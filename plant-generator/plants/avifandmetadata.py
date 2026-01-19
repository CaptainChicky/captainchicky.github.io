from pathlib import Path
from PIL import Image
import pillow_avif as _  # noqa: F401

OUTPUT_DIR_NAME = "avif_output"


def strip_and_save_avif(png_path: Path, output_dir: Path) -> Path:
    # Load original PNG
    img = Image.open(png_path)
    img.load()

    # Create a clean image from pixel data only
    clean = Image.new(img.mode, img.size)
    clean.putdata(list(img.getdata()))

    # Preserve ICC profile if present
    icc = img.info.get("icc_profile")

    # Prepare output path
    output_dir.mkdir(exist_ok=True)
    out_path = output_dir / (png_path.stem + ".avif")

    # Save lossless AVIF with ICC (if available) and strip other metadata
    clean.save(
        out_path,
        format="AVIF",
        lossless=True,
        icc_profile=icc,  # preserve color profile for correct display
        exif=None          # strip EXIF and other unnecessary metadata
    )

    # Reload saved AVIF to inspect info
    out_img = Image.open(out_path)
    out_img.load()

    # Collect all info Pillow exposes dynamically
    info_dict = dict(out_img.info)  # all keys Pillow sees
    if icc:
        info_dict["icc_profile"] = f"<{len(icc)} bytes>"

    # Check for animation keys (duration, loop)
    for key in ["duration", "loop", "timestamp"]:
        if key in out_img.info:
            info_dict[key] = out_img.info[key]

    return out_path, info_dict, out_img.size, out_img.mode


def main():
    script_dir = Path(__file__).parent
    png_files = sorted(script_dir.rglob("*.png"))

    if not png_files:
        print(f"No PNG files found in {script_dir}")
        return

    output_dir = script_dir / OUTPUT_DIR_NAME
    print(f"Converting {len(png_files)} PNG files to AVIF in '{OUTPUT_DIR_NAME}'...\n")

    for png_path in png_files:
        try:
            out_path, info, size, mode = strip_and_save_avif(png_path, output_dir)
            print(f"Processed: {png_path.name} -> {out_path.name}")
            print("  Metadata keys and values:")
            if not info:
                print("    <No metadata>")
            else:
                for k, v in info.items():
                    print(f"    {k}: {v}")
            print("  Size:", size)
            print("  Mode:", mode)
            print()
        except Exception as e:
            print(f"ERROR processing {png_path.name}: {e}\n")


if __name__ == "__main__":
    main()
