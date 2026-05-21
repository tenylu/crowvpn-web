import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/download.php",
        destination: "/download",
        permanent: true,
      },
    ];
  },
  images: {
    // 同名覆盖 `public/images/` 下文件时，避免 `/_next/image` 长期返回旧图。
    // 开发环境关闭 TTL；生产环境保留较短缓存（秒），可按需调高。
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 0 : 3600,
    /** Docker/部分环境 sharp 与 libc 不匹配时可能 Bus error；设 NEXT_IMAGE_UNOPTIMIZED=1 可绕过图片优化原生依赖 */
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "1",
  },
};

export default nextConfig;
