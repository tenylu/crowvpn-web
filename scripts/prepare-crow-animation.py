"""Usage: python prepare-crow-animation.py INPUT.mp4
Build-time dependencies: imageio-ffmpeg, numpy, opencv-python-headless.
Fixed masks + a spatially matched, temporally smoothed feather surface replace
colour-thresholded per-frame inpainting. SVG eyes in the browser are the only moving eye geometry.
"""
from pathlib import Path
import subprocess
import sys
import cv2
import imageio_ffmpeg
import numpy as np

root = Path(__file__).resolve().parents[1]
out = root / 'public/media'
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
raw = subprocess.check_output([ffmpeg, '-v', 'error', '-i', sys.argv[1],
    '-vf', 'fps=24,crop=720:950:0:160', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-an', '-'])
frames = np.frombuffer(raw, np.uint8).reshape(-1, 950, 720, 3)
reference = frames[0].astype(np.float32)
yy, xx = np.mgrid[:950, :720]

# These masks are created ONCE. The previous per-frame orange/skin threshold
# changed with blue/yellow lighting and could let original eyelids leak through.
# The opaque core covers the entire original blink, with a wider feather outside.
left = ((xx-460)/36)**2 + ((yy-290)/32)**2
right = ((xx-534)/38)**2 + ((yy-302)/33)**2
core_distance = np.minimum(left, right)
alpha = np.clip((1.65-core_distance)/0.65, 0, 1).astype(np.float32)

# Use a FIXED set of feather samples around both eyes. A spatially varying
# quadratic illumination surface preserves the head's left/right shading, unlike
# the previous flat plate plus a single RGB offset sampled above the forehead.
# Neither the sample set nor the coverage mask depends on a frame's light colour.
orange = (reference[:,:,0] > reference[:,:,1]*1.22) & (reference[:,:,1] > reference[:,:,2]*1.25)
samples = (core_distance > 1.08) & (core_distance < 3.0) & (reference.max(axis=2) < 155) & ~orange
u, v = (xx-497)/100, (yy-290)/100
basis = np.stack([np.ones_like(u), u, v, u*u, u*v, v*v], axis=-1).astype(np.float32)
coefficients = np.stack([np.linalg.lstsq(basis[samples].astype(np.float64), frame[samples].astype(np.float64), rcond=None)[0] for frame in frames])
assert np.isfinite(coefficients).all(), "Invalid feather illumination coefficients"
# Five-frame smoothing removes codec noise without delaying visible TV colour
# changes enough to make the eye patch appear a different colour from the face.
kernel = np.hanning(5).astype(np.float32)
kernel /= kernel.sum()
padded = np.pad(coefficients, ((2,2),(0,0),(0,0)), mode='reflect')
coefficients = np.stack([sum(kernel[k]*padded[i+k] for k in range(5)) for i in range(len(frames))])
# Preserve the original beak and its anti-aliased contour, using a fixed mask.
# No baked-in eyes lie inside this reference beak mask.
alpha[orange] = 0
alpha = alpha*alpha*(3-2*alpha)  # smoothstep, zero slope at the feather edges
clean = []
y0,y1,x0,x1 = 240,350,410,590
blend = alpha[y0:y1,x0:x1,None]
patch_basis = basis[y0:y1,x0:x1]
for frame, coefficient in zip(frames, coefficients):
    result = frame.copy()
    patch = np.clip(patch_basis @ coefficient, 0, 255)
    result[y0:y1,x0:x1] = np.clip(frame[y0:y1,x0:x1]*(1-blend)+patch*blend, 0,255).astype(np.uint8)
    clean.append(result)

# The full eye core must contain only the smooth feather/light surface. This
# invariant catches source eyelids leaking through, without treating real
# spatial TV illumination changes as an error.
core = (core_distance[y0:y1,x0:x1] <= 1) & ~orange[y0:y1,x0:x1]
residual = max(float(np.max(np.abs((f[y0:y1,x0:x1].astype(np.float32)-np.clip(patch_basis @ coefficient,0,255))[core]))) for f,coefficient in zip(clean,coefficients))
assert residual < 1.01, f'Unexpected source eye texture: {residual}'

loop = clean + clean[-2:0:-1]
proc = subprocess.Popen([ffmpeg, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
    '-s', '720x950', '-r', '24', '-i', '-', '-an', '-c:v', 'libx264', '-crf', '17',
    '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    str(out / 'crow-light-blended.mp4')], stdin=subprocess.PIPE)
for frame in loop:
    proc.stdin.write(frame.tobytes())
proc.stdin.close()
if proc.wait() != 0:
    raise RuntimeError('Video encoding failed')
cv2.imwrite(str(out / 'crow-light-blended-poster.jpg'), cv2.cvtColor(clean[0], cv2.COLOR_RGB2BGR))
print(f'{len(loop)} frames, {len(loop)/24:.2f}s loop; spatially matched feather surface; residual={residual:.3f}/255')
