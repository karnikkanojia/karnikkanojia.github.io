import { generateCrossDocumentTransitionCss } from "@/lib/view-transitions/css"
import { viewTransitionRegistry } from "@/lib/view-transitions/project-image"
import { generateViewTransitionRuntime } from "@/lib/view-transitions/runtime"

const transitionCss = generateCrossDocumentTransitionCss(viewTransitionRegistry)
const transitionRuntime = generateViewTransitionRuntime(viewTransitionRegistry)

/**
 * Installs cross-document transition styles and lifecycle listeners before the
 * first rendering opportunity. This must remain a classic inline head script.
 */
export function ViewTransitionRuntime() {
  return (
    <>
      <style id="view-transition-styles">{transitionCss}</style>
      <script
        id="view-transition-lifecycle"
        dangerouslySetInnerHTML={{ __html: transitionRuntime }}
      />
    </>
  )
}
