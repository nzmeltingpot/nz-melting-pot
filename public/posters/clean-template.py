"""
One-off helper: produce poster-template-clean.png from poster-original.png
by carefully masking the central text column with cream so the
decorations/logo remain but the body text is gone. Then the main
generator can overlay fresh copy onto this clean template.
"""
from PIL import Image, ImageDraw
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "poster-original.png")
OUT = os.path.join(HERE, "poster-template-clean.png")
CREAM = (254, 244, 235)

img = Image.open(SRC).convert("RGB")
W, H = img.size  # 1024, 1536
d = ImageDraw.Draw(img)

# Aggressive central-column mask (everywhere text lives) but leave the
# corner decorations and logo untouched.
# Logo region (top-left) = ~(40, 20) -> (260, 220)  — KEEP
# Top-right decorations    = ~(720, 0)  -> (1024, 300) — KEEP
# Middle-right decorations = ~(760, 530)-> (1024, 980) — KEEP
# Bottom-left decorations  = ~(0, 1180) -> (300, 1536) — KEEP
# Bottom-right decorations = ~(540, 1180)-> (1024, 1536) — KEEP

# 1. Header strip just to the right of the logo: where "NZ MELTING POT
#    PRESENTS THE" lives. Stop before the top-right decoration at x≈720.
d.rectangle((270, 100, 720, 220), fill=CREAM)

# 2. Big text band from below the header to above the bottom decorations
#    (covers headline, date, paragraphs, bullets, etc.). Stop before
#    the right-side decoration at x≈720 (and middle-right at x≈760 from
#    y=530+).
d.rectangle((30, 230, 720, 530), fill=CREAM)        # headline + date
d.rectangle((30, 530, 760, 1180), fill=CREAM)       # paragraphs/bullets

# 3. Bottom centre band (URL, gates, address, sponsor). The bottom
#    decorations sit BELOW this band so they remain complete shapes.
d.rectangle((150, 1180, 870, 1310), fill=CREAM)

img.save(OUT, "PNG", optimize=True)
print(f"Saved clean template to {OUT}")
