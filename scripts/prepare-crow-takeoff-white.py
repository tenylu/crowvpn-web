"""Prepare 视频2.mp4 at native 960px: preserve eyes, remove white floor/shadow.
Usage: python scripts/prepare-crow-takeoff-white.py INPUT.mp4
Original media and the previous trial remain untouched.
"""
import subprocess
import sys
from pathlib import Path
import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image

out = Path(__file__).resolve().parents[1] / 'public/media'
ff = imageio_ffmpeg.get_ffmpeg_exe()
raw = subprocess.check_output([ff, '-v', 'error', '-i', sys.argv[1], '-vf',
    'fps=24,scale=960:960', '-an', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
frames = np.frombuffer(raw, np.uint8).reshape(-1, 960, 960, 3)
process = subprocess.Popen([ff, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt',
    'rgb24', '-s', '1920x960', '-r', '24', '-i', '-', '-an', '-c:v', 'libx264',
    '-crf', '15', '-g', '1', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    str(out / 'crow-takeoff-white.mp4')], stdin=subprocess.PIPE)
reference = np.asarray(Image.open(out / 'flying-crow-poster-hd.png'))[:, :, 3]
rx, ry, rw, rh = cv2.boundingRect((reference > 128).astype(np.uint8))
alignment = None
initial_bottom = None
foot_offset = 0
for index, rgb in enumerate(frames):
    # Dark plumage and saturated beak are distinct from the pale floor shadow.
    dark = rgb.min(axis=2) < 145
    count, labels, stats, _ = cv2.connectedComponentsWithStats(dark.astype(np.uint8))
    best = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = (labels == best).astype(np.uint8) * 255
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # Filling only enclosed holes retains the white eyeballs and specular light.
    cv2.drawContours(mask, contours, -1, 255, cv2.FILLED)
    x, y, w, h = cv2.boundingRect(mask)
    if alignment is None:
        scale = rh / h
        alignment = np.float32([[scale, 0, rx + rw/2 - scale*(x+w/2)],
                               [0, scale, ry + rh - scale*(y+h)]])
        initial_bottom = y+h
    matrix = alignment.copy()
    # Feet stay on the window ledge while turning/preparing; after 3.4 seconds
    # preserve the source jump. Never register the face or cancel wing/body motion.
    if index/24 < 3.4:
        foot_offset = matrix[1, 1] * (initial_bottom-y-h)
    # Reserve 90px of headroom for raised wings; the runtime offsets this
    # transparent padding so the perceived resting position stays unchanged.
    matrix[1, 2] += foot_offset + 90
    mask = cv2.GaussianBlur(mask, (3, 3), .6)
    alpha = mask.astype(np.float32)/255
    color = np.clip((rgb.astype(np.float32)-(1-alpha[..., None])*245)
                   / np.maximum(alpha[..., None], .01), 0, 255)
    # Premultiplied resampling prevents a white halo at the transparent border.
    matte = cv2.warpAffine(alpha, matrix, (960, 960))
    color = cv2.warpAffine(color*alpha[..., None], matrix, (960, 960))
    color = np.clip(color/np.maximum(matte[..., None], .001), 0, 255).astype(np.uint8)
    matte = np.clip(matte*255, 0, 255).astype(np.uint8)
    packed = np.concatenate((color, np.repeat(matte[..., None], 3, axis=2)), axis=1)
    process.stdin.write(packed.tobytes())
    if index in (0, 36, 72, 96, 120):
        rgba = Image.fromarray(np.dstack((color, matte)))
        bg = Image.new('RGBA', rgba.size, '#b8d4e6')
        bg.alpha_composite(rgba)
        bg.convert('RGB').save(out / f'crow-white-check-{index}.jpg')
process.stdin.close()
if process.wait():
    raise RuntimeError('Video encoding failed')
print(f'Prepared {len(frames)} native-resolution frames')
