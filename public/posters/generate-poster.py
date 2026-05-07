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
DEEP_MAROON = (84, 18, 36)         # richer burgundy — for borders + headline pop
EMBER = (168, 56, 50)
DEEP_EMBER = (132, 38, 40)         # deeper red-brown for SHOWCASE punch
GOLD = (201, 162, 39)
GOLD_SOFT = (212, 180, 89)
DEEP_AMBER = (148, 100, 25)
DEEP_BLUE = (38, 70, 120)
NAVY = (28, 52, 92)
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
# Smooth Bezier helper used by all curve-based shapes
# ---------------------------------------------------------------------------
def cubic_bezier(p0, p1, p2, p3, n=24):
    """Sample a cubic Bezier curve at n+1 evenly-spaced points."""
    pts = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        x = u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def child_singer(W, H, cx, cy, scale, color, alpha):
    """
    Side-profile silhouette of a small child up on tiptoes, body leaning
    forward, head tilted upward — straining to reach a microphone that
    hangs from a bent boom stand. Profile faces RIGHT.

    Local coordinates: (0,0) sits at the child's chest level. Ground at
    y = +286. The mic stand pole rises from a base at x ≈ +160; its boom
    arm curves UP and back over the child so the mic head sits just above
    and slightly forward of the child's open mouth.
    """
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    a = (color[0], color[1], color[2], alpha)
    s = scale

    def P(x, y):
        return (cx + x * s, cy + y * s)

    def thick_line(p0, p1, thickness):
        d.line([p0, p1], fill=a, width=int(thickness))
        r = int(thickness / 2)
        d.ellipse([p0[0] - r, p0[1] - r, p0[0] + r, p0[1] + r], fill=a)
        d.ellipse([p1[0] - r, p1[1] - r, p1[0] + r, p1[1] + r], fill=a)

    def filled_ellipse(cx_, cy_, rx, ry):
        d.ellipse([cx_ - rx, cy_ - ry, cx_ + rx, cy_ + ry], fill=a)

    def thick_curve(pts, thickness):
        for i in range(len(pts) - 1):
            d.line([pts[i], pts[i + 1]], fill=a, width=int(thickness))
        r = int(thickness / 2)
        d.ellipse([pts[0][0] - r, pts[0][1] - r, pts[0][0] + r, pts[0][1] + r], fill=a)
        d.ellipse([pts[-1][0] - r, pts[-1][1] - r, pts[-1][0] + r, pts[-1][1] + r], fill=a)

    # ----- BODY (leaning forward — front line bulges out, back line tilts forward) -----
    body = []
    body += cubic_bezier(P(38, -190), P(58, -130), P(54, -60), P(40, 30), n=24)    # front torso
    body += cubic_bezier(P(40, 30), P(38, 80), P(32, 110), P(20, 130), n=20)        # hip front
    body += cubic_bezier(P(20, 130), P(0, 135), P(-25, 132), P(-40, 125), n=14)     # bottom of torso
    body += cubic_bezier(P(-40, 125), P(-46, 80), P(-46, 30), P(-42, -30), n=20)    # back lower
    body += cubic_bezier(P(-42, -30), P(-36, -90), P(-26, -140), P(-12, -185), n=22) # back upper (forward lean)
    body += cubic_bezier(P(-12, -185), P(8, -198), P(28, -198), P(38, -190), n=14)   # neck/shoulders
    d.polygon(body, fill=a)

    # ----- HEAD (tilted UP — drawn as a rotated egg) -----
    head_cx_v, head_cy_v = P(18, -255)
    rx_h, ry_h = 50 * s, 56 * s
    angle = math.radians(-22)  # negative => face tilts up & forward
    cos_a, sin_a = math.cos(angle), math.sin(angle)
    head_pts = []
    for i in range(60):
        t = i / 60 * 2 * math.pi
        # Egg shape: slightly fatter at the chin (positive y when un-rotated).
        ex = rx_h * math.cos(t)
        ey = ry_h * math.sin(t) * (1.0 + 0.08 * math.sin(t))
        rpx = ex * cos_a - ey * sin_a
        rpy = ex * sin_a + ey * cos_a
        head_pts.append((head_cx_v + rpx, head_cy_v + rpy))
    d.polygon(head_pts, fill=a)

    # Open singing mouth — a small cream-coloured oval at the front-top of
    # the head, tilted so it visually "opens" upward toward the mic.
    mouth_cx, mouth_cy = P(58, -278)
    m_rx, m_ry = 7 * s, 13 * s
    m_ang = math.radians(-30)
    m_cos, m_sin = math.cos(m_ang), math.sin(m_ang)
    m_pts = []
    for i in range(24):
        t = i / 24 * 2 * math.pi
        mx = m_rx * math.cos(t)
        my = m_ry * math.sin(t)
        m_pts.append((mouth_cx + mx * m_cos - my * m_sin,
                      mouth_cy + mx * m_sin + my * m_cos))
    d.polygon(m_pts, fill=(CREAM[0], CREAM[1], CREAM[2], min(255, alpha + 60)))

    # ----- HAIR / PONYTAIL — trails back-down behind the tilted head -----
    pony = []
    pony += cubic_bezier(P(-25, -260), P(-60, -240), P(-90, -210), P(-100, -175), n=18)
    pony += cubic_bezier(P(-100, -175), P(-105, -150), P(-95, -140), P(-80, -150), n=14)
    pony += cubic_bezier(P(-80, -150), P(-58, -180), P(-42, -210), P(-30, -235), n=14)
    pony += cubic_bezier(P(-30, -235), P(-22, -250), P(-22, -260), P(-26, -265), n=10)
    d.polygon(pony, fill=a)

    # ----- FRONT ARM stretched UP toward the mic -----
    shoulder = P(30, -180)
    elbow = P(58, -270)
    wrist = P(78, -355)
    thick_line(shoulder, elbow, max(6, int(22 * s)))
    thick_line(elbow, wrist, max(6, int(20 * s)))
    # Hand reaching just below mic capsule
    d.ellipse([wrist[0] - 14 * s, wrist[1] - 14 * s, wrist[0] + 14 * s, wrist[1] + 14 * s], fill=a)

    # ----- BACK ARM — bent for balance, swung behind the body -----
    shoulder2 = P(-22, -170)
    elbow2 = P(-65, -100)
    wrist2 = P(-72, -25)
    thick_line(shoulder2, elbow2, max(6, int(20 * s)))
    thick_line(elbow2, wrist2, max(6, int(18 * s)))
    d.ellipse([wrist2[0] - 12 * s, wrist2[1] - 12 * s, wrist2[0] + 12 * s, wrist2[1] + 12 * s], fill=a)

    # ----- LEGS — both clearly on tiptoes, front leg straining higher -----
    hip_front = P(15, 125)
    knee_front = P(22, 198)
    ankle_front = P(30, 258)
    thick_line(hip_front, knee_front, max(8, int(28 * s)))
    thick_line(knee_front, ankle_front, max(8, int(24 * s)))
    foot_pts_f = [
        ankle_front,
        (ankle_front[0] + 44 * s, ankle_front[1] + 18 * s),
        (ankle_front[0] + 40 * s, ankle_front[1] + 26 * s),
        (ankle_front[0] - 6 * s, ankle_front[1] + 22 * s),
    ]
    d.polygon(foot_pts_f, fill=a)

    hip_back = P(-25, 125)
    knee_back = P(-22, 198)
    ankle_back = P(-15, 254)
    thick_line(hip_back, knee_back, max(8, int(26 * s)))
    thick_line(knee_back, ankle_back, max(8, int(22 * s)))
    foot_pts_b = [
        ankle_back,
        (ankle_back[0] + 32 * s, ankle_back[1] + 16 * s),
        (ankle_back[0] + 28 * s, ankle_back[1] + 22 * s),
        (ankle_back[0] - 12 * s, ankle_back[1] + 18 * s),
    ]
    d.polygon(foot_pts_b, fill=a)

    # ----- GROUND LINE -----
    ground_y = ankle_front[1] + 28 * s
    d.line([(P(-110, 0)[0], ground_y), (P(180, 0)[0], ground_y)], fill=a, width=max(2, int(3 * s)))

    # ----- BENT BOOM MIC STAND -----
    # Vertical pole rises from a base on the right of the figure...
    pole_bot = P(160, 256)
    pole_top = P(160, -340)
    thick_line(pole_top, pole_bot, max(5, int(8 * s)))
    # ...with a small base disc on the ground.
    base_w = 64 * s
    base_h = 14 * s
    d.ellipse([pole_bot[0] - base_w / 2, ground_y - base_h / 2,
               pole_bot[0] + base_w / 2, ground_y + base_h / 2], fill=a)

    # The boom arm — curves up and OVER from the top of the pole to bring
    # the mic forward & down to the child's mouth.  This is the classic
    # "bent" stage-mic silhouette.
    boom_start = pole_top
    boom_ctrl1 = P(160, -420)
    boom_ctrl2 = P(110, -420)
    boom_end = P(78, -345)
    boom_pts = cubic_bezier(boom_start, boom_ctrl1, boom_ctrl2, boom_end, n=32)
    thick_curve(boom_pts, max(5, int(7 * s)))

    # Mic capsule hanging from the boom end, tilted toward the child's mouth
    mic_cx, mic_cy = P(72, -320)
    mic_r = 28 * s
    # Short connector from boom tip to mic body
    thick_line(boom_end, (mic_cx, mic_cy - mic_r * 0.9), max(4, int(6 * s)))
    # Mic head (egg-shape, slightly tilted toward mouth)
    head_pts_m = []
    mic_angle = math.radians(20)  # tilts mic toward the child's mouth
    cos_m, sin_m = math.cos(mic_angle), math.sin(mic_angle)
    for i in range(40):
        t = i / 40 * 2 * math.pi
        mx = mic_r * 0.95 * math.cos(t)
        my = mic_r * 1.10 * math.sin(t)
        head_pts_m.append((mic_cx + mx * cos_m - my * sin_m,
                           mic_cy + mx * sin_m + my * cos_m))
    d.polygon(head_pts_m, fill=a)
    # Windscreen mesh suggestion
    for i in range(-2, 3):
        ang_off = i * 0.3
        x_off = mic_r * 0.85 * math.sin(ang_off)
        y_off = -mic_r * 0.85 * math.cos(ang_off)
        x_b = mic_r * 0.85 * math.sin(ang_off)
        y_b = mic_r * 0.85 * math.cos(ang_off)
        # Rotate offsets into mic frame
        sx1 = x_off * cos_m - y_off * sin_m
        sy1 = x_off * sin_m + y_off * cos_m
        sx2 = x_b * cos_m - y_b * sin_m
        sy2 = x_b * sin_m + y_b * cos_m
        d.line([(mic_cx + sx1, mic_cy + sy1), (mic_cx + sx2, mic_cy + sy2)],
               fill=(255, 255, 255, int(alpha * 0.45)), width=1)

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

    # Multi-line border + diamond ornaments — outer line in DEEP_MAROON for
    # extra weight, inner accents echo the deeper palette.
    margin = int(90 * (W / BASE_W))
    o_thick = max(7, int(10 * (W / BASE_W)))
    draw.rectangle([margin, margin, W - margin, H - margin], outline=DEEP_MAROON + (255,), width=o_thick)
    gap1 = int(22 * (W / BASE_W))
    draw.rectangle([margin + gap1, margin + gap1, W - margin - gap1, H - margin - gap1],
                   outline=GOLD + (255,), width=max(3, int(4 * (W / BASE_W))))
    gap2 = gap1 + int(14 * (W / BASE_W))
    draw.rectangle([margin + gap2, margin + gap2, W - margin - gap2, H - margin - gap2],
                   outline=DEEP_MAROON + (220,), width=1)
    gap3 = gap2 + int(12 * (W / BASE_W))
    draw.rectangle([margin + gap3, margin + gap3, W - margin - gap3, H - margin - gap3],
                   outline=GOLD + (140,), width=1)

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

    # Singer silhouette — the visual hero of the poster.
    sf = W / BASE_W  # scale factor
    # Positioned in the right column, sized so the WHOLE figure fits in the
    # clear band between the SHOWCASE headline and the registrations panel.
    # Drawn in DEEP_MAROON at a stronger alpha so she reads as a bolder
    # silhouette without overwhelming the surrounding text.
    g = child_singer(W, H,
                     int(W // 2 + 380 * sf),
                     int(H // 2 - 110 * sf),
                     0.92 * sf, DEEP_MAROON, 140)
    img.paste(g, (0, 0), g)

    # Music notes — generously scattered, in the deeper poster palette so
    # they read clearly against the cream background.
    notes_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    nd = ImageDraw.Draw(notes_layer)
    for cx, cy, sc, col, kind, alpha in [
        # Pulled IN to flank each headline word — sits in the empty space
        # just beside the centred letters, giving a "between the words" feel.
        (int(440 * sf),  int(400 * sf),  0.40 * sf, DEEP_MAROON, 'eighth',  240),  # left of MUSICAL
        (int(1180 * sf), int(400 * sf),  0.40 * sf, NAVY,        'quarter', 240),  # right of MUSICAL
        (int(420 * sf),  int(560 * sf),  0.42 * sf, GOLD,        'beam',    235),  # left of TALENT
        (int(1180 * sf), int(560 * sf),  0.40 * sf, NAVY,        'eighth',  245),  # right of TALENT
        (int(430 * sf),  int(720 * sf),  0.42 * sf, NAVY,        'quarter', 245),  # left of SHOWCASE
        (int(1180 * sf), int(720 * sf),  0.40 * sf, DEEP_AMBER,  'eighth',  240),  # right of SHOWCASE

        # Tucked just below SHOWCASE, flanking the tagline
        (int(450 * sf),  int(840 * sf),  0.32 * sf, DEEP_BLUE,   'eighth',  220),
        (int(1170 * sf), int(840 * sf),  0.32 * sf, DEEP_MAROON, 'quarter', 220),

        # Drifting UP and AWAY from the singer's mic — three rising notes
        (int(1280 * sf), int(720 * sf),  0.38 * sf, DEEP_MAROON, 'eighth',  245),
        (int(1370 * sf), int(620 * sf),  0.42 * sf, NAVY,        'quarter', 240),
        (int(1230 * sf), int(540 * sf),  0.46 * sf, DEEP_AMBER,  'beam',    230),

        # A subtle pair flanking the tagline / gates band — pulled in
        (int(560 * sf),  int(990 * sf),  0.34 * sf, NAVY,        'quarter', 215),
        (int(1080 * sf), int(990 * sf),  0.32 * sf, DEEP_MAROON, 'eighth',  215),

        # One on each side of the bullets — sparse
        (int(200 * sf),  int(1240 * sf), 0.40 * sf, DEEP_BLUE,   'quarter', 230),
        (int(1485 * sf), int(1320 * sf), 0.38 * sf, DEEP_EMBER,  'eighth',  225),

        # Just below the panel (audience-tickets band)
        (int(240 * sf),  int(1780 * sf), 0.44 * sf, NAVY,        'beam',    230),
        (int(1420 * sf), int(1780 * sf), 0.42 * sf, DEEP_EMBER,  'eighth',  230),

        # Bottom flourish near venue / sponsor — quieter, single per side
        (int(260 * sf),  int(2160 * sf), 0.38 * sf, DEEP_MAROON, 'eighth',  205),
        (int(1400 * sf), int(2160 * sf), 0.38 * sf, DEEP_BLUE,   'quarter', 215),
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
    for line, color in [("MUSICAL", DEEP_MAROON), ("TALENT", DEEP_MAROON)]:
        draw.text((center_x_for(line, f_h1), y), line, fill=color, font=f_h1)
        y += line_h
    draw.text((center_x_for("SHOWCASE", f_h1), y), "SHOWCASE", fill=DEEP_EMBER, font=f_h1)
    y += int(line_h * 1.1)

    # Tagline directly under the title — small caps in deep amber for
    # stronger contrast against the cream paper.
    f_tag = font("InstrumentSans-Bold.ttf", int(28 * sf))
    tag_text = "LIVE  MUSIC  ·  LOCAL  TALENT  ·  ALL  AGES"
    tag_w = draw.textlength(tag_text, font=f_tag)
    draw.text(((W - tag_w) // 2, y), tag_text, fill=DEEP_AMBER, font=f_tag)
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
    # Translucent panel in DEEP_MAROON — richer fill that grounds the
    # bottom of the poster and lets the singer show through if she overlaps.
    draw.rectangle([panel_x1, panel_top, panel_x2, panel_top + panel_h], fill=DEEP_MAROON + (228,))
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
    draw.text(((W - uw) // 2, y), url, fill=DEEP_MAROON, font=f_url)
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
