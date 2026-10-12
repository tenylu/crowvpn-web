"""Trial takeoff matte: remove blue backdrop/platform, retain enclosed eyes.
Usage: python scripts/prepare-crow-takeoff.py INPUT.mp4
Requires numpy, pillow, opencv-python-headless, imageio-ffmpeg.
"""
import sys
import subprocess
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
import imageio_ffmpeg

ff = imageio_ffmpeg.get_ffmpeg_exe()
out = Path(__file__).resolve().parents[1]/"public/media"
raw = subprocess.check_output([ff, "-v", "error", "-ss", "0.5", "-i", sys.argv[1], "-t", "3.0",
    "-vf", "fps=24,scale=960:960", "-an", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
frames = np.frombuffer(raw, np.uint8).reshape(-1, 960, 960, 3)
proc = subprocess.Popen([ff,"-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s","1920x960",
    "-r","24","-i","-","-an","-c:v","libx264","-crf","16","-g","1","-pix_fmt","yuv420p",
    "-movflags","+faststart",str(out/"crow-takeoff-trial.mp4")],stdin=subprocess.PIPE)
for index, rgb in enumerate(frames):
    signed = rgb.astype(np.int16)
    blue = (signed[:,:,2]-signed[:,:,0] > 12) & (signed[:,:,2] > signed[:,:,1])
    candidate = (~blue).astype(np.uint8)*255
    candidate[860:][rgb[860:].min(axis=2)>85] = 0
    candidate[:15] = 0
    candidate[:,:12] = 0
    candidate[:,-12:] = 0
    # The first frames have a dark gradient backdrop. Seed GrabCut with known
    # outer background and central body instead of mistaking black for alpha.
    small = cv2.resize(rgb,(480,480))
    gc = np.where(cv2.resize(candidate,(480,480))>128, cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)
    gc[:35]=cv2.GC_BGD
    gc[:,:30]=cv2.GC_BGD
    gc[:,-25:]=cv2.GC_BGD
    gc[-20:]=cv2.GC_BGD
    gc[170:350,210:300]=cv2.GC_FGD
    whites = ((small.min(axis=2)>170)&((small.max(axis=2).astype(int)-small.min(axis=2))<40)).astype(np.uint8)
    wn, wl, ws, wc = cv2.connectedComponentsWithStats(whites)
    for k in range(1,wn):
        x,y = wc[k]
        if 100<x<365 and 95<y<245 and 40<ws[k,cv2.CC_STAT_AREA]<2500:
            gc[cv2.dilate((wl==k).astype(np.uint8),np.ones((7,7),np.uint8))>0]=cv2.GC_FGD
    cv2.grabCut(small,gc,None,np.zeros((1,65)),np.zeros((1,65)),2,cv2.GC_INIT_WITH_MASK)
    candidate = cv2.resize(np.where((gc==1)|(gc==3),255,0).astype(np.uint8),(960,960),interpolation=cv2.INTER_NEAREST)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(candidate)
    best = 1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
    matte = (labels==best).astype(np.uint8)*255
    # Fill enclosed eye whites and highlights; do not color-key them away.
    contours,_ = cv2.findContours(matte,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(matte,contours,-1,255,cv2.FILLED)
    matte = cv2.morphologyEx(matte,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    matte = cv2.erode(matte,np.ones((3,3),np.uint8))
    matte = cv2.GaussianBlur(matte,(5,5),.85)
    # Suppress blue spill at the antialiased perimeter only.
    color = rgb.copy()
    edge = (matte>0)&(matte<250)
    color[:,:,2][edge] = np.minimum(color[:,:,2][edge],np.maximum(color[:,:,0][edge],color[:,:,1][edge]))
    # Match the existing perched asset's head/foot bounds before the page
    # applies its departure trajectory. No changing scale at the video handoff.
    align = np.float32([[1,0,-50],[0,1,-78]])
    color = cv2.warpAffine(color,align,(960,960))
    matte = cv2.warpAffine(matte,align,(960,960))
    packed = np.concatenate((color,np.repeat(matte[:,:,None],3,axis=2)),axis=1)
    proc.stdin.write(packed.tobytes())
    if index in (0,24,48,71):
        Image.fromarray(np.dstack((color,matte))).save(out/f"crow-takeoff-check-{index}.png")
proc.stdin.close()
assert proc.wait()==0
print(f"Prepared {len(frames)} frames, {len(frames)/24:.2f}s, all-intra MP4")
