import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 max-w-6xl flex items-center gap-3">
        <span className="text-3xl">🌿</span>
        <Link href="/" className="text-2xl font-bold tracking-tight hover:text-green-200 transition-colors">
          EcoLog
        </Link>
        <span className="text-green-300 text-sm ml-2 hidden sm:block">
          Track your environmental impact
        </span>
      </div>
    </header>
  )
}
