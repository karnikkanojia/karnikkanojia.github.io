import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-white text-black">
      <Image
        src="/videos/intro-poster.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-10 flex min-h-svh flex-col justify-between p-5 sm:p-8">
        <p className="font-navbar text-xs font-medium tracking-[0.16em]">404</p>

        <div className="max-w-xs pb-2 sm:pb-4">
          <h1 className="text-5xl leading-[0.88] tracking-[-0.065em] sm:text-7xl">
            Not found
          </h1>
          <Link
            href="/"
            className="mt-5 inline-flex text-sm underline decoration-black/35 underline-offset-4 transition-[text-decoration-color] duration-180 hover:decoration-black"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  )
}
