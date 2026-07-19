import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface Props { images: string[] }

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

type Category = 'shaorma' | 'burgeri' | 'sandwich' | 'hotdog' | 'salate' | 'cartofi'

const CATEGORY_LABEL: Record<Category, string> = {
  shaorma: '🌯 Shaorma & Kebab',
  burgeri: '🍔 Burgeri',
  sandwich: '🥪 Sandwich',
  hotdog: '🌭 Hot Dog',
  salate: '🥗 Salate',
  cartofi: '🍟 Cartofi',
}

interface MenuItem {
  slug: string
  name: string
  category: Category
  priceMedium?: string
  priceFamily?: string
  price?: string
  sizeMediumLabel?: string
  sizeFamilyLabel?: string
  ingredients: string
  image: string
  imageScale?: number
}

const MENU: MenuItem[] = [
  {
    slug: 'shaorma',
    name: 'Shaorma',
    category: 'shaorma',
    priceMedium: '22 lei',
    priceFamily: '25 lei',
    sizeMediumLabel: 'Mică · 250g',
    sizeFamilyLabel: 'Mare · 300g',
    ingredients: 'Lipie, carne pui, cartofi prăjiți, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos usturoi, sos tzatziki, sos chilli, condimente.',
    image: '/images/corvin/shaorma.png',
  },
  {
    slug: 'shaorma-farfurie',
    name: 'Shaorma la Casserolă',
    category: 'shaorma',
    price: '27 lei',
    ingredients: 'Carne pui, cartofi prăjiți, sos de usturoi, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos tzatziki, sos chilli, lipie. 300g',
    image: '/images/corvin/shaorma-farfurie.jpeg',
  },
  {
    slug: 'kebab',
    name: 'Kebab',
    category: 'shaorma',
    price: '22 lei',
    ingredients: 'Chiflă-kebab, carne de pui, cartofi prăjiți, sos de usturoi, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos tzatziki, sos picant. 300g',
    image: '/images/corvin/kebab.jpeg',
  },
  {
    slug: 'pittburger',
    name: 'Pittburger',
    category: 'burgeri',
    priceMedium: '18 lei',
    priceFamily: '21 lei',
    sizeMediumLabel: 'Simplu · 260g',
    sizeFamilyLabel: 'Dublu · 330g',
    ingredients: 'Chiflă, chiftea vită + porc (2 chiftele la Dublu), cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente.',
    image: '/images/corvin/pittburger-simplu.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'burger-snitel-pui',
    name: 'Burger cu Șnițel de Pui',
    category: 'burgeri',
    priceMedium: '19 lei',
    priceFamily: '22 lei',
    sizeMediumLabel: 'Simplu · 280g',
    sizeFamilyLabel: 'Dublu · 360g',
    ingredients: 'Chiflă, șnițel din piept de pui (2 șnițele la Dublu), cartofi prăjiți, sos de usturoi, maioneză cu varză, ketchup, castraveți murați, condimente.',
    image: '/images/corvin/burger-snitel-pui.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca-cascaval',
    name: 'Sandwich cu Șuncă și Cașcaval',
    category: 'sandwich',
    price: '16 lei',
    ingredients: 'Chiflă, cașcaval, șuncă, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 250g',
    image: '/images/corvin/sandwich-sunca-cascaval.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca',
    name: 'Sandwich cu Șuncă',
    category: 'sandwich',
    priceMedium: '14 lei',
    priceFamily: '16 lei',
    sizeMediumLabel: 'Simplu · 220g',
    sizeFamilyLabel: 'Dublu · 260g',
    ingredients: 'Chiflă, șuncă (2 felii la Dublu), cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente.',
    image: '/images/corvin/sandwich-sunca.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'hotdog-cascaval',
    name: 'Hot Dog cu Cașcaval',
    category: 'hotdog',
    price: '15 lei',
    ingredients: 'Baton, crenvurști, cașcaval, maioneză, ketchup, muștar. 220g',
    image: '/images/corvin/hotdog-cascaval.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'hotdog',
    name: 'Hot Dog',
    category: 'hotdog',
    priceMedium: '13 lei',
    priceFamily: '15 lei',
    sizeMediumLabel: 'Simplu · 180g',
    sizeFamilyLabel: 'Dublu · 230g',
    ingredients: 'Baton, crenvurști (2 crenvurști la Dublu), maioneză, ketchup, muștar.',
    image: '/images/corvin/hotdog.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'cartofi-cheddar',
    name: 'Cartofi cu Cheddar și Ceapă Caramelizată',
    category: 'cartofi',
    price: '12 lei',
    ingredients: 'Cartofi, brânză cheddar, ceapă caramelizată, condimente. 220g',
    image: '/images/corvin/cartofi.jpeg',
  },
  {
    slug: 'salata-kebab',
    name: 'Salată cu Carne Kebab Cosimo',
    category: 'salate',
    price: '21 lei',
    ingredients: 'Carne kebab la grătar, salată iceberg, morcov, roșii, castraveți, ceapă roșie, dressing tzatziki sau dressing orange Cosimo. 280g',
    image: '/images/corvin/salata-pui.png',
    imageScale: 1.6,
  },
  {
    slug: 'salata-ton',
    name: 'Salată cu Ton Cosimo',
    category: 'salate',
    price: '21 lei',
    ingredients: 'Ton, ceapă roșie, roșii, salată iceberg, morcov, castraveți, dressing orange Cosimo și dressing pătrunjel cu lămâie. 280g',
    image: '/images/corvin/salata-ton.png',
    imageScale: 1.2,
  },
  {
    slug: 'salata-vegetala',
    name: 'Salată Vegetală Cosimo',
    category: 'salate',
    price: '18 lei',
    ingredients: 'Roșii, salată iceberg, morcov, varză, castraveți, ceapă roșie, ardei iute (opțional), dressing tzatziki sau dressing orange Cosimo, dressing de pătrunjel cu lămâie. 270g',
    image: '/images/corvin/salata-vegetala.png',
    imageScale: 1.2,
  },
  {
    slug: 'cartofi',
    name: 'Cartofi Prăjiți',
    category: 'cartofi',
    priceMedium: '7 lei',
    priceFamily: '10 lei',
    sizeMediumLabel: '100g',
    sizeFamilyLabel: '150g',
    ingredients: 'Cartofi prăjiți crocanți — porție ca supliment sau garnitură.',
    image: '/images/corvin/cartofi.jpeg',
  },
]

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useCounter(target: number, duration = 1400, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const tick = (ts: number) => {
      if (!start) start = ts
      const pct = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - pct, 3)
      setVal(Math.round(ease * target))
      if (pct < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return val
}

type TabValue = 'toate' | Category

const CorvinPage: NextPage<Props> = ({ images }) => {
  const heroImage = images.find(f => f.toLowerCase().includes('hero')) ?? images[0] ?? null
  const heroSection  = useInView(0.05)
  const statsSection = useInView(0.3)
  const mapsSection  = useInView(0.1)

  const reviewCount = useCounter(126, 1200, statsSection.visible)
  const rating      = useCounter(45,  1000, statsSection.visible)

  const [activeTab, setActiveTab] = useState<TabValue>('toate')
  const filtered = activeTab === 'toate' ? MENU : MENU.filter(m => m.category === activeTab)
  const countBy = (cat: Category) => MENU.filter(m => m.category === cat).length
  const tabs = [
    { value: 'toate' as TabValue, label: 'Toate', count: MENU.length },
    { value: 'shaorma' as TabValue, label: CATEGORY_LABEL.shaorma, count: countBy('shaorma') },
    { value: 'burgeri' as TabValue, label: CATEGORY_LABEL.burgeri, count: countBy('burgeri') },
    { value: 'sandwich' as TabValue, label: CATEGORY_LABEL.sandwich, count: countBy('sandwich') },
    { value: 'hotdog' as TabValue, label: CATEGORY_LABEL.hotdog, count: countBy('hotdog') },
    { value: 'salate' as TabValue, label: CATEGORY_LABEL.salate, count: countBy('salate') },
    { value: 'cartofi' as TabValue, label: CATEGORY_LABEL.cartofi, count: countBy('cartofi') },
  ]

  return (
    <>
      <Head>
        <title>Fast Food Cosimo — Bulevardul Corvin, Hunedoara</title>
        <meta name="description" content="Fast Food Cosimo Bd. Corvin — Shaorma, Burgeri, Kebab, Hot Dog în Hunedoara. Mâncare proaspătă, prețuri accesibile." />
      </Head>

      <Navbar variant="location" />

      <main>
        {/* ══════════════════════════════════════════
            HERO — Wolf-style: photo top, dark card bottom
        ══════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[700px] flex flex-col">

          <div className="relative flex-[1.15] min-h-0 overflow-hidden">
            {heroImage ? (
              <Image
                src={`/images/corvin/${heroImage}`}
                alt="Fast Food Cosimo exterior"
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#b71c1c] to-[#4a0000]" />
            )}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }} />
          </div>

          <div className="relative flex-1 min-h-0 bg-[#0d0d0d] -mt-8 rounded-t-[2rem] z-10 flex flex-col justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20z'/%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E\")", backgroundSize: '20px 20px' }}
            />

            <div ref={heroSection.ref} className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full">
              <div
                style={{
                  opacity: heroSection.visible ? 1 : 0,
                  transform: heroSection.visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                <p className="text-[#D32F2F] uppercase tracking-[0.35em] text-xs font-bold mb-3">
                  // Bulevardul Corvin, Hunedoara
                </p>

                <h1 className="font-playfair font-bold text-white leading-[0.95] mb-3" style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}>
                  Fast Food<br />
                  <span className="italic text-[#D32F2F]">NON STOP</span>
                </h1>

                <p className="text-white/50 text-sm md:text-base mb-6 tracking-wide">
                  Shaorma · Burgeri · Kebab · Hot Dog.<br className="hidden sm:block" />
                  Prețuri corecte, porții generoase.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <a
                    href="tel:0722235551"
                    className="flex items-center justify-center gap-2.5 bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:shadow-2xl hover:shadow-red-900/50 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    SUNĂ ACUM — 0722 235 551
                  </a>
                  <a
                    href="#meniu"
                    className="flex items-center justify-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-full border-2 border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-200 text-sm"
                  >
                    MENIUL NOSTRU
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-[#FFC107]">★★★★★</span>
                    <span className="text-white font-semibold">4.5</span>
                    <span className="text-white/40 text-xs">· 126 recenzii</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-[#4caf50]">●</span>
                    <span className="text-white/60">Deschis acum</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#meniu"
              className="relative z-10 flex flex-col items-center gap-0.5 text-white/30 hover:text-white/60 transition-colors pb-4"
            >
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════ */}
        <div ref={statsSection.ref} className="bg-[#D32F2F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-white/20">
              {[
                { value: `${(rating / 10).toFixed(1)}`, label: 'Rating Google', suffix: '⭐' },
                { value: `${reviewCount}`, label: 'Recenzii', suffix: '+' },
                { value: `${MENU.length}`, label: 'Produse în meniu', suffix: '' },
              ].map((stat) => (
                <div key={stat.label} className="py-5 text-center">
                  <div className="font-playfair text-2xl md:text-3xl font-bold text-white">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-red-200 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MENU — pizzeria-style dark grid
        ══════════════════════════════════════════ */}
        <section id="meniu" className="bg-[#0f0806] py-24 relative">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e8b76a' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-10 bg-[#e8b76a]" />
                <span className="font-inter text-[#e8b76a] uppercase tracking-[0.4em] text-xs font-semibold">
                  Il menù
                </span>
                <span className="h-px w-10 bg-[#e8b76a]" />
              </div>
              <h2 className="font-playfair text-5xl md:text-6xl font-bold text-white italic">
                Meniul <span className="text-[#e8b76a]">nostru</span>
              </h2>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-14">
              {tabs.map(tab => {
                const isActive = activeTab === tab.value
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'bg-[#e8b76a] text-[#0f0806] shadow-lg shadow-[#e8b76a]/20'
                        : 'bg-transparent text-white/70 border border-white/20 hover:border-[#e8b76a]/60 hover:text-[#e8b76a]'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2 text-xs ${isActive ? 'text-[#0f0806]/60' : 'text-white/40'}`}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {filtered.map(item => (
                <div key={item.slug} className="flex flex-col items-center text-center group">
                  <div className="relative w-full aspect-square max-w-md overflow-hidden transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      style={item.imageScale ? { transform: `scale(${item.imageScale})` } : undefined}
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                  <h3 className="font-playfair italic text-4xl font-bold text-[#e8b76a] mt-8">
                    {item.name}
                  </h3>
                  {item.price && (
                    <div className="text-white font-bold text-2xl mt-3 tracking-wide">
                      {item.price}
                    </div>
                  )}
                  {(item.priceMedium || item.priceFamily) && (
                    <div className="flex items-center gap-8 mt-4">
                      {item.priceMedium && (
                        <div className="flex flex-col items-center">
                          <span className="text-[#e8b76a]/80 uppercase tracking-widest text-[10px] font-semibold">
                            {item.sizeMediumLabel ?? 'Medie · 32 cm'}
                          </span>
                          <span className="text-white font-bold text-2xl mt-1 tracking-wide">
                            {item.priceMedium}
                          </span>
                        </div>
                      )}
                      {item.priceMedium && item.priceFamily && (
                        <div className="h-10 w-px bg-[#e8b76a]/30" />
                      )}
                      {item.priceFamily && (
                        <div className="flex flex-col items-center">
                          <span className="text-[#e8b76a]/80 uppercase tracking-widest text-[10px] font-semibold">
                            {item.sizeFamilyLabel ?? 'Family · 50 cm'}
                          </span>
                          <span className="text-white font-bold text-2xl mt-1 tracking-wide">
                            {item.priceFamily}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-white/70 text-sm mt-4 max-w-md leading-relaxed">
                    {item.ingredients}
                  </p>
                  <a
                    href="tel:0722235551"
                    className="mt-8 inline-flex items-center gap-2 border-2 border-[#e8b76a] text-[#e8b76a] hover:bg-[#e8b76a] hover:text-[#0f0806] font-bold uppercase tracking-widest px-8 py-3 rounded-full transition-all text-xs"
                  >
                    Comandă telefonic
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════════ */}
        <section className="bg-[#1a0e08] py-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-5"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D32F2F' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-3">
              Ți-e foame? Sunăm noi! 📞
            </h2>
            <p className="text-[#c9b99a] mb-8">
              Comandă telefonic sau ridică direct de la Fast Food Cosimo Bd. Corvin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:0722235551"
                className="bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-red-900/50 text-sm inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0722 235 551
              </a>
              <a href="https://glovoapp.com" target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold px-8 py-4 rounded-full border border-white/20 transition-all text-sm inline-flex items-center justify-center gap-2"
              >
                🛵 Comandă pe Glovo
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            GOOGLE MAPS
        ══════════════════════════════════════════ */}
        <section className="bg-[#FFF8F0] py-20" ref={mapsSection.ref}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{
                opacity: mapsSection.visible ? 1 : 0,
                transform: mapsSection.visible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
              className="text-center mb-8"
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1a1a1a]">
                Cum ne găsești
              </h2>
              <p className="text-[#6b5c4e] mt-2 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bulevardul Corvin, Hunedoara, România
              </p>
            </div>
            <div
              className="rounded-3xl overflow-hidden shadow-2xl border border-[#e8d5b7]"
              style={{
                opacity: mapsSection.visible ? 1 : 0,
                transform: mapsSection.visible ? 'translateY(0)' : 'translateY(32px)',
                transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Bulevardul+Corvin,+Hunedoara,+Romania&hl=ro&z=16&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                title="Fast Food Cosimo Bd. Corvin"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dir = path.join(process.cwd(), 'public', 'images', 'corvin')
  let images: string[] = []
  if (fs.existsSync(dir)) {
    images = fs.readdirSync(dir)
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort()
  }
  return { props: { images } }
}

export default CorvinPage
