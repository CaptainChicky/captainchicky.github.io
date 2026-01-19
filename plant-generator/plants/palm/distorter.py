import cv2
import numpy as np
import matplotlib.pyplot as plt
import os

# ============================================================
# 0. Load image (RGB)
# ============================================================
script_dir = os.path.dirname(os.path.realpath(__file__))
image_path = os.path.join(script_dir, "t.png")

img = cv2.imread(image_path)
if img is None:
    raise FileNotFoundError(image_path)

img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img_f = img.astype(np.float32) / 255.0
H, W = img.shape[:2]

# ============================================================
# SECTION 1 - CHANNEL MISALIGNMENT (uncanny color drift)
# ============================================================
def channel_shift(image, severity=7):
    """
    severity: int from 1 (subtle) to 9 (extreme)
    """
    severity = np.clip(severity, 1, 9)

    # Maximum pixel shift at severity 9
    max_shift = 3 + severity * 4   # → range roughly 7–39 px

    # Deterministic but asymmetric shifts
    shift_r = ( max_shift, -max_shift // 2)
    shift_g = (-max_shift // 3,  max_shift)
    shift_b = ( max_shift // 2,  max_shift // 3)

    out = np.zeros_like(image)
    out[..., 0] = np.roll(image[..., 0], shift_r, axis=(0, 1))
    out[..., 1] = np.roll(image[..., 1], shift_g, axis=(0, 1))
    out[..., 2] = np.roll(image[..., 2], shift_b, axis=(0, 1))

    return out

section1 = channel_shift(img_f)

# ============================================================
# SECTION 2 - NONLINEAR WARP (organic deformation)
# ============================================================
y, x = np.meshgrid(np.arange(H), np.arange(W), indexing="ij")

warp_x = x + 20 * np.sin(y / 30.0) + 10 * np.sin(x / 80.0)
warp_y = y + 20 * np.sin(x / 40.0)

warp_x = np.clip(warp_x, 0, W-1).astype(np.float32)
warp_y = np.clip(warp_y, 0, H-1).astype(np.float32)

section2 = cv2.remap(section1, warp_x, warp_y, cv2.INTER_LINEAR)

# ============================================================
# SECTION 3 - EDGE GHOSTING (high-pass hallucination)
# ============================================================
gray = cv2.cvtColor((section2 * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
edges_small = cv2.Laplacian(gray, cv2.CV_32F)

blur = cv2.GaussianBlur(gray, (0,0), sigmaX=3)
edges_large = cv2.Laplacian(blur, cv2.CV_32F)

edges = edges_small + 0.6 * edges_large
edges = np.tanh(edges / 30.0)

ghost = section2 + 1.4 * np.stack([edges]*3, axis=2)
section3 = np.clip(ghost, 0, 1)

# ============================================================
# SECTION 4 - COLOR THRESHOLD (grotesque palette)
# ============================================================
section4 = section3.copy()

mask_dark = section4.mean(axis=2) < 0.35
mask_bright = section4.mean(axis=2) > 0.75

# Dark regions → purple / green shift
section4[mask_dark] = section4[mask_dark][..., ::-1] * [1.2, 0.4, 1.4]

section4 = np.clip(section4, 0, 1)

# ============================================================
# Save results
# ============================================================
def save(img, name):
    out = (img * 255).astype(np.uint8)
    out = cv2.cvtColor(out, cv2.COLOR_RGB2BGR)
    cv2.imwrite(os.path.join(script_dir, name), out)

save(section4, "final.png")

# ============================================================
# Display
# ============================================================
plt.figure(figsize=(16,10))
titles = [
    "Original",
    "1. Channel Drift",
    "2. Organic Warp",
    "3. Edge Ghosting",
    "4. Grotesque Palette"
]
images = [img_f, section1, section2, section3, section4]

for i, (t, im) in enumerate(zip(titles, images)):
    plt.subplot(2,3,i+1)
    plt.title(t)
    plt.imshow(im)
    plt.axis("off")

plt.tight_layout()
plt.show()