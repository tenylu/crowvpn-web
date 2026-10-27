"""Build the supplied white-background crow into RGB+matte MP4 and a PNG fallback.
Usage: python scripts/prepare-flying-crow.py INPUT.mp4
Dependencies: imageio-ffmpeg numpy pillow opencv-python-headless. Original input is never modified.
Only edge-connected white is removed, preserving enclosed white eyes.
"""
from pathlib import Path
import subprocess
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter
import imageio_ffmpeg

out = Path(__file__).resolve().parents[1] / "public/media"
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
size = 960  # Preserve the supplied video's native resolution; never downsample.
raw = subprocess.check_output([ffmpeg, "-v", "error", "-i", sys.argv[1],
    "-vf", f"fps=24,scale={size}:{size}", "-an", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
frames = np.frombuffer(raw, np.uint8).reshape(-1, size, size, 3)
packed = []
for index, frame in enumerate(frames):
    # Flood-fill is confined to the outside background, never the enclosed eyes.
    white = np.min(frame, axis=2) > 215
    region = Image.fromarray(np.where(white, 255, 0).astype(np.uint8)).copy()
    for seed in [(0, 0), (size-1, 0), (0, size-1), (size-1, size-1)]:
        ImageDraw.floodfill(region, seed, 128)
    matte = Image.fromarray(np.where(np.array(region) == 128, 0, 255).astype(np.uint8))
    matte = matte.filter(ImageFilter.GaussianBlur(.8))
    alpha = np.asarray(matte).astype(np.float32) / 255
    # Remove white contamination along the feathered silhouette edge.
    rgb = np.clip((frame.astype(np.float32) - (1-alpha[..., None])*255) / np.maximum(alpha[..., None], .01), 0, 255).astype(np.uint8)
    if index == 0:
        Image.fromarray(np.dstack((rgb, np.array(matte)))).save(out / "flying-crow-poster.png")
    packed.append(np.concatenate((rgb, np.repeat(np.array(matte)[..., None], 3, axis=2)), axis=1))

def encode(sequence, name, fps=24):
    process = subprocess.Popen([ffmpeg, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{size*2}x{size}", "-r", str(fps), "-i", "-", "-an", "-c:v", "libx264",
        "-crf", "15", "-g", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        str(out / name)], stdin=subprocess.PIPE)
    for frame in sequence:
        process.stdin.write(frame.tobytes())
    process.stdin.close()
    if process.wait():
        raise RuntimeError("MP4 encoding failed")

# Anchor the head/beak to an open-eyed resting pose. Track only facial features,
# never wings: similarity registration removes translation, rotation and scale
# breathing while preserving the original wing silhouettes (no frame blending).
reference = frames[12]
gray_ref = cv2.cvtColor(reference, cv2.COLOR_RGB2GRAY)
r, g, b = reference.astype(np.float32).transpose(2, 0, 1)
beak = ((r > g*1.25) & (g > b*1.3) & (r > 100)).astype(np.uint8)*255
face_mask = cv2.dilate(beak, np.ones((130, 130), np.uint8))
points = cv2.goodFeaturesToTrack(gray_ref, 100, .005, 6, mask=face_mask)
if points is None or len(points) < 6:
    raise RuntimeError("Not enough facial landmarks for body stabilization")
stable = []
transforms = []
errors = []
for source, frame in zip(frames, packed):
    gray = cv2.cvtColor(source, cv2.COLOR_RGB2GRAY)
    tracked, valid, _ = cv2.calcOpticalFlowPyrLK(gray_ref, gray, points, None,
        winSize=(31, 31), maxLevel=3)
    back, valid_back, _ = cv2.calcOpticalFlowPyrLK(gray, gray_ref, tracked, None,
        winSize=(31, 31), maxLevel=3)
    good = (valid[:, 0] == 1) & (valid_back[:, 0] == 1) & (np.linalg.norm(back-points, axis=2)[:, 0] < 2)
    if good.sum() < 6:
        raise RuntimeError("Unreliable facial tracking; refusing unstable frames")
    matrix, inliers = cv2.estimateAffinePartial2D(tracked[good], points[good],
        method=cv2.RANSAC, ransacReprojThreshold=3)
    if matrix is None:
        raise RuntimeError("Cannot stabilize crow pose")
    transforms.append(matrix)
    # Warp RGB and matte identically, with premultiplied colors at the edge.
    alpha = frame[:, size:].astype(np.float32)/255
    premult = frame[:, :size].astype(np.float32)*alpha
    mask = cv2.warpAffine(alpha, matrix, (size, size))
    color = cv2.warpAffine(premult, matrix, (size, size))/np.maximum(mask, .001)
    stable.append(np.clip(np.concatenate((color, mask*255), axis=1), 0, 255).astype(np.uint8))
    projected = cv2.transform(tracked[good], matrix)
    residual = np.linalg.norm(projected-points[good], axis=2)[:, 0]
    errors.append(float(np.median(residual[inliers[:, 0] == 1])))
print(f"Stabilized {len(stable)} poses; max median facial residual {max(errors):.2f}px at {size}px")

# Reverse only the flight segment, stopping before the second blink. The blink
# used below always runs forward. Slower final frames let the wings settle.
entrance = []
for i in range(45, 24, -1):
    if i >= 30:
        # Preserve the original flight's body movement, scale and tilt.
        entrance.append(packed[i])
        continue
    # Only ease into the resting anchor as the wings finish folding. This
    # avoids a sudden positional snap from natural flight to the fixed pose.
    t = (30-i)/5
    t = t*t*(3-2*t)
    identity = np.array([[1., 0., 0.], [0., 1., 0.]])
    matrix = identity*(1-t) + transforms[i]*t
    frame = packed[i]
    alpha = frame[:, size:].astype(np.float32)/255
    mask = cv2.warpAffine(alpha, matrix, (size, size))
    rgb = cv2.warpAffine(frame[:, :size].astype(np.float32)*alpha, matrix, (size, size))/np.maximum(mask, .001)
    entrance.append(np.clip(np.concatenate((rgb, mask*255), axis=1), 0, 255).astype(np.uint8))
# Flight runs at the original 24fps cadence. Only the final five folding poses
# are held twice to decelerate into contact instead of slowing every wingbeat.
entrance = [frame for index, frame in enumerate(entrance) for _ in range(1 if index < 16 else 2)]
# One extra down/up wingbeat before the approach folds the wings. End at 44
# so the following original frame 45 is adjacent, without a splice pose jump.
extra_beat = list(range(45, 37, -1)) + list(range(39, 45))
entrance = [packed[i] for i in extra_beat] + entrance
# Retain the exact landing pose instead of cutting to a different body frame.
# This guarantees a pixel-identical body at the entrance/rest boundary.
rest = stable[25]
eye_mask_image = Image.new("L", (size, size))
draw = ImageDraw.Draw(eye_mask_image)
draw.ellipse((396, 248, 520, 376), fill=255)
draw.ellipse((546, 298, 674, 434), fill=255)
eye_mask = np.asarray(eye_mask_image.filter(ImageFilter.GaussianBlur(6))).astype(np.float32)[..., None]/255
# Landing frame 25 still has partly lowered eyelids. Keep its body but restore
# the fully open resting eyes before holding that pose.
rest = np.concatenate(((rest[:, :size]*(1-eye_mask) + stable[12][:, :size]*eye_mask).astype(np.uint8), rest[:, size:]), axis=1)
entrance += [rest]*12
encode(entrance, "flying-crow-arrive-hd.mp4", fps=30)

# Lock the entire resting body. Only feathered eye patches change during a
# blink, eliminating scale/position jitter or wing movement while waiting.
blink = []
for i in range(2, 10):
    # This is a spatial mask, NOT temporal blending of adjacent poses.
    rgb = rest[:, :size]*(1-eye_mask) + stable[i][:, :size]*eye_mask
    blink.append(np.concatenate((rgb.astype(np.uint8), rest[:, size:]), axis=1))
# Unequal spacing avoids a metronomic expression: blinks every ~5 and ~6 sec.
idle = [rest]*112 + blink + [rest]*144 + blink
encode(idle, "flying-crow-rest-hd.mp4")
Image.fromarray(np.dstack((rest[:, :size], rest[:, size:, 0]))).save(out / "flying-crow-poster-hd.png")
print(f"Arrival: {len(entrance)/30:.2f}s once (+25% wing cadence); rest: {len(idle)/24:.2f}s loop; native 960px")
