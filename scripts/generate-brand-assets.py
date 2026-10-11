#!/usr/bin/env python3
"""
Generate Brand Assets for X Viral Radar (Chrome Web Store Edition)
Creates:
- icons/icon16.png (16x16)
- icons/icon48.png (48x48)
- icons/icon128.png (128x128)
- store-assets/promo-440x280.png (440x280)
- store-assets/banner-1400x560.png (1400x560)
- store-assets/screenshot-1280x800.png (1280x800)
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
ICONS_DIR = os.path.join(PROJECT_DIR, "icons")
STORE_DIR = os.path.join(PROJECT_DIR, "store-assets")

os.makedirs(ICONS_DIR, exist_ok=True)
os.makedirs(STORE_DIR, exist_ok=True)

def create_radar_icon(size=128):
    # Canvas with alpha
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = size * 0.05
    rect = [pad, pad, size - pad, size - pad]
    radius = size * 0.22

    # Draw rounded dark slate / deep indigo background
    # Background gradient approximation
    bg = Image.new("RGBA", (size, size), (15, 23, 42, 255))
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(rect, radius=int(radius), fill=255)

    # Gradient from top-left #1E293B to bottom-right #0B0F19
    for y in range(size):
        for x in range(size):
            factor = (x + y) / (size * 2)
            r = int(30 * (1 - factor) + 11 * factor)
            g = int(41 * (1 - factor) + 15 * factor)
            b = int(59 * (1 - factor) + 25 * factor)
            bg.putpixel((x, y), (r, g, b, 255))

    img.paste(bg, (0, 0), mask)

    # Draw border
    border_draw = ImageDraw.Draw(img)
    border_draw.rounded_rectangle(rect, radius=int(radius), outline=(56, 189, 248, 120), width=max(1, int(size * 0.025)))

    # Radar center point
    cx = size * 0.45
    cy = size * 0.55

    # Draw Radar rings (cyan with low opacity)
    for r_ratio in [0.18, 0.32, 0.45]:
        r = size * r_ratio
        border_draw.arc([cx - r, cy - r, cx + r, cy + r], start=210, end=380, fill=(56, 189, 248, 90), width=max(1, int(size * 0.02)))

    # Trending bars
    # Bar 1: Green 🌱
    b1_w = size * 0.16
    b1_h = size * 0.28
    b1_x = size * 0.20
    b1_y = size * 0.62
    border_draw.rounded_rectangle([b1_x, b1_y, b1_x + b1_w, b1_y + b1_h], radius=int(size*0.04), fill=(34, 197, 94, 255))

    # Bar 2: Amber / Orange 🚀
    b2_w = size * 0.16
    b2_h = size * 0.44
    b2_x = size * 0.42
    b2_y = size * 0.46
    border_draw.rounded_rectangle([b2_x, b2_y, b2_x + b2_w, b2_y + b2_h], radius=int(size*0.04), fill=(249, 115, 22, 255))

    # Bar 3: Hot Red / Flame 🔥
    b3_w = size * 0.16
    b3_h = size * 0.60
    b3_x = size * 0.64
    b3_y = size * 0.30
    border_draw.rounded_rectangle([b3_x, b3_y, b3_x + b3_w, b3_y + b3_h], radius=int(size*0.04), fill=(239, 68, 68, 255))

    # Trending curve with neon rocket/star arrow
    arrow_color = (255, 255, 255, 255)
    points = [
        (size * 0.22, size * 0.60),
        (size * 0.48, size * 0.40),
        (size * 0.74, size * 0.22),
    ]
    # Draw trajectory line
    border_draw.line(points, fill=(239, 68, 68, 220), width=max(2, int(size * 0.04)))
    border_draw.line(points, fill=(255, 255, 255, 255), width=max(1, int(size * 0.02)))

    # Draw bright viral spark star at tip
    tx = size * 0.76
    ty = size * 0.20
    star_r = size * 0.08
    border_draw.ellipse([tx - star_r, ty - star_r, tx + star_r, ty + star_r], fill=(255, 255, 255, 255))

    return img

def generate_promo_tile():
    width, height = 440, 280
    img = Image.new("RGB", (width, height), (15, 23, 42))
    draw = ImageDraw.Draw(img)

    # Background ambient lighting
    for y in range(height):
        factor = y / height
        r = int(15 * (1 - factor) + 8 * factor)
        g = int(23 * (1 - factor) + 12 * factor)
        b = int(42 * (1 - factor) + 28 * factor)
        for x in range(width):
            img.putpixel((x, y), (r, g, b))

    # Paste Icon
    icon = create_radar_icon(110)
    img.paste(icon, (32, 85), icon)

    # Try font
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 26)
        font_sub = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 13)
        font_tag = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 11)
    except Exception:
        font_large = font_sub = font_tag = ImageFont.load_default()

    draw = ImageDraw.Draw(img)

    # Badges
    badge_rect = [160, 48, 280, 72]
    draw.rounded_rectangle(badge_rect, radius=6, fill=(56, 189, 248, 40), outline=(56, 189, 248, 160))
    draw.text((168, 52), "⚡ 实时流速监测 + AI 创作", fill=(56, 189, 248), font=font_tag)

    # Title
    draw.text((160, 84), "X 爆款雷达", fill=(255, 255, 255), font=font_large)
    draw.text((160, 122), "X Viral Radar", fill=(148, 163, 184), font=font_sub)

    # Features
    draw.text((160, 156), "🔥 实时曝光流速 · 🌱/🚀/🔥 爆帖分级", fill=(226, 232, 240), font=font_sub)
    draw.text((160, 180), "🧠 Gemini 2.0 / Grok 爆款拆解 & 仿写二创", fill=(226, 232, 240), font=font_sub)
    draw.text((160, 204), "📥 浮动榜单一键导出 Markdown / JSON", fill=(226, 232, 240), font=font_sub)
    draw.text((160, 228), "🔒 100% 本地运行 · 零数据采集 · 永久激活", fill=(52, 211, 153), font=font_sub)

    img.save(os.path.join(STORE_DIR, "promo-440x280.png"), "PNG")
    print("promo-440x280.png created")

def generate_banner():
    width, height = 1400, 560
    img = Image.new("RGB", (width, height), (15, 23, 42))

    for y in range(height):
        factor = y / height
        r = int(20 * (1 - factor) + 10 * factor)
        g = int(30 * (1 - factor) + 15 * factor)
        b = int(55 * (1 - factor) + 30 * factor)
        for x in range(width):
            img.putpixel((x, y), (r, g, b))

    # Icon
    icon = create_radar_icon(240)
    img.paste(icon, (100, 160), icon)

    try:
        font_hero = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 60)
        font_sub = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 26)
        font_desc = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 22)
    except Exception:
        font_hero = font_sub = font_desc = ImageFont.load_default()

    draw = ImageDraw.Draw(img)
    draw.text((390, 140), "X 爆款雷达 - AI 创作与流速监测助手", fill=(255, 255, 255), font=font_hero)
    draw.text((390, 225), "X Viral Radar · Real-Time Impression Velocity & Creator Engine", fill=(56, 189, 248), font=font_sub)
    draw.text((390, 280), "• 实时 views/h 加速度胶囊徽章，毫秒级捕捉全网起量趋势", fill=(226, 232, 240), font=font_desc)
    draw.text((390, 320), "• 深度整合 Google Gemini 2.0 / X Grok，爆款逻辑拆解与一键二创仿写", fill=(226, 232, 240), font=font_desc)
    draw.text((390, 360), "• 浮动排行榜面板一键导出 Markdown / JSON，无缝对接自媒体增长矩阵", fill=(226, 232, 240), font=font_desc)
    draw.text((390, 400), "• 纯本地解析与端侧运行，零服务端数据收集，隐私绝对安全", fill=(52, 211, 153), font=font_desc)

    img.save(os.path.join(STORE_DIR, "banner-1400x560.png"), "PNG")
    print("banner-1400x560.png created")

def generate_screenshot():
    width, height = 1280, 800
    img = Image.new("RGB", (width, height), (15, 23, 42))

    for y in range(height):
        factor = y / height
        r = int(18 * (1 - factor) + 9 * factor)
        g = int(26 * (1 - factor) + 14 * factor)
        b = int(48 * (1 - factor) + 26 * factor)
        for x in range(width):
            img.putpixel((x, y), (r, g, b))

    icon = create_radar_icon(180)
    img.paste(icon, (80, 80), icon)

    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 44)
        font_sub = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 22)
        font_card_t = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 20)
        font_card_b = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 15)
    except Exception:
        font_title = font_sub = font_card_t = font_card_b = ImageFont.load_default()

    draw = ImageDraw.Draw(img)
    draw.text((290, 100), "X 爆款雷达 · 核心功能全景", fill=(255, 255, 255), font=font_title)
    draw.text((290, 160), "专为 X (Twitter) 创作者与海外增长团队打造的生产力利器", fill=(148, 163, 184), font=font_sub)

    # 4 Cards
    cards = [
        ("🚀 实时流速徽章", "在每条推文时间线上秒级显示 views/h 速度指标，自动划分正常、蹿升与爆款热度，不再错过任何传播拐点。", 80, 300, 520, 210),
        ("🔥 爆款深度拆解", "一键剖析爆款推文的 Hook 钩子、情绪共鸣点与底层传播结构，自动提炼可复制的爆款公式。", 680, 300, 520, 210),
        ("✍️ 结构仿写二创", "基于顶级爆款的架构节奏，由 Gemini 2.0 / Grok 快速衍生 5 篇跨领域的原创高赞推文草稿。", 80, 540, 520, 210),
        ("📥 榜单一键导出", "右下角可拖拽浮动排行榜，支持一键将可见热门推文批量导出为结构化 Markdown / JSON 数据。", 680, 540, 520, 210),
    ]

    for title, desc, cx, cy, cw, ch in cards:
        draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=12, fill=(30, 41, 59), outline=(51, 65, 85), width=2)
        draw.text((cx + 24, cy + 24), title, fill=(56, 189, 248), font=font_card_t)
        # Wrap text
        line_len = 28
        for idx, i in enumerate(range(0, len(desc), line_len)):
            draw.text((cx + 24, cy + 70 + idx * 28), desc[i:i+line_len], fill=(203, 213, 225), font=font_card_b)

    img.save(os.path.join(STORE_DIR, "screenshot-1280x800.png"), "PNG")
    print("screenshot-1280x800.png created")

def main():
    print("Generating icons...")
    create_radar_icon(16).save(os.path.join(ICONS_DIR, "icon16.png"))
    create_radar_icon(48).save(os.path.join(ICONS_DIR, "icon48.png"))
    create_radar_icon(128).save(os.path.join(ICONS_DIR, "icon128.png"))
    print("Icons generated!")

    print("Generating Chrome Web Store promotional graphics...")
    generate_promo_tile()
    generate_banner()
    generate_screenshot()
    print("Store assets generated successfully!")

if __name__ == "__main__":
    main()
