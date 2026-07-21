import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/i18n'

interface NavbarProps {
  variant?: 'home' | 'location'
}

export default function Navbar({ variant = 'home' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route changes
  useEffect(() => { setMenuOpen(false) }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-black/5 border-b border-white/20'
          : 'bg-white/60 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#D32F2F]/30 group-hover:ring-[#D32F2F] transition-all duration-200">
              <Image src="/images/logo.png" alt="Cosimo Logo" fill className="object-cover" />
            </div>
            <span className="font-playfair text-2xl font-bold text-[#D32F2F] tracking-wide">
              COSIMO
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {variant === 'location' ? (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-[#6b5c4e] hover:text-[#D32F2F] font-medium transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('Acasă', 'Home')}
              </Link>
            ) : (
              <>
                <Link href="/dacia" className="text-[#6b5c4e] hover:text-[#D32F2F] font-medium transition-colors text-sm relative group">
                  Cosimo Non-Stop Fast Food
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-200" />
                </Link>
                <Link href="/corvin" className="text-[#6b5c4e] hover:text-[#D32F2F] font-medium transition-colors text-sm relative group">
                  Cosimo Fast Food Pietonala
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-200" />
                </Link>
                <Link href="/pizzerie" className="text-[#6b5c4e] hover:text-[#D32F2F] font-medium transition-colors text-sm relative group">
                  {t('Pizzeria Cosimo', 'Cosimo Pizzeria')}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#D32F2F] group-hover:w-full transition-all duration-200" />
                </Link>
              </>
            )}
            {/* Desktop language toggle */}
            <div className="flex items-center gap-0.5 bg-[#FFF3E0] rounded-full p-0.5 border border-[#e8d5b7]">
              <button
                onClick={() => setLang('ro')}
                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${lang === 'ro' ? 'bg-[#D32F2F] text-white' : 'text-[#6b5c4e] hover:text-[#D32F2F]'}`}
                aria-label="Română"
              >
                🇷🇴 RO
              </button>
              <button
                onClick={() => setLang('en')}
                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${lang === 'en' ? 'bg-[#D32F2F] text-white' : 'text-[#6b5c4e] hover:text-[#D32F2F]'}`}
                aria-label="English"
              >
                🇬🇧 EN
              </button>
            </div>
            <a
              href="https://glovoapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#D32F2F] hover:bg-[#b71c1c] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-px"
            >
              {t('Comandă pe Glovo', 'Order on Glovo')}
            </a>
          </div>

          {/* Always-visible right cluster: language toggle (mobile) + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center gap-0.5 bg-[#FFF3E0] rounded-full p-0.5 border border-[#e8d5b7]">
              <button
                onClick={() => setLang('ro')}
                className={`text-[11px] font-bold px-2 py-1 rounded-full transition-colors ${lang === 'ro' ? 'bg-[#D32F2F] text-white' : 'text-[#6b5c4e]'}`}
                aria-label="Română"
              >
                RO
              </button>
              <button
                onClick={() => setLang('en')}
                className={`text-[11px] font-bold px-2 py-1 rounded-full transition-colors ${lang === 'en' ? 'bg-[#D32F2F] text-white' : 'text-[#6b5c4e]'}`}
                aria-label="English"
              >
                EN
              </button>
            </div>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-2 rounded-xl text-[#6b5c4e] hover:text-[#D32F2F] hover:bg-[#D32F2F]/10 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-[#e8d5b7]/50 px-4 py-4 space-y-1">
          {variant === 'location' ? (
            <Link href="/" className="flex items-center gap-2 text-[#6b5c4e] hover:text-[#D32F2F] font-medium py-3 px-3 rounded-xl hover:bg-[#D32F2F]/5 transition-colors" onClick={() => setMenuOpen(false)}>
              ← {t('Acasă', 'Home')}
            </Link>
          ) : (
            <>
              {[{ href: '/dacia', label: 'Cosimo Non-Stop Fast Food' }, { href: '/corvin', label: 'Cosimo Fast Food Pietonala' }, { href: '/pizzerie', label: t('Pizzeria Cosimo', 'Cosimo Pizzeria') }].map(item => (
                <Link key={item.href} href={item.href} className="block text-[#6b5c4e] hover:text-[#D32F2F] font-medium py-3 px-3 rounded-xl hover:bg-[#D32F2F]/5 transition-colors" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </>
          )}
          {/* Language toggle */}
          <div className="flex items-center justify-center gap-0.5 bg-[#FFF3E0] rounded-full p-0.5 border border-[#e8d5b7] mt-2 w-max mx-auto">
            <button
              onClick={() => setLang('ro')}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${lang === 'ro' ? 'bg-[#D32F2F] text-white' : 'text-[#6b5c4e]'}`}
            >
              🇷🇴 RO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${lang === 'en' ? 'bg-[#D32F2F] text-white' : 'text-[#6b5c4e]'}`}
            >
              🇬🇧 EN
            </button>
          </div>
          <div className="pt-2">
            <a
              href="https://glovoapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#D32F2F] text-white text-center font-semibold px-5 py-3 rounded-full transition-colors hover:bg-[#b71c1c]"
            >
              {t('Comandă pe Glovo', 'Order on Glovo')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
