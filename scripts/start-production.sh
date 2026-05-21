#!/bin/sh
# 生产启动：若缺少 .next 构建产物则先 build，再 next start（适配 1Panel 仅配置 start 的场景）
set -e
cd "$(dirname "$0")/.." || exit 1

if [ ! -f .next/BUILD_ID ]; then
  echo "[crowvpn-web] 未找到生产构建，正在执行 npm run build …"
  npm run build
fi

exec npx next start "$@"
