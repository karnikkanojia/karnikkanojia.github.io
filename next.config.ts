import type { NextConfig } from "next"
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "byhuy.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
    ],
  },
}

export default nextConfig
