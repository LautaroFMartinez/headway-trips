"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/1.png" alt="Headway Trips Logo" width={44} height={44} className="object-contain" />
            <span className="font-serif text-xl font-semibold text-foreground">Headway Trips</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-8"
          />

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Algo salió mal</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Ocurrió un error inesperado. Por favor, intentá nuevamente o volvé al inicio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de nuevo
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-full font-medium hover:bg-secondary transition-colors"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-background/50 text-sm">© 2026 Headway Trips. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
