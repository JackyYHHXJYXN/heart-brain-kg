#!/usr/bin/env python3
"""把 share/qr-<id>.png 做成带标题的分享海报（适合发微信、朋友圈、打印）。
用法: python3 tools/make-poster.py <id> "<标题>" "<副标题>"
只依赖 Pillow；字体用 macOS 自带的苹方。"""
import sys
from PIL import Image, ImageDraw, ImageFont
gid, title, sub = sys.argv[1:4]
W, H = 1080, 1500
img = Image.new("RGB", (W, H), "#f6f5f2"); d = ImageDraw.Draw(img)
F = lambda s: ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", s, index=2)
d.rectangle([0, 0, W, 16], fill="#c8102e")
def center(text, y, font, fill):
    w = d.textlength(text, font=font); d.text(((W - w) / 2, y), text, font=font, fill=fill)
center(title, 110, F(72), "#1b1c1f"); center(sub, 215, F(38), "#6a6c72")
qr = Image.open(f"share/qr-{gid}.png").convert("RGB").resize((820, 820))
d.rounded_rectangle([110, 330, 970, 1190], radius=36, fill="#ffffff", outline="#e2dfd8", width=3)
img.paste(qr, (130, 350))
center("微信扫一扫 · 或用手机相机扫码", 1240, F(42), "#1b1c1f")
center("仅供健康科普，不能替代医生诊疗", 1330, F(30), "#6a6c72")
img.save(f"share/poster-{gid}.png"); print(f"✓ share/poster-{gid}.png")
