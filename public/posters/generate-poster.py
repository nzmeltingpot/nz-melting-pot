"""
NZ Melting Pot — Musical Talent Showcase 2026 poster generator (v2).
Philosophy: "Polyphonic Order"
- Replaces unicode glyphs with hand-drawn shapes (so they render in any font)
- Tightens the bottom-half spacing and prevents overlap
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = r"C:\Users\home\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\5aad43d3-476d-4e65-85a0-c82662019b12\4447626e-9fe3-4503-934b-3dd27bfeac5b\skills\canvas-design\canvas-fonts"
LOGO = os.path.join(HERE, "..", "images", "branding", "logo-300x300.png")
OUT_PNG = os.path.join(HERE, "talent-showcase-2026-poster.png")

W, H = 1620, 2400  # slightly taller — gives the bottom block room to breathe

CREAM = (251, 245, 237)
DEEP_CREAM = (242, 232, 217)
MAROON = (123, 30, 45)
EMBER = (168, 56, 50)
GOLD = (201, 162, 39)
GOLD_SOFT = (212, 180, 89)
DARK = (30, 25, 21)
INK = (47, 36, 31)
MUTED = (112, 95, 80)

def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)

# ---------------------------------------------------------------------------
# Drawn-shape decorative primitives (so we never depend on unicode glyphs)
# ---------------------------------------------------------------------------
def draw_diamond(d, cx, cy, size, fill, outline=None, width=1):
    pts = [(cx, cy - size), (cx + size, cy), (cx, cy + size), (cx - size, cy)]
    d.polygon(pts, fill=fill, outline=outline)

def draw_star(d, cx, cy, size, fill, outline=None):
    """Five-point star, inscribed in radius `size`."""
    import math as m
    points = []
    for i in range(10):
        ang = -m.pi / 2 + (m.pi / 5) * i
        r = size if i % 2 == 0 else size * 0.42
        points.append((cx + r * m.cos(ang), cy + r * m.sin(ang)))
    d.polygon(points, fill=fill, outline=outline)

def draw_eighth_note(d, cx, cy, scale, color, alpha=255):
    """A polished eighth note with a curved flag."""
    a = (color[0], color[1], color[2], alpha) if len(color) == 3 else color
    hw, hh = int(28 * scale), int(20 * scale)
    # Rotated note head — draw as filled ellipse, slight slant via overlay
    d.ellipse([cx - hw, cy - hh, cx + hw, cy + hh], fill=a)
    # Stem
    stem_x = cx + hw - 3
    stem_top = cy - int(120 * scale)
    d.line([stem_x, cy - 3, stem_x, stem_top], fill=a, width=int(4 * scale))
    # Flag — two small diagonal strokes for the tail
    fl = int(38 * scale)
    d.line([stem_x, stem_top, stem_x + fl, stem_top + int(28 * scale)], fill=a, width=int(4 * scale))
    d.line([stem_x, stem_top + int(20 * scale), stem_x + int(fl * 0.9), stem_top + int(50 * scale)], fill=a, width=int(3 * scale))

def draw_quarter_note(d, cx, cy, scale, color, alpha=255):
    a = (color[0], color[1], color[2], alpha) if len(color) == 3 else color
    hw, hh = int(28 * scale), int(20 * scale)
    d.ellipse([cx - hw, cy - hh, cx + hw, cy + hh], fill=a)
    d.line([cx + hw - 3, cy - 3, cx + hw - 3, cy - int(115 * scale)], fill=a, width=int(4 * scale))

def draw_beamed_pair(d, cx, cy, scale, color, alpha=255):
    a = (color[0], color[1], color[2], alpha) if len(color) == 3 else color
    sp = int(72 * scale)
    for x_off in (0, sp):
        x = cx + x_off
        hw, hh = int(28 * scale), int(20 * scale)
        d.ellipse([x - hw, cy - hh, x + hw, cy + hh], fill=a)
        d.line([x + hw - 3, cy - 3, x + hw - 3, cy - int(115 * scale)], fill=a, width=int(4 * scale))
    # Beam between stems
    beam_top = cy - int(115 * scale)
    d.rectangle([cx + int(28 * scale) - 3, beam_top, cx + sp + int(28 * scale) - 3, beam_top + int(13 * scale)], fill=a)

# Bullet icons drawn as shapes
def bullet_note(d, cx, cy, color):
    """Small filled note for live performance bullet."""
    draw_quarter_note(d, cx, cy, 0.45, color)

def bullet_star(d, cx, cy, color):
    draw_star(d, cx, cy, 18, color)

def bullet_warning(d, cx, cy, color):
    """Triangle with exclamation"""
    pts = [(cx, cy - 22), (cx + 22, cy + 18), (cx - 22, cy + 18)]
    d.polygon(pts, outline=color, width=3)
    # exclamation mark inside
    d.line([(cx, cy - 8), (cx, cy + 6)], fill=color, width=3)
    d.ellipse([cx - 2, cy + 11, cx + 2, cy + 15], fill=color)

# ---------------------------------------------------------------------------
# Build canvas
# ---------------------------------------------------------------------------
print("Building canvas...")
img = Image.new("RGB", (W, H), CREAM)

# Subtle grain
random.seed(42)
grain = Image.new("L", (W, H), 0)
gd = grain.load()
for y in range(0, H, 2):
    for x in range(0, W, 2):
        gd[x, y] = random.randint(0, 16)
grain = grain.filter(ImageFilter.GaussianBlur(0.6))
img = Image.composite(Image.new("RGB", (W, H), DEEP_CREAM), img, grain)

draw = ImageDraw.Draw(img, "RGBA")

# ---------------------------------------------------------------------------
# Multi-line letterpress border (gold + maroon, accentuated like the reference)
# ---------------------------------------------------------------------------
margin = 90
# 1. Outermost thick maroon rule
draw.rectangle([margin, margin, W - margin, H - margin], outline=MAROON + (255,), width=8)
# 2. Inner gold rule
gap1 = 22
draw.rectangle([margin + gap1, margin + gap1, W - margin - gap1, H - margin - gap1], outline=GOLD + (255,), width=4)
# 3. Hairline maroon
gap2 = gap1 + 14
draw.rectangle([margin + gap2, margin + gap2, W - margin - gap2, H - margin - gap2], outline=MAROON + (200,), width=1)
# 4. Innermost faint gold rule (the working frame)
gap3 = gap2 + 12
draw.rectangle([margin + gap3, margin + gap3, W - margin - gap3, H - margin - gap3], outline=GOLD + (110,), width=1)

# Decorative diamonds at the four corners of the maroon hairline frame
for cx, cy in [
    (margin + gap2, margin + gap2),
    (W - margin - gap2, margin + gap2),
    (margin + gap2, H - margin - gap2),
    (W - margin - gap2, H - margin - gap2),
]:
    draw_diamond(draw, cx, cy, 9, fill=GOLD)
    draw_diamond(draw, cx, cy, 4, fill=MAROON)

# Tiny diamond ornaments at the midpoint of each outer edge
for cx, cy in [
    (W // 2, margin + gap2),
    (W // 2, H - margin - gap2),
    (margin + gap2, H // 2),
    (W - margin - gap2, H // 2),
]:
    draw_diamond(draw, cx, cy, 7, fill=GOLD)
    draw_diamond(draw, cx, cy, 3, fill=MAROON)

# ---------------------------------------------------------------------------
# Background electric guitar (Stratocaster-inspired silhouette, more visible)
# ---------------------------------------------------------------------------
print("Drawing background electric guitar...")

def electric_guitar(cx, cy, scale, color, alpha):
    """
    Stratocaster-style silhouette assembled from polygon + circles.
    Body has the iconic offset double-cutaway shape; long neck rises up-left.
    """
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    a = (color[0], color[1], color[2], alpha)

    s = scale  # shorthand

    # ---- BODY: offset double-cutaway shape, anchored at (cx, cy) ----
    # We build the body silhouette as a closed polygon traced clockwise from top-left horn.
    body_pts = [
        (cx - 230 * s, cy - 240 * s),   # top-left horn tip (treble side)
        (cx - 100 * s, cy - 280 * s),   # upper bout shoulder
        (cx + 80 * s,  cy - 290 * s),   # neck-side notch (top)
        (cx + 90 * s,  cy - 220 * s),   # neck heel
        (cx + 140 * s, cy - 200 * s),   # transition
        (cx + 280 * s, cy - 140 * s),   # upper-right curve
        (cx + 340 * s, cy - 30 * s),    # right side mid
        (cx + 330 * s, cy + 130 * s),   # right curve
        (cx + 240 * s, cy + 280 * s),   # lower-right bottom
        (cx + 60 * s,  cy + 340 * s),   # base curve
        (cx - 130 * s, cy + 320 * s),   # lower-left
        (cx - 270 * s, cy + 220 * s),   # back of lower bout
        (cx - 320 * s, cy + 80 * s),    # left side
        (cx - 280 * s, cy - 80 * s),    # left horn lower
        (cx - 290 * s, cy - 180 * s),   # left horn (bass side, longer)
        (cx - 230 * s, cy - 240 * s),   # close shape
    ]
    # Subtle interior fill first (so outline sits on top crisply)
    inner_a = (color[0], color[1], color[2], max(20, int(alpha * 0.55)))
    d.polygon(body_pts, fill=inner_a)
    # Outline the body
    d.polygon(body_pts, outline=a, width=int(8 * s))

    # ---- PICKGUARD (white pickguard typical of Strats, drawn as outline) ----
    pg_pts = [
        (cx - 80 * s,  cy - 200 * s),
        (cx + 80 * s,  cy - 180 * s),
        (cx + 130 * s, cy - 100 * s),
        (cx + 160 * s, cy + 20 * s),
        (cx + 130 * s, cy + 140 * s),
        (cx + 60 * s,  cy + 220 * s),
        (cx - 100 * s, cy + 240 * s),
        (cx - 220 * s, cy + 130 * s),
        (cx - 180 * s, cy - 30 * s),
        (cx - 130 * s, cy - 150 * s),
    ]
    d.polygon(pg_pts, outline=a, width=int(4 * s))

    # ---- 3 single-coil PICKUPS (rectangles inside the pickguard) ----
    pu_positions = [(cx - 80 * s, cy - 80 * s), (cx - 30 * s, cy + 20 * s), (cx + 20 * s, cy + 120 * s)]
    for px, py in pu_positions:
        d.rectangle([px - 60 * s, py - 14 * s, px + 60 * s, py + 14 * s], outline=a, width=int(3 * s))
        # Pole pieces
        for i in range(6):
            ppx = px - 50 * s + (i * 20 * s)
            ppy = py
            d.ellipse([ppx - 3 * s, ppy - 3 * s, ppx + 3 * s, ppy + 3 * s], fill=a)

    # ---- CONTROL KNOBS (3 volume/tone) and selector switch ----
    knob_positions = [(cx + 90 * s, cy + 80 * s), (cx + 110 * s, cy + 140 * s), (cx + 80 * s, cy + 200 * s)]
    for kx, ky in knob_positions:
        d.ellipse([kx - 14 * s, ky - 14 * s, kx + 14 * s, ky + 14 * s], outline=a, width=int(3 * s))
        d.line([kx, ky - 10 * s, kx, ky - 4 * s], fill=a, width=int(3 * s))
    # Pickup selector lever
    d.line([cx - 30 * s, cy + 200 * s, cx - 50 * s, cy + 240 * s], fill=a, width=int(4 * s))

    # ---- BRIDGE / TREMOLO assembly ----
    br_x, br_y = cx + 60 * s, cy + 180 * s
    d.rectangle([br_x - 50 * s, br_y - 12 * s, br_x + 50 * s, br_y + 12 * s], outline=a, width=int(3 * s))
    # 6 saddle dots
    for i in range(6):
        sx = br_x - 40 * s + (i * 16 * s)
        d.ellipse([sx - 3 * s, br_y - 4 * s, sx + 3 * s, br_y + 4 * s], fill=a)

    # ---- OUTPUT JACK on the lower right edge ----
    d.ellipse([cx + 270 * s, cy + 100 * s, cx + 300 * s, cy + 130 * s], outline=a, width=int(3 * s))

    # ---- NECK rising from the neck-heel up to the headstock ----
    # Neck angle: roughly toward upper-right (in the rotated layer this becomes the diagonal we want)
    neck_base_x = cx + 100 * s
    neck_base_y = cy - 250 * s
    neck_len = 720 * s
    neck_w = 50 * s
    # Draw neck as a rotated rectangle going up-and-to-the-right
    import math as _m
    angle = -1.05  # radians ≈ -60°, points up-right
    dx, dy = _m.cos(angle), _m.sin(angle)
    perp_x, perp_y = -dy, dx
    p1 = (neck_base_x + perp_x * neck_w / 2, neck_base_y + perp_y * neck_w / 2)
    p2 = (neck_base_x - perp_x * neck_w / 2, neck_base_y - perp_y * neck_w / 2)
    p3 = (neck_base_x + dx * neck_len - perp_x * neck_w / 2, neck_base_y + dy * neck_len - perp_y * neck_w / 2)
    p4 = (neck_base_x + dx * neck_len + perp_x * neck_w / 2, neck_base_y + dy * neck_len + perp_y * neck_w / 2)
    d.polygon([p1, p2, p3, p4], outline=a, width=int(5 * s))

    # Frets across the neck
    for i in range(1, 22):
        t = i / 22
        fcx = neck_base_x + dx * neck_len * t
        fcy = neck_base_y + dy * neck_len * t
        fp1 = (fcx + perp_x * neck_w / 2, fcy + perp_y * neck_w / 2)
        fp2 = (fcx - perp_x * neck_w / 2, fcy - perp_y * neck_w / 2)
        d.line([fp1, fp2], fill=(color[0], color[1], color[2], int(alpha * 0.7)), width=1)
    # Fret-position dots (3rd, 5th, 7th, 9th, 12th double, 15th, 17th)
    for i in [3, 5, 7, 9, 12, 12, 15, 17]:
        t = i / 22
        fcx = neck_base_x + dx * neck_len * t
        fcy = neck_base_y + dy * neck_len * t
        # Offset slightly from center for the double-dot on 12
        offset = -10 * s if i == 12 and (12 in [3, 5, 7, 9]) else 0
        d.ellipse([fcx - 5 * s, fcy - 5 * s, fcx + 5 * s, fcy + 5 * s], fill=a)

    # ---- HEADSTOCK at end of neck ----
    head_cx = neck_base_x + dx * neck_len
    head_cy = neck_base_y + dy * neck_len
    # Headstock shape — Stratocaster-style: leans to one side
    head_pts = [
        (head_cx + perp_x * neck_w / 2, head_cy + perp_y * neck_w / 2),
        (head_cx + dx * 40 * s + perp_x * neck_w * 1.4, head_cy + dy * 40 * s + perp_y * neck_w * 1.4),
        (head_cx + dx * 130 * s + perp_x * neck_w * 1.6, head_cy + dy * 130 * s + perp_y * neck_w * 1.6),
        (head_cx + dx * 180 * s, head_cy + dy * 180 * s),
        (head_cx + dx * 130 * s - perp_x * neck_w * 0.4, head_cy + dy * 130 * s - perp_y * neck_w * 0.4),
        (head_cx - perp_x * neck_w / 2, head_cy - perp_y * neck_w / 2),
    ]
    d.polygon(head_pts, outline=a, width=int(5 * s))
    # Tuning pegs (6 small circles along headstock edge)
    for i in range(6):
        peg_t = 0.1 + i * 0.13
        pcx = head_cx + dx * (180 * s * peg_t) + perp_x * neck_w * 1.5
        pcy = head_cy + dy * (180 * s * peg_t) + perp_y * neck_w * 1.5
        d.ellipse([pcx - 8 * s, pcy - 8 * s, pcx + 8 * s, pcy + 8 * s], outline=a, width=int(2 * s))

    # ---- 6 STRINGS running from bridge to headstock ----
    string_a = (color[0], color[1], color[2], int(alpha * 0.55))
    for i in range(6):
        # Spread strings across the neck width
        offset = -neck_w / 2 + 5 * s + (i * (neck_w - 10 * s) / 5)
        str_start = (br_x + (i - 2.5) * 14 * s, br_y - 10 * s)
        str_end = (
            head_cx + dx * (40 * s + i * 30 * s) + perp_x * (neck_w * 0.35 + (i - 2.5) * 6 * s),
            head_cy + dy * (40 * s + i * 30 * s) + perp_y * (neck_w * 0.35 + (i - 2.5) * 6 * s)
        )
        d.line([str_start, str_end], fill=string_a, width=1)

    return layer

# Place electric guitar — large, clearly visible, behind the headline area
g = electric_guitar(W // 2 + 50, H // 2 + 280, 1.25, EMBER, 95)
g = g.rotate(-22, resample=Image.BICUBIC, expand=False, center=(W // 2 + 50, H // 2 + 280))
img.paste(g, (0, 0), g)

# ---------------------------------------------------------------------------
# Decorative music notes (drawn shapes)
# ---------------------------------------------------------------------------
print("Adding music notes...")
notes_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
nd = ImageDraw.Draw(notes_layer)

# Avoid the dense central text band
for cx, cy, sc, col, kind, alpha in [
    (300, 480, 0.55, GOLD_SOFT, 'beam', 110),
    (1340, 380, 0.5, EMBER, 'eighth', 105),
    (180, 1200, 0.45, GOLD, 'quarter', 100),
    (1420, 1080, 0.55, MAROON, 'beam', 95),
]:
    if kind == 'beam':
        draw_beamed_pair(nd, cx, cy, sc, col, alpha)
    elif kind == 'eighth':
        draw_eighth_note(nd, cx, cy, sc, col, alpha)
    else:
        draw_quarter_note(nd, cx, cy, sc, col, alpha)
img.paste(notes_layer, (0, 0), notes_layer)

# Re-init draw with RGBA mode
draw = ImageDraw.Draw(img, "RGBA")

# ---------------------------------------------------------------------------
# Logo
# ---------------------------------------------------------------------------
print("Logo...")
if os.path.exists(LOGO):
    logo = Image.open(LOGO).convert("RGBA")
    logo = logo.resize((150, 150), Image.LANCZOS)
    img.paste(logo, (margin + 50, margin + 45), logo)

# ---------------------------------------------------------------------------
# Header — pre-headline / location
# ---------------------------------------------------------------------------
print("Header...")
pre_x = margin + 50 + 150 + 28
pre_y = margin + 60
draw.text((pre_x, pre_y), "NZ MELTING POT", fill=MAROON, font=font("InstrumentSans-Bold.ttf", 30))
draw.text((pre_x, pre_y + 40), "PRESENTS", fill=MUTED, font=font("InstrumentSans-Regular.ttf", 22))

loc_text = "AUCKLAND  ·  NEW ZEALAND"
f_loc = font("InstrumentSans-Regular.ttf", 22)
loc_w = draw.textlength(loc_text, font=f_loc)
draw.text((W - margin - 50 - loc_w, pre_y + 50), loc_text, fill=MUTED, font=f_loc)
draw.line([(W - margin - 50 - loc_w, pre_y + 80), (W - margin - 50, pre_y + 80)], fill=GOLD, width=1)

# ---------------------------------------------------------------------------
# Headline
# ---------------------------------------------------------------------------
print("Headline...")
title_top = margin + 250
f_h1 = font("Gloock-Regular.ttf", 168)

def center_x_for(text, font_obj):
    bbox = draw.textbbox((0, 0), text, font=font_obj)
    return (W - (bbox[2] - bbox[0])) // 2

y = title_top
for line, color in [("MUSICAL", MAROON), ("TALENT", MAROON)]:
    draw.text((center_x_for(line, f_h1), y), line, fill=color, font=f_h1)
    y += 175

draw.text((center_x_for("SHOWCASE", f_h1), y), "SHOWCASE", fill=EMBER, font=f_h1)
y += 200

# Ornament
center_x = W // 2
orn_y = y + 6
draw.line([(center_x - 220, orn_y), (center_x - 24, orn_y)], fill=GOLD, width=2)
draw.line([(center_x + 24, orn_y), (center_x + 220, orn_y)], fill=GOLD, width=2)
draw_diamond(draw, center_x, orn_y, 12, fill=GOLD)
y += 50

# Date
f_date = font("CrimsonPro-Bold.ttf", 70)
date_text = "Saturday, 18 July 2026"
draw.text((center_x_for(date_text, f_date), y), date_text, fill=DARK, font=f_date)
y += 95

# Gates open italic
f_sub = font("CrimsonPro-Italic.ttf", 36)
gates_text = "Gates open  —  TBA"
draw.text((center_x_for(gates_text, f_sub), y), gates_text, fill=MUTED, font=f_sub)
y += 90

# ---------------------------------------------------------------------------
# Bullet list — drawn icons + serif text
# ---------------------------------------------------------------------------
print("Bullets...")
y += 20
f_bullet = font("InstrumentSerif-Regular.ttf", 36)
left_pad = margin + 130
icon_x = left_pad + 30
text_x = left_pad + 80

for icon_fn, text in [
    (lambda d: bullet_note(d, icon_x, y + 22, GOLD),
        "Live performances showcasing talent from across cultures."),
    (lambda d: bullet_star(d, icon_x, y + 22, GOLD),
        "Delicious food and drinks available throughout the evening."),
    (lambda d: bullet_warning(d, icon_x, y + 22, EMBER),
        "Hall capacity is limited — be sure to arrive early."),
]:
    icon_fn(draw)
    draw.text((text_x, y), text, fill=INK, font=f_bullet)
    y += 60

y += 50

# ---------------------------------------------------------------------------
# Registrations panel
# ---------------------------------------------------------------------------
print("Registrations panel...")
panel_top = y
panel_h = 360
panel_x1, panel_x2 = margin + 80, W - margin - 80
draw.rectangle([panel_x1, panel_top, panel_x2, panel_top + panel_h], fill=MAROON)
draw.rectangle([panel_x1 + 18, panel_top + 18, panel_x2 - 18, panel_top + panel_h - 18], outline=GOLD, width=2)

# Eyebrow with drawn stars
f_panel_eb = font("InstrumentSans-Bold.ttf", 24)
eb_text = "REGISTRATIONS  NOW  OPEN"
eb_w = draw.textlength(eb_text, font=f_panel_eb)
eb_y = panel_top + 55
eb_x = (W - eb_w) // 2
draw.text((eb_x, eb_y), eb_text, fill=GOLD, font=f_panel_eb)
# Stars left and right
draw_star(draw, eb_x - 26, eb_y + 14, 8, GOLD)
draw_star(draw, eb_x + eb_w + 26, eb_y + 14, 8, GOLD)

# "Perform on stage"
f_panel_sub = font("Gloock-Regular.ttf", 64)
ps_text = "Perform on stage"
ps_w = draw.textlength(ps_text, font=f_panel_sub)
draw.text(((W - ps_w) // 2, panel_top + 100), ps_text, fill=CREAM, font=f_panel_sub)

# Pricing columns
col_y = panel_top + 200
col_w = (panel_x2 - panel_x1) // 2
divider_x = (panel_x1 + panel_x2) // 2

f_pl = font("InstrumentSans-Bold.ttf", 22)
f_pa = font("Gloock-Regular.ttf", 70)
f_ps = font("CrimsonPro-Italic.ttf", 24)

ea_label = "EARLY  BIRD"
ea_w = draw.textlength(ea_label, font=f_pl)
draw.text((panel_x1 + col_w // 2 - ea_w // 2, col_y), ea_label, fill=GOLD, font=f_pl)
amt = "$10"
amt_w = draw.textlength(amt, font=f_pa)
draw.text((panel_x1 + col_w // 2 - amt_w // 2, col_y + 26), amt, fill=CREAM, font=f_pa)
sub = "until 1 June 2026"
sub_w = draw.textlength(sub, font=f_ps)
draw.text((panel_x1 + col_w // 2 - sub_w // 2, col_y + 110), sub, fill=GOLD_SOFT, font=f_ps)

draw.line([(divider_x, col_y + 8), (divider_x, col_y + 145)], fill=GOLD, width=1)

std_label = "STANDARD"
std_w = draw.textlength(std_label, font=f_pl)
draw.text((divider_x + col_w // 2 - std_w // 2, col_y), std_label, fill=GOLD, font=f_pl)
amt2 = "$15"
amt2_w = draw.textlength(amt2, font=f_pa)
draw.text((divider_x + col_w // 2 - amt2_w // 2, col_y + 26), amt2, fill=CREAM, font=f_pa)
sub2 = "from 2 June, per participant"
sub2_w = draw.textlength(sub2, font=f_ps)
draw.text((divider_x + col_w // 2 - sub2_w // 2, col_y + 110), sub2, fill=GOLD_SOFT, font=f_ps)

# ---------------------------------------------------------------------------
# Bottom block — positioned BELOW the registrations panel, in normal flow
# ---------------------------------------------------------------------------
print("Footer block...")
y = panel_top + panel_h + 50  # start a comfortable gap below the panel

# Audience tickets line
f_aud = font("CrimsonPro-Bold.ttf", 32)
aud_text = "Audience tickets — $10 NZD each  ·  book up to 10 per person"
aud_w = draw.textlength(aud_text, font=f_aud)
draw.text(((W - aud_w) // 2, y), aud_text, fill=DARK, font=f_aud)
y += 70

# Tiny gold ornament
draw_diamond(draw, W // 2, y + 8, 6, fill=GOLD)
y += 30

# VENUE label
f_vlbl = font("InstrumentSans-Bold.ttf", 22)
v_lbl = "VENUE"
v_lbl_w = draw.textlength(v_lbl, font=f_vlbl)
draw.text(((W - v_lbl_w) // 2, y), v_lbl, fill=GOLD, font=f_vlbl)
y += 32
draw.line([(W // 2 - 30, y), (W // 2 + 30, y)], fill=GOLD, width=1)
y += 18

# Venue lines
f_v = font("CrimsonPro-Regular.ttf", 26)
for ln in [
    "Blockhouse Bay Community Centre",
    "524 Blockhouse Bay Road, Blockhouse Bay",
    "Auckland 0600",
]:
    lw = draw.textlength(ln, font=f_v)
    draw.text(((W - lw) // 2, y), ln, fill=INK, font=f_v)
    y += 36

y += 18

# Website URL
f_url = font("InstrumentSans-Bold.ttf", 30)
url = "www.nzmeltingpot.com"
uw = draw.textlength(url, font=f_url)
draw.text(((W - uw) // 2, y), url, fill=MAROON, font=f_url)
y += 60

# Gold rule
draw.line([(margin + 250, y), (W - margin - 250, y)], fill=GOLD, width=1)
y += 28

# Sponsor block
f_sp_eb = font("InstrumentSans-Regular.ttf", 18)
sp_eb = "PROUDLY  SUPPORTED  BY"
sp_eb_w = draw.textlength(sp_eb, font=f_sp_eb)
draw.text(((W - sp_eb_w) // 2, y), sp_eb, fill=MUTED, font=f_sp_eb)
y += 32

f_sp = font("CrimsonPro-Italic.ttf", 30)
sp_name = "JR Finance — create wealth"
sp_w = draw.textlength(sp_name, font=f_sp)
draw.text(((W - sp_w) // 2, y), sp_name, fill=DARK, font=f_sp)

# ---------------------------------------------------------------------------
# Save
# ---------------------------------------------------------------------------
print(f"Saving to {OUT_PNG}...")
img.save(OUT_PNG, "PNG", dpi=(200, 200), optimize=True)
print(f"Done. {os.path.getsize(OUT_PNG) // 1024} KB")
