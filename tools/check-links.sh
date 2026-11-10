#!/usr/bin/env bash
# 检查某图谱里所有外部链接是否可打开：tools/check-links.sh stroke-mi
# 403/429 多为网站拒绝脚本访问，不一定失效，需人工用浏览器确认；404/000 才是真失效。
set -u
G="${1:?用法: tools/check-links.sh <图谱目录名>}"
cd "$(dirname "$0")/.."
grep -oE 'https://[^"` )]+' "$G/data.js" | sed 's/[,;]$//' | sort -u | while read -r u; do
  c=$(curl -s -o /dev/null -L -m 15 -A "Mozilla/5.0" -w '%{http_code}' "$u"); echo "$c $u"
done | sort | awk '{print} $1!~/^(200|301|302)$/ {bad++} END {print "\n非200: " bad+0 > "/dev/stderr"}'
