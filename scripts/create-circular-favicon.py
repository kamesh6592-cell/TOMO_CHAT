"""
Create circular favicon from logo image
Requires: pip install pillow
"""

from PIL import Image, ImageDraw, ImageOps
import os

def create_circular_image(input_path, output_path, size):
    """Create a circular cropped image"""
    # Open the image
    img = Image.open(input_path)
    
    # Convert to RGBA if not already
    img = img.convert('RGBA')
    
    # Create a square image (taking the smaller dimension)
    min_dim = min(img.size)
    left = (img.width - min_dim) // 2
    top = (img.height - min_dim) // 2
    right = left + min_dim
    bottom = top + min_dim
    img = img.crop((left, top, right, bottom))
    
    # Resize to target size
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Create circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    # Apply mask
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Save
    output.save(output_path, 'PNG')
    print(f"Created {output_path}")

def main():
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_logo = os.path.join(base_dir, 'public', 'aj-logo.jpg')
    
    # Create circular versions in different sizes
    sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'favicon-96x96.png': 96,
        'apple-touch-icon.png': 180,
        'web-app-manifest-192x192.png': 192,
        'web-app-manifest-512x512.png': 512,
    }
    
    for filename, size in sizes.items():
        output_path = os.path.join(base_dir, 'public', filename)
        create_circular_image(input_logo, output_path, size)
    
    # Also create icon.png for src/app
    icon_path = os.path.join(base_dir, 'src', 'app', 'icon.png')
    create_circular_image(input_logo, icon_path, 512)
    
    # Create favicon.ico
    favicon_path = os.path.join(base_dir, 'src', 'app', 'favicon.ico')
    create_circular_image(input_logo, favicon_path.replace('.ico', '-temp.png'), 32)
    
    # Convert to ICO
    img = Image.open(favicon_path.replace('.ico', '-temp.png'))
    img.save(favicon_path, format='ICO', sizes=[(32, 32), (16, 16)])
    os.remove(favicon_path.replace('.ico', '-temp.png'))
    print(f"Created {favicon_path}")
    
    print("\n✅ All circular favicons created successfully!")

if __name__ == '__main__':
    main()
