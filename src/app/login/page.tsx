
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";


type Provider = "google";

export default function LoginPage() {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loginWithProvider(provider: Provider) {
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      
options: {
  redirectTo: `${window.location.origin}/auth/callback`,
},

      });

      if (error) throw error;

      if (data.url) {
        window.location.assign(data.url);
      } else {
        setMessage("Não foi possível iniciar o login.");
        setLoading(false);
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro no login."
      );
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();

      if (register) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.session) {
          window.location.assign("/");
          return;
        }

        setMessage("Cadastro realizado! Verifique seu e-mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.assign("/");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Erro na autenticação."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080810] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-violet-500/20 bg-[#151421] p-8 shadow-2xl shadow-violet-950/20">

        <Link
          href="/"
          className="block text-center text-3xl font-black tracking-widest"
        >
          NEXORA<span className="text-violet-400">.</span>
        </Link>

        <h1 className="mt-8 text-center text-2xl font-bold">
          {register ? "Criar minha conta" : "Bem-vindo de volta"}
        </h1>

        <p className="mt-2 text-center text-sm text-gray-400">
          Entre para o universo NEXORA GAMES.
        </p>

        <div className="mt-8 space-y-3">
<button
    type="button"
    disabled={loading}
    onClick={() => loginWithProvider("google")}
    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-4 font-semibold text-black transition duration-200 hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <FcGoogle size={23} className="shrink-0" />
    <span>Continuar com Google</span>
  </button>
</div>

        

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-400">
            OU ENTRE COM E-MAIL
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full rounded-xl border border-white/10 bg-[#0c0c16] px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-gray-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              minLength={6}
              required
              autoComplete={register ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full rounded-xl border border-white/10 bg-[#0c0c16] px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          {message && (
            <p role="status" className="rounded-xl bg-violet-500/10 p-3 text-sm text-violet-200">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-4 font-bold transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? "Aguarde..." : register ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-4 text-center text-sm text-gray-400">
            {register
              ? "Já possui uma conta?"
              : "Ainda não tem uma conta?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setRegister(!register);
              setMessage("");
              setPassword("");
            }}
            className="w-full rounded-xl border-2 border-violet-500 px-6 py-4 font-bold text-violet-300 transition hover:bg-violet-600 hover:text-white"
          >
            {register ? "FAZER LOGIN" : "CRIAR MINHA CONTA"}
          </button>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-gray-400 hover:text-white"
        >
          Voltar à loja
        </Link>
      </div>
    </main>
  );
}
