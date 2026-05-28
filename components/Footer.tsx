import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#1a0e08] text-[#c9b99a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D32F2F]/50">
                <Image src="/images/logo.png" alt="Cosimo" fill className="object-cover" />
              </div>
              <span className="font-playfair text-2xl font-bold text-white">COSIMO</span>
            </div>
            <p className="text-sm leading-relaxed text-[#8a7260] mb-4">
              Trei locații, o singură pasiune —<br />gusturi autentice în inima Hunedoarei.
            </p>
            <div className="flex gap-3">
              <a
                href="https://glovoapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D32F2F] hover:bg-[#b71c1c] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Glovo
              </a>
            </div>
          </div>

          {/* Dacia */}
          <div>
            <h3 className="font-playfair text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D32F2F] inline-block"></span>
              Cosimo — Bd. Dacia
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#D32F2F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bulevardul Dacia, Hunedoara
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D32F2F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0724004216" className="hover:text-white transition-colors">0724 004 216</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#4caf50] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="5" />
                </svg>
                <span className="text-[#4caf50] font-medium text-xs">Nonstop 24/7</span>
              </li>
            </ul>
          </div>

          {/* Corvin */}
          <div>
            <h3 className="font-playfair text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D32F2F] inline-block"></span>
              Fast Food — Bd. Corvin
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#D32F2F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bulevardul Corvin, Hunedoara
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D32F2F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0722235551" className="hover:text-white transition-colors">0722 235 551</a>
              </li>
            </ul>
          </div>

          {/* Pizzerie */}
          <div>
            <h3 className="font-playfair text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D32F2F] inline-block"></span>
              Pizzeria Cosimo
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#D32F2F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bd. Corvin nr. 1, bl. 1, ap. 2, Hunedoara
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#FFC107] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-[#FFC107] text-xs font-medium">Comenzi telefonice</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2d1f14] pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#5a4535]">© 2025 Cosimo Hunedoara. Toate drepturile rezervate.</p>
            <div className="flex gap-4 text-sm">
              <Link href="/dacia" className="text-[#5a4535] hover:text-[#c9b99a] transition-colors">Bd. Dacia</Link>
              <Link href="/corvin" className="text-[#5a4535] hover:text-[#c9b99a] transition-colors">Bd. Corvin</Link>
              <Link href="/pizzerie" className="text-[#5a4535] hover:text-[#c9b99a] transition-colors">Pizzerie</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
