import PlatformSelector from "@/components/PlatformSelector";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function generateStaticParams() {
  return games.map((game) => ({
    id: game.id,
  }));
}

export default async function GameDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const game = games.find((item) => item.id === id);

  if (!game) {
    notFound();
  }

  const relatedGames = games
    .filter(
      (item) =>
        item.id !== game.id &&
        item.genre === game.genre
    )
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#080810] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#0c0c16]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="text-2xl font-black tracking-[0.2em]"
          >
            NEXORA
            <span className="text-violet-400">.</span>
          </Link>

          <Link
            href="/#catalogo"
            className="text-sm text-gray-300 transition hover:text-violet-400"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* BREADCRUMB */}
        <div className="mb-8 text-sm text-gray-400">
          <Link href="/" className="hover:text-white">
            Início
          </Link>
          <span className="mx-3">/</span>
          <span>{game.genre}</span>
          <span className="mx-3">/</span>
          <span className="text-violet-300">
            {game.title}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* CONTEÚDO */}
          <section>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171522]">
              <img
                src={game.image}
                alt={`Imagem de ${game.title}`}
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="mt-10">
              <h2 className="mb-5 text-2xl font-bold">
                Sobre o jogo
              </h2>

              <p className="text-base leading-8 text-gray-300">
                {game.description}
              </p>
            </div>

            {/* INFORMAÇÕES */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#141420] p-7">
              <h2 className="mb-6 text-xl font-bold">
                Informações do produto
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-gray-400">
                    Nome
                  </span>
                  <span className="text-right font-medium">
                    {game.title}
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-gray-400">
                    Gênero
                  </span>
                  <span>{game.genre}</span>
                </div>

                <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-gray-400">
                    Plataformas
                  </span>
                  <span className="text-right">
                    {game.platforms.join(", ")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">
                    Disponibilidade
                  </span>
                  <span className="text-violet-300">
                    Catálogo demonstrativo
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* PAINEL DE COMPRA */}
          <aside>
            <div className="rounded-2xl border border-violet-500/30 bg-[#171522] p-7 shadow-2xl shadow-violet-950/20 lg:sticky lg:top-8">
              <span className="inline-flex rounded-md bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {game.tag}
              </span>

              <h1 className="mt-6 text-3xl font-black leading-tight">
                {game.title}
              </h1>

              <p className="mt-4 text-sm text-gray-400">
                Disponível no catálogo para:
              </p>

             <div className="mt-4">
  <PlatformSelector
  platforms={game.platforms}
  gameId={game.id}
/>
</div>

              <div className="my-8 border-t border-white/10 pt-7">
                {game.oldPrice &&
                  game.oldPrice > game.price && (
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(game.oldPrice)}
                      </span>

                      <span className="rounded bg-green-500/15 px-2 py-1 text-xs font-bold text-green-400">
                        -
                        {Math.round(
                          (1 -
                            game.price /
                              game.oldPrice) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  )}

                <p className="text-4xl font-black tracking-tight">
                  {formatPrice(game.price)}
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  Valor ilustrativo para demonstração.
                </p>
              </div>

              <Link
                href="/#catalogo"
                className="block w-full rounded-xl bg-violet-600 px-6 py-4 text-center text-sm font-bold transition hover:bg-violet-500"
              >
                Explorar catálogo
              </Link>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-gray-400">
                <p>Checkout de testes em sandbox.</p>
                <p>Nenhuma venda real é realizada.</p>
                <p>
                  Plataforma demonstrativa para
                  portfólio Full Stack.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* RECOMENDAÇÕES */}
        {relatedGames.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-black">
                Você também pode gostar
              </h2>

              <Link
                href="/#catalogo"
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                Ver catálogo completo
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedGames.map((item) => (
                <Link
                  key={item.id}
                  href={`/jogo/${item.id}`}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-[#171522] transition hover:-translate-y-1 hover:border-violet-500/60"
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="mb-2 text-xs text-gray-400">
                      {item.genre}
                    </p>

                    <h3 className="font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-lg font-black text-violet-300">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-white/10 bg-[#0c0c16]">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          NEXORA GAMES — Premium Gaming Experience
          <p className="mt-2">
            Projeto demonstrativo de portfólio.
            Sem vendas reais.
          </p>
        </div>
      </footer>
    </main>
  );
}

