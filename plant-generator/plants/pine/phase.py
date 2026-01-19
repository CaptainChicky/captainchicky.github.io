import cv2
import numpy as np
import os
import matplotlib.pyplot as plt

# ============================================================
# 0. Load image
# ============================================================
script_dir = os.path.dirname(os.path.realpath(__file__))
image_path = os.path.join(script_dir, "t.png")

img = cv2.imread(image_path)
if img is None:
    raise FileNotFoundError(image_path)

img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = img.astype(np.float32) / 255.0
H, W, C = img.shape

# ============================================================
# SECTION 1 - FFT PHASE DRIFT (no convolution)
# ============================================================
def phase_drift(image, severity=0.07):
    """
    Controlled FFT phase drift per channel.
    severity: float ~0-0.1 for subtle effects
    """
    H, W, C = image.shape
    out = np.zeros_like(image)

    # radius for scaling drift
    y, x = np.meshgrid(
        np.linspace(-1, 1, H),
        np.linspace(-1, 1, W),
        indexing="ij"
    )
    radius = np.sqrt(x**2 + y**2)

    for c in range(C):
        F = np.fft.fft2(image[..., c])
        mag = np.abs(F)
        phase = np.angle(F)

        # subtle phase drift with random per-channel noise
        drift = radius * np.random.randn(H, W) * severity
        phase_new = phase + drift

        F_new = mag * np.exp(1j * phase_new)
        out[..., c] = np.real(np.fft.ifft2(F_new))

    # normalize each channel separately to prevent one channel dominating
    for c in range(C):
        channel = out[..., c]
        out[..., c] = (channel - channel.min()) / (channel.max() - channel.min() + 1e-8)

    return out

section1 = phase_drift(img)

# ============================================================
# SECTION 2 - CHAOTIC INTENSITY FEEDBACK
# ============================================================
def chaotic_feedback(image, severity=6, iterations=3):
    r = 3.7 + 0.03 * severity
    out = image.copy()

    for _ in range(iterations):
        out = r * out * (1.0 - out)

    out -= out.min()
    out /= out.max() + 1e-6
    return out

section2 = chaotic_feedback(section1)

# ============================================================
# Save output
# ============================================================
def save(img, name):
    out = (img * 255).astype(np.uint8)
    out = cv2.cvtColor(out, cv2.COLOR_RGB2BGR)
    cv2.imwrite(os.path.join(script_dir, name), out)

save(section2, "final.png")

# ============================================================
# Display
# ============================================================
plt.figure(figsize=(12,5))

plt.subplot(1,3,1)
plt.title("Original")
plt.imshow(img)
plt.axis("off")

plt.subplot(1,3,2)
plt.title("Phase Drift")
plt.imshow(section1)
plt.axis("off")

plt.subplot(1,3,3)
plt.title("Phase + Chaos")
plt.imshow(section2)
plt.axis("off")

plt.tight_layout()
plt.show()