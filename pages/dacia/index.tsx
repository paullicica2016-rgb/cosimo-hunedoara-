import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
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

const MENU: MenuItem[] = [
  {
    slug: 'burger-snitel-pui',
    name: 'Burger cu Șnițel de Pui',
    nameEn: 'Chicken Schnitzel Burger',
    price: '19 lei',
    comboPrice: '25 lei',
    ingredients: 'Chiflă, șnițel din piept de pui, cartofi prăjiți, sos de usturoi, maioneză cu varză, ketchup, castraveți murați, condimente. 280g',
    ingredientsEn: 'Bun, chicken breast schnitzel, fries, garlic sauce, mayo with cabbage, ketchup, pickles, spices. 280g',
    image: '/images/corvin/burger-snitel-pui.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'pittburger',
    name: 'Pittburger',
    price: '18 lei',
    comboPrice: '24 lei',
    ingredients: 'Chiflă, chiftea vită + porc, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 260g',
    ingredientsEn: 'Bun, beef + pork patty, fries, mayo with cabbage, ketchup, pickles, spices. 260g',
    image: '/images/corvin/pittburger-simplu.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca-cascaval',
    name: 'Sandwich cu Șuncă și Cașcaval',
    nameEn: 'Ham & Cheese Sandwich',
    price: '16 lei',
    comboPrice: '22 lei',
    ingredients: 'Chiflă, cașcaval, șuncă, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 250g',
    ingredientsEn: 'Bun, kaskaval cheese, ham, fries, mayo with cabbage, ketchup, pickles, spices. 250g',
    image: '/images/corvin/sandwich-sunca-cascaval.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'sandwich-sunca',
    name: 'Sandwich cu Șuncă',
    nameEn: 'Ham Sandwich',
    price: '14 lei',
    ingredients: 'Chiflă, șuncă, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 220g',
    ingredientsEn: 'Bun, ham, fries, mayo with cabbage, ketchup, pickles, spices. 220g',
    image: '/images/corvin/sandwich-sunca.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'miniburger',
    name: 'Miniburger',
    price: '16 lei',
    ingredients: 'Mini chiflă, șnițel de pui, cartofi prăjiți, maioneză, castraveți murați, ketchup, condimente. 180g',
    ingredientsEn: 'Mini bun, chicken schnitzel, fries, mayo, pickles, ketchup, spices. 180g',
    image: '/images/corvin/miniburger.png',
    imageScale: 0.8,
  },
  {
    slug: 'hotdog-cascaval',
    name: 'Hot Dog cu Cașcaval',
    nameEn: 'Hot Dog with Cheese',
    price: '15 lei',
    comboPrice: '21 lei',
    ingredients: 'Baton, crenvurști, cașcaval, castraveți murați, maioneză, ketchup, muștar, condimente. 220g',
    ingredientsEn: 'Baguette, frankfurters, kaskaval cheese, pickles, mayo, ketchup, mustard, spices. 220g',
    image: '/images/corvin/hotdog-cascaval.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'hotdog',
    name: 'Hot Dog',
    price: '13 lei',
    ingredients: 'Baton, crenvurști, maioneză, ketchup, muștar. 180g',
    ingredientsEn: 'Baguette, frankfurters, mayo, ketchup, mustard. 180g',
    image: '/images/corvin/hotdog.jpeg',
    imageScale: 0.8,
  },
  {
    slug: 'burger-vegetal',
    name: 'Burger Vegetal',
    nameEn: 'Vegetarian Burger',
    price: '14 lei',
    ingredients: 'Chiflă, cartofi prăjiți, salată de varză, castraveți murați, maioneză, ketchup, condimente. 260g',
    ingredientsEn: 'Bun, fries, cabbage salad, pickles, mayo, ketchup, spices. 260g',
    image: '/images/corvin/burger-vegetal.png',
    imageScale: 1.1,
  },
  {
    slug: 'cartofi-cheddar',
    name: 'Cartofi cu Cheddar și Ceapă Caramelizată',
    nameEn: 'Cheddar & Caramelized Onion Fries',
    price: '12 lei',
    ingredients: 'Cartofi, sos cheddar, ceapă caramelizată, condimente. 220g',
    ingredientsEn: 'Fries, cheddar sauce, caramelized onion, spices. 220g',
    image: '/images/corvin/cartofi-cheddar.png',
    imageScale: 1.15,
  },
  {
    slug: 'cartofi',
    name: 'Cartofi Prăjiți',
    nameEn: 'French Fries',
    priceMedium: '7 lei',
    priceFamily: '10 lei',
    sizeMediumLabel: '100g',
    sizeFamilyLabel: '150g',
    ingredients: 'Cartofi prăjiți crocanți — porție ca supliment sau garnitură.',
    ingredientsEn: 'Crispy fries — as a side or extra.',
    image: '/images/corvin/cartofi.jpeg',
  },
]

