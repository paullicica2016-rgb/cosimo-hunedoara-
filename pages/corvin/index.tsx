import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useLanguage } from '../../lib/i18n'

interface Props { images: string[] }

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

type Category = 'shaorma' | 'burgeri' | 'sandwich' | 'hotdog' | 'salate' | 'cartofi'

const CATEGORY_LABEL: Record<Category, { ro: string; en: string }> = {
  shaorma: { ro: '🌯 Shaorma & Kebab', en: '🌯 Shawarma & Kebab' },
  burgeri: { ro: '🍔 Burgeri', en: '🍔 Burgers' },
  sandwich: { ro: '🥪 Sandwich', en: '🥪 Sandwich' },
  hotdog: { ro: '🌭 Hot Dog', en: '🌭 Hot Dog' },
  salate: { ro: '🥗 Salate', en: '🥗 Salads' },
  cartofi: { ro: '🍟 Cartofi', en: '🍟 Fries' },
}

interface MenuItem {
  slug: string
  name: string
  nameEn?: string
  category: Category
  priceMedium?: string
  priceFamily?: string
  price?: string
  sizeMediumLabel?: string
  sizeMediumLabelEn?: string
  sizeFamilyLabel?: string
  sizeFamilyLabelEn?: string
  comboPrice?: string
  ingredients: string
  ingredientsEn?: string
  image: string
  imageScale?: number
}

