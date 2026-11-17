
import Link from "next/link";
import Stripe from "stripe";

type Props = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function Success({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let confirmed = false;
  let amount = 0;
  let orderId = "";

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.retrieve(
        session_id
      );

      confirmed = session.payment_status === "paid";
      amount = session.amount_total ?? 0;
      orderId = session.id;
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl">
        <div className="text-6xl mb-6">
          {confirmed ? "✅" : "⏳"}
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {confirmed
            ? "Pagamento confirmado!"
            : "Pagamento não confirmado"}
        </h1>

        <p className="text-zinc-400 mb-6">
          {confirmed
            ? "Sua compra de teste na NEXORA GAMES foi aprovada com sucesso."
            : "Não foi possível confirmar este pagamento. Verifique o status no Stripe."}
        </p>

        {confirmed && (
          <div className="rounded-xl bg-zinc-800 p-5 mb-6 text-left space-y-3">
            <p>
              <span className="text-zinc-400">Status: </span>
              <span className="text-green-400 font-semibold">
                Aprovado
              </span>
            </p>

            <p>
              <span className="text-zinc-400">Valor: </span>
              {(amount / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            <p className="text-xs text-zinc-400 break-all">
              Pedido: {orderId}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="inline-block rounded-xl bg-violet-600 px-8 py-3 font-bold hover:bg-violet-500 transition"
        >
          Voltar à loja
        </Link>

        <p className="text-xs text-zinc-500 mt-6">
          Ambiente de demonstração. Nenhuma chave comercial
          é entregue.
        </p>
      </div>
    </main>
  );
}
