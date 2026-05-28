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
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const DaciaPage: NextPage<Props> = ({ images }) => {
  const heroImage = images[0] ?? null

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

        {/* ─── MENU GALLERY ─── */}
        <section className="bg-[#FDF6EC] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="font-inter text-[#D32F2F] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                Descoperă
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1a1a1a]">
                Meniul Nostru
              </h2>
              <p className="text-[#6b5c4e] mt-3">
                Click pe orice imagine pentru a o mări
              </p>
            </div>

            <ImageGallery images={images} folder="dacia" />
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
  let images: string[] = []
  if (fs.existsSync(dir)) {
    images = fs.readdirSync(dir)
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort()
  }
  return { props: { images } }
}

export default DaciaPage
