"""Derive native-resolution seamless sky and transparent wisps; no upscaling.
Run with Pillow and numpy installed. Retains the original licensed photograph.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

folder = Path(__file__).resolve().parents[1] / 'public/images'
source = Image.open(folder / 'cloud-ocean-source.jpg').convert('RGB')
# Keep the wispy upper sky that was approved, with only a distant cloud bank.
crop = source.crop((0, 1050, source.width, 2850))
rgb = np.asarray(crop).astype(np.float32)
overlap = 256
t = np.linspace(0, 1, overlap)[None, :, None]
t = t*t*(3-2*t)
seam = rgb[:, -overlap:]*(1-t) + rgb[:, :overlap]*t
tile = np.concatenate((rgb[:, overlap:-overlap], seam), axis=1)
panorama = Image.fromarray(np.uint8(tile))
# Mild local contrast followed by restrained fine sharpening; retain natural
# cloud softness and avoid invented resolution or aggressive bright outlines.
panorama = panorama.filter(ImageFilter.UnsharpMask(radius=12, percent=18, threshold=3))
panorama = panorama.filter(ImageFilter.UnsharpMask(radius=.8, percent=85, threshold=3))
panorama = ImageEnhance.Color(panorama).enhance(.88)
panorama.save(folder / 'cloud-horizon-crisp.webp', lossless=True, method=6)
# Extract a faint real photographic wisp, retaining soft natural edges. This
# layer is intentionally subtle: not a second opaque/doubled cloud horizon.
wisp = np.asarray(source.crop((0, 700, source.width, 1900))).astype(np.float32)
h, w = wisp.shape[:2]
y, x = np.mgrid[0:h, 0:w]
envelope = np.sin(np.pi*x/(w-1))**2 * np.sin(np.pi*y/(h-1))**2
alpha = np.clip((wisp.min(axis=2)-105)/130, 0, 1)*envelope*.24
rgba = np.dstack((np.full_like(wisp, 247), alpha*255)).astype(np.uint8)
Image.fromarray(rgba).save(folder / 'cloud-wisp.webp', quality=94, method=6)
print(f'Panorama: {tile.shape[1]}x{tile.shape[0]}; transparent wisp: {w}x{h}; no upscale')
