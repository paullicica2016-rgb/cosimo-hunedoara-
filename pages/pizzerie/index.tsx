import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

type Category = 'pizza' | 'paste' | 'burgeri' | 'desert'

interface MenuItem {
  slug: string
  name: string
  category: Category
  priceMedium?: string
  priceFamily?: string
  sizeMediumLabel?: string
  sizeFamilyLabel?: string
  price?: string
  ingredients: string
  image: string
  imageScale?: number
}

const CATEGORY_LABEL: Record<Category, string> = {
  pizza: '🍕 Pizza',
  paste: '🍝 Paste',
  burgeri: '🍔 Burgeri',
  desert: '🍰 Desert',
}

interface Drink {
  name: string
  note?: string
  volume?: string
  price: string
}

interface DrinkGroup {
  title: string
  items: Drink[]
}

const DRINKS: DrinkGroup[] = [
  {
    title: 'Vinuri & Șampanie',
    items: [
      { name: 'Vin fiert (Merlot)', volume: '200 ml', price: '10 lei' },
      { name: 'Castel Huniade', note: 'sec, demisec — alb, roșu, roze', volume: '187 ml', price: '15 lei' },
      { name: 'Cocktail Zarea', volume: '275 ml', price: '18 lei' },
      { name: 'Prosecco', note: 'sec', volume: '200 ml', price: '25 lei' },
      { name: 'Șampanie Royal Gold — Zarea', note: 'demisec', volume: '750 ml', price: '70 lei' },
      { name: 'Vin Bușuioacă Dealurile Munteniei', note: 'demidulce, roze', volume: '700 ml', price: '75 lei' },
      { name: 'Vin Purcari', note: 'sec, demisec — alb, roșu', volume: '700 ml', price: '75 lei' },
      { name: 'Wine Chocolate', volume: '500 ml', price: '75 lei' },
      { name: 'Flori de Gheață', volume: '375 ml', price: '75 lei' },
      { name: 'Vin Cuvee', note: 'sec, roșu', volume: '700 ml', price: '200 lei' },
    ],
  },
  {
    title: 'Cocktail-uri',
    items: [
      { name: 'Dry Martini', note: '20 ml Cinzano, 50 ml Gin, gheață, 3 măsline', price: '25 lei' },
      { name: 'Aperol Spritz', note: '75 ml Prosecco, 50 ml Aperol, 30 ml apă minerală, felie de portocală', price: '25 lei' },
      { name: 'Cuba Libre', note: '50 ml rom, 220 ml Cola, gheață, suc de lămâie', price: '25 lei' },
      { name: 'Gin Tonic', note: '50 ml Gin, 220 ml apă tonică, gheață, afine, merișoare, felie de portocală', price: '25 lei' },
    ],
  },
  {
    title: 'Bere',
    items: [
      { name: 'Birra Moretti', volume: '0.33 L', price: '9 lei' },
      { name: 'Birra Moretti Zero', volume: '0.33 L', price: '9 lei' },
      { name: 'Ciuc Radler', note: 'zmeură și lămâie', volume: '0.50 L', price: '11 lei' },
      { name: 'Desperados', volume: '400 ml', price: '11 lei' },
      { name: 'Heineken', volume: '0.33 L', price: '10 lei' },
      { name: 'Heineken Zero', volume: '0.33 L', price: '10 lei' },
      { name: 'Silva Black', volume: '0.50 L', price: '13 lei' },
      { name: 'Strongbow', note: 'red, gold', volume: '0.33 L', price: '10 lei' },
      { name: 'Bere Draft (Birra Moretti)', volume: '400 ml', price: '12 lei' },
    ],
  },
  {
    title: 'Răcoritoare',
    items: [
      { name: 'Coca-Cola', note: 'Gust Original', volume: '0.25 L', price: '9 lei' },
      { name: 'Coca-Cola Zero', note: 'Zero zahăr, zero calorii', volume: '0.25 L', price: '9 lei' },
      { name: 'Fanta', note: 'Orange, Orange Zero, Madness', volume: '0.25 L', price: '9 lei' },
      { name: 'Sprite', volume: '0.25 L', price: '9 lei' },
      { name: 'Schweppes', note: 'Tonic, Tonic Zero, Bitter Lemon, Mandarin, Pink Style', volume: '0.25 L', price: '9 lei' },
      { name: 'FuzeTea', note: 'Lemon Lemongrass, Peach Hibiscus', volume: '0.25 L', price: '9 lei' },
      { name: 'Cappy Nectar', note: 'Orange, Peach, Pear, Red Orange, Sour Cherry', volume: '0.25 L', price: '9 lei' },
      { name: 'Dorna', note: 'apă minerală carbogazoasă / plată', volume: '0.33 L', price: '7 lei' },
      { name: 'Dorna', note: 'apă minerală carbogazoasă / plată', volume: '0.75 L', price: '11 lei' },
      { name: 'Burn Energy', note: 'Original & Non Sugar', volume: '0.25 L', price: '9 lei' },
    ],
  },
  {
    title: 'Cafea & Băuturi Calde',
    items: [
      { name: 'Cafea', price: '7 lei' },
      { name: 'Cafe Latte', note: 'cafea, lapte', price: '10 lei' },
      { name: 'Cappuccino', note: 'cafea, lapte', price: '11 lei' },
      { name: 'Latte Macchiato', note: 'cafea, lapte', price: '13 lei' },
      { name: 'Cafe Aroma', note: 'cafea, caramel / scorțișoară, lapte opțional', price: '11 lei' },
      { name: 'Ice Coffee', note: 'cafea, lapte, gheață', price: '11 lei' },
      { name: 'Frappe', note: 'înghețată vanilie, cafea, lapte, frișcă, gheață', price: '15 lei' },
      { name: 'Ciocolată Caldă', note: 'ciocolată plic, lapte', price: '14 lei' },
      { name: 'Ceai', note: 'plic ceai, apă', price: '8 lei' },
      { name: 'Milkshake', note: 'lapte, înghețată vanilie, biscuiți Oreo, frișcă, topping', price: '15 lei' },
      { name: 'Limonadă', note: 'lămâie, aromă sirop afine/rodie, gheață, mentă opțional', price: '15 lei' },
      { name: 'Cocktail Non-Alcoolic', note: 'sirop rodie/afine, suc portocale, sprite, gheață', price: '18 lei' },
    ],
  },
  {
    title: 'Lichioruri & Vinars',
    items: [
      { name: 'Cognac Jidvei (Vinars)', volume: '100 ml', price: '16 lei' },
      { name: 'Vecchia Romagna', volume: '100 ml', price: '18 lei' },
      { name: "Lichior Sheridan's", volume: '100 ml', price: '20 lei' },
    ],
  },
]

