from PIL import Image
import os

def strip_metadata(input_path, output_path):
    try:
        # Open the image
        img = Image.open(input_path)
        
        print(f"\n📋 Original image metadata:")
        if img.info:
            for key, value in img.info.items():
                # Truncate long values for readability
                value_str = str(value)
                if len(value_str) > 100:
                    value_str = value_str[:100] + "..."
                print(f"   {key}: {value_str}")
        else:
            print("   (no metadata found by PIL)")
        
        # Get the image data (preserving pixel values)
        data = list(img.getdata())
        
        # Create a new image without any metadata
        clean_img = Image.new(img.mode, img.size)
        
        # For palette mode images, copy the palette and transparency
        if img.mode == 'P':
            clean_img.putpalette(img.getpalette())
            # Preserve transparency information
            if 'transparency' in img.info:
                clean_img.info['transparency'] = img.info['transparency']
        
        clean_img.putdata(data)
        
        # Determine save parameters based on output format
        output_ext = os.path.splitext(output_path)[1].lower()
        
        # Save with explicit parameters to ensure no metadata
        if output_ext in ['.jpg', '.jpeg']:
            # Convert RGBA/LA/P to RGB for JPEG
            if clean_img.mode in ('RGBA', 'LA', 'P'):
                clean_img = clean_img.convert('RGB')
            clean_img.save(output_path, 'JPEG', quality=95, optimize=True, exif=b"")
        elif output_ext == '.png':
            # For PNG, preserve transparency
            if clean_img.mode == 'P' and 'transparency' in clean_img.info:
                clean_img.save(output_path, 'PNG', optimize=True, transparency=clean_img.info['transparency'])
            else:
                clean_img.save(output_path, 'PNG', optimize=True)
        elif output_ext == '.webp':
            clean_img.save(output_path, 'WEBP', quality=95, exif=b"")
        else:
            # For other formats, save normally
            clean_img.save(output_path)
        
        # Verify the cleaned image
        verify_img = Image.open(output_path)
        print(f"\n✓ Saved clean image to {output_path}")
        print(f"  Mode: {verify_img.mode}, Size: {verify_img.size}")
        
        print(f"\n📋 Cleaned image metadata:")
        if verify_img.info:
            for key, value in verify_img.info.items():
                value_str = str(value)
                if len(value_str) > 100:
                    value_str = value_str[:100] + "..."
                print(f"   {key}: {value_str}")
            print("\n⚠️  Warning: Some metadata still present!")
        else:
            print("   (no metadata found by PIL)")
            print("\n✓ All PIL-readable metadata successfully removed!")
        
    except Exception as e:
        print(f"✗ Error processing {input_path}: {e}")
        return False
    
    return True

if __name__ == '__main__':
    # ========================================
    # CONFIGURE YOUR IMAGES HERE
    # ========================================
    
    input_file = r"###"
    output_file = r"###"
    
    # ========================================
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"✗ Error: Input file '{input_file}' not found")
        print("Please update the 'input_file' variable in the script with the correct path.")
        exit(1)
    
    # Ensure output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
    
    strip_metadata(input_file, output_file)