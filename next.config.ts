import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 同名覆盖 `public/images/` 下文件时，避免 `/_next/image` 长期返回旧图。
    // 开发环境关闭 TTL；生产环境保留较短缓存（秒），可按需调高。
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 0 : 3600,
  },
};

export default nextConfig;
