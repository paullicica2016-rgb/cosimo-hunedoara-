import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface MenuItem {
  slug: string
  name: string
  priceMedium?: string
  priceFamily?: string
  price?: string
  ingredients: string
  image: string
}

interface Props {
  heroImage: string | null
  menu: MenuItem[]
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const MENU: MenuItem[] = [
  {
    slug: 'pizza-huniad',
    name: 'Pizza Huniad',
    priceMedium: '35 lei',
    priceFamily: '66 lei',
    ingredients: 'Sos de roșii, mozzarella, ou, cârnat, ardei, ceapă, ardei iute.',
    image: '/images/pizzerie/tasta-cu-ou.png',
  },
  {
    slug: 'pizza-salami',
    name: 'Pizza Salami',
    priceMedium: '32 lei',
    priceFamily: '60 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, salam Spinata, Romana Dolce.',
    image: '/images/pizzerie/pizza-salami.png',
  },
  {
    slug: 'pizza-quatro-formaggi',
    name: 'Pizza Quatro Formaggi',
    priceMedium: '34 lei',
    priceFamily: '66 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, brânză Asiago, emmentaler, gorgonzola, Grana Padano.',
    image: '/images/pizzerie/quatro-formaggi.png',
  },
  {
    slug: 'pizza-tonno',
    name: 'Pizza Tonno',
    priceMedium: '33 lei',
    priceFamily: '62 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte, ton, ceapă, lămâie.',
    image: '/images/pizzerie/pizza-tonno.jpg',
  },
  {
    slug: 'pizza-vegetala',
    name: 'Pizza Vegetală',
    priceMedium: '29 lei',
    ingredients: 'Aluat, sos de roșii, mozzarella Fior di latte (sau vegetală/de post), mix de legume, ardei copt, zucchini, măsline, anghinare (opțional).',
    image: '/images/pizzerie/pizza-vegetala.jpg',
  },
  {
    slug: 'pizza-desert',
    name: 'Pizza Desert',
    priceMedium: '33 lei',
    ingredients: 'Aluat, Nutella, ananas, fructe de sezon, banană, fulgi de migdale sau biscuiți Oreo.',
    image: '/images/pizzerie/pizza-desert.png',
  },
]

const PizzeriePage: NextPage<Props> = ({ heroImage, menu }) => {

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
                  href="tel:0724004216"
                  className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-4 rounded-full transition-all text-sm uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0724 004 216
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

        {/* ─── STORY STRIP ─── */}
        <section className="bg-[#f5ebd7] border-y border-[#d4b483]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#a63e2a]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.5 2 6 5 6 8c0 1.5.5 2.5 1.5 3.5C9 13 12 15 12 22c0-7 3-9 4.5-10.5C17.5 10.5 18 9.5 18 8c0-3-2.5-6-6-6z" />
                </svg>
                <span className="font-playfair italic text-[#3a1a0a] text-lg">Foc de lemn</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-[#d4b483]" />
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#a63e2a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18M3 12h18" />
                </svg>
                <span className="font-playfair italic text-[#3a1a0a] text-lg">Aluat 48h de maturare</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-[#d4b483]" />
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#a63e2a]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.5 6h6.5l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z" />
                </svg>
                <span className="font-playfair italic text-[#3a1a0a] text-lg">Ingrediente italiene</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        <section className="bg-[#faf3e3] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-inter text-[#a63e2a] uppercase tracking-[0.3em] text-xs font-semibold mb-4">
              Tradiție napoletană
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#3a1a0a] leading-tight">
              Pizza care se face <span className="italic text-[#a63e2a]">așa cum trebuie</span>
            </h2>
            <p className="text-[#5c4433] text-lg mt-6 leading-relaxed">
              La Cosimo, fiecare pizza pornește de la un aluat lăsat să se maturizeze 48 de ore
              și se termină în cuptorul nostru pe lemne, la peste 400°C.
              Așa capătă crusta acea margine pufoasă, ușor afumată,
              și mijlocul acela subțire pe care îl vezi doar la Napoli.
            </p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {menu.map(item => (
                <div key={item.slug} className="flex flex-col items-center text-center group">
                  <div className="relative w-full aspect-square max-w-md transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain drop-shadow-2xl"
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
                            Medie · 32 cm
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
                            Family · 50 cm
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
                href="tel:0724004216"
                className="bg-[#e8b76a] hover:bg-[#d4a054] text-[#1a0f0a] font-bold px-10 py-4 rounded-full transition-all hover:shadow-2xl text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0724 004 216
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
