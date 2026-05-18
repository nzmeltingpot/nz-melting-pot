"""
NZ Melting Pot — Musical Talent Showcase 2026 poster generator (v10)

Uses the user-supplied poster-original.png AS-IS, with TWO surgical edits:
  1. "GATES OPEN AT 4.30PM" line replaced with "GATES OPEN AT TBA"
  2. A small "PROUDLY SUPPORTED BY • JR FINANCE — CREATE WEALTH" line
     added in a thin band just below the address (above the bottom
     border decorations).

All other content — decorations, headline, body copy, address, etc. —
is preserved exactly as the user designed.

Outputs four variants:
  1. talent-showcase-2026-poster.png            — main A4-ish portrait
  2. talent-showcase-2026-poster-print-A3.png   — upscaled for print
  3. talent-showcase-2026-poster-square.png     — Instagram feed
  4. talent-showcase-2026-poster-story.png      — Instagram/FB story
"""
from PIL import Image, ImageDraw, ImageFont
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(HERE, "poster-original.png")
FONTS = r"C:\Users\home\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\5aad43d3-476d-4e65-85a0-c82662019b12\4447626e-9fe3-4503-934b-3dd27bfeac5b\skills\canvas-design\canvas-fonts"

# Colours sampled from poster-original.png
CREAM = (254, 244, 235)
BLUE  = (35, 55, 130)
DARK  = (50, 48, 42)
MUTED = (110, 100, 90)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def apply_edits(img):
    """
    Two surgical edits on the original poster:
      • Replace 'GATES OPEN AT 4.30PM' with 'GATES OPEN AT TBA'
      • Add a one-line sponsor credit just below the address
    """
    W, H = img.size
    d = ImageDraw.Draw(img)

    # The original image is 1024 × 1536 — coordinates measured there.
    sx = W / 1024
    sy = H / 1536

    def Y(y): return int(y * sy)
    def X(x): return int(x * sx)
    def S(v): return int(v * sx)

    # --- 1. Gates line ---
    # Old text occupies y=1153-1174, x=216-581. Mask slightly larger.
    d.rectangle((X(190), Y(1145), X(620), Y(1184)), fill=CREAM)

    # Redraw with "TBA" in the same blue, similar weight + size.
    f_gate = font("BigShoulders-Bold.ttf", S(36))
    new_text = "GATES OPEN AT TBA"
    tw = d.textlength(new_text, font=f_gate)
    # Centre horizontally inside the masked box (matches original centring)
    x_pos = X(190) + (X(620) - X(190) - tw) // 2
    d.text((x_pos, Y(1148)), new_text, fill=BLUE, font=f_gate)

    # --- 2. Sponsor credit ---
    # Small bold line tucked just below "www.nzmeltingpot.com" and above
    # the "GATES OPEN" line. Centred under the URL text (URL text spans
    # x=241-571 in the original image; centre x≈406), not under the page
    # centre, so it sits visually beneath the URL rather than off to the
    # right of it.
    f_sp = font("WorkSans-Bold.ttf", S(15))
    sp_text = "PROUDLY SUPPORTED BY  •  JR FINANCE  —  CREATE WEALTH"
    sw = d.textlength(sp_text, font=f_sp)
    url_cx = X(406)
    sp_x = url_cx - sw // 2
    sp_y = Y(1124)
    pad_x = S(8)
    pad_y = S(3)
    text_h = S(19)
    d.rectangle(
        (sp_x - pad_x, sp_y - pad_y,
         sp_x + sw + pad_x, sp_y + text_h + pad_y),
        fill=CREAM,
    )
    d.text((sp_x, sp_y), sp_text, fill=DARK, font=f_sp)


def get_main_image():
    img = Image.open(SOURCE).convert("RGB")
    apply_edits(img)
    return img


def main():
    print("=" * 60)
    print("Generating poster variants (TBA + sponsor edits on original)")
    print("=" * 60)

    print("\n[1/4] Main A4-ish (1024 x 1536, 200 DPI)...")
    main_img = get_main_image()
    out = os.path.join(HERE, "talent-showcase-2026-poster.png")
    main_img.save(out, "PNG", dpi=(200, 200), optimize=True)
    print(f"  -> {out} ({os.path.getsize(out) // 1024} KB)")

    print("\n[2/4] A3 print (2480 x 3508, 300 DPI)...")
    a3 = Image.open(SOURCE).convert("RGB").resize((2480, 3508), Image.LANCZOS)
    apply_edits(a3)
    out = os.path.join(HERE, "talent-showcase-2026-poster-print-A3.png")
    a3.save(out, "PNG", dpi=(300, 300), optimize=True)
    print(f"  -> {out} ({os.path.getsize(out) // 1024} KB)")

    print("\n[3/4] Instagram square (1080 x 1080)...")
    bw, bh = main_img.size
    target = 1080
    scaled_h = int(bh * (target / bw))
    scaled = main_img.resize((target, scaled_h), Image.LANCZOS)
    sq = scaled.crop((0, 0, target, target))
    out = os.path.join(HERE, "talent-showcase-2026-poster-square.png")
    sq.save(out, "PNG", optimize=True)
    print(f"  -> {out} ({os.path.getsize(out) // 1024} KB)")

    print("\n[4/4] Instagram story (1080 x 1920)...")
    target_w, target_h = 1080, 1920
    base_ratio = bw / bh
    target_ratio = target_w / target_h
    if base_ratio > target_ratio:
        new_h = target_h
        new_w = int(bw * (new_h / bh))
        s = main_img.resize((new_w, new_h), Image.LANCZOS)
        x_off = (new_w - target_w) // 2
        story = s.crop((x_off, 0, x_off + target_w, target_h))
    else:
        new_w = target_w
        new_h = int(bh * (new_w / bw))
        s = main_img.resize((new_w, new_h), Image.LANCZOS)
        if new_h >= target_h:
            y_off = (new_h - target_h) // 2
            story = s.crop((0, y_off, target_w, y_off + target_h))
        else:
            story = Image.new("RGB", (target_w, target_h), CREAM)
            story.paste(s, (0, (target_h - new_h) // 2))
    out = os.path.join(HERE, "talent-showcase-2026-poster-story.png")
    story.save(out, "PNG", optimize=True)
    print(f"  -> {out} ({os.path.getsize(out) // 1024} KB)")

    print("\n" + "=" * 60)
    print("Done.")
    print("=" * 60)


if __name__ == "__main__":
    main()
