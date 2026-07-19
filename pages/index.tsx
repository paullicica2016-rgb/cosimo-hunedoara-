import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface Props {
  daciaHero: string | null
  corvinHero: string | null
  pizzerieHero: string | null
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

function getHeroImage(folder: string): string | null {
  const dir = path.join(process.cwd(), 'public', 'images', folder)
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir).filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
  // Prefer file with "hero" in the name, otherwise first sorted
  const heroFile = files.find(f => f.toLowerCase().includes('hero'))
  if (heroFile) return `/images/${folder}/${heroFile}`
  files.sort()
  return files.length > 0 ? `/images/${folder}/${files[0]}` : null
}

const reviews = [
  {
    name: 'Alexandru M.',
    stars: 5,
    text: 'Cel mai bun fast food din Hunedoara! Burgerii sunt extraordinari, carnea e mereu proaspătă. Revin de fiecare dată cu mare plăcere!',
    date: 'acum 2 săptămâni',
  },
  {
    name: 'Maria D.',
    stars: 5,
    text: 'Pizza de la Cosimo e de departe cea mai bună din oraș. Aluat subțire, ingrediente abundente și livrare rapidă. 10/10!',
    date: 'acum o lună',
  },
  {
    name: 'Ionuț P.',
    stars: 4,
    text: 'Personal foarte amabil, porții generoase și prețuri corecte. Locul meu preferat pentru o masă rapidă după muncă.',
    date: 'acum 3 săptămâni',
  },
  {
    name: 'Elena C.',
    stars: 5,
    text: 'Am comandat de mai multe ori prin Glovo și mereu a venit cald și perfect ambalat. Felicitări echipei Cosimo!',
    date: 'acum 5 zile',
  },
  {
    name: 'Bogdan R.',
    stars: 5,
    text: 'Atmosfera e superbă, mâncarea delicioasă. Am venit cu familia și toți au fost încântați. Cu siguranță revenim!',
    date: 'acum 2 luni',
  },
]

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} className={`w-4 h-4 ${i <= count ? 'text-[#FFC107]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const Home: NextPage<Props> = ({ daciaHero, corvinHero, pizzerieHero }) => {
  return (
    <>
      <Head>
        <title>Cosimo Hunedoara — Trei locații, o singură pasiune</title>
      </Head>

      <Navbar variant="home" />

      <main>
        {/* ─── SECTION 1: HERO ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pattern-overlay"
          style={{ background: 'linear-gradient(160deg, #FDF6EC 0%, #F5E6D0 50%, #EDD5B5 100%)' }}
        >
          {/* Decorative circles */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#D32F2F]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#FFC107]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full border-2 border-[#D32F2F]/10 pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full border border-[#FFC107]/20 pointer-events-none" />

          <div className="relative z-10 text-center px-4 animate-fade-in">
            {/* Ornamental line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-[#D32F2F]/40" />
              <div className="w-2 h-2 rounded-full bg-[#D32F2F]" />
              <div className="h-px w-16 bg-[#D32F2F]/40" />
            </div>

            <p className="font-inter text-[#6b5c4e] uppercase tracking-[0.4em] text-xs md:text-sm font-medium mb-3">
              Hunedoara, România
            </p>

            <h1 className="font-playfair text-[5rem] md:text-[9rem] lg:text-[11rem] font-bold text-[#D32F2F] leading-none tracking-tight drop-shadow-sm">
              COSIMO
            </h1>

            <p className="font-playfair italic text-[#6b5c4e] text-xl md:text-3xl mt-4 mb-8">
              Trei locații, o singură pasiune — Hunedoara
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href="#locatii"
                className="bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-red-200 text-sm"
              >
                Descoperă Locațiile
              </a>
              <a
                href="https://glovoapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 text-sm"
              >
                Comandă pe Glovo
              </a>
            </div>
          </div>

          {/* Scroll arrow */}
          <a
            href="#poveste"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#D32F2F]/60 hover:text-[#D32F2F] transition-colors animate-bounce-slow z-10"
            aria-label="Scroll down"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </section>

        {/* ─── SECTION 2: POVESTEA NOASTRĂ ─── */}
        <section id="poveste" className="bg-[#FFF8F0] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Text */}
              <div>
                <p className="font-inter text-[#D32F2F] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                  Cine suntem
                </p>
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 leading-tight">
                  Povestea<br />
                  <span className="text-[#D32F2F] italic">Noastră</span>
                </h2>
                <p className="text-[#6b5c4e] text-lg leading-relaxed mb-8">
                  Cosimo a început ca un vis simplu: să aducem gusturi autentice pe străzile Hunedoarei.
                  De la primul burger până la pizza italiană, am crescut împreună cu orașul nostru.
                  Astăzi, cu trei locații și mii de clienți fericiți, continuăm să gătim cu aceeași
                  pasiune din prima zi.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '3', label: 'Locații' },
                    { value: '10.000+', label: 'Clienți' },
                    { value: '28+', label: 'Ani' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-4 rounded-2xl bg-[#FDF6EC] border border-[#e8d5b7]">
                      <div className="font-playfair text-3xl font-bold text-[#D32F2F]">{stat.value}</div>
                      <div className="text-[#6b5c4e] text-sm font-medium mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: CELE 3 LOCAȚII ─── */}
        <section id="locatii" className="bg-[#FDF6EC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="font-inter text-[#D32F2F] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                Unde ne găsești
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1a1a1a]">
                Cele 3 Locații
              </h2>
              <p className="text-[#6b5c4e] mt-4 max-w-lg mx-auto">
                Fiecare locație cu personalitatea ei, toate cu aceeași dragoste pentru mâncare bună.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* CARD 1 — Dacia */}
              <div className="location-card bg-[#FFF8F0] rounded-3xl overflow-hidden shadow-md border border-[#e8d5b7]">
                <div className="relative h-52 overflow-hidden">
                  {daciaHero ? (
                    <Image src={daciaHero} alt="Cosimo Bd. Dacia" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#D32F2F] to-[#b71c1c]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#4caf50] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      ● Nonstop 24/7
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-[#1a1a1a] mb-1">Cosimo</h3>
                  <p className="text-[#6b5c4e] text-sm flex items-center gap-1.5 mb-3">
                    <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Bulevardul Dacia, Hunedoara
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating count={4} />
                    <span className="text-[#1a1a1a] font-semibold text-sm">4.4</span>
                    <span className="text-[#6b5c4e] text-xs">(913 recenzii)</span>
                  </div>

                  {/* Phone */}
                  <a href="tel:0724004216" className="flex items-center gap-2 text-[#D32F2F] font-medium text-sm mb-4 hover:text-[#b71c1c] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    0724 004 216
                  </a>

                  {/* Mini map */}
                  <div className="rounded-xl overflow-hidden mb-5 border border-[#e8d5b7]">
                    <iframe
                      src="https://maps.google.com/maps?q=Bulevardul+Dacia,+Hunedoara,+Romania&hl=ro&z=15&output=embed"
                      width="100%"
                      height="120"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Cosimo Bd. Dacia"
                    />
                  </div>

                  <Link
                    href="/dacia"
                    className="block text-center bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
                  >
                    Intră & Vezi Meniu →
                  </Link>
                </div>
              </div>

              {/* CARD 2 — Corvin */}
              <div className="location-card bg-[#FFF8F0] rounded-3xl overflow-hidden shadow-md border border-[#e8d5b7]">
                <div className="relative h-52 overflow-hidden">
                  {corvinHero ? (
                    <Image src={corvinHero} alt="Fast Food Cosimo Bd. Corvin" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#b71c1c] to-[#7f0000]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-[#1a1a1a] mb-1">Fast Food Cosimo</h3>
                  <p className="text-[#6b5c4e] text-sm flex items-center gap-1.5 mb-3">
                    <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Bulevardul Corvin, Hunedoara
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <StarRating count={5} />
                    <span className="text-[#1a1a1a] font-semibold text-sm">4.5</span>
                    <span className="text-[#6b5c4e] text-xs">(126 recenzii)</span>
                  </div>

                  <a href="tel:0722235551" className="flex items-center gap-2 text-[#D32F2F] font-medium text-sm mb-4 hover:text-[#b71c1c] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    0722 235 551
                  </a>

                  <div className="rounded-xl overflow-hidden mb-5 border border-[#e8d5b7]">
                    <iframe
                      src="https://maps.google.com/maps?q=Bulevardul+Corvin,+Hunedoara,+Romania&hl=ro&z=15&output=embed"
                      width="100%"
                      height="120"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Cosimo Bd. Corvin"
                    />
                  </div>

                  <Link
                    href="/corvin"
                    className="block text-center bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
                  >
                    Intră & Vezi Meniu →
                  </Link>
                </div>
              </div>

              {/* CARD 3 — Pizzerie */}
              <div className="location-card bg-[#FFF8F0] rounded-3xl overflow-hidden shadow-md border border-[#e8d5b7]">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src="/images/pizzerie/pizzerie-card.jpeg"
                    alt="Pizzeria Cosimo"
                    fill
                    className="object-cover"
                    style={{ objectPosition: '50% 25%' }}
                  />
                  {/* pizzerieHero preserved but unused for card visual override */}
                  {!pizzerieHero && null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#FFC107] text-[#1a1a1a] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      🍕 Pizzerie
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-[#1a1a1a] mb-1">Pizzeria Cosimo</h3>
                  <p className="text-[#6b5c4e] text-sm flex items-center gap-1.5 mb-3">
                    <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Bd. Corvin nr. 1, bl. 1, ap. 2, Hunedoara
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <StarRating count={5} />
                    <span className="text-[#1a1a1a] font-semibold text-sm">4.5</span>
                  </div>

                  <a href="tel:0792764690" className="flex items-center gap-2 text-[#D32F2F] font-medium text-sm mb-4 hover:text-[#b71c1c] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    0792 764 690
                  </a>

                  <div className="flex items-start gap-2 mb-4 p-3 bg-[#FFF3CD] rounded-xl border border-[#FFC107]/30">
                    <span className="text-[#FFC107]">ℹ️</span>
                    <p className="text-[#6b5c4e] text-xs leading-relaxed">
                      Comenzile se fac telefonic — ridicare din magazin.
                    </p>
                  </div>

                  <div className="rounded-xl overflow-hidden mb-5 border border-[#e8d5b7]">
                    <iframe
                      src="https://maps.google.com/maps?q=Bd+Corvin+nr+1,+Hunedoara,+Romania&hl=ro&z=15&output=embed"
                      width="100%"
                      height="120"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Pizzeria Cosimo"
                    />
                  </div>

                  <Link
                    href="/pizzerie"
                    className="block text-center bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
                  >
                    Intră & Vezi Meniu →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: DE CE COSIMO? ─── */}
        <section className="relative bg-[#1a0f0a] py-28 overflow-hidden">
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e8b76a' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")" }}
          />
          {/* Glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D32F2F]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#e8b76a]/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-10 bg-[#e8b76a]" />
                <span className="font-inter text-[#e8b76a] uppercase tracking-[0.4em] text-xs font-semibold">
                  Valorile noastre
                </span>
                <span className="h-px w-10 bg-[#e8b76a]" />
              </div>
              <h2 className="font-playfair text-5xl md:text-6xl font-bold text-white leading-tight">
                De ce <span className="italic text-[#e8b76a]">Cosimo?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
              {[
                { num: '01', title: 'Ingrediente Proaspete', desc: 'Selectăm zilnic ingrediente locale de cea mai bună calitate pentru fiecare preparat.' },
                { num: '02', title: 'Livrare Rapidă', desc: 'Comanda ta ajunge caldă și perfectă în cel mai scurt timp posibil prin Glovo.' },
                { num: '03', title: 'Prețuri Accesibile', desc: 'Mâncare de calitate la prețuri corecte, pentru că toată lumea merită o masă bună.' },
                { num: '04', title: 'Făcut cu Pasiune', desc: 'Fiecare preparat este gătit cu dragoste și atenție, exact ca acasă, dar mai gustos.' },
              ].map(item => (
                <div key={item.title} className="group relative">
                  <div className="flex items-start gap-6">
                    <span className="font-playfair italic text-6xl md:text-7xl font-bold text-[#e8b76a]/25 leading-none flex-shrink-0 transition-all duration-300 group-hover:text-[#e8b76a]/50">
                      {item.num}
                    </span>
                    <div className="flex-1 pt-2">
                      <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                        {item.title}
                      </h3>
                      <div className="h-px w-12 bg-[#e8b76a] mb-4" />
                      <p className="text-white/70 text-base leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: RECENZII GOOGLE ─── */}
        <section className="bg-[#FDF6EC] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="font-inter text-[#D32F2F] uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                Ce spun clienții
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#1a1a1a]">
                Recenzii <span className="text-[#D32F2F] italic">Google</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <StarRating count={5} />
                <span className="font-semibold text-[#1a1a1a]">4.5</span>
                <span className="text-[#6b5c4e] text-sm">· 1000+ recenzii</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {reviews.slice(0, 3).map(review => (
                <div key={review.name} className="bg-[#FFF8F0] rounded-2xl p-6 border border-[#e8d5b7] hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 flex items-center justify-center">
                        <span className="text-[#D32F2F] font-bold text-lg">{review.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1a1a1a] text-sm">{review.name}</div>
                        <div className="text-[#6b5c4e] text-xs">{review.date}</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <StarRating count={review.stars} />
                  <p className="text-[#6b5c4e] text-sm leading-relaxed mt-3">&ldquo;{review.text}&rdquo;</p>
                </div>
              ))}
            </div>

            {/* Second row — 2 centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
              {reviews.slice(3).map(review => (
                <div key={review.name} className="bg-[#FFF8F0] rounded-2xl p-6 border border-[#e8d5b7] hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 flex items-center justify-center">
                        <span className="text-[#D32F2F] font-bold text-lg">{review.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1a1a1a] text-sm">{review.name}</div>
                        <div className="text-[#6b5c4e] text-xs">{review.date}</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <StarRating count={review.stars} />
                  <p className="text-[#6b5c4e] text-sm leading-relaxed mt-3">&ldquo;{review.text}&rdquo;</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="https://www.google.com/maps/search/Cosimo+Hunedoara"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Vezi toate recenziile pe Google
              </a>
            </div>
          </div>
        </section>

        {/* ─── SECTION 6: CTA BANNER ─── */}
        <section className="bg-[#D32F2F] py-20 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10 translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <p className="text-red-200 uppercase tracking-[0.3em] text-xs font-semibold mb-3">Acționează acum</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Foame?
            </h2>
            <p className="text-red-100 text-xl mb-10">
              Comandă acum prin Glovo sau sună-ne direct!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://glovoapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#D32F2F] hover:bg-red-50 font-bold px-10 py-4 rounded-full transition-all duration-200 hover:shadow-2xl text-sm inline-flex items-center justify-center gap-2"
              >
                <span>🛵</span> Comandă pe Glovo
              </a>
              <a
                href="tel:0724004216"
                className="border-2 border-white text-white hover:bg-white hover:text-[#D32F2F] font-bold px-10 py-4 rounded-full transition-all duration-200 text-sm inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Sună — Bd. Dacia
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      daciaHero: getHeroImage('dacia'),
      corvinHero: getHeroImage('corvin'),
      pizzerieHero: getHeroImage('pizzerie'),
    },
  }
}

export default Home
