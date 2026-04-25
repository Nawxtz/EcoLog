export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 px-8 py-4 flex items-center justify-between bg-surface-container-lowest">
      <p className="text-sm text-outline">
        Built with Next.js 14 + Open-Meteo
      </p>
      <p className="text-sm text-outline hidden sm:block">
        Environmental data for a better world 🌍
      </p>
    </footer>
  )
}
