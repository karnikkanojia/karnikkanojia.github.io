export const SITE_FOOTER_ACTIVE_EVENT = "site-footer:active-change"

type SiteFooterActiveDetail = {
  isActive: boolean
}

export function isSiteFooterActive(): boolean {
  return document.documentElement.dataset.siteFooterActive === "true"
}

export function setSiteFooterActive(isActive: boolean): void {
  const root = document.documentElement

  if (isActive) root.dataset.siteFooterActive = "true"
  else delete root.dataset.siteFooterActive

  window.dispatchEvent(
    new CustomEvent<SiteFooterActiveDetail>(SITE_FOOTER_ACTIVE_EVENT, {
      detail: { isActive },
    })
  )
}

export function getSiteFooterActiveState(event: Event): boolean {
  return (event as CustomEvent<SiteFooterActiveDetail>).detail.isActive
}
