import cv2
import numpy as np
import os
import matplotlib.pyplot as plt

# ============================================================
# Load image
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
# SECTION 4a - Improved Nonlinear Cellular Automata
# ============================================================
def nonlinear_cellular_automata(image, steps=28, alpha=0.4, beta=0.09, freq=85.0):
    """
    Each pixel updates based on neighbors using nonlinear functions
    to create colorful, grotesque distortions.
    """
    out = image.copy()
    for _ in range(steps):
        padded = np.pad(out, ((1,1),(1,1),(0,0)), mode='reflect')
        new = out.copy()
        for c in range(3):
            # sum of neighbors
            neighbors = (
                padded[:-2,:-2,c] + padded[:-2,1:-1,c] + padded[:-2,2:,c] +
                padded[1:-1,:-2,c] +                 padded[1:-1,2:,c] +
                padded[2:,:-2,c] + padded[2:,1:-1,c] + padded[2:,2:,c]
            ) / 8.0

            diff = neighbors - out[...,c]

            # nonlinear CA update
            new[...,c] += alpha * np.tanh(3 * diff)
            new[...,c] += beta * np.sin(neighbors * freq)
        out = np.clip(new, 0, 1)
    return out

section4a = nonlinear_cellular_automata(img)

# ============================================================
# SECTION 4b - Creepy Block Distortion
# ============================================================
def creepy_block_distortion(image, severity=7, block_size=128):
    """
    Apply block-based creepy distortions.
    severity: 0-9 scale, controls max offset and rotation
    """
    H, W, C = image.shape
    out = image.copy()

    # Map severity 0-9 -> offset in pixels and rotation in degrees
    max_offset = int(severity * 2)  # max pixel shift
    max_rot = severity * 2           # max rotation per block

    # Ensure block size divides image roughly
    step_y = block_size
    step_x = block_size

    for y in range(0, H, step_y):
        for x in range(0, W, step_x):
            # Extract block
            y_end = min(y + step_y, H)
            x_end = min(x + step_x, W)
            block = out[y:y_end, x:x_end, :].copy()

            # Random pixel shift
            shift_y = np.random.randint(-max_offset, max_offset + 1)
            shift_x = np.random.randint(-max_offset, max_offset + 1)

            # Random rotation angle
            angle = np.random.uniform(-max_rot, max_rot)

            # Create rotation matrix around block center
            center = ((x_end - x)/2, (y_end - y)/2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)

            # Apply rotation
            block_rot = cv2.warpAffine(block, M, (x_end - x, y_end - y), borderMode=cv2.BORDER_REFLECT)

            # Place block back with offset (clipped)
            y_start = np.clip(y + shift_y, 0, H - (y_end - y))
            x_start = np.clip(x + shift_x, 0, W - (x_end - x))
            out[y_start:y_start + (y_end - y), x_start:x_start + (x_end - x), :] = block_rot

    return np.clip(out, 0, 1)

section4b = creepy_block_distortion(section4a)

# ============================================================
# Save & Display
# ============================================================
def save(img, name):
    out = (img*255).astype(np.uint8)
    out = cv2.cvtColor(out, cv2.COLOR_RGB2BGR)
    cv2.imwrite(os.path.join(script_dir, name), out)

save(section4b, "final.png")

plt.figure(figsize=(15,5))
plt.subplot(1,3,1)
plt.title("Original")
plt.imshow(img)
plt.axis("off")

plt.subplot(1,3,2)
plt.title("Nonlinear Cellular Automata")
plt.imshow(section4a)
plt.axis("off")

plt.subplot(1,3,3)
plt.title("After Warp + Color Flow")
plt.imshow(section4b)
plt.axis("off")
plt.show()