const MENU: MenuItem[] = [
  {
    slug: 'shaorma',
    name: 'Shaorma',
    nameEn: 'Shawarma',
    category: 'shaorma',
    priceMedium: '22 lei',
    priceFamily: '25 lei',
    sizeMediumLabel: 'Mică · 250g',
    sizeMediumLabelEn: 'Small · 250g',
    sizeFamilyLabel: 'Mare · 300g',
    sizeFamilyLabelEn: 'Large · 300g',
    ingredients: 'Lipie, carne pui, cartofi prăjiți, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos usturoi, sos tzatziki, sos chilli, condimente.',
    ingredientsEn: 'Flatbread, chicken, fries, cabbage salad, onion, tomatoes, pickles, ketchup, garlic sauce, tzatziki, chilli sauce, spices.',
    image: '/images/corvin/shaorma.png',
  },
  {
    slug: 'shaorma-farfurie',
    name: 'Shaorma la Caserolă',
    nameEn: 'Shawarma in Casserole',
    category: 'shaorma',
    price: '27 lei',
    ingredients: 'Carne pui, cartofi prăjiți, sos de usturoi, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos tzatziki, sos chilli, lipie. 300g',
    ingredientsEn: 'Chicken, fries, garlic sauce, cabbage salad, onion, tomatoes, pickles, ketchup, tzatziki, chilli sauce, flatbread. 300g',
    image: '/images/corvin/shaorma-farfurie.jpeg',
  },
  {
    slug: 'kebab',
    name: 'Kebab',
    category: 'shaorma',
    price: '22 lei',
    ingredients: 'Chiflă-kebab, carne de pui, cartofi prăjiți, sos de usturoi, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos tzatziki, sos picant. 300g',
    ingredientsEn: 'Kebab bread, chicken, fries, garlic sauce, cabbage salad, onion, tomatoes, pickles, ketchup, tzatziki, spicy sauce. 300g',
    image: '/images/corvin/kebab.jpeg',
  },
  {
    slug: 'pittburger',
    name: 'Pittburger',
    category: 'burgeri',
    priceMedium: '18 lei',
    priceFamily: '21 lei',
    sizeMediumLabel: 'Simplu · 260g',
    sizeMediumLabelEn: 'Single · 260g',
    sizeFamilyLabel: 'Dublu · 330g',
    sizeFamilyLabelEn: 'Double · 330g',
    ingredients: 'Chiflă, chiftea vită + porc — 1 chiftea la Simplu, 2 chiftele la Dublu, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente.',
    ingredientsEn: 'Bun, beef + pork patty — 1 patty on Single, 2 patties on Double, fries, mayo with cabbage, ketchup, pickles, spices.',
    image: '/images/corvin/pittburger-simplu.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'burger-snitel-pui',
    name: 'Burger cu Șnițel de Pui',
    nameEn: 'Chicken Schnitzel Burger',
    category: 'burgeri',
    priceMedium: '19 lei',
    priceFamily: '22 lei',
    sizeMediumLabel: 'Simplu · 280g',
    sizeMediumLabelEn: 'Single · 280g',
    sizeFamilyLabel: 'Dublu · 360g',
    sizeFamilyLabelEn: 'Double · 360g',
    ingredients: 'Chiflă, șnițel din piept de pui — 1 șnițel la Simplu, 2 șnițele la Dublu, cartofi prăjiți, sos de usturoi, maioneză cu varză, ketchup, castraveți murați, condimente.',
    ingredientsEn: 'Bun, chicken breast schnitzel — 1 schnitzel on Single, 2 on Double, fries, garlic sauce, mayo with cabbage, ketchup, pickles, spices.',
    image: '/images/corvin/burger-snitel-pui.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca-cascaval',
    name: 'Sandwich cu Șuncă și Cașcaval',
    nameEn: 'Ham & Cheese Sandwich',
    category: 'sandwich',
    price: '16 lei',
    ingredients: 'Chiflă, cașcaval, șuncă, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 250g',
    ingredientsEn: 'Bun, kaskaval cheese, ham, fries, mayo with cabbage, ketchup, pickles, spices. 250g',
    image: '/images/corvin/sandwich-sunca-cascaval.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca',
    name: 'Sandwich cu Șuncă',
    nameEn: 'Ham Sandwich',
    category: 'sandwich',
    priceMedium: '14 lei',
    priceFamily: '16 lei',
    sizeMediumLabel: 'Simplu · 220g',
    sizeMediumLabelEn: 'Single · 220g',
    sizeFamilyLabel: 'Dublu · 260g',
    sizeFamilyLabelEn: 'Double · 260g',
    ingredients: 'Chiflă, șuncă — 1 felie la Simplu, 2 felii la Dublu, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente.',
    ingredientsEn: 'Bun, ham — 1 slice on Single, 2 slices on Double, fries, mayo with cabbage, ketchup, pickles, spices.',
    image: '/images/corvin/sandwich-sunca.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'hotdog-cascaval',
    name: 'Hot Dog cu Cașcaval',
    nameEn: 'Hot Dog with Cheese',
    category: 'hotdog',
    priceMedium: '15 lei',
    priceFamily: '19 lei',
    sizeMediumLabel: 'Simplu · 220g',
    sizeMediumLabelEn: 'Single · 220g',
    sizeFamilyLabel: 'Dublu · 270g',
    sizeFamilyLabelEn: 'Double · 270g',
    ingredients: 'Baton, crenvurști — 1 crenvurst la Simplu, 2 crenvurști la Dublu, cașcaval, maioneză, ketchup, muștar.',
    ingredientsEn: 'Baguette, frankfurters — 1 frankfurter on Single, 2 on Double, kaskaval cheese, mayo, ketchup, mustard.',
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
    sizeMediumLabelEn: 'Single · 180g',
    sizeFamilyLabel: 'Dublu · 230g',
    sizeFamilyLabelEn: 'Double · 230g',
    ingredients: 'Baton, crenvurști — 1 crenvurst la Simplu, 2 crenvurști la Dublu, maioneză, ketchup, muștar.',
    ingredientsEn: 'Baguette, frankfurters — 1 frankfurter on Single, 2 on Double, mayo, ketchup, mustard.',
    image: '/images/corvin/hotdog.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'cartofi-cheddar',
    name: 'Cartofi cu Cheddar și Ceapă Caramelizată',
    nameEn: 'Cheddar & Caramelized Onion Fries',
    category: 'cartofi',
    price: '12 lei',
    ingredients: 'Cartofi, sos cheddar, ceapă caramelizată, condimente. 220g',
    ingredientsEn: 'Fries, cheddar sauce, caramelized onion, spices. 220g',
    image: '/images/corvin/cartofi-cheddar.png',
    imageScale: 1.15,
  },
  {
    slug: 'salata-kebab',
    name: 'Salată cu Carne Kebab Cosimo',
    nameEn: 'Cosimo Kebab Meat Salad',
    category: 'salate',
    price: '21 lei',
    ingredients: 'Carne kebab la grătar, salată iceberg, morcov, roșii, castraveți, ceapă roșie, dressing tzatziki sau dressing orange Cosimo. 280g',
    ingredientsEn: 'Grilled kebab meat, iceberg lettuce, carrot, tomato, cucumber, red onion, tzatziki or Cosimo orange dressing. 280g',
    image: '/images/corvin/salata-pui.png',
    imageScale: 1.3,
  },
  {
    slug: 'salata-ton',
    name: 'Salată cu Ton Cosimo',
    nameEn: 'Cosimo Tuna Salad',
    category: 'salate',
    price: '21 lei',
    ingredients: 'Ton, ceapă roșie, roșii, salată iceberg, morcov, castraveți, dressing orange Cosimo și dressing pătrunjel cu lămâie. 280g',
    ingredientsEn: 'Tuna, red onion, tomato, iceberg lettuce, carrot, cucumber, Cosimo orange dressing and parsley–lemon dressing. 280g',
    image: '/images/corvin/salata-ton.png',
    imageScale: 1.4,
  },
  {
    slug: 'salata-vegetala',
    name: 'Salată Vegetală Cosimo',
    nameEn: 'Cosimo Vegetarian Salad',
    category: 'salate',
    price: '18 lei',
    ingredients: 'Roșii, salată iceberg, morcov, varză, castraveți, ceapă roșie, ardei iute (opțional), dressing tzatziki sau dressing orange Cosimo, dressing de pătrunjel cu lămâie. 270g',
    ingredientsEn: 'Tomato, iceberg lettuce, carrot, cabbage, cucumber, red onion, chilli pepper (optional), tzatziki or Cosimo orange dressing, parsley–lemon dressing. 270g',
    image: '/images/corvin/salata-vegetala.png',
    imageScale: 1.2,
  },
  {
    slug: 'cartofi',
    name: 'Cartofi Prăjiți',
    nameEn: 'French Fries',
    category: 'cartofi',
    priceMedium: '7 lei',
    priceFamily: '10 lei',
    sizeMediumLabel: '100g',
    sizeFamilyLabel: '150g',
    ingredients: 'Cartofi prăjiți crocanți — porție ca supliment sau garnitură.',
    ingredientsEn: 'Crispy fries — as a side or extra.',
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
  const { t, lang } = useLanguage()
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
    { value: 'toate' as TabValue, label: t('Toate', 'All'), count: MENU.length },
    { value: 'shaorma' as TabValue, label: CATEGORY_LABEL.shaorma[lang], count: countBy('shaorma') },
    { value: 'burgeri' as TabValue, label: CATEGORY_LABEL.burgeri[lang], count: countBy('burgeri') },
    { value: 'sandwich' as TabValue, label: CATEGORY_LABEL.sandwich[lang], count: countBy('sandwich') },
    { value: 'hotdog' as TabValue, label: CATEGORY_LABEL.hotdog[lang], count: countBy('hotdog') },
    { value: 'salate' as TabValue, label: CATEGORY_LABEL.salate[lang], count: countBy('salate') },
    { value: 'cartofi' as TabValue, label: CATEGORY_LABEL.cartofi[lang], count: countBy('cartofi') },
  ]

  return (
    <>
      <Head>
        <title>{t('Cosimo Fast Food Pietonala — Bd. Corvin nr. 1, ap. 3, Hunedoara', 'Cosimo Fast Food Pietonala — Bd. Corvin no. 1, ap. 3, Hunedoara')}</title>
        <meta name="description" content={t('Fast Food Cosimo Bd. Corvin — Shaorma, Burgeri, Kebab, Hot Dog în Hunedoara. Mâncare proaspătă, prețuri accesibile.', 'Cosimo Fast Food Bd. Corvin — Shawarma, Burgers, Kebab, Hot Dog in Hunedoara. Fresh food, fair prices.')} />
      </Head>

      <Navbar variant="location" />

      <main>
        {/* ══════════════════════════════════════════
            HERO — split layout with burger showcase
        ══════════════════════════════════════════ */}
        <section className="relative bg-[#0d0806] overflow-hidden min-h-[92vh] flex items-center pt-16">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#D32F2F]/25 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#FFC107]/15 blur-[120px] pointer-events-none" />

          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }}
          />

          <div ref={heroSection.ref} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div
              style={{
                opacity: heroSection.visible ? 1 : 0,
                transform: heroSection.visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
              }}
              className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
            >

              <div>
                <p className="font-inter text-[#FFC107] uppercase tracking-[0.35em] text-xs font-semibold mb-3">
                  {t('// Bd. Corvin nr. 1, ap. 3', '// Bd. Corvin no. 1, ap. 3')}
                </p>

                <h1 className="font-playfair font-bold text-white leading-[0.9] mb-4" style={{ fontSize: 'clamp(56px, 9vw, 108px)' }}>
                  <span className="inline-block italic text-[#D32F2F]">Fast Food</span>
                  <br />
                  Cosimo
                </h1>

                <p className="text-white/70 text-base md:text-lg max-w-md mb-8 leading-relaxed">
                  {t(
                    'Burgeri, sandwich-uri, hot dog și cartofi făcuți pe loc — prețuri corecte, porții generoase.',
                    'Burgers, sandwiches, hot dogs and fresh-made fries — fair prices, generous portions.'
                  )}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href="tel:0724004415"
                    className="inline-flex items-center justify-center gap-2 bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl shadow-red-900/40 text-sm uppercase tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    0724 004 415
                  </a>
                  <a
                    href="#meniu"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-full border border-white/25 hover:border-white/50 transition-all text-sm uppercase tracking-wider"
                  >
                    {t('Vezi meniul', 'View menu')}
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#FFC107]">★★★★★</span>
                    <span className="text-white font-semibold">4.5</span>
                    <span className="text-white/40 text-xs">· 126 {t('recenzii Google', 'Google reviews')}</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <svg className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {t('Program: 10:00 — 22:00', 'Open: 10:00 — 22:00')}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D32F2F]/40 to-[#FFC107]/20 blur-3xl" />
                  <Image
                    src="/images/corvin/pittburger.jpeg"
                    alt="Burger Cosimo"
                    fill
                    className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <a
            href="#meniu"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </section>

        {/* ══════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════ */}
        <div ref={statsSection.ref} className="bg-[#D32F2F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-white/20">
              {[
                { value: `${(rating / 10).toFixed(1)}`, label: t('Rating Google', 'Google Rating'), suffix: '⭐' },
                { value: `${reviewCount}`, label: t('Recenzii', 'Reviews'), suffix: '+' },
                { value: `${MENU.length}`, label: t('Produse în meniu', 'Menu items'), suffix: '' },
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
              <p className="font-inter text-[#e8b76a] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
                Il menù
              </p>
              <h2 className="font-playfair text-5xl md:text-6xl font-bold text-white italic">
                {t('Meniul', 'Our')} <span className="text-[#e8b76a]">{t('nostru', 'Menu')}</span>
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
                    {lang === 'en' && item.nameEn ? item.nameEn : item.name}
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
                            {lang === 'en' && item.sizeMediumLabelEn ? item.sizeMediumLabelEn : (item.sizeMediumLabel ?? 'Medie · 32 cm')}
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
                            {lang === 'en' && item.sizeFamilyLabelEn ? item.sizeFamilyLabelEn : (item.sizeFamilyLabel ?? 'Family · 50 cm')}
                          </span>
                          <span className="text-white font-bold text-2xl mt-1 tracking-wide">
                            {item.priceFamily}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-white/70 text-sm mt-4 max-w-md leading-relaxed">
                    {lang === 'en' && item.ingredientsEn ? item.ingredientsEn : item.ingredients}
                  </p>
                  {item.comboPrice && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-[#e8b76a]/10 border border-[#e8b76a]/30 rounded-full px-4 py-2">
                      <span className="text-[#e8b76a] text-sm">🥤</span>
                      <span className="text-white/80 text-xs uppercase tracking-wider font-semibold">
                        {t('Meniu + Coca-Cola 330 ml', 'Combo + Coca-Cola 330 ml')}
                      </span>
                      <span className="text-[#e8b76a] font-bold text-sm">
                        {item.comboPrice}
                      </span>
                    </div>
                  )}
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
              {t('Nu gătești azi? Nici nu trebuie, gătim noi!', "Not cooking today? No need — we've got it!")} 🍔
            </h2>
            <p className="text-[#c9b99a] mb-8">
              {t(
                'Comandă pe Glovo cu livrare, sau sună-ne telefonic — comenzile telefonice se ridică doar din locație.',
                'Order on Glovo for delivery, or call us by phone — phone orders are pickup-only from our location.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:0724004415"
                className="bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-red-900/50 text-sm inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0724 004 415
              </a>
              <a href="https://food.bolt.eu" target="_blank" rel="noopener noreferrer"
                className="bg-[#34D186] hover:bg-[#2ab973] text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl text-sm inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.4 15.5l-4.5-4.5 1.5-1.5 3 3 6-6 1.5 1.5-7.5 7.5z" />
                </svg>
                Bolt Food
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
                {t('Cum ne găsești', 'Find us')}
              </h2>
              <p className="text-[#6b5c4e] mt-2 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bd. Corvin nr. 1, ap. 3, Hunedoara, România
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
                src="https://maps.google.com/maps?q=45.7548575,22.9040721&hl=ro&z=17&output=embed"
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
