import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../lib/i18n'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="border-t border-[#e7d4bd] bg-[#f4eadb] pt-14 pb-8 text-[#6f5848]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D32F2F]/50">
                <Image src="/images/logo.png" alt="Cosimo" fill className="object-cover" />
              </div>
              <span className="font-playfair text-2xl font-bold text-[#57291f]">COSIMO</span>
            </div>
            <p className="text-sm leading-relaxed text-[#826c5e] mb-5">
              {t('Trei locații, o singură pasiune —', 'Three locations, one single passion —')}<br />
              {t('gusturi autentice în inima Hunedoarei.', 'authentic flavours in the heart of Hunedoara.')}
            </p>
            <div className="flex gap-3">
              <a
                href="https://glovoapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#722f24] hover:bg-[#914331] text-[#fff5e8] text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Glovo
              </a>
            </div>
          </div>

          {/* Dacia */}
          <div className="rounded-2xl border border-[#e7d4bd] bg-[#fffaf3] p-5 shadow-[0_8px_24px_rgba(67,38,24,0.04)]">
            <h3 className="font-playfair text-[#321c16] text-lg font-semibold mb-4 flex items-start gap-2">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a64b37] inline-block"></span>
              Cosimo Non-Stop Fast Food
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-[#70594a]">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#a64b37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bd. Dacia 23 bis, Hunedoara
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#a64b37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0724004216" className="hover:text-[#a64b37] transition-colors">0724 004 216</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#388b55] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="5" />
                </svg>
                <span className="text-[#388b55] font-medium text-xs">{t('Nonstop 24/7', 'Open 24/7')}</span>
              </li>
            </ul>
          </div>

          {/* Corvin */}
          <div className="rounded-2xl border border-[#e7d4bd] bg-[#fffaf3] p-5 shadow-[0_8px_24px_rgba(67,38,24,0.04)]">
            <h3 className="font-playfair text-[#321c16] text-lg font-semibold mb-4 flex items-start gap-2">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a64b37] inline-block"></span>
              Cosimo Fast Food Pietonala
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-[#70594a]">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#a64b37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bd. Corvin nr. 1, ap. 3, Hunedoara
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#a64b37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0724004415" className="hover:text-[#a64b37] transition-colors">0724 004 415</a>
              </li>
            </ul>
          </div>

          {/* Pizzerie */}
          <div className="rounded-2xl border border-[#e7d4bd] bg-[#fffaf3] p-5 shadow-[0_8px_24px_rgba(67,38,24,0.04)]">
            <h3 className="font-playfair text-[#321c16] text-lg font-semibold mb-4 flex items-start gap-2">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a64b37] inline-block"></span>
              {t('Pizzeria Cosimo', 'Cosimo Pizzeria')}
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-[#70594a]">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#a64b37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bd. Corvin nr. 1, bl. 1, ap. 2, Hunedoara
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-[#b27617] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-[#9a6715] text-xs font-semibold">{t('Comenzi telefonice', 'Phone orders')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e1cbb1] pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#826c5e]">© 2025 Cosimo Hunedoara. {t('Toate drepturile rezervate.', 'All rights reserved.')}</p>
            <div className="flex gap-4 text-sm">
              <Link href="/dacia" className="text-[#826c5e] hover:text-[#a64b37] transition-colors">Non Stop</Link>
              <Link href="/corvin" className="text-[#826c5e] hover:text-[#a64b37] transition-colors">Bd. Corvin</Link>
              <Link href="/pizzerie" className="text-[#826c5e] hover:text-[#a64b37] transition-colors">{t('Pizzerie', 'Pizzeria')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
