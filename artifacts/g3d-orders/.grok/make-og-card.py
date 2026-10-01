#!/usr/bin/env python3
"""Brand-forward 1200x630 share card for G3D Orders — geometric lattice studio."""
from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT_PNG = Path("/workspace/.grok/og-card-2x.png")
W, H = 2400, 1260  # exact 1200x630 at 2x

PAPER = (244, 241, 234)
INK = (26, 24, 20)
COPPER = (184, 92, 56)
COPPER_LT = (206, 138, 108)
COPPER_DK = (122, 58, 36)
STONE = (138, 132, 122)

FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"


def gyroid_field(w: int, h: int) -> np.ndarray:
    # Slightly oblique lattice so it reads as TPMS, not a grid.
    xs = np.linspace(0, 10.5 * math.pi, w, dtype=np.float32)
    ys = np.linspace(0, 5.5 * math.pi, h, dtype=np.float32)
    x, y = np.meshgrid(xs, ys)
    z = np.float32(0.85)
    g = np.sin(x) * np.cos(y) + np.sin(y) * np.cos(z) + np.sin(z) * np.cos(x)
    # Second harmonic, shifted — denser gyroid walls.
    x2, y2 = x * 0.55 + 0.7, y * 0.55 + 1.1
    g2 = np.sin(x2) * np.cos(y2) + np.sin(y2) * np.cos(z) + np.sin(z) * np.cos(x2)
    strut = np.exp(-(g ** 2) / 0.055) * 0.72 + np.exp(-(g2 ** 2) / 0.08) * 0.28
    return np.clip(strut, 0, 1)


def paper_ground() -> Image.Image:
    strut = gyroid_field(W, H)
    paper = np.array(PAPER, dtype=np.float32)
    copper = np.array(COPPER, dtype=np.float32)
    stone = np.array(STONE, dtype=np.float32)
    # Copper lattice over paper, stone in the voids — warm, quiet.
    rgb = paper * (1 - strut[..., None] * 0.34) + copper * (strut[..., None] * 0.28)
    rgb += (1 - strut[..., None]) * (stone - paper) * 0.04
    # Soft vignette toward the edges so the lockup sits on quieter paper.
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx = (xx - W / 2) / (W * 0.62)
    ny = (yy - H / 2) / (H * 0.70)
    r2 = nx * nx + ny * ny
    veil = np.clip(0.18 * np.maximum(r2 - 0.35, 0), 0, 0.22)
    rgb = rgb * (1 - veil[..., None]) + paper * veil[..., None]
    rng = np.random.RandomState(7)
    grain = rng.randn(H, W, 1).astype(np.float32) * 3.2
    rgb = np.clip(rgb + grain, 0, 255).astype(np.uint8)
    return Image.fromarray(rgb, "RGB")


def _pt(cx, cy, s, *axes):
    x, y = cx, cy
    U = (s, s * 0.5)
    V = (-s, s * 0.5)
    Wd = (0, s * 1.12)
    vecs = {"U": U, "V": V, "W": Wd}
    for a in axes:
        dx, dy = vecs[a]
        x += dx
        y += dy
    return (x, y)


def draw_iso_cube(draw: ImageDraw.ImageDraw, cx, cy, s, hatch=True):
    O = (cx, cy)
    top = [_pt(cx, cy, s), _pt(cx, cy, s, "U"), _pt(cx, cy, s, "U", "V"), _pt(cx, cy, s, "V")]
    left = [_pt(cx, cy, s, "V"), _pt(cx, cy, s, "U", "V"), _pt(cx, cy, s, "U", "V", "W"), _pt(cx, cy, s, "V", "W")]
    right = [_pt(cx, cy, s, "U"), _pt(cx, cy, s, "U", "V"), _pt(cx, cy, s, "U", "V", "W"), _pt(cx, cy, s, "U", "W")]
    draw.polygon(top, fill=COPPER_LT)
    draw.polygon(left, fill=COPPER_DK)
    draw.polygon(right, fill=COPPER)
    # Lattice struts on the facing (right) wall — reads as TPMS infill.
    if hatch:
        mask = Image.new("L", (W, H), 0)
        md = ImageDraw.Draw(mask)
        md.polygon(right, fill=255)
        lines = Image.new("L", (W, H), 0)
        ld = ImageDraw.Draw(lines)
        x0 = min(p[0] for p in right) - s
        x1 = max(p[0] for p in right) + s
        y0 = min(p[1] for p in right) - s
        y1 = max(p[1] for p in right) + s
        step = max(10, int(s * 0.18))
        for i, t in enumerate(range(int(x0 - (y1 - y0)), int(x1 + (y1 - y0)), step)):
            ld.line([(t, y0), (t + (y1 - y0) * 0.55, y1)], fill=255, width=max(2, int(s * 0.035)))
        hatch_l = ImageChops_and(lines, mask)
        # Composite a slightly lighter copper hatch via overlay on a temp — draw as paper-thin lines.
        overlay = Image.new("RGB", (W, H), PAPER)
        # We'll paste later; return overlay+mask instead. For simplicity, draw darker lines into draw.
        # Darken struts on the right face:
        ink_l = Image.new("L", (W, H), 0)
        # reuse hatch
        pass
    # Crisp edges
    draw.line(top + [top[0]], fill=INK, width=3)
    draw.line(left + [left[0]], fill=INK, width=3)
    draw.line(right + [right[0]], fill=INK, width=3)
    if hatch:
        # Draw hatch clipped by intersecting the face: simple lines inside bbox, then
        # only those that a point-in-polygon would keep — use the mask via Image.composite below.
        return mask, lines
    return None, None