const DaciaPage: NextPage<Props> = ({ heroImage }) => {
  const { t, lang } = useLanguage()

  return (
    <>
      <Head>
        <title>{t('Cosimo Non-Stop Fast Food — Bd. Dacia 23 bis, Hunedoara', 'Cosimo Non-Stop Fast Food — Bd. Dacia 23 bis, Hunedoara')}</title>
        <meta name="description" content={t('Cosimo Non-Stop Fast Food, Bd. Dacia 23 bis — Restaurant nonstop 24/7 în Hunedoara. Burgeri, mâncare proaspătă, livrare Glovo.', 'Cosimo Non-Stop Fast Food, Bd. Dacia 23 bis — 24/7 restaurant in Hunedoara. Burgers, fresh food, Glovo delivery.')} />
      </Head>

      <Navbar variant="location" />

      <main>
        {/* ─── HERO ─── */}
        <section className="relative bg-[#0d0806] overflow-hidden min-h-[92vh] flex items-center pt-16">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#D32F2F]/25 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#FFC107]/15 blur-[120px] pointer-events-none" />

          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

              <div>
                <div className="inline-flex items-center gap-2 bg-[#4caf50]/15 border border-[#4caf50]/40 text-[#7dcc7f] text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
                  {t('Nonstop 24/7', 'Open 24/7')}
                </div>

                <p className="font-inter text-[#FFC107] uppercase tracking-[0.35em] text-xs font-semibold mb-3">
                  {t('// Bd. Dacia 23 bis', '// Bd. Dacia 23 bis')}
                </p>

                <h1 className="font-playfair font-bold text-white leading-[0.9] mb-4" style={{ fontSize: 'clamp(56px, 9vw, 108px)' }}>
                  Cosimo<br />
                  <span className="italic text-[#D32F2F]">Fast Food</span>
                </h1>

                <p className="text-white/70 text-base md:text-lg max-w-md mb-8 leading-relaxed">
                  {t(
                    'Burgeri, hot dog și sandwich-uri gata în mai puțin de 5 minute — cea mai rapidă servire, orice oră, orice zi.',
                    'Burgers, hot dogs and sandwiches ready in under 5 minutes — the fastest service in town, any hour, any day.'
                  )}
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
                  <a
                    href="tel:0724004216"
                    className="inline-flex items-center justify-center gap-2 bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl shadow-red-900/40 text-sm uppercase tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    0724 004 216
                  </a>
                  <a
                    href="https://glovoapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-full border border-white/25 hover:border-white/50 transition-all text-sm uppercase tracking-wider"
                  >
                    🛵 {t('Comandă pe Glovo', 'Order on Glovo')}
                  </a>
                  <a
                    href="https://food.bolt.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#34D186] hover:bg-[#2ab973] text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl text-sm uppercase tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.4 15.5l-4.5-4.5 1.5-1.5 3 3 6-6 1.5 1.5-7.5 7.5z" />
                    </svg>
                    Bolt Food
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#FFC107]">★★★★★</span>
                    <span className="text-white font-semibold">4.4</span>
                    <span className="text-white/40 text-xs">· 913 {t('recenzii', 'reviews')}</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Bd. Dacia 23 bis, Hunedoara
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

        {/* ─── MENU — pizzeria-style dark grid ─── */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {MENU.map(item => (
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
