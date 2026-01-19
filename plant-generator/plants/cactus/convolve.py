import cv2
import numpy as np
from scipy.signal import fftconvolve
import matplotlib.pyplot as plt
import os

# -------------------------
# 0. Paths relative to script
# -------------------------
script_dir = os.path.dirname(os.path.realpath(__file__))
image_path = os.path.join(script_dir, 'target_image.png')
kernel_path = os.path.join(script_dir, 'numeral7.png')

# -------------------------
# 1. Load images
# -------------------------
image_rgb = cv2.imread(image_path)
if image_rgb is None:
    raise FileNotFoundError(f"Could not load image: {image_path}")
image_rgb = cv2.cvtColor(image_rgb, cv2.COLOR_BGR2RGB)

kernel_rgb = cv2.imread(kernel_path)
if kernel_rgb is None:
    raise FileNotFoundError(f"Could not load kernel: {kernel_path}")
kernel_rgb = cv2.cvtColor(kernel_rgb, cv2.COLOR_BGR2RGB)

# -------------------------
# 2. Convert kernel to signed -1 to 1
# -------------------------
kernel_gray = cv2.cvtColor(kernel_rgb, cv2.COLOR_RGB2GRAY) / 255.0
kernel_signed = kernel_gray * 2 - 1

# -------------------------
# 3. Upscale kernel x10 using nearest neighbor
# -------------------------
scale_factor = 7
kH_new = kernel_signed.shape[0] * scale_factor
kW_new = kernel_signed.shape[1] * scale_factor
kernel_upscaled = cv2.resize(kernel_signed, (kW_new, kH_new), interpolation=cv2.INTER_NEAREST)

# -------------------------
# 4. Normalize image
# -------------------------
image_norm = image_rgb / 255.0
H, W, C = image_norm.shape
kH, kW = kernel_upscaled.shape

# -------------------------
# 5. FFT-based convolution per channel
# -------------------------
convolved_channels = []
for c in range(C):
    conv_c = fftconvolve(image_norm[:, :, c], kernel_upscaled, mode='valid')
    convolved_channels.append(conv_c)

convolved_rgb = np.stack(convolved_channels, axis=2)

# -------------------------
# 6. Function to normalize RGB for display
# -------------------------
def normalize_rgb(image, low=1, high=99):
    normalized = np.zeros_like(image)
    for c in range(3):
        channel = image[:, :, c]
        lo = np.percentile(channel, low)
        hi = np.percentile(channel, high)
        if hi > lo:
            channel = np.clip(channel, lo, hi)
            normalized[:, :, c] = (channel - lo) / (hi - lo)
    return normalized

#def normalize_rgb(image):
#    normalized = np.zeros_like(image)
#    for c in range(3):
#        channel = image[:, :, c]
#        min_val, max_val = channel.min(), channel.max()
#        if max_val - min_val > 0:
#            normalized[:, :, c] = (channel - min_val) / (max_val - min_val)
#    return normalized

# -------------------------
# 7. Display results
# -------------------------
plt.figure(figsize=(18,6))

plt.subplot(1,2,1)
plt.title("Original Image")
plt.imshow(image_rgb)
plt.axis('off')

plt.subplot(1,2,2)
plt.title("Convolved Output (RGB, normalized)")
plt.imshow(normalize_rgb(convolved_rgb))
plt.axis('off')

plt.show()

# -------------------------
# 8. Save result to disk
# -------------------------
output_rgb = normalize_rgb(convolved_rgb)

# Convert to uint8 [0,255]
output_uint8 = (output_rgb * 255).astype(np.uint8)

# Convert RGB -> BGR for OpenCV saving
output_bgr = cv2.cvtColor(output_uint8, cv2.COLOR_RGB2BGR)

output_path = os.path.join(script_dir, "convolved_output.png")
cv2.imwrite(output_path, output_bgr)

print(f"Saved convolved image to: {output_path}")