def ImageChops_and(a: Image.Image, b: Image.Image) -> Image.Image:
    from PIL import ImageChops
    return ImageChops.multiply(a, b)


def paste_cube(base: Image.Image, cx, cy, s, hatch=True):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    top = [_pt(cx, cy, s), _pt(cx, cy, s, "U"), _pt(cx, cy, s, "U", "V"), _pt(cx, cy, s, "V")]
    left = [_pt(cx, cy, s, "V"), _pt(cx, cy, s, "U", "V"), _pt(cx, cy, s, "U", "V", "W"), _pt(cx, cy, s, "V", "W")]
    right = [_pt(cx, cy, s, "U"), _pt(cx, cy, s, "U", "V"), _pt(cx, cy, s, "U", "V", "W"), _pt(cx, cy, s, "U", "W")]
    d.polygon(top, fill=(*COPPER_LT, 255))
    d.polygon(left, fill=(*COPPER_DK, 255))
    d.polygon(right, fill=(*COPPER, 255))
    if hatch:
        mask = Image.new("L", (W, H), 0)
        md = ImageDraw.Draw(mask)
        md.polygon(right, fill=255)
        lines = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(lines)
        x0 = min(p[0] for p in right)
        x1 = max(p[0] for p in right)
        y0 = min(p[1] for p in right)
        y1 = max(p[1] for p in right)
        step = max(8, int(s * 0.16))
        for t in range(int(x0 - (y1 - y0)), int(x1 + 4), step):
            ld.line(
                [(t, y0 - 4), (t + (y1 - y0) * 0.9, y1 + 4)],
                fill=(244, 241, 234, 70),
                width=max(2, int(s * 0.04)),
            )
        lines.putalpha(ImageChops_and(lines.split()[-1], mask))
        layer = Image.alpha_composite(layer, lines)
    # Edge lines
    d = ImageDraw.Draw(layer)
    d.line(top + [top[0]], fill=(*INK, 180), width=3)
    d.line(left + [left[0]], fill=(*INK, 160), width=3)
    d.line(right + [right[0]], fill=(*INK, 160), width=3)
    # Soft contact shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sx0, sy0 = _pt(cx, cy, s, "V", "W")
    sx1, sy1 = _pt(cx, cy, s, "U", "W")
    sx2, sy2 = _pt(cx, cy, s, "U", "V", "W")
    midy = max(sy0, sy1, sy2) + s * 0.12
    sd.ellipse(
        [cx - s * 1.15, midy - s * 0.18, cx + s * 1.15, midy + s * 0.28],
        fill=(26, 24, 20, 48),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=s * 0.12))
    base.alpha_composite(shadow)
    base.alpha_composite(layer)


def draw_centered_text(draw, text, font, y, fill, tracking=0):
    if tracking == 0:
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        x = (W - tw) / 2 - bbox[0]
        draw.text((x, y), text, font=font, fill=fill)
        return x, tw, bbox[3] - bbox[1]
    # Manual tracking
    widths = []
    for ch in text:
        bb = draw.textbbox((0, 0), ch, font=font)
        widths.append(bb[2] - bb[0])
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2
    for ch, ww in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += ww + tracking
    bb = draw.textbbox((0, 0), "Hg", font=font)
    return (W - total) / 2, total, bb[3] - bb[1]


def main():
    rgb = paper_ground()
    canvas = rgb.convert("RGBA")

    # Flanking lattice cubes — studio still-life, well clear of the centered lockup.
    paste_cube(canvas, 280, 420, 160, hatch=True)
    paste_cube(canvas, 470, 680, 84, hatch=True)
    paste_cube(canvas, 2120, 390, 144, hatch=True)
    paste_cube(canvas, 1940, 690, 80, hatch=True)

    draw = ImageDraw.Draw(canvas)
    font_g = ImageFont.truetype(FONT_BOLD, 268)
    font_o = ImageFont.truetype(FONT_BOLD, 88)
    font_tag = ImageFont.truetype(FONT_REG, 34)
    font_meta = ImageFont.truetype(FONT_REG, 24)

    # Vertical lockup, dead center, title occupying the middle half of the frame.
    title_y = 418
    x, tw, th = draw_centered_text(draw, "G3D", font_g, title_y, INK, tracking=22)
    rule_y = title_y + th + 24
    rw = 112
    draw.rectangle([(W - rw) / 2, rule_y, (W + rw) / 2, rule_y + 6], fill=COPPER)
    orders_y = rule_y + 32
    draw_centered_text(draw, "ORDERS", font_o, orders_y, INK, tracking=32)
    tag_y = orders_y + 128
    draw_centered_text(draw, "product studio  ·  order desk", font_tag, tag_y, COPPER, tracking=4)
    meta_y = tag_y + 64
    draw_centered_text(draw, "LATTICE   TPMS   SQUISH", font_meta, meta_y, STONE, tracking=10)

    out = canvas.convert("RGB").resize((1200, 630), Image.Resampling.LANCZOS)
    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT_PNG, "PNG")
    print("wrote", OUT_PNG, out.size)


if __name__ == "__main__":
    main()
