"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { LogIn, LogOut, UserRound } from "lucide-react";

const supabase = createClient();

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    window.location.href = "/";
  }

  if (loading) {
    return <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />;
  }

  if (!user) {
    return (
      <a
        href="/login"
        className="flex items-center gap-2 rounded-xl border border-violet-500/40 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-600 hover:text-white"
      >
        <LogIn size={17} />
        Entrar
      </a>
    );
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Jogador";

  const avatar = user.user_metadata?.avatar_url;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-3 rounded-xl border border-violet-500/30 bg-[#171522] px-3 py-2 transition hover:border-violet-400"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Foto do perfil"
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <UserRound size={24} className="text-violet-300" />
        )}

        <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">
          {name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-violet-500/20 bg-[#171522] p-4 shadow-2xl">
          <p className="truncate font-bold">{name}</p>
          <p className="mt-1 truncate text-xs text-gray-400">
            {user.email}
          </p>

          
          <a
            href="/minha-conta"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-violet-200 transition hover:bg-violet-500/10"
          >
            <UserRound size={17} />
            Minha Conta
          </a>

          <div className="my-4 border-t border-white/10" />

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}
