import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ImageGallery from '../../components/ImageGallery'

interface Props {
  images: string[]
  heroImage: string | null
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const PizzeriePage: NextPage<Props> = ({ images, heroImage }) => {

  return (
    <>
      <Head>
        <title>Pizzeria Cosimo — Bd. Corvin nr. 1, Hunedoara</title>
        <meta name="description" content="Pizzeria Cosimo Hunedoara — Pizza artizanală cu ingrediente proaspete. Comenzi telefonice, ridicare din magazin." />
      </Head>

      <Navbar variant="location" />

      <main>
        {/* ─── HERO ─── */}
        <section className="relative h-[65vh] min-h-[420px] flex items-end overflow-hidden pt-16">
          {heroImage ? (
            <Image
              src={`/images/pizzerie/${heroImage}`}
              alt="Pizzeria Cosimo"
              fill
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#e65100] to-[#4a1500]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Italian flavor overlay */}
          <div className="absolute inset-0 bg-[#e65100]/10 mix-blend-multiply pointer-events-none" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="inline-block bg-[#FFC107] text-[#1a1a1a] text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-lg">
                  🍕 Autentică Italiană
                </span>
                <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white drop-shadow-md italic">
                  Pizzeria Cosimo
                </h1>
                <p className="text-white/80 text-lg mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Bd. Corvin nr. 1, bl. 1, ap. 2, Hunedoara
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 bg-[#FFC107] text-[#1a1a1a] font-bold px-6 py-3 rounded-full shadow-lg text-sm">
                  📞 Comenzi telefonice
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NOTICE BANNER ─── */}
        <div className="bg-[#FFF3CD] border-b border-[#FFC107]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 py-4">
              <span className="text-[#FFC107] text-xl">ℹ️</span>
              <div>
                <p className="font-semibold text-[#6b5c4e] text-sm">Comenzile se fac telefonic — ridicare din magazin</p>
                <p className="text-[#6b5c4e] text-xs">Sunați-ne pentru a comanda pizza dumneavoastră preferată!</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-[#6b5c4e] text-sm">
                <svg className="w-4 h-4 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.5 · Recenzii Google
              </div>
            </div>
          </div>
        </div>

        {/* ─── FEATURES ─── */}
        <section className="bg-[#FFF8F0] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: '🌿', label: 'Aluat Artizanal', desc: 'Pregătit zilnic după rețetă italiană tradițională' },
                { icon: '🧀', label: 'Ingrediente Premium', desc: 'Mozzarella autentică și sos de roșii Italian' },
                { icon: '🔥', label: 'Copt în Cuptor', desc: 'Pizza coaptă la temperaturi înalte pentru crustă perfectă' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 p-5 bg-[#FDF6EC] rounded-2xl border border-[#e8d5b7]">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-[#1a1a1a] text-sm">{item.label}</div>
                    <div className="text-[#6b5c4e] text-xs mt-1">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MENU GALLERY ─── */}
        <section className="bg-[#FDF6EC] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="font-inter text-[#D32F2F] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                Specialitățile noastre
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1a1a1a]">
                Meniul <span className="italic text-[#D32F2F]">Pizzeriei</span>
              </h2>
              <p className="text-[#6b5c4e] mt-3">
                Click pe orice imagine pentru a o mări
              </p>
            </div>

            <ImageGallery images={images} folder="pizzerie" />
          </div>
        </section>

        {/* ─── ORDER CTA ─── */}
        <section className="bg-gradient-to-r from-[#D32F2F] to-[#b71c1c] py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-playfair text-4xl font-bold text-white mb-3 italic">
              Comandă pizza ta acum!
            </h2>
            <p className="text-red-100 mb-8">
              Sunați-ne și pizza dumneavoastră va fi gata în scurt timp pentru ridicare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0724004216"
                className="bg-white text-[#D32F2F] hover:bg-red-50 font-bold px-10 py-4 rounded-full transition-all hover:shadow-2xl text-sm inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Comandă telefonic
              </a>
              <a
                href="https://maps.google.com/?q=Bd+Corvin+nr+1+Hunedoara+Romania"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-[#D32F2F] font-bold px-10 py-4 rounded-full transition-all text-sm inline-flex items-center justify-center gap-2"
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
        <section className="bg-[#FFF8F0] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl font-bold text-[#1a1a1a]">Cum ne găsești</h2>
              <p className="text-[#6b5c4e] mt-2 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Bd. Corvin nr. 1, bl. 1, ap. 2, Hunedoara, România
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#e8d5b7]">
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
  let images: string[] = []
  let heroImage: string | null = null
  if (fs.existsSync(dir)) {
    const all = fs.readdirSync(dir)
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort()
    const heroFile = all.find(f => f.toLowerCase().includes('hero'))
    heroImage = heroFile ?? null
    images = all.filter(f => !f.toLowerCase().includes('hero'))
  }
  return { props: { images, heroImage } }
}

export default PizzeriePage
