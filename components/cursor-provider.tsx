"use client"

import { animate, remove } from "animejs"
import { Cursor } from "@/components/ui/cursor"
import { cn } from "@/lib/utils"
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

const VIEWPORT_PADDING = 12
const CURSOR_SIZE = 16
const CAPSULE_HEIGHT = 32
const TRANSITION_DURATION = 150

type CursorLabel = {
  icon?: ReactNode
  label: ReactNode
  labelClassName?: string
}

type ActiveCursorLabel = CursorLabel & { id: string }

type CursorProviderValue = {
  activate: (id: string, label: CursorLabel) => void
  deactivate: (id: string) => void
}

const CursorContext = createContext<CursorProviderValue>({
  activate: () => undefined,
  deactivate: () => undefined,
})

export function CursorProvider({ children }: { children: ReactNode }) {
  const [activeLabel, setActiveLabel] = useState<ActiveCursorLabel | null>(null)

  const activate = useCallback((id: string, label: CursorLabel) => {
    setActiveLabel({ id, ...label })
  }, [])

  const deactivate = useCallback((id: string) => {
    setActiveLabel((current) => (current?.id === id ? null : current))
  }, [])

  const value = useMemo(() => ({ activate, deactivate }), [activate, deactivate])

  return (
    <CursorContext.Provider value={value}>
      <PortfolioCursor activeLabel={activeLabel} />
      {children}
    </CursorContext.Provider>
  )
}

export function useCursorProvider() {
  return useContext(CursorContext)
}

function PortfolioCursor({
  activeLabel,
}: {
  activeLabel: ActiveCursorLabel | null
}) {
  const capsuleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef<HTMLDivElement>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const isExpanded = activeLabel !== null

  const clampCapsule = useCallback((x: number, y: number, width: number) => {
    const offset = offsetRef.current
    if (!offset) return

    const halfWidth = width / 2
    const halfHeight = CAPSULE_HEIGHT / 2
    const offsetX = Math.min(
      Math.max(VIEWPORT_PADDING + halfWidth - x, 0),
      window.innerWidth - VIEWPORT_PADDING - halfWidth - x
    )
    const offsetY = Math.min(
      Math.max(VIEWPORT_PADDING + halfHeight - y, 0),
      window.innerHeight - VIEWPORT_PADDING - halfHeight - y
    )
    offset.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
  }, [])

  const resizeCapsule = useCallback(() => {
    const capsule = capsuleRef.current
    const content = contentRef.current
    if (!capsule || !content) return

    const targetWidth = isExpanded
      ? Math.min(content.scrollWidth + 24, window.innerWidth - VIEWPORT_PADDING * 2)
      : CURSOR_SIZE

    remove(capsule)
    animate(capsule, {
      width: targetWidth,
      height: isExpanded ? CAPSULE_HEIGHT : CURSOR_SIZE,
      duration: TRANSITION_DURATION,
      ease: "easeInOutQuad",
    })
    clampCapsule(lastPositionRef.current.x, lastPositionRef.current.y, targetWidth)
  }, [clampCapsule, isExpanded])

  useLayoutEffect(() => {
    resizeCapsule()
  }, [activeLabel, resizeCapsule])

  useEffect(() => {
    const handleResize = () => resizeCapsule()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [resizeCapsule])

  useEffect(() => {
    const capsule = capsuleRef.current
    return () => {
      if (capsule) remove(capsule)
    }
  }, [])

  const handlePositionChange = useCallback(
    (x: number, y: number) => {
      lastPositionRef.current = { x, y }
      const width = capsuleRef.current?.getBoundingClientRect().width ?? CURSOR_SIZE
      clampCapsule(x, y, width)
    },
    [clampCapsule]
  )

  return (
    <Cursor onPositionChange={handlePositionChange}>
      <div className="translate-x-[-50%] translate-y-[-50%]">
        <div ref={offsetRef} className="will-change-transform">
          <div
            ref={capsuleRef}
            data-cursor-capsule
            data-expanded={isExpanded}
            className="group flex h-4 w-4 items-center justify-center overflow-hidden rounded-[24px] bg-black will-change-[width,height] data-[expanded=true]:bg-[#f1f1f1] data-[expanded=true]:backdrop-blur-md"
          >
            <div
              ref={contentRef}
              className={cn(
                "inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap text-sm text-white transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.5] group-data-[expanded=true]:text-black",
                activeLabel?.labelClassName,
                isExpanded ? "scale-100 opacity-100" : "scale-95 opacity-0"
              )}
            >
              {activeLabel && (
                <>
                  {activeLabel.icon}
                  <span className="min-w-0">{activeLabel.label}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Cursor>
  )
}
