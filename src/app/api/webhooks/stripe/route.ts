
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecret || !stripeSecret.startsWith("sk_test_") ||
      !webhookSecret || !supabaseUrl || !serviceKey) {
    console.error("Configuração do webhook incompleta.");
    return NextResponse.json(
      { error: "Webhook não configurado" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeSecret);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura ausente" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json(
      { error: "Assinatura inválida" },
      { status: 400 }
    );
  }

  const supportedEvents = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
  ];

  if (!supportedEvents.includes(event.type)) {
    return NextResponse.json({ received: true });
  }

  const eventSession = event.data.object as Stripe.Checkout.Session;

  // Busca o estado atualizado diretamente no Stripe.
  const session = await stripe.checkout.sessions.retrieve(
    eventSession.id,
    { expand: ["line_items"] }
  );

  if (session.metadata?.environment !== "portfolio-demo") {
    return NextResponse.json({ received: true });
  }

  const userId = session.client_reference_id;

  if (!userId || session.metadata?.user_id !== userId) {
    console.error("Checkout sem usuário válido.");
    return NextResponse.json(
      { error: "Usuário não identificado" },
      { status: 400 }
    );
  }

  const status =
    session.payment_status === "paid"
      ? "paid"
      : event.type === "checkout.session.async_payment_failed"
        ? "failed"
        : "pending";

  const items = (session.line_items?.data ?? []).map((item) => ({
    description: item.description,
    quantity: item.quantity,
    amount_total: item.amount_total,
    currency: item.currency,
  }));

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase
    .from("orders")
    .upsert(
      {
        user_id: userId,
        stripe_session_id: session.id,
        status,
        amount_total: session.amount_total ?? 0,
        currency: session.currency ?? "brl",
        items,
      },
      { onConflict: "stripe_session_id" }
    );

  if (error) {
    console.error("Erro ao salvar pedido:", error.message);
    return NextResponse.json(
      { error: "Falha ao registrar pedido" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
