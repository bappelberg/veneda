import Link from "next/link";
import Image from "next/image";
import { content } from "@/content";

export default function Home() {
  const { hero, intro, features, quote, cta } = content;

  return (
    <main className="bg-white dark:bg-black">

      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-image.jpg"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-sm text-green-300 mb-4 font-medium">
            {hero.eyebrow}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 whitespace-pre-line">
            {hero.heading}
          </h1>
          <p className="text-lg md:text-xl text-zinc-200 mb-10 leading-relaxed">
            {hero.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recipes"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              href="/about"
              className="border border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section className="bg-green-50 dark:bg-zinc-900 py-16 px-6 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-xs mb-3">{intro.eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          {intro.heading}
        </h2>
        <p className="max-w-xl mx-auto text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {intro.body}
        </p>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((card) => (
          <div
            key={card.title}
            className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">{card.icon}</span>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{card.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{card.body}</p>
          </div>
        ))}
      </section>

      {/* Quote */}
      <section className="bg-green-600 py-20 px-6 text-center text-white">
        <blockquote className="max-w-2xl mx-auto">
          <p className="text-2xl md:text-3xl font-semibold leading-snug italic mb-6">
            "{quote.text}"
          </p>
          <cite className="not-italic text-green-200 text-sm tracking-widest uppercase">— {quote.author}</cite>
        </blockquote>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          {cta.heading}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
          {cta.body}
        </p>
        <Link
          href="/recipes"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-4 rounded-full transition-colors text-lg"
        >
          {cta.button}
        </Link>
      </section>

    </main>
  );
}
