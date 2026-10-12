"""Reuse the original crow's prepared arrival poses for a matched scroll exit.
The landing hold becomes the first pose; reversing the folding wings produces
an unfolding motion. No side-turn, floor contact, or temporal crossfade.
Run after prepare-flying-crow.py; requires numpy and imageio-ffmpeg.
"""
from pathlib import Path
import subprocess
import numpy as np
import imageio_ffmpeg

media = Path(__file__).resolve().parents[1] / 'public/media'
ff = imageio_ffmpeg.get_ffmpeg_exe()
raw = subprocess.check_output([ff, '-v', 'error', '-i',
    str(media / 'flying-crow-arrive-hd.mp4'), '-f', 'rawvideo',
    '-pix_fmt', 'rgb24', '-'])
frames = np.frombuffer(raw, np.uint8).reshape(-1, 960, 1920, 3)
# Remove the long landing hold, keep two matching frames before wings unfold.
sequence = [frames[-1], frames[-1], *frames[:-12][::-1]]
# Repeat the existing complete wingbeat, whose end joins the next start at
# adjacent source poses. More beats per scroll distance, without ghost blends.
sequence += list(frames[:14][::-1])
process = subprocess.Popen([ff, '-v', 'error', '-y', '-f', 'rawvideo',
    '-pix_fmt', 'rgb24', '-s', '1920x960', '-r', '30', '-i', '-', '-an',
    '-c:v', 'libx264', '-crf', '15', '-g', '1', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', str(media / 'crow-retreat-hd.mp4')], stdin=subprocess.PIPE)
for frame in sequence:
    process.stdin.write(frame.tobytes())
process.stdin.close()
if process.wait():
    raise RuntimeError('Retreat encoding failed')
print(f'Retreat: {len(sequence)} frames, {len(sequence)/30:.2f}s, native 960px')
