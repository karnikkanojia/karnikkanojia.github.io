"use client"

import { useRouter } from "next/navigation"
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react"

type CrossDocumentLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

function supportsCrossDocumentViewTransitions() {
  return (
    typeof window !== "undefined" &&
    "CSSViewTransitionRule" in window &&
    "onpageswap" in window &&
    "onpagereveal" in window
  )
}

function isPlainPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  )
}

/**
 * Keeps Next.js client navigation as the fallback, but uses a document
 * navigation where cross-document View Transitions are available.
 */
export const CrossDocumentLink = forwardRef<
  HTMLAnchorElement,
  CrossDocumentLinkProps
>(function CrossDocumentLink(
  { href, onClick, target, download, ...props },
  ref
) {
  const router = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      !isPlainPrimaryClick(event) ||
      (target !== undefined && target !== "_self") ||
      download !== undefined
    ) {
      return
    }

    const destination = new URL(href, window.location.href)
    const isSamePageAnchor =
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search &&
      Boolean(destination.hash)

    if (destination.origin !== window.location.origin || isSamePageAnchor) {
      return
    }

    event.preventDefault()
    if (supportsCrossDocumentViewTransitions()) {
      window.location.assign(destination.href)
    } else {
      router.push(href)
    }
  }

  return (
    <a
      {...props}
      ref={ref}
      href={href}
      target={target}
      download={download}
      onClick={handleClick}
    />
  )
})
