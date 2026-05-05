"""
NZ Melting Pot — Musical Talent Showcase 2026 poster generator (v6).
Philosophy: "Polyphonic Order"

Outputs FOUR variants from a single drawing function:
  1. talent-showcase-2026-poster.png            — A4 portrait, 200 DPI (web/print)
  2. talent-showcase-2026-poster-print-A3.png   — A3 portrait, 300 DPI (premium print)
  3. talent-showcase-2026-poster-square.png     — 1080x1080 (Instagram feed)
  4. talent-showcase-2026-poster-story.png      — 1080x1920 (Instagram/Facebook story)
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = r"C:\Users\home\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\5aad43d3-476d-4e65-85a0-c82662019b12\4447626e-9fe3-4503-934b-3dd27bfeac5b\skills\canvas-design\canvas-fonts"
LOGO = os.path.join(HERE, "..", "images", "branding", "logo-300x300.png")

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
# Drawn-shape primitives
# ---------------------------------------------------------------------------
def draw_diamond(d, cx, cy, size, fill, outline=None, width=1):
    pts = [(cx, cy - size), (cx + size, cy), (cx, cy + size), (cx - size, cy)]
    d.polygon(pts, fill=fill, outline=outline)


def draw_star(d, cx, cy, size, fill, outline=None):
    points = []
    for i in range(10):
        ang = -math.pi / 2 + (math.pi / 5) * i
        r = size if i % 2 == 0 else size * 0.42
        points.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    d.polygon(points, fill=fill, outline=outline)


def draw_eighth_note(d, cx, cy, scale, color, alpha=255):
    a = (color[0], color[1], color[2], alpha) if len(color) == 3 else color
    hw, hh = int(28 * scale), int(20 * scale)
    d.ellipse([cx - hw, cy - hh, cx + hw, cy + hh], fill=a)
    stem_x = cx + hw - 3
    stem_top = cy - int(120 * scale)
    d.line([stem_x, cy - 3, stem_x, stem_top], fill=a, width=int(4 * scale))
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
    beam_top = cy - int(115 * scale)
    d.rectangle([cx + int(28 * scale) - 3, beam_top, cx + sp + int(28 * scale) - 3, beam_top + int(13 * scale)], fill=a)


def bullet_note(d, cx, cy, color):
    draw_quarter_note(d, cx, cy, 0.45, color)


def bullet_star(d, cx, cy, color):
    draw_star(d, cx, cy, 18, color)


def bullet_warning(d, cx, cy, color):
    pts = [(cx, cy - 22), (cx + 22, cy + 18), (cx - 22, cy + 18)]
    d.polygon(pts, outline=color, width=3)
    d.line([(cx, cy - 8), (cx, cy + 6)], fill=color, width=3)
    d.ellipse([cx - 2, cy + 11, cx + 2, cy + 15], fill=color)


# ---------------------------------------------------------------------------
# Electric (Stratocaster-style) guitar silhouette
# ---------------------------------------------------------------------------
def electric_guitar(W, H, cx, cy, scale, color, alpha):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    a = (color[0], color[1], color[2], alpha)
    s = scale

    body_pts = [
        (cx - 230 * s, cy - 240 * s),
        (cx - 100 * s, cy - 280 * s),
        (cx + 80 * s,  cy - 290 * s),
        (cx + 90 * s,  cy - 220 * s),
        (cx + 140 * s, cy - 200 * s),
        (cx + 280 * s, cy - 140 * s),
        (cx + 340 * s, cy - 30 * s),
        (cx + 330 * s, cy + 130 * s),
        (cx + 240 * s, cy + 280 * s),
        (cx + 60 * s,  cy + 340 * s),
        (cx - 130 * s, cy + 320 * s),
        (cx - 270 * s, cy + 220 * s),
        (cx - 320 * s, cy + 80 * s),
        (cx - 280 * s, cy - 80 * s),
        (cx - 290 * s, cy - 180 * s),
        (cx - 230 * s, cy - 240 * s),
    ]
    inner_a = (color[0], color[1], color[2], max(20, int(alpha * 0.55)))
    d.polygon(body_pts, fill=inner_a)
    d.polygon(body_pts, outline=a, width=int(8 * s))

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

    pu_positions = [(cx - 80 * s, cy - 80 * s), (cx - 30 * s, cy + 20 * s), (cx + 20 * s, cy + 120 * s)]
    for px, py in pu_positions:
        d.rectangle([px - 60 * s, py - 14 * s, px + 60 * s, py + 14 * s], outline=a, width=int(3 * s))
        for i in range(6):
            ppx = px - 50 * s + (i * 20 * s)
            d.ellipse([ppx - 3 * s, py - 3 * s, ppx + 3 * s, py + 3 * s], fill=a)

    knob_positions = [(cx + 90 * s, cy + 80 * s), (cx + 110 * s, cy + 140 * s), (cx + 80 * s, cy + 200 * s)]
    for kx, ky in knob_positions:
        d.ellipse([kx - 14 * s, ky - 14 * s, kx + 14 * s, ky + 14 * s], outline=a, width=int(3 * s))
        d.line([kx, ky - 10 * s, kx, ky - 4 * s], fill=a, width=int(3 * s))
    d.line([cx - 30 * s, cy + 200 * s, cx - 50 * s, cy + 240 * s], fill=a, width=int(4 * s))

    br_x, br_y = cx + 60 * s, cy + 180 * s
    d.rectangle([br_x - 50 * s, br_y - 12 * s, br_x + 50 * s, br_y + 12 * s], outline=a, width=int(3 * s))
    for i in range(6):
        sx = br_x - 40 * s + (i * 16 * s)
        d.ellipse([sx - 3 * s, br_y - 4 * s, sx + 3 * s, br_y + 4 * s], fill=a)

    d.ellipse([cx + 270 * s, cy + 100 * s, cx + 300 * s, cy + 130 * s], outline=a, width=int(3 * s))

    neck_base_x = cx + 100 * s
    neck_base_y = cy - 250 * s
    neck_len = 720 * s
    neck_w = 50 * s
    angle = -1.05
    dx, dy = math.cos(angle), math.sin(angle)
    perp_x, perp_y = -dy, dx
    p1 = (neck_base_x + perp_x * neck_w / 2, neck_base_y + perp_y * neck_w / 2)
    p2 = (neck_base_x - perp_x * neck_w / 2, neck_base_y - perp_y * neck_w / 2)
    p3 = (neck_base_x + dx * neck_len - perp_x * neck_w / 2, neck_base_y + dy * neck_len - perp_y * neck_w / 2)
    p4 = (neck_base_x + dx * neck_len + perp_x * neck_w / 2, neck_base_y + dy * neck_len + perp_y * neck_w / 2)
    d.polygon([p1, p2, p3, p4], outline=a, width=int(5 * s))

    for i in range(1, 22):
        t = i / 22
        fcx = neck_base_x + dx * neck_len * t
        fcy = neck_base_y + dy * neck_len * t
        fp1 = (fcx + perp_x * neck_w / 2, fcy + perp_y * neck_w / 2)
        fp2 = (fcx - perp_x * neck_w / 2, fcy - perp_y * neck_w / 2)
        d.line([fp1, fp2], fill=(color[0], color[1], color[2], int(alpha * 0.7)), width=1)
    for i in [3, 5, 7, 9, 12, 15, 17]:
        t = i / 22
        fcx = neck_base_x + dx * neck_len * t
        fcy = neck_base_y + dy * neck_len * t
        d.ellipse([fcx - 5 * s, fcy - 5 * s, fcx + 5 * s, fcy + 5 * s], fill=a)

    head_cx = neck_base_x + dx * neck_len
    head_cy = neck_base_y + dy * neck_len
    head_pts = [
        (head_cx + perp_x * neck_w / 2, head_cy + perp_y * neck_w / 2),
        (head_cx + dx * 40 * s + perp_x * neck_w * 1.4, head_cy + dy * 40 * s + perp_y * neck_w * 1.4),
        (head_cx + dx * 130 * s + perp_x * neck_w * 1.6, head_cy + dy * 130 * s + perp_y * neck_w * 1.6),
        (head_cx + dx * 180 * s, head_cy + dy * 180 * s),
        (head_cx + dx * 130 * s - perp_x * neck_w * 0.4, head_cy + dy * 130 * s - perp_y * neck_w * 0.4),
        (head_cx - perp_x * neck_w / 2, head_cy - perp_y * neck_w / 2),
    ]
    d.polygon(head_pts, outline=a, width=int(5 * s))
    for i in range(6):
        peg_t = 0.1 + i * 0.13
        pcx = head_cx + dx * (180 * s * peg_t) + perp_x * neck_w * 1.5
        pcy = head_cy + dy * (180 * s * peg_t) + perp_y * neck_w * 1.5
        d.ellipse([pcx - 8 * s, pcy - 8 * s, pcx + 8 * s, pcy + 8 * s], outline=a, width=int(2 * s))

    string_a = (color[0], color[1], color[2], int(alpha * 0.55))
    for i in range(6):
        str_start = (br_x + (i - 2.5) * 14 * s, br_y - 10 * s)
        str_end = (
            head_cx + dx * (40 * s + i * 30 * s) + perp_x * (neck_w * 0.35 + (i - 2.5) * 6 * s),
            head_cy + dy * (40 * s + i * 30 * s) + perp_y * (neck_w * 0.35 + (i - 2.5) * 6 * s)
        )
        d.line([str_start, str_end], fill=string_a, width=1)

    return layer


# ---------------------------------------------------------------------------
# Layout strategy:
# We design at a "base" canvas of W=1620, H=2400 (the print-ready A4 size).
# All other variants render the same drawing then resize / re-crop as needed.
# ---------------------------------------------------------------------------
BASE_W, BASE_H = 1620, 2400


def render_portrait(W=BASE_W, H=BASE_H, headline_size=156):
    """Returns a fully-rendered PIL Image at the given W,H (must be portrait)."""
    img = Image.new("RGB", (W, H), CREAM)

    # Subtle paper grain
    random.seed(42)
    grain = Image.new("L", (W, H), 0)
    gd = grain.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            gd[x, y] = random.randint(0, 16)
    grain = grain.filter(ImageFilter.GaussianBlur(0.6))
    img = Image.composite(Image.new("RGB", (W, H), DEEP_CREAM), img, grain)

    draw = ImageDraw.Draw(img, "RGBA")

    # Multi-line border + diamond ornaments
    margin = int(90 * (W / BASE_W))
    o_thick = max(6, int(8 * (W / BASE_W)))
    draw.rectangle([margin, margin, W - margin, H - margin], outline=MAROON + (255,), width=o_thick)
    gap1 = int(22 * (W / BASE_W))
    draw.rectangle([margin + gap1, margin + gap1, W - margin - gap1, H - margin - gap1],
                   outline=GOLD + (255,), width=max(3, int(4 * (W / BASE_W))))
    gap2 = gap1 + int(14 * (W / BASE_W))
    draw.rectangle([margin + gap2, margin + gap2, W - margin - gap2, H - margin - gap2],
                   outline=MAROON + (200,), width=1)
    gap3 = gap2 + int(12 * (W / BASE_W))
    draw.rectangle([margin + gap3, margin + gap3, W - margin - gap3, H - margin - gap3],
                   outline=GOLD + (110,), width=1)

    diam_size = max(7, int(9 * (W / BASE_W)))
    inner_diam = max(3, int(4 * (W / BASE_W)))
    for cx, cy in [
        (margin + gap2, margin + gap2),
        (W - margin - gap2, margin + gap2),
        (margin + gap2, H - margin - gap2),
        (W - margin - gap2, H - margin - gap2),
    ]:
        draw_diamond(draw, cx, cy, diam_size, fill=GOLD)
        draw_diamond(draw, cx, cy, inner_diam, fill=MAROON)
    for cx, cy in [
        (W // 2, margin + gap2),
        (W // 2, H - margin - gap2),
        (margin + gap2, H // 2),
        (W - margin - gap2, H // 2),
    ]:
        draw_diamond(draw, cx, cy, max(5, int(7 * (W / BASE_W))), fill=GOLD)
        draw_diamond(draw, cx, cy, max(2, int(3 * (W / BASE_W))), fill=MAROON)

    # Background guitar
    sf = W / BASE_W  # scale factor
    g = electric_guitar(W, H, int(W // 2 + 50 * sf), int(H // 2 + 280 * sf), 1.25 * sf, EMBER, 95)
    g = g.rotate(-22, resample=Image.BICUBIC, expand=False, center=(int(W // 2 + 50 * sf), int(H // 2 + 280 * sf)))
    img.paste(g, (0, 0), g)

    # Music notes
    notes_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    nd = ImageDraw.Draw(notes_layer)
    for cx, cy, sc, col, kind, alpha in [
        (int(300 * sf), int(480 * sf), 0.55 * sf, GOLD_SOFT, 'beam', 110),
        (int(1340 * sf), int(380 * sf), 0.5 * sf, EMBER, 'eighth', 105),
        (int(180 * sf), int(1200 * sf), 0.45 * sf, GOLD, 'quarter', 100),
        (int(1420 * sf), int(1080 * sf), 0.55 * sf, MAROON, 'beam', 95),
    ]:
        if kind == 'beam':
            draw_beamed_pair(nd, cx, cy, sc, col, alpha)
        elif kind == 'eighth':
            draw_eighth_note(nd, cx, cy, sc, col, alpha)
        else:
            draw_quarter_note(nd, cx, cy, sc, col, alpha)
    img.paste(notes_layer, (0, 0), notes_layer)

    draw = ImageDraw.Draw(img, "RGBA")

    # Logo
    if os.path.exists(LOGO):
        logo = Image.open(LOGO).convert("RGBA")
        lsize = int(150 * sf)
        logo = logo.resize((lsize, lsize), Image.LANCZOS)
        img.paste(logo, (margin + int(50 * sf), margin + int(45 * sf)), logo)

    # Header
    pre_x = margin + int(50 * sf) + int(150 * sf) + int(28 * sf)
    pre_y = margin + int(60 * sf)
    draw.text((pre_x, pre_y), "NZ MELTING POT", fill=MAROON, font=font("InstrumentSans-Bold.ttf", int(30 * sf)))
    draw.text((pre_x, pre_y + int(40 * sf)), "PRESENTS", fill=MUTED, font=font("InstrumentSans-Regular.ttf", int(22 * sf)))

    loc_text = "AUCKLAND  ·  NEW ZEALAND"
    f_loc = font("InstrumentSans-Regular.ttf", int(22 * sf))
    loc_w = draw.textlength(loc_text, font=f_loc)
    draw.text((W - margin - int(50 * sf) - loc_w, pre_y + int(50 * sf)), loc_text, fill=MUTED, font=f_loc)
    draw.line([(W - margin - int(50 * sf) - loc_w, pre_y + int(80 * sf)), (W - margin - int(50 * sf), pre_y + int(80 * sf))],
              fill=GOLD, width=1)

    # Headline (slightly tighter than before — headline_size param)
    title_top = margin + int(250 * sf)
    f_h1 = font("Gloock-Regular.ttf", int(headline_size * sf))

    def center_x_for(text, font_obj):
        bbox = draw.textbbox((0, 0), text, font=font_obj)
        return (W - (bbox[2] - bbox[0])) // 2

    line_h = int(headline_size * 1.04 * sf)
    y = title_top
    for line, color in [("MUSICAL", MAROON), ("TALENT", MAROON)]:
        draw.text((center_x_for(line, f_h1), y), line, fill=color, font=f_h1)
        y += line_h
    draw.text((center_x_for("SHOWCASE", f_h1), y), "SHOWCASE", fill=EMBER, font=f_h1)
    y += int(line_h * 1.1)

    # Tagline directly under the title — small caps in gold
    f_tag = font("InstrumentSans-Bold.ttf", int(24 * sf))
    tag_text = "LIVE  MUSIC  ·  LIVE  JUDGES  ·  LOCAL  TALENT"
    tag_w = draw.textlength(tag_text, font=f_tag)
    draw.text(((W - tag_w) // 2, y), tag_text, fill=GOLD, font=f_tag)
    y += int(50 * sf)

    # Ornament line
    cx_mid = W // 2
    draw.line([(cx_mid - int(220 * sf), y), (cx_mid - int(24 * sf), y)], fill=GOLD, width=2)
    draw.line([(cx_mid + int(24 * sf), y), (cx_mid + int(220 * sf), y)], fill=GOLD, width=2)
    draw_diamond(draw, cx_mid, y, max(8, int(12 * sf)), fill=GOLD)
    y += int(50 * sf)

    # Date
    f_date = font("CrimsonPro-Bold.ttf", int(70 * sf))
    date_text = "Saturday, 18 July 2026"
    draw.text((center_x_for(date_text, f_date), y), date_text, fill=DARK, font=f_date)
    y += int(95 * sf)

    f_sub = font("CrimsonPro-Italic.ttf", int(36 * sf))
    gates_text = "Gates open  —  TBA"
    draw.text((center_x_for(gates_text, f_sub), y), gates_text, fill=MUTED, font=f_sub)
    y += int(90 * sf)

    # Bullets
    y += int(20 * sf)
    f_bullet = font("InstrumentSerif-Regular.ttf", int(36 * sf))
    left_pad = margin + int(130 * sf)
    icon_x = left_pad + int(30 * sf)
    text_x = left_pad + int(80 * sf)

    for icon_fn, text in [
        (lambda d, _y: bullet_note(d, icon_x, _y + int(22 * sf), GOLD),
            "Live performances showcasing talent from across cultures."),
        (lambda d, _y: bullet_star(d, icon_x, _y + int(22 * sf), GOLD),
            "Delicious food and drinks available throughout the evening."),
        (lambda d, _y: bullet_warning(d, icon_x, _y + int(22 * sf), EMBER),
            "Hall capacity is limited — be sure to arrive early."),
    ]:
        icon_fn(draw, y)
        draw.text((text_x, y), text, fill=INK, font=f_bullet)
        y += int(60 * sf)

    y += int(50 * sf)

    # Registrations panel
    panel_top = y
    panel_h = int(360 * sf)
    panel_x1, panel_x2 = margin + int(80 * sf), W - margin - int(80 * sf)
    draw.rectangle([panel_x1, panel_top, panel_x2, panel_top + panel_h], fill=MAROON)
    draw.rectangle([panel_x1 + int(18 * sf), panel_top + int(18 * sf),
                    panel_x2 - int(18 * sf), panel_top + panel_h - int(18 * sf)],
                   outline=GOLD, width=2)

    f_panel_eb = font("InstrumentSans-Bold.ttf", int(24 * sf))
    eb_text = "REGISTRATIONS  NOW  OPEN"
    eb_w = draw.textlength(eb_text, font=f_panel_eb)
    eb_y = panel_top + int(55 * sf)
    eb_x = (W - eb_w) // 2
    draw.text((eb_x, eb_y), eb_text, fill=GOLD, font=f_panel_eb)
    draw_star(draw, eb_x - int(26 * sf), eb_y + int(14 * sf), int(8 * sf), GOLD)
    draw_star(draw, eb_x + eb_w + int(26 * sf), eb_y + int(14 * sf), int(8 * sf), GOLD)

    f_panel_sub = font("Gloock-Regular.ttf", int(64 * sf))
    ps_text = "Perform on stage"
    ps_w = draw.textlength(ps_text, font=f_panel_sub)
    draw.text(((W - ps_w) // 2, panel_top + int(100 * sf)), ps_text, fill=CREAM, font=f_panel_sub)

    col_y = panel_top + int(200 * sf)
    col_w = (panel_x2 - panel_x1) // 2
    divider_x = (panel_x1 + panel_x2) // 2

    f_pl = font("InstrumentSans-Bold.ttf", int(22 * sf))
    f_pa = font("Gloock-Regular.ttf", int(70 * sf))
    f_ps = font("CrimsonPro-Italic.ttf", int(24 * sf))

    ea_label = "EARLY  BIRD"
    ea_w = draw.textlength(ea_label, font=f_pl)
    draw.text((panel_x1 + col_w // 2 - ea_w // 2, col_y), ea_label, fill=GOLD, font=f_pl)
    amt = "$10"
    amt_w = draw.textlength(amt, font=f_pa)
    draw.text((panel_x1 + col_w // 2 - amt_w // 2, col_y + int(26 * sf)), amt, fill=CREAM, font=f_pa)
    sub = "until 1 June 2026"
    sub_w = draw.textlength(sub, font=f_ps)
    draw.text((panel_x1 + col_w // 2 - sub_w // 2, col_y + int(110 * sf)), sub, fill=GOLD_SOFT, font=f_ps)

    draw.line([(divider_x, col_y + int(8 * sf)), (divider_x, col_y + int(145 * sf))], fill=GOLD, width=1)

    std_label = "STANDARD"
    std_w = draw.textlength(std_label, font=f_pl)
    draw.text((divider_x + col_w // 2 - std_w // 2, col_y), std_label, fill=GOLD, font=f_pl)
    amt2 = "$15"
    amt2_w = draw.textlength(amt2, font=f_pa)
    draw.text((divider_x + col_w // 2 - amt2_w // 2, col_y + int(26 * sf)), amt2, fill=CREAM, font=f_pa)
    sub2 = "from 2 June, per participant"
    sub2_w = draw.textlength(sub2, font=f_ps)
    draw.text((divider_x + col_w // 2 - sub2_w // 2, col_y + int(110 * sf)), sub2, fill=GOLD_SOFT, font=f_ps)

    # Footer block (in flow, below panel)
    y = panel_top + panel_h + int(50 * sf)

    f_aud = font("CrimsonPro-Bold.ttf", int(32 * sf))
    aud_text = "Audience tickets — $10 NZD each  ·  book up to 10 per person"
    aud_w = draw.textlength(aud_text, font=f_aud)
    draw.text(((W - aud_w) // 2, y), aud_text, fill=DARK, font=f_aud)
    y += int(70 * sf)

    draw_diamond(draw, W // 2, y + int(8 * sf), max(4, int(6 * sf)), fill=GOLD)
    y += int(30 * sf)

    f_vlbl = font("InstrumentSans-Bold.ttf", int(22 * sf))
    v_lbl = "VENUE"
    v_lbl_w = draw.textlength(v_lbl, font=f_vlbl)
    draw.text(((W - v_lbl_w) // 2, y), v_lbl, fill=GOLD, font=f_vlbl)
    y += int(32 * sf)
    draw.line([(W // 2 - int(30 * sf), y), (W // 2 + int(30 * sf), y)], fill=GOLD, width=1)
    y += int(18 * sf)

    f_v = font("CrimsonPro-Regular.ttf", int(26 * sf))
    for ln in [
        "Blockhouse Bay Community Centre",
        "524 Blockhouse Bay Road, Blockhouse Bay",
        "Auckland 0600",
    ]:
        lw = draw.textlength(ln, font=f_v)
        draw.text(((W - lw) // 2, y), ln, fill=INK, font=f_v)
        y += int(36 * sf)

    y += int(18 * sf)

    f_url = font("InstrumentSans-Bold.ttf", int(30 * sf))
    url = "www.nzmeltingpot.com"
    uw = draw.textlength(url, font=f_url)
    draw.text(((W - uw) // 2, y), url, fill=MAROON, font=f_url)
    y += int(60 * sf)

    draw.line([(margin + int(250 * sf), y), (W - margin - int(250 * sf), y)], fill=GOLD, width=1)
    y += int(28 * sf)

    f_sp_eb = font("InstrumentSans-Regular.ttf", int(18 * sf))
    sp_eb = "PROUDLY  SUPPORTED  BY"
    sp_eb_w = draw.textlength(sp_eb, font=f_sp_eb)
    draw.text(((W - sp_eb_w) // 2, y), sp_eb, fill=MUTED, font=f_sp_eb)
    y += int(32 * sf)

    f_sp = font("CrimsonPro-Italic.ttf", int(30 * sf))
    sp_name = "JR Finance — create wealth"
    sp_w = draw.textlength(sp_name, font=f_sp)
    draw.text(((W - sp_w) // 2, y), sp_name, fill=DARK, font=f_sp)

    return img


# ---------------------------------------------------------------------------
# Render & save all four variants
# ---------------------------------------------------------------------------
def main():
    print("=" * 60)
    print("Generating all poster variants")
    print("=" * 60)

    print("\n[1/4] A4 portrait (web/print, 200 DPI)...")
    base = render_portrait(BASE_W, BASE_H, headline_size=156)
    out_a4 = os.path.join(HERE, "talent-showcase-2026-poster.png")
    base.save(out_a4, "PNG", dpi=(200, 200), optimize=True)
    print(f"  -> {out_a4} ({os.path.getsize(out_a4) // 1024} KB)")

    print("\n[2/4] A3 print-quality (300 DPI)...")
    # A3 at 300 DPI = 3508 x 4961. We render the portrait at proportional larger size.
    a3 = render_portrait(2480, 3508, headline_size=156)
    out_a3 = os.path.join(HERE, "talent-showcase-2026-poster-print-A3.png")
    a3.save(out_a3, "PNG", dpi=(300, 300), optimize=True)
    print(f"  -> {out_a3} ({os.path.getsize(out_a3) // 1024} KB)")

    print("\n[3/4] Instagram square 1080x1080 (top portion of base)...")
    # Scale base so width = 1080 (1080 x 1600), then take the top 1080x1080.
    # This keeps the headline + registrations panel + most venue info; only
    # the sponsor footer is omitted (acceptable for an Instagram preview tile).
    bw, bh = base.size
    scaled_w = 1080
    scaled_h = int(bh * (scaled_w / bw))
    scaled = base.resize((scaled_w, scaled_h), Image.LANCZOS)
    sq = scaled.crop((0, 0, 1080, 1080))
    out_sq = os.path.join(HERE, "talent-showcase-2026-poster-square.png")
    sq.save(out_sq, "PNG", optimize=True)
    print(f"  -> {out_sq} ({os.path.getsize(out_sq) // 1024} KB)")

    print("\n[4/4] Instagram story 1080x1920 (resize from base)...")
    # Story is taller than A4 ratio (1080/1920 = 0.5625, A4 = 0.7), so we letterbox slightly.
    # Simpler: render the base then resize to fit 1920 height, centre-crop horizontally.
    target_h = 1920
    target_w = 1080
    base_ratio = bw / bh
    target_ratio = target_w / target_h
    if base_ratio > target_ratio:
        # Base is wider — fit to height, crop sides
        new_h = target_h
        new_w = int(bw * (new_h / bh))
        story = base.resize((new_w, new_h), Image.LANCZOS)
        x_off = (new_w - target_w) // 2
        story = story.crop((x_off, 0, x_off + target_w, target_h))
    else:
        # Base is narrower (more portrait) than story — fit to width, crop top/bottom
        new_w = target_w
        new_h = int(bh * (new_w / bw))
        story = base.resize((new_w, new_h), Image.LANCZOS)
        y_off = (new_h - target_h) // 2
        story = story.crop((0, y_off, target_w, y_off + target_h))
    out_story = os.path.join(HERE, "talent-showcase-2026-poster-story.png")
    story.save(out_story, "PNG", optimize=True)
    print(f"  -> {out_story} ({os.path.getsize(out_story) // 1024} KB)")

    print("\n" + "=" * 60)
    print("All four variants saved to public/posters/")
    print("=" * 60)


if __name__ == "__main__":
    main()
