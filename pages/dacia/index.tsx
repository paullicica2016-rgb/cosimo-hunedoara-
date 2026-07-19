import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface Props {
  heroImage: string | null
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

interface MenuItem {
  slug: string
  name: string
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
    price: '27 lei',
    ingredients: 'Carne pui, cartofi prăjiți, sos de usturoi, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos tzatziki, sos chilli, lipie. 300g',
    image: '/images/corvin/shaorma-farfurie.jpeg',
  },
  {
    slug: 'kebab',
    name: 'Kebab',
    price: '22 lei',
    ingredients: 'Chiflă-kebab, carne de pui, cartofi prăjiți, sos de usturoi, salată de varză, ceapă, roșii, castraveți murați, ketchup, sos tzatziki, sos picant. 300g',
    image: '/images/corvin/kebab.jpeg',
  },
  {
    slug: 'pittburger',
    name: 'Pittburger',
    priceMedium: '18 lei',
    priceFamily: '21 lei',
    sizeMediumLabel: 'Simplu · 260g',
    sizeFamilyLabel: 'Dublu · 330g',
    ingredients: 'Chiflă, chiftea vită + porc (2 chiftele la Dublu), cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente.',
    image: '/images/corvin/pittburger-simplu.jpeg',
  },
  {
    slug: 'burger-snitel-pui',
    name: 'Burger cu Șnițel de Pui',
    priceMedium: '19 lei',
    priceFamily: '22 lei',
    sizeMediumLabel: 'Simplu · 280g',
    sizeFamilyLabel: 'Dublu · 360g',
    ingredients: 'Chiflă, șnițel din piept de pui (2 șnițele la Dublu), cartofi prăjiți, sos de usturoi, maioneză cu varză, ketchup, castraveți murați, condimente.',
    image: '/images/corvin/burger-snitel-pui.jpeg',
  },
  {
    slug: 'sandwich-sunca-cascaval',
    name: 'Sandwich cu Șuncă și Cașcaval',
    price: '16 lei',
    ingredients: 'Chiflă, cașcaval, șuncă, cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente. 250g',
    image: '/images/corvin/sandwich-sunca-cascaval.jpeg',
  },
  {
    slug: 'sandwich-sunca',
    name: 'Sandwich cu Șuncă',
    priceMedium: '14 lei',
    priceFamily: '16 lei',
    sizeMediumLabel: 'Simplu · 220g',
    sizeFamilyLabel: 'Dublu · 260g',
    ingredients: 'Chiflă, șuncă (2 felii la Dublu), cartofi prăjiți, maioneză cu varză, ketchup, castraveți murați, condimente.',
    image: '/images/corvin/sandwich-sunca.jpeg',
  },
  {
    slug: 'hotdog-cascaval',
    name: 'Hot Dog cu Cașcaval',
    price: '15 lei',
    ingredients: 'Baton, crenvurști, cașcaval, maioneză, ketchup, muștar. 220g',
    image: '/images/corvin/hotdog-cascaval.jpeg',
  },
  {
    slug: 'hotdog',
    name: 'Hot Dog',
    priceMedium: '13 lei',
    priceFamily: '15 lei',
    sizeMediumLabel: 'Simplu · 180g',
    sizeFamilyLabel: 'Dublu · 230g',
    ingredients: 'Baton, crenvurști (2 crenvurști la Dublu), maioneză, ketchup, muștar.',
    image: '/images/corvin/hotdog.jpeg',
  },
  {
    slug: 'cartofi-cheddar',
    name: 'Cartofi cu Cheddar și Ceapă Caramelizată',
    price: '12 lei',
    ingredients: 'Cartofi, brânză cheddar, ceapă caramelizată, condimente. 220g',
    image: '/images/corvin/cartofi.jpeg',
  },
  {
    slug: 'salata-kebab',
    name: 'Salată cu Carne Kebab Cosimo',
    price: '21 lei',
    ingredients: 'Carne kebab la grătar, salată iceberg, morcov, roșii, castraveți, ceapă roșie, dressing tzatziki sau dressing orange Cosimo. 280g',
    image: '/images/corvin/salata-pui.png',
    imageScale: 1.6,
  },
  {
    slug: 'salata-ton',
    name: 'Salată cu Ton Cosimo',
    price: '21 lei',
    ingredients: 'Ton, ceapă roșie, roșii, salată iceberg, morcov, castraveți, dressing orange Cosimo și dressing pătrunjel cu lămâie. 280g',
    image: '/images/corvin/salata-ton.png',
    imageScale: 1.6,
  },
  {
    slug: 'salata-vegetala',
    name: 'Salată Vegetală Cosimo',
    price: '18 lei',
    ingredients: 'Roșii, salată iceberg, morcov, varză, castraveți, ceapă roșie, ardei iute (opțional), dressing tzatziki sau dressing orange Cosimo, dressing de pătrunjel cu lămâie. 270g',
    image: '/images/corvin/salata-vegetala.png',
    imageScale: 1.6,
  },
  {
    slug: 'cartofi',
    name: 'Cartofi Prăjiți',
    priceMedium: '7 lei',
    priceFamily: '10 lei',
    sizeMediumLabel: '100g',
    sizeFamilyLabel: '150g',
    ingredients: 'Cartofi prăjiți crocanți — porție ca supliment sau garnitură.',
    image: '/images/corvin/cartofi.jpeg',
  },
]

const DaciaPage: NextPage<Props> = ({ heroImage }) => {

  return (
    <>
      <Head>
        <title>Cosimo — Bulevardul Dacia, Hunedoara</title>
        <meta name="description" content="Cosimo Bulevardul Dacia — Restaurant nonstop 24/7 în Hunedoara. Burgeri, mâncare proaspătă, livrare Glovo." />
      </Head>

      <Navbar variant="location" />

      <main>
        {/* ─── HERO ─── */}
        <section className="relative h-[65vh] min-h-[420px] flex items-end overflow-hidden pt-16">
          {heroImage ? (
            <Image
              src={`/images/dacia/${heroImage}`}
              alt="Cosimo Bd. Dacia"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] to-[#7f0000]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="inline-block bg-[#4caf50] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-lg">
                  ● Nonstop 24/7
                </span>
                <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white drop-shadow-md">
                  Cosimo
                </h1>
                <p className="text-white/80 text-lg mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Bulevardul Dacia, Hunedoara
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="tel:0724004216"
                  className="flex items-center gap-2 bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg text-sm"
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
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm border border-white/30"
                >
                  🛵 Comandă pe Glovo
                </a>
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
                <span className="text-[#4caf50] font-semibold">Deschis 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-[#6b5c4e]">
                <svg className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.4 · 913 recenzii Google
              </div>
              <div className="flex items-center gap-2 text-[#6b5c4e]">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Bulevardul Dacia, Hunedoara
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
                    href="tel:0724004216"
                    className="mt-8 inline-flex items-center gap-2 border-2 border-[#e8b76a] text-[#e8b76a] hover:bg-[#e8b76a] hover:text-[#0f0806] font-bold uppercase tracking-widest px-8 py-3 rounded-full transition-all text-xs"
                  >
                    Comandă telefonic
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GOOGLE MAPS ─── */}
        <section className="bg-[#FFF8F0] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl font-bold text-[#1a1a1a]">Cum ne găsești</h2>
              <p className="text-[#6b5c4e] mt-2 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bulevardul Dacia, Hunedoara, România
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#e8d5b7]">
              <iframe
                src="https://maps.google.com/maps?q=Bulevardul+Dacia,+Hunedoara,+Romania&hl=ro&z=16&output=embed"
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
