import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-white text-black">
      <Image
        src="/videos/intro-poster.webp"
        alt=""
        width={1440}
        height={810}
        priority
        sizes="(max-width: 640px) 72vw, 24rem"
        className="pointer-events-none absolute top-1/2 left-1/2 h-auto w-[72vw] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 object-contain"
      />

      <div className="relative z-10 flex min-h-svh flex-col justify-between p-5 sm:p-8">
        <p className="font-navbar text-xs font-medium tracking-[0.16em]">404</p>

        <div className="max-w-xs pb-2 sm:pb-4">
          <h1 className="text-5xl leading-[0.88] tracking-[-0.065em] sm:text-7xl">
            Not found
          </h1>
          <Link
            href="/"
            className="not-found-home mt-5 inline-flex border-b border-transparent py-2 text-base underline decoration-black/35 underline-offset-4 transition-[text-decoration-color] duration-180 active:opacity-60"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  )
}
