import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface Props { images: string[] }

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

/* ─── Types ─────────────────────────────────────────────── */
interface MenuItem {
  id: number
  category: string
  name: string
  ingredients: string
  price: number
  popular?: boolean
  photo?: string
}

/* ─── Menu data (extracted via vision from menu board) ───── */
const MENU: MenuItem[] = [
  // Burgeri
  { id: 1,  category: 'Burgeri',      name: 'Burger cu Șnițel din Piept de Pui', ingredients: 'Șnițel de pui crispy, salată verde, roșii, muștar, maioneză', price: 28, popular: true,  photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=260&fit=crop&auto=format' },
  { id: 2,  category: 'Burgeri',      name: 'Pittburger',                         ingredients: 'Carne de vită, cascaval topit, salată, roșii, ceapă caramelizată, sos special', price: 34, popular: true, photo: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=260&fit=crop&auto=format' },
  { id: 3,  category: 'Burgeri',      name: 'Hamburger cu Șnițel Pui',            ingredients: 'Șnițel pui pane, castraveți murați, salată, sos muștar-maioneză', price: 30 },
  { id: 4,  category: 'Burgeri',      name: 'Burger Vegetarian',                  ingredients: 'Legume gratinate, cascaval, salată verde, roșii, sos de casă', price: 22 },
  // Shaorma
  { id: 5,  category: 'Shaorma',      name: 'Mașorma Mare',                       ingredients: 'Carne kebab la grătar, legume proaspete, sos usturoi, chifla crocantă', price: 35, popular: true, photo: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=260&fit=crop&auto=format' },
  { id: 6,  category: 'Shaorma',      name: 'Mașorma Mică',                       ingredients: 'Carne kebab, legume proaspete, sos usturoi', price: 25 },
  { id: 7,  category: 'Shaorma',      name: 'Salată Carne Kebab Cosimo',           ingredients: 'Carne kebab la grătar, salată verde, legume proaspete, sos usturoi', price: 28 },
  { id: 8,  category: 'Shaorma',      name: 'Salată Vegetariană Cosimo',           ingredients: 'Legume proaspete de sezon, brânză feta, sos de casă', price: 20 },
  // Kebab
  { id: 9,  category: 'Kebab',        name: 'Kebab',                               ingredients: 'Carne kebab la grătar, legume, sos usturoi, lipie crocantă', price: 30, popular: true, photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=260&fit=crop&auto=format' },
  { id: 10, category: 'Kebab',        name: 'Kebab Cascaval',                      ingredients: 'Carne kebab, cascaval topit, legume, sos special', price: 33 },
  { id: 11, category: 'Kebab',        name: 'Mașorma la Caserola',                 ingredients: 'Carne kebab, legume, sos usturoi — servit la caserola caldă', price: 32 },
  // Hot Dog
  { id: 12, category: 'Hot Dog',      name: 'Hot Dog Cascaval',                    ingredients: 'Cârnat grătar, cascaval topit, muștar, ketchup, chifla crocantă', price: 13, popular: true, photo: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=400&h=260&fit=crop&auto=format' },
  { id: 13, category: 'Hot Dog',      name: 'Hot Dog',                             ingredients: 'Cârnat grătar, muștar, ketchup, chifla crocantă', price: 11 },
  // Meniuri Cola
  { id: 14, category: 'Meniuri Cola', name: 'Meniu Burger + Cola',                 ingredients: 'Burger la alegere + Coca-Cola 0.5L', price: 38, popular: true, photo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=260&fit=crop&auto=format' },
  { id: 15, category: 'Meniuri Cola', name: 'Meniu Shaorma + Cola',                ingredients: 'Mașorma mică + Coca-Cola 0.5L', price: 33 },
  { id: 16, category: 'Meniuri Cola', name: 'Meniu Hot Dog + Cola',                ingredients: 'Hot Dog Cascaval + Coca-Cola 0.5L', price: 21 },
  // Sosuri
  { id: 17, category: 'Sosuri',       name: 'Sos Usturoi',                         ingredients: 'Cremă de usturoi', price: 3 },
  { id: 18, category: 'Sosuri',       name: 'Maioneză cu Ceapă',                   ingredients: 'Maioneză artizanală cu ceapă verde', price: 3 },
  { id: 19, category: 'Sosuri',       name: 'Maioneză Picantă',                    ingredients: 'Maioneză cu ardei iute & boia', price: 3 },
  { id: 20, category: 'Sosuri',       name: 'Ketchup',                             ingredients: 'Sos roșii clasic', price: 2 },
  // Băuturi
  { id: 21, category: 'Băuturi',      name: 'Coca-Cola 0.5L',                      ingredients: 'Răcoritoare', price: 7 },
  { id: 22, category: 'Băuturi',      name: 'Fanta 0.5L',                          ingredients: 'Răcoritoare portocale', price: 7 },
  { id: 23, category: 'Băuturi',      name: 'Sprite 0.5L',                         ingredients: 'Răcoritoare lămâie', price: 7 },
  { id: 24, category: 'Băuturi',      name: 'Apă Plată 0.5L',                      ingredients: 'Apă minerală naturală', price: 3 },
]

const TABS = ['Toate', 'Burgeri', 'Shaorma', 'Kebab', 'Hot Dog', 'Meniuri Cola', 'Sosuri', 'Băuturi'] as const

/* ─── Intersection Observer hook ─────────────────────────── */
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

/* ─── Animated counter hook ──────────────────────────────── */
function useCounter(target: number, duration = 1400, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const tick = (ts: number) => {
      if (!start) start = ts
      const pct = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const ease = 1 - Math.pow(1 - pct, 3)
      setVal(Math.round(ease * target))
      if (pct < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return val
}

/* ─── Menu Card ──────────────────────────────────────────── */
function MenuCard({ item, index, visible }: { item: MenuItem; index: number; visible: boolean }) {
  const delay = index * 80
  return (
    <div
      className="group bg-[#FFF8F0] rounded-2xl overflow-hidden border border-[#e8d5b7] shadow-sm
        transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#D32F2F]/10 hover:border-[#D32F2F]/20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.3s ease, transform 0.3s ease`,
      }}
    >
      {/* Photo (top 6 popular only) */}
      {item.photo && (
        <div className="relative h-44 overflow-hidden bg-[#f0e6d8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.photo}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {item.popular && (
            <span className="absolute top-3 left-3 bg-[#D32F2F] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              ⭐ Popular
            </span>
          )}
        </div>
      )}

      <div className={`p-5 ${!item.photo ? 'pt-5' : ''}`}>
        {/* No-photo popular badge */}
        {item.popular && !item.photo && (
          <span className="inline-block bg-[#FFC107]/20 text-[#b8860b] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
            ⭐ Popular
          </span>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-playfair text-[#1a1a1a] font-bold text-lg leading-tight line-clamp-2">
              {item.name}
            </h3>
            <p className="text-[#6b5c4e] text-xs mt-1.5 leading-relaxed line-clamp-2">
              {item.ingredients}
            </p>
          </div>
          <div className="flex-shrink-0 bg-[#D32F2F] text-white font-bold text-sm px-3 py-1.5 rounded-xl shadow-sm whitespace-nowrap">
            {item.price} lei
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
const CorvinPage: NextPage<Props> = ({ images }) => {
  const heroImage = images[0] ?? null
  const [activeTab, setActiveTab] = useState<string>('Toate')
  const [tabVisible, setTabVisible] = useState(true)

  const filtered = activeTab === 'Toate' ? MENU : MENU.filter(m => m.category === activeTab)

  const handleTab = useCallback((tab: string) => {
    if (tab === activeTab) return
    setTabVisible(false)
    setTimeout(() => { setActiveTab(tab); setTabVisible(true) }, 180)
  }, [activeTab])

  const heroSection   = useInView(0.05)
  const menuSection   = useInView(0.08)
  const statsSection  = useInView(0.3)
  const mapsSection   = useInView(0.1)

  const reviewCount   = useCounter(126, 1200, statsSection.visible)
  const rating        = useCounter(45,  1000, statsSection.visible)  // 4.5 → show as 4.5

  return (
    <>
      <Head>
        <title>Fast Food Cosimo — Bulevardul Corvin, Hunedoara</title>
        <meta name="description" content="Fast Food Cosimo Bd. Corvin — Burgeri, Shaorma, Kebab, Hot Dog în Hunedoara. Mâncare proaspătă, prețuri accesibile." />
      </Head>

      <Navbar variant="location" />

      <main>
        {/* ══════════════════════════════════════════
            HERO — Wolf-style: photo top, dark card bottom
        ══════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[700px] flex flex-col">

          {/* ── TOP: Full-width location photo ── */}
          <div className="relative flex-[1.15] min-h-0 overflow-hidden">
            {/* Location exterior — the hero visual */}
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

            {/* Subtle dark vignette on edges */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)' }} />

            {/* Bottom fade into the dark card */}
            <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }} />
          </div>

          {/* ── BOTTOM: Dark text card, overlaps image ── */}
          <div className="relative flex-1 min-h-0 bg-[#0d0d0d] -mt-8 rounded-t-[2rem] z-10 flex flex-col justify-center overflow-hidden">

            {/* Subtle texture pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20z'/%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E\")", backgroundSize: '20px 20px' }}
            />

            <div
              ref={heroSection.ref}
              className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full"
            >
              <div
                style={{
                  opacity: heroSection.visible ? 1 : 0,
                  transform: heroSection.visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                {/* Location tag */}
                <p className="text-[#D32F2F] uppercase tracking-[0.35em] text-xs font-bold mb-3">
                  // Bulevardul Corvin, Hunedoara
                </p>

                {/* Title */}
                <h1 className="font-playfair font-bold text-white leading-[0.95] mb-3" style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}>
                  Fast Food<br />
                  <span className="italic text-[#D32F2F]">NON STOP</span>
                </h1>

                <p className="text-white/50 text-sm md:text-base mb-6 tracking-wide">
                  Burgeri · Shaorma · Kebab · Hot Dog.<br className="hidden sm:block" />
                  Prețuri corecte, porții generoase.
                </p>

                {/* CTA buttons */}
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

                {/* Ratings */}
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

            {/* Scroll arrow at very bottom of card */}
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
                { value: '24', label: 'Produse în meniu', suffix: '' },
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
            MENU SECTION
        ══════════════════════════════════════════ */}
        <section id="meniu" className="bg-[#FDF6EC] py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div
              ref={menuSection.ref}
              style={{
                opacity: menuSection.visible ? 1 : 0,
                transform: menuSection.visible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
              className="text-center mb-10"
            >
              <p className="font-inter text-[#D32F2F] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                Descoperă
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1a1a1a]">
                Meniul <span className="italic text-[#D32F2F]">Nostru</span>
              </h2>
              <p className="text-[#6b5c4e] mt-3 max-w-md mx-auto">
                Ingrediente proaspete zilnic — gust autentic la prețuri corecte
              </p>
            </div>

            {/* Tab navigation */}
            <div className="overflow-x-auto -mx-4 px-4 mb-8">
              <div className="flex gap-2 w-max md:w-auto md:flex-wrap md:justify-center">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => handleTab(tab)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-[#D32F2F] text-white shadow-lg shadow-red-200'
                        : 'bg-[#FFF8F0] text-[#6b5c4e] border border-[#e8d5b7] hover:border-[#D32F2F]/40 hover:text-[#D32F2F]'
                    }`}
                  >
                    {tab}
                    {tab !== 'Toate' && (
                      <span className={`ml-1.5 text-xs ${activeTab === tab ? 'text-red-200' : 'text-[#c9b99a]'}`}>
                        ({MENU.filter(m => m.category === tab).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            <div
              style={{ opacity: tabVisible ? 1 : 0, transition: 'opacity 0.18s ease' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((item, idx) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={idx}
                    visible={menuSection.visible && tabVisible}
                  />
                ))}
              </div>
            </div>

            {/* Supplements note */}
            <div className="mt-8 p-4 bg-[#FFF8F0] rounded-2xl border border-[#e8d5b7] text-center">
              <p className="text-[#6b5c4e] text-sm">
                <span className="font-semibold text-[#1a1a1a]">Suplimente disponibile:</span>{' '}
                Carne de Kebab +5 lei/porție · Cartofi Prăjiți 100g — 7 lei
              </p>
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