interface Props {
  heroImage: string | null
  menu: MenuItem[]
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const MENU: MenuItem[] = [
  {
    slug: 'pizza-huniad',
    name: 'Pizza Huniad',
    category: 'pizza',
    priceMedium: '35 lei',
    priceFamily: '66 lei',
    ingredients: 'Sos de roșii, mozzarella, ou, cârnat, ardei, ceapă, ardei iute.',
    image: '/images/pizzerie/tasta-cu-ou.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-salami',
    name: 'Pizza Salami',
    category: 'pizza',
    priceMedium: '32 lei',
    priceFamily: '60 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, salam Spinata, Romana Dolce.',
    image: '/images/pizzerie/pizza-salami.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-quatro-formaggi',
    name: 'Pizza Quatro Formaggi',
    category: 'pizza',
    priceMedium: '34 lei',
    priceFamily: '66 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, brânză Asiago, emmentaler, gorgonzola, Grana Padano.',
    image: '/images/pizzerie/quatro-formaggi.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-cosimo',
    name: 'Pizza Cosimo',
    category: 'pizza',
    priceMedium: '35 lei',
    priceFamily: '66 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, măsline, șuncă, mușchi file, salam, ciuperci, ardei kapia.',
    image: '/images/pizzerie/pizza-cosimo.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-jenny',
    name: 'Pizza Jenny',
    category: 'pizza',
    priceMedium: '33 lei',
    priceFamily: '62 lei',
    ingredients: 'Aluat, crenvurști, cartofi pai, emmentaler.',
    image: '/images/pizzerie/pizza-jenny.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-prosciutto-crudo',
    name: 'Pizza Prosciutto Crudo',
    category: 'pizza',
    priceMedium: '34 lei',
    priceFamily: '65 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, prosciutto crudo Stagionato, rucola.',
    image: '/images/pizzerie/pizza-prosciutto-crudo.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-tonno',
    name: 'Pizza Tonno',
    category: 'pizza',
    priceMedium: '33 lei',
    priceFamily: '62 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, ton, ceapă, lămâie.',
    image: '/images/pizzerie/pizza-tonno.png',
  },
  {
    slug: 'pizza-semplice',
    name: 'Pizza Semplice',
    category: 'pizza',
    priceMedium: '31 lei',
    priceFamily: '56 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, șuncă, ciuperci.',
    image: '/images/pizzerie/pizza-semplice.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-kebab',
    name: 'Pizza Kebab',
    category: 'pizza',
    priceMedium: '34 lei',
    priceFamily: '65 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, carne kebab, ceapă roșie, ardei, sos de usturoi.',
    image: '/images/pizzerie/pizza-kebab.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-peperoncino',
    name: 'Pizza Peperoncino',
    category: 'pizza',
    priceMedium: '32 lei',
    priceFamily: '60 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, salam picant, ceapă, ardei iute.',
    image: '/images/pizzerie/pizza-peperoncino.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-vegetala',
    name: 'Pizza Vegetală',
    category: 'pizza',
    priceMedium: '29 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte (sau vegetală/de post), mix de legume, ardei copt, zucchini, măsline, anghinare (opțional).',
    image: '/images/pizzerie/pizza-vegetala.png',
    imageScale: 1.25,
  },
  {
    slug: 'pizza-desert',
    name: 'Pizza Desert',
    category: 'pizza',
    priceMedium: '33 lei',
    ingredients: 'Aluat, Nutella, ananas, fructe de sezon, banană, fulgi de migdale sau biscuiți Oreo.',
    image: '/images/pizzerie/pizza-desert.png',
    imageScale: 1.25,
  },
  {
    slug: 'chef-burger',
    name: "Chef's Burger",
    category: 'burgeri',
    priceMedium: '16 lei',
    priceFamily: '35 lei',
    sizeMediumLabel: 'Mini',
    sizeFamilyLabel: 'Regular',
    ingredients: 'Chiflă cu susan, chiftea de vită, cașcaval cheddar, bacon, salată, roșii, castraveți murați, ceapă crispy, sos special — cu cartofi wedges și sos cheddar.',
    image: '/images/pizzerie/chef-burger.png',
  },
  {
    slug: 'paste-cosimo',
    name: 'Paste Cosimo',
    category: 'paste',
    price: '35 lei',
    ingredients: 'Paste al dente, sos de roșii, parmezan, măsline negre, busuioc proaspăt.',
    image: '/images/pizzerie/paste-cosimo.png',
  },
  {
    slug: 'tagliatelle-carbonara',
    name: 'Tagliatelle Carbonara',
    category: 'paste',
    price: '35 lei',
    ingredients: 'Tagliatelle, ou, guanciale (sau bacon), Pecorino Romano, piper negru proaspăt măcinat.',
    image: '/images/pizzerie/tagliatelle-carbonara.png',
  },
  {
    slug: 'paste-quatro-formaggi',
    name: 'Paste Quatro Formaggi',
    category: 'paste',
    price: '35 lei',
    ingredients: 'Paste, mozzarella, gorgonzola, Grana Padano, emmentaler, smântână, piper negru.',
    image: '/images/pizzerie/paste-quatro-formaggi.png',
  },
  {
    slug: 'paste-bologneze',
    name: 'Paste Bologneze',
    category: 'paste',
    price: '35 lei',
    ingredients: 'Paste, ragù de vită și porc, sos de roșii, parmezan, busuioc proaspăt.',
    image: '/images/pizzerie/paste-bolognese.png',
  },
  {
    slug: 'paste-primavera',
    name: 'Paste Primavera',
    category: 'paste',
    price: '32 lei',
    ingredients: 'Paste, zucchini, ardei copt, morcov, roșii cherry, mazăre, usturoi, ulei de măsline, parmezan, busuioc proaspăt.',
    image: '/images/pizzerie/paste-primavera.png',
    imageScale: 0.85,
  },
  {
    slug: 'lava-cake',
    name: 'Lava Cake',
    category: 'desert',
    price: '22 lei',
    ingredients: 'Prăjitură de ciocolată cu inimă lichidă, servită cu înghețată de vanilie și fructe de pădure.',
    image: '/images/pizzerie/lava-cake.png',
  },
  {
    slug: 'papanasi',
    name: 'Papanași',
    category: 'desert',
    price: '22 lei',
    ingredients: 'Gogoașă prăjită cu brânză dulce, smântână și dulceață de fructe de pădure.',
    image: '/images/pizzerie/papanasi.png',
    imageScale: 1.5,
  },
  {
    slug: 'clatite',
    name: 'Clătite',
    category: 'desert',
    price: '18 lei',
    ingredients: 'Sortimente la alegere · cu Nutella · cu Nutella și banane · cu gem de afine · cu ciocolată și biscuiți Oreo. Servite cu frișcă și felii de portocală.',
    image: '/images/pizzerie/clatite.png',
  },
]

type TabValue = 'toate' | Category | 'bauturi'

const PizzeriePage: NextPage<Props> = ({ heroImage, menu }) => {
  const [activeTab, setActiveTab] = useState<TabValue>('toate')

  const filtered = activeTab === 'toate' || activeTab === 'bauturi'
    ? menu
    : menu.filter(m => m.category === activeTab)
  const countBy = (cat: Category) => menu.filter(m => m.category === cat).length
  const drinksTotal = DRINKS.reduce((sum, g) => sum + g.items.length, 0)
  const tabs = [
    { value: 'toate' as TabValue, label: 'Toate', count: menu.length },
    { value: 'pizza' as TabValue, label: CATEGORY_LABEL.pizza, count: countBy('pizza') },
    { value: 'paste' as TabValue, label: CATEGORY_LABEL.paste, count: countBy('paste') },
    { value: 'burgeri' as TabValue, label: CATEGORY_LABEL.burgeri, count: countBy('burgeri') },
    { value: 'desert' as TabValue, label: CATEGORY_LABEL.desert, count: countBy('desert') },
    { value: 'bauturi' as TabValue, label: '🥂 Băuturi', count: drinksTotal },
  ]

  return (
    <>
      <Head>
        <title>Pizzeria Cosimo — Cuptor pe lemne · Bd. Corvin nr. 1, Hunedoara</title>
        <meta name="description" content="Pizzeria Cosimo Hunedoara — Pizza napoletană coaptă în cuptor pe lemne. Rețete tradiționale, ingrediente italiene. Comenzi telefonice." />
      </Head>

      <Navbar variant="location" />

      <main className="bg-[#1a0f0a]">
        {/* ─── HERO ─── */}
        <section className="relative h-[92vh] min-h-[600px] flex items-center overflow-hidden">
          {heroImage ? (
            <Image
              src={`/images/pizzerie/${heroImage}`}
              alt="Cuptor pe lemne Pizzeria Cosimo"
              fill
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a1a0a] to-[#0a0503]" />
          )}
          {/* Dark vignette so text stays legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-[#e8b76a]" />
                <span className="font-inter text-[#e8b76a] uppercase tracking-[0.4em] text-xs font-semibold">
                  Cuptor pe lemne · dal 1998
                </span>
              </div>
              <h1 className="font-playfair text-6xl md:text-8xl font-bold text-white leading-[0.95] italic">
                Pizzeria
                <br />
                <span className="text-[#e8b76a]">Cosimo</span>
              </h1>
              <p className="font-playfair italic text-white/85 text-xl md:text-2xl mt-6 max-w-lg">
                „O bucată de Napoli, coaptă pe lemne în inima Hunedoarei."
              </p>
              <div className="flex items-center gap-3 mt-8 text-white/70 text-sm">
                <svg className="w-4 h-4 text-[#e8b76a]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bd. Corvin nr. 1, bl. 1, ap. 2 · Hunedoara
              </div>

              <div className="flex flex-wrap gap-3 mt-10">
                <a
                  href="#meniu"
                  className="bg-[#e8b76a] hover:bg-[#d4a054] text-[#1a0f0a] font-bold px-8 py-4 rounded-full transition-all shadow-xl text-sm uppercase tracking-wider"
                >
                  Vezi meniul
                </a>
                <a
                  href="https://food.bolt.eu/ro-ro/1846-hunedoara/p/151943-pizzeria-cosimo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#34D186] hover:bg-[#2ab973] text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl text-sm uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.4 15.5l-4.5-4.5 1.5-1.5 3 3 6-6 1.5 1.5-7.5 7.5z" />
                  </svg>
                  Bolt Food
                </a>
                <a
                  href="tel:0792764690"
                  className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-4 rounded-full transition-all text-sm uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0792 764 690
                </a>
              </div>
            </div>
          </div>

          {/* Bottom scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </section>

        {/* ─── MENU ─── */}
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
                Specialitățile <span className="text-[#e8b76a]">casei</span>
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

            {activeTab === 'bauturi' ? (
              <div className="max-w-3xl mx-auto space-y-14">
                {DRINKS.map(group => (
                  <div key={group.title}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="h-px flex-1 bg-[#e8b76a]/30" />
                      <h3 className="font-playfair italic text-2xl md:text-3xl text-[#e8b76a] whitespace-nowrap">
                        {group.title}
                      </h3>
                      <span className="h-px flex-1 bg-[#e8b76a]/30" />
                    </div>
                    <ul className="divide-y divide-white/10">
                      {group.items.map((d, i) => (
                        <li key={`${d.name}-${i}`} className="flex items-baseline gap-3 py-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-playfair text-white text-lg leading-tight">
                              {d.name}
                            </div>
                            {d.note && (
                              <div className="text-white/50 text-xs mt-1 leading-snug">
                                {d.note}
                              </div>
                            )}
                          </div>
                          <div className="flex items-baseline gap-3 flex-shrink-0 text-right">
                            {d.volume && (
                              <span className="text-white/50 text-xs whitespace-nowrap tabular-nums">
                                {d.volume}
                              </span>
                            )}
                            <span className="text-[#e8b76a] font-bold text-base whitespace-nowrap tabular-nums min-w-[60px] text-right">
                              {d.price}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {filtered.map(item => (
                <div key={item.slug} className="flex flex-col items-center text-center group">
                  <div className="relative w-full aspect-[3/2] max-w-md overflow-hidden transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      style={item.imageScale ? { transform: `scale(${item.imageScale})` } : undefined}
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                  <h3 className="font-playfair italic text-4xl font-bold text-[#e8b76a] mt-2">
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
                    href="tel:0792764690"
                    className="mt-8 inline-flex items-center gap-2 border-2 border-[#e8b76a] text-[#e8b76a] hover:bg-[#e8b76a] hover:text-[#0f0806] font-bold uppercase tracking-widest px-8 py-3 rounded-full transition-all text-xs"
                  >
                    Comandă telefonic
                  </a>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* ─── ORDER CTA ─── */}
        <section className="relative py-24 overflow-hidden bg-[#3a1a0a]">
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #a63e2a 0%, transparent 55%), radial-gradient(circle at 80% 70%, #e8b76a 0%, transparent 50%)" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <p className="font-inter text-[#e8b76a] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
              Buonissimo
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white italic leading-tight">
              Ți-e foame?
              <br />
              <span className="text-[#e8b76a]">Cuptorul e cald.</span>
            </h2>
            <p className="text-white/80 mt-6 mb-10 text-lg">
              Sună-ne, alege pizza — o găsești pregătită și proaspătă în câteva minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://food.bolt.eu/ro-ro/1846-hunedoara/p/151943-pizzeria-cosimo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#34D186] hover:bg-[#2ab973] text-white font-bold px-10 py-4 rounded-full transition-all hover:shadow-2xl text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.4 15.5l-4.5-4.5 1.5-1.5 3 3 6-6 1.5 1.5-7.5 7.5z" />
                </svg>
                Comandă pe Bolt Food
              </a>
              <a
                href="tel:0792764690"
                className="bg-[#e8b76a] hover:bg-[#d4a054] text-[#1a0f0a] font-bold px-10 py-4 rounded-full transition-all hover:shadow-2xl text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0792 764 690
              </a>
              <a
                href="https://maps.google.com/?q=Bd+Corvin+nr+1+Hunedoara+Romania"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/50 hover:border-white text-white font-bold px-10 py-4 rounded-full transition-all text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Direcții pe Maps
              </a>
            </div>
          </div>
        </section>

        {/* ─── GOOGLE MAPS ─── */}
        <section className="bg-[#faf3e3] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="font-inter text-[#a63e2a] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                Cum ne găsești
              </p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#3a1a0a] italic">
                Te așteptăm la Cosimo
              </h2>
              <p className="text-[#5c4433] mt-3 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-[#a63e2a]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bd. Corvin nr. 1, bl. 1, ap. 2, Hunedoara
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#d4b483]/50">
              <iframe
                src="https://maps.google.com/maps?q=Bd+Corvin+nr+1+bl+1+Hunedoara+Romania&hl=ro&z=16&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                title="Pizzeria Cosimo"
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
  const dir = path.join(process.cwd(), 'public', 'images', 'pizzerie')
  let heroImage: string | null = null
  if (fs.existsSync(dir)) {
    const all = fs.readdirSync(dir)
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort()
    const heroFile = all.find(f => f.toLowerCase().includes('hero'))
    heroImage = heroFile ?? null
  }
  return { props: { heroImage, menu: MENU } }
}

export default PizzeriePage
