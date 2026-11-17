
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { games } from "@/lib/catalog";

export const runtime = "nodejs";

type CheckoutItem = {
  id: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret || !secret.startsWith("sk_test_")) {
      return NextResponse.json(
        { error: "Configure STRIPE_SECRET_KEY de teste no .env.local." },
        { status: 503 }
      );
    }

    const body = await req.json();

    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 30) {
      return NextResponse.json(
        { error: "Carrinho inválido." },
        { status: 400 }
      );
    }

    const quantities: Record<string, number> = {};

    for (const item of body.items as CheckoutItem[]) {
      if (
        typeof item.id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 5
      ) {
        return NextResponse.json(
          { error: "Item ou quantidade inválidos." },
          { status: 400 }
        );
      }

      const [gameId, platform, ...extra] = item.id.split("::");
      const game = games.find((g) => g.id === gameId);

      if (
        !game ||
        extra.length > 0 ||
        (platform !== undefined &&
          !game.platforms.includes(platform))
      ) {
        return NextResponse.json(
          { error: "Jogo ou plataforma inválidos." },
          { status: 400 }
        );
      }

      const key = platform ? `${gameId}::${platform}` : gameId;

      quantities[key] = (quantities[key] || 0) + item.quantity;

      if (quantities[key] > 5) {
        return NextResponse.json(
          { error: "Limite de 5 unidades por versão do jogo." },
          { status: 400 }
        );
      }
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      Object.entries(quantities).map(([key, quantity]) => {
        const [gameId, platform] = key.split("::");
        const game = games.find((g) => g.id === gameId)!;

        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: platform
                ? `${game.title} — ${platform}`
                : game.title,
              description: "Produto fictício para demonstração de portfólio",
            },
            unit_amount: Math.round(game.price * 100),
          },
          quantity,
        };
      });

    const stripe = new Stripe(secret);

    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?canceled=1`,
      metadata: {
        environment: "portfolio-demo",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: "Não foi possível iniciar o checkout de teste." },
      { status: 500 }
    );
  }
}
