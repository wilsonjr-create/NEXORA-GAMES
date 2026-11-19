"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Gamepad2,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Mail,
} from "lucide-react";
type Order = {
  id: string;
  user_id: string;
  stripe_session_id: string;
  status: string;
  amount_total: number;
  currency: string;
  created_at: string;
  items: {
    description: string | null;
    quantity: number | null;
    amount_total: number;
    currency: string;
  }[];
};
const supabase = createClient();

export default function MinhaConta() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const [orders, setOrders] = useState<Order[]>([]);
const [ordersLoading, setOrdersLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
  setUser(data.user);
  setLoading(false);

  if (data.user) {
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar pedidos:", error.message);
    }

    setOrders((ordersData ?? []) as Order[]);
  }

  setOrdersLoading(false);
});

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b12] text-white">
        Carregando sua conta...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#090b12] px-5 text-center text-white">
        <UserRound size={48} className="text-violet-400" />
        <h1 className="text-3xl font-bold">Acesse sua conta</h1>
        <p className="text-gray-400">
          Faça login para acessar seu painel de jogador.
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-violet-600 px-8 py-4 font-semibold hover:bg-violet-500"
        >
          Entrar na NEXORA
        </Link>
      </main>
    );
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Jogador";

  const avatar = user.user_metadata?.avatar_url;

  return (
    <main className="min-h-screen bg-[#090b12] text-white">
      <header className="border-b border-white/10 bg-[#10121c]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-widest">
            <Gamepad2 className="text-violet-400" />
            NEXORA<span className="text-violet-400">.</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <ArrowLeft size={17} />
            Voltar à loja
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-xs font-bold tracking-[.3em] text-violet-400">
          PLAYER DASHBOARD
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          Minha <span className="text-violet-400">Conta.</span>
        </h1>

        <section className="mt-10 flex flex-wrap items-center gap-6 rounded-3xl border border-violet-500/20 bg-[#141421] p-8">
          {avatar ? (
            <img
              src={avatar}
              alt="Foto do perfil"
              referrerPolicy="no-referrer"
              className="h-20 w-20 rounded-full border-2 border-violet-400 object-cover"
            />
          ) : (
            <UserRound size={60} className="text-violet-400" />
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="mt-2 flex items-center gap-2 break-all text-sm text-gray-400">
              <Mail size={15} />
              {user.email}
            </p>
            <p className="mt-3 text-xs text-green-400">
              ● Conta autenticada
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Sair
          </button>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Gamepad2,
              title: "Minha biblioteca",
              description: "Seus jogos aparecerão aqui quando a biblioteca estiver integrada.",
            },
            {
              icon: ShoppingBag,
              title: "Meus pedidos",
              description: "Histórico de pedidos de teste, após integração com o banco de dados.",
            },
            {
              icon: ShieldCheck,
              title: "Segurança",
              description: "Sua conta está autenticada pelo Supabase.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-[#141421] p-7"
            >
              <Icon size={28} className="text-violet-400" />
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                {description}
              </p>
            </div>
          ))}
        </div>
<section className="mt-10 rounded-2xl border border-white/10 bg-[#141421] p-7">
  <div className="mb-6 flex items-center gap-3">
    <ShoppingBag className="text-violet-400" />
    <h2 className="text-2xl font-bold">
      Histórico de compras
    </h2>
  </div>

  {ordersLoading ? (
    <p className="text-gray-400">
      Carregando pedidos...
    </p>
  ) : orders.length === 0 ? (
    <p className="text-gray-400">
      Você ainda não possui pedidos registrados.
    </p>
  ) : (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-white/10 bg-[#0c0e17] p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Pedido #{order.id.slice(0, 8)}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {new Date(order.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                order.status === "paid"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {order.status === "paid"
                ? "Pagamento aprovado"
                : order.status === "failed"
                  ? "Pagamento falhou"
                  : "Pagamento pendente"}
            </span>
          </div>

          <div className="mt-5 space-y-2">
            {(order.items ?? []).map((item, index) => (
              <div
                key={index}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-gray-300">
                  {item.description ?? "Jogo"} × {item.quantity ?? 1}
                </span>

                <span className="text-gray-400">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: item.currency.toUpperCase(),
                  }).format(item.amount_total / 100)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between border-t border-white/10 pt-4">
            <span className="font-semibold">Total</span>

            <span className="font-bold text-violet-400">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: order.currency.toUpperCase(),
              }).format(order.amount_total / 100)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
        <p className="mt-12 text-center text-xs text-gray-500">
          NEXORA GAMES · Projeto demonstrativo de portfólio
        </p>
      </div>
    </main>
  );
}
