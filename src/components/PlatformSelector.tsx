
"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

type PlatformSelectorProps = {
  platforms: string[];
  gameId?: string;
  onChange?: (platform: string) => void;
};

export default function PlatformSelector({
  platforms,
  gameId,
  onChange,
}: PlatformSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const { change } = useCart();

  function addToCart() {
    if (!gameId || !selected) return;

    change(gameId, 1, selected);
    setMessage(`${selected} adicionado ao carrinho!`);
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">
        Selecione sua plataforma:
      </p>

      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            type="button"
            aria-pressed={selected === platform}
            onClick={() => {
              setSelected(platform);
              setMessage("");
              onChange?.(platform);
            }}
            className={`rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${
              selected === platform
                ? "border-violet-400 bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "border-white/20 bg-white/5 text-gray-200 hover:border-violet-500 hover:bg-violet-500/10"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {selected && (
        <p className="mt-3 text-sm text-violet-300">
          Plataforma selecionada: {selected}
        </p>
      )}

      {gameId && (
        <button
          type="button"
          disabled={!selected}
          onClick={addToCart}
          className="mt-6 w-full rounded-xl bg-violet-600 px-6 py-4 font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selected
            ? `Adicionar ao carrinho — ${selected}`
            : "Selecione uma plataforma"}
        </button>
      )}

      {message && (
        <p role="status" className="mt-3 text-sm text-green-400">
          {message}
        </p>
      )}
    </div>
  );
}
