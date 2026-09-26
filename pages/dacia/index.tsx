import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useLanguage } from '../../lib/i18n'

interface Props {
  heroImage: string | null
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

interface MenuItem {
  slug: string
  name: string
  nameEn?: string
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

interface Drink {
  name: string
  nameEn?: string
  note?: string
  noteEn?: string
  volume?: string
  price: string
}

interface DrinkGroup {
  title: string
  titleEn?: string
  items: Drink[]
}

const DRINKS: DrinkGroup[] = [
  {
    title: 'Băuturi Răcoritoare',
    titleEn: 'Soft Drinks',
    items: [
      { name: 'Coca-Cola', note: 'Gust Original, Zero Zahăr, Lamaie Verde Zero, Cherry Zero', volume: '0.50 L', price: '10,50 lei' },
      { name: 'Fanta', note: 'Orange, Madness, Zero Orange, Zero Mango, Zero WTF', volume: '0.50 L', price: '10,50 lei' },
      { name: 'Sprite', volume: '0.50 L', price: '10,50 lei' },
      { name: 'Schweppes', note: 'Tonic Water, Tonic Water Zero, Bitter Lemon, Mandarin, Pomegranate, Pink Style', volume: '0.50 L', price: '10,50 lei' },
      { name: 'FuzeTea', note: 'Lemon Lemongrass, Peach Hibiscus, Forest Fruit, Mango Pineapple, Green Lime Mint, White Peach Zero, Cherry Elderflower', volume: '0.50 L', price: '10,50 lei' },
      { name: 'Cappy Pulpy', note: 'Orange, Peach, Grapefruit', volume: '0.33 L', price: '10,50 lei' },
      { name: 'Cappy Nectar', note: 'Orange, Peach', volume: '0.33 L', price: '10,50 lei' },
      { name: 'Cappy Lemonades', note: 'Minty Lemon, Happy Lemon, Lemon Elderflower', volume: '0.40 L', price: '10,50 lei' },
      { name: 'Dorna', note: 'apă minerală carbo/plată', volume: '0.50 L', price: '10,50 lei' },
      { name: 'Burn', note: 'Energy Drink Original & Non Sugar', volume: '0.25 L', price: '10,50 lei' },
      { name: 'Monster', note: 'Energy Drink Original & Non Sugar', volume: '0.50 L', price: '10,50 lei' },
    ],
  },
  {
    title: 'Cocktailuri Premix',
    titleEn: 'Premix Cocktails',
    items: [
      { name: "Jack Daniel's & Coca-Cola", volume: '330 ml', price: '20 lei' },
      { name: 'Bacardi & Coca-Cola', volume: '330 ml', price: '20 lei' },
    ],
  },
]

const MENU: MenuItem[] = [
  {
    slug: 'burger-snitel-pui',
    name: 'Burger cu Șnițel de Pui',
    nameEn: 'Chicken Schnitzel Burger',
    price: '20 lei',
    comboPrice: '26 lei',
    ingredients: 'Chiflă, șnițel din piept de pui, cartofi prăjiți, sos de usturoi, maioneză cu varză, ketchup, castraveți murați, condimente. 280g',
    ingredientsEn: 'Bun, chicken breast schnitzel, fries, garlic sauce, mayo with cabbage, ketchup, pickles, spices. 280g',
    image: '/images/dacia/burger-snitel-pui-cutout.png',
    imageScale: 0.8,
  },
  {
    slug: 'pittburger',
    name: 'Pittburger',
    price: '19 lei',
    comboPrice: '25 lei',
    ingredients: 'Chiflă, chiftea vită + porc, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 260g',
    ingredientsEn: 'Bun, beef + pork patty, fries, mayo with cabbage, ketchup, pickles, spices. 260g',
    image: '/images/dacia/pittburger-cutout.png',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca-cascaval',
    name: 'Sandwich cu Șuncă și Cașcaval',
    nameEn: 'Ham & Cheese Sandwich',
    price: '17 lei',
    comboPrice: '23 lei',
    ingredients: 'Chiflă, cașcaval, șuncă, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 250g',
    ingredientsEn: 'Bun, kaskaval cheese, ham, fries, mayo with cabbage, ketchup, pickles, spices. 250g',
    image: '/images/dacia/sandwich-sunca-cascaval-cutout.png',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca',
    name: 'Sandwich cu Șuncă',
    nameEn: 'Ham Sandwich',
    price: '15 lei',
    ingredients: 'Chiflă, șuncă, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 220g',
    ingredientsEn: 'Bun, ham, fries, mayo with cabbage, ketchup, pickles, spices. 220g',
    image: '/images/dacia/sandwich-sunca-cutout.png',
    imageScale: 0.8,
  },
  {
    slug: 'miniburger',
    name: 'Miniburger',
    price: '17 lei',
    ingredients: 'Mini chiflă, șnițel de pui, cartofi prăjiți, maioneză, castraveți murați, ketchup, condimente. 180g',
    ingredientsEn: 'Mini bun, chicken schnitzel, fries, mayo, pickles, ketchup, spices. 180g',
    image: '/images/corvin/miniburger.png',
    imageScale: 0.8,
  },
  {
    slug: 'hotdog-cascaval',
    name: 'Hot Dog cu Cașcaval',
    nameEn: 'Hot Dog with Cheese',
    price: '16 lei',
    comboPrice: '22 lei',
    ingredients: 'Baton, crenvurști, cașcaval, castraveți murați, maioneză, ketchup, muștar, condimente. 220g',
    ingredientsEn: 'Baguette, frankfurters, kaskaval cheese, pickles, mayo, ketchup, mustard, spices. 220g',
    image: '/images/dacia/hotdog-cascaval-cutout.png',
    imageScale: 0.8,
  },
  {
    slug: 'hotdog',
    name: 'Hot Dog',
    price: '14 lei',
    ingredients: 'Baton, crenvurști, maioneză, ketchup, muștar. 180g',
    ingredientsEn: 'Baguette, frankfurters, mayo, ketchup, mustard. 180g',
    image: '/images/dacia/hotdog-cutout.png',
    imageScale: 0.8,
  },
  {
    slug: 'burger-vegetal',
    name: 'Burger Vegetal',
    nameEn: 'Vegetarian Burger',
    price: '15 lei',
    ingredients: 'Chiflă, cartofi prăjiți, salată de varză, castraveți murați, maioneză, ketchup, condimente. 260g',
    ingredientsEn: 'Bun, fries, cabbage salad, pickles, mayo, ketchup, spices. 260g',
    image: '/images/corvin/burger-vegetal.png',
    imageScale: 1.1,
  },
  {
    slug: 'cartofi-cheddar',
    name: 'Cartofi cu Cheddar și Ceapă Caramelizată',
    nameEn: 'Cheddar & Caramelized Onion Fries',
    price: '13 lei',
    ingredients: 'Cartofi, sos cheddar, ceapă caramelizată, condimente. 220g',
    ingredientsEn: 'Fries, cheddar sauce, caramelized onion, spices. 220g',
    image: '/images/corvin/cartofi-cheddar.png',
    imageScale: 1.15,
  },
]

type TabValue = 'toate' | 'bauturi'

const DaciaPage: NextPage<Props> = ({ heroImage }) => {
  const { t, lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabValue>('toate')
  const drinksTotal = DRINKS.reduce((sum, g) => sum + g.items.length, 0)
  const tabs = [
    { value: 'toate' as TabValue, label: t('Preparate', 'Food'), count: MENU.length },
    { value: 'bauturi' as TabValue, label: t('Băuturi', 'Drinks'), count: drinksTotal },
  ]

  return (
    <>
      <Head>
        <title>{t('Cosimo Non-Stop Fast Food — Bd. Dacia 23 bis, Hunedoara', 'Cosimo Non-Stop Fast Food — Bd. Dacia 23 bis, Hunedoara')}</title>
        <meta name="description" content={t('Cosimo Non-Stop Fast Food, Bd. Dacia 23 bis — Restaurant nonstop 24/7 în Hunedoara. Burgeri, mâncare proaspătă, livrare Glovo.', 'Cosimo Non-Stop Fast Food, Bd. Dacia 23 bis — 24/7 restaurant in Hunedoara. Burgers, fresh food, Glovo delivery.')} />
      </Head>

      <Navbar variant="location" theme="dacia" />

      <main>
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden bg-[#efe1cb] pt-20 text-[#351b15]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,#f9f0df_0%,transparent_42%),linear-gradient(135deg,#f5ead9_0%,#ecd8bb_100%)]" />
          <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#dcb78b]/30 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-1 px-4 pb-11 pt-5 sm:px-8 sm:pt-10 lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-6 lg:px-10 lg:py-12">
            <div className="order-2 relative z-10 lg:order-1">
              <p className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9b5a40] sm:text-xs">
                <span className="h-px w-6 bg-[#a9684a]" /> Cosimo · Bd. Dacia 23 bis
              </p>
              <h1 className="max-w-[620px] font-playfair text-[clamp(2.8rem,8vw,6.2rem)] font-medium leading-[1.03] tracking-[-0.045em] text-[#3e2018]">
                {t('Pofta n-are', 'Good taste')} <em className="font-normal text-[#a25436]">{t('oră.', 'never sleeps.')}</em>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#705344] sm:mt-6 sm:text-base sm:leading-7">
                {t('Burgeri, sandwich-uri și gusturi care merită savurate. Pregătite pentru tine, la orice oră.', 'Burgers, sandwiches and flavours worth savouring. Made for you, any time of day.')}
              </p>
              <div className="mt-6 grid max-w-[440px] grid-cols-2 gap-2 sm:mt-8 sm:gap-3">
                <a href="#meniu" className="inline-flex min-h-11 min-w-0 items-center justify-center whitespace-nowrap bg-[#722f24] px-2 text-[9px] font-bold uppercase tracking-[0.04em] text-[#fff5e8] transition-colors hover:bg-[#914331] sm:min-h-12 sm:px-4 sm:text-[11px] sm:tracking-[0.08em]">
                  {t('Descoperă meniul', 'Explore the menu')} <span className="ml-1 sm:ml-2" aria-hidden="true">↗</span>
                </a>
                <a href="tel:0724004216" className="inline-flex min-h-11 min-w-0 items-center justify-center whitespace-nowrap border border-[#9c6d50] px-2 text-[9px] font-semibold uppercase tracking-[0.04em] text-[#57291f] transition-colors hover:bg-[#e4c7a7] sm:min-h-12 sm:px-4 sm:text-[11px] sm:tracking-[0.08em]">
                  {t('Sună și comandă', 'Call to order')}
                </a>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#735442] sm:mt-8">
                <span className="font-bold uppercase tracking-[0.12em] text-[#763b2b]">{t('Deschis non-stop', 'Open 24/7')}</span>
                <span className="text-[#a86c48]">✦</span>
                <span><span className="text-[#b17635]">★★★★★</span> 4.4 · 913 {t('recenzii', 'reviews')}</span>
              </div>
              <p className="mt-3 text-[11px] text-[#8d6b58]">
                {t('Livrare prin', 'Delivery via')} <a href="https://glovoapp.com" target="_blank" rel="noopener noreferrer" className="underline decoration-[#a98976]/50 underline-offset-4 hover:text-[#722f24]">Glovo</a> {t('și', 'and')} <a href="https://food.bolt.eu" target="_blank" rel="noopener noreferrer" className="underline decoration-[#a98976]/50 underline-offset-4 hover:text-[#722f24]">Bolt Food</a>
              </p>
            </div>

            <div className="order-1 relative lg:order-2">
              <div className="absolute left-[12%] top-[10%] h-[75%] w-[76%] rounded-full border border-[#bd8b61]/40 bg-[#e6b988]/30" />
              <div className="absolute left-[21%] top-[18%] h-[57%] w-[58%] rounded-full bg-[#f7e2bc]/80 blur-2xl" />
              <div className="relative aspect-[1.2] lg:aspect-[1.05]">
                <Image src="/images/dacia/dacia-hero-cutout.png" alt={t('Burger Cosimo pe platou de lemn', 'Cosimo burger on a wooden serving board')} fill className="object-contain" style={{ filter: 'drop-shadow(0 24px 24px rgba(91, 48, 24, 0.22))' }} priority sizes="(max-width: 1024px) 100vw, 55vw" />
              </div>
              <span className="absolute right-0 top-2 border border-[#a87354]/45 bg-[#f8eedc]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#683727] shadow-sm sm:right-5 sm:top-8">{t('Deschis 24/7', 'Open 24/7')}</span>
            </div>
          </div>
        </section>

        {/* ─── INFO STRIP ─── */}
        <div className="bg-[#FFF8F0] border-b border-[#e8d5b7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-6 py-4 text-sm">
              <div className="flex items-center gap-2 text-[#6b5c4e]">
                <svg className="w-4 h-4 text-[#4caf50]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#4caf50] font-semibold">{t('Deschis 24/7', 'Open 24/7')}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6b5c4e]">
                <svg className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.4 · 913 {t('recenzii Google', 'Google reviews')}
              </div>
              <div className="flex items-center gap-2 text-[#6b5c4e]">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Bd. Dacia 23 bis, Hunedoara
              </div>
            </div>
          </div>
        </div>

        {/* ─── MENU ─── */}
        <section id="meniu" className="scroll-mt-20 bg-[#f6efe5] py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a06845]">{t('Din bucătăria Cosimo', 'From the Cosimo kitchen')}</p>
              <h2 className="font-playfair text-4xl font-medium tracking-[-0.04em] text-[#2c1711] sm:text-6xl">{t('Meniul nostru', 'Our menu')}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#745d50] sm:text-base">{t('Alege ce îți face poftă. Gust proaspăt, pregătit la orice oră.', 'Choose what you crave. Fresh flavours, prepared around the clock.')}</p>
            </div>

            <div className="mb-6 mt-7 flex gap-2 border-b border-[#dcc9b6] pb-4 sm:mb-9 sm:mt-10">
              {tabs.map(tab => {
                const isActive = activeTab === tab.value
                return (
                  <button key={tab.value} onClick={() => setActiveTab(tab.value)} aria-pressed={isActive} className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${isActive ? 'bg-[#361c16] text-[#fff6e9]' : 'text-[#735747] hover:bg-[#eadccc] hover:text-[#361c16]'}`}>
                    {tab.label} <span className={`text-[10px] ${isActive ? 'text-[#d4ae85]' : 'text-[#a28b78]'}`}>{tab.count}</span>
                  </button>
                )
              })}
            </div>

            {activeTab === 'bauturi' ? (
              <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
                {DRINKS.map(group => (
                  <div key={group.title} className="border border-[#e3d3c1] bg-[#fffaf3] p-5 sm:p-7">
                    <h3 className="mb-5 border-b border-[#e7d9c9] pb-4 font-playfair text-2xl font-medium text-[#3a2119]">
                      {lang === 'en' && group.titleEn ? group.titleEn : group.title}
                    </h3>
                    <ul className="divide-y divide-[#ecdfd1]">
                      {group.items.map((d, i) => (
                        <li key={`${d.name}-${i}`} className="flex items-start justify-between gap-3 py-3">
                          <div className="min-w-0">
                            <p className="font-medium text-[#352018]">{lang === 'en' && d.nameEn ? d.nameEn : d.name}</p>
                            {d.note && <p className="mt-1 text-xs leading-5 text-[#846f61]">{lang === 'en' && d.noteEn ? d.noteEn : d.note}</p>}
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-semibold text-[#6a3022]">{d.price}</p>
                            {d.volume && <p className="mt-1 text-[11px] text-[#987f6c]">{d.volume}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-5 lg:grid-cols-2">
                {MENU.map(item => (
                  <article key={item.slug} className="group border border-[#e1d0bd] bg-[#fffaf3] p-4 transition-shadow hover:shadow-[0_12px_32px_rgba(67,38,24,0.1)] sm:p-5">
                    <div className="flex items-center gap-3 sm:gap-5">
                      <div className="relative h-36 w-36 shrink-0 sm:h-44 sm:w-44">
                        <Image src={item.image} alt={item.name} fill className={`object-contain transition-transform duration-300 ${item.slug === 'cartofi-cheddar' || item.slug === 'burger-vegetal' ? 'scale-[1.7] group-hover:scale-[1.8]' : 'group-hover:scale-105'}`} sizes="(max-width: 640px) 144px, 176px" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-inter text-[18px] font-semibold leading-tight tracking-[-0.03em] text-[#4b2b20] sm:text-[22px]">{lang === 'en' && item.nameEn ? item.nameEn : item.name}</h3>
                        {item.price && <p className="mt-2 text-base font-bold text-[#8a4330]">{item.price}</p>}
                      </div>
                    </div>
                    <p className="mt-3 border-t border-[#e8d9c9] pt-3 font-inter text-[13px] leading-[1.6] text-[#70584a] sm:text-sm">{lang === 'en' && item.ingredientsEn ? item.ingredientsEn : item.ingredients}</p>
                    {(item.priceMedium || item.priceFamily) && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#e8d9c9] pt-3 text-xs text-[#6b3d2b]">
                        {item.priceMedium && <span>{lang === 'en' && item.sizeMediumLabelEn ? item.sizeMediumLabelEn : (item.sizeMediumLabel ?? 'Medie · 32 cm')}: <strong>{item.priceMedium}</strong></span>}
                        {item.priceFamily && <span>{lang === 'en' && item.sizeFamilyLabelEn ? item.sizeFamilyLabelEn : (item.sizeFamilyLabel ?? 'Family · 50 cm')}: <strong>{item.priceFamily}</strong></span>}
                      </div>
                    )}
                    {item.comboPrice && <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 border-t border-[#e8d9c9] pt-3 font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-[#814c34] sm:text-xs">
                      <span>{t('Meniu + Coca-Cola 330 ml', 'Combo + Coca-Cola 330 ml')}</span><span className="font-bold text-[#4d271b]">{item.comboPrice}</span>
                    </div>}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── GOOGLE MAPS ─── */}
        <section className="bg-[#FFF8F0] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl font-bold text-[#1a1a1a]">{t('Cum ne găsești', 'Find us')}</h2>
              <p className="text-[#6b5c4e] mt-2 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {t('Bd. Dacia 23 bis, Hunedoara, România', 'Bd. Dacia 23 bis, Hunedoara, Romania')}
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#e8d5b7]">
              <iframe
                src="https://maps.google.com/maps?q=Cosimo+Non-Stop+Fast+Food,+Bulevardul+Dacia+23+bis,+Hunedoara,+Romania&hl=ro&z=17&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                title="Cosimo Bulevardul Dacia"
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
  const dir = path.join(process.cwd(), 'public', 'images', 'dacia')
  let heroImage: string | null = null
  if (fs.existsSync(dir)) {
    const all = fs.readdirSync(dir)
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort()
    heroImage = all.find(f => f.toLowerCase().includes('hero')) ?? all[0] ?? null
  }
  return { props: { heroImage } }
}

export default DaciaPage
