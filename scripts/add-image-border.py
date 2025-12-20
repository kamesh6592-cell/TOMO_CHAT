"""
Add curved borders and white border to an image
Requires: pip install pillow
"""

from PIL import Image, ImageDraw, ImageOps
import os

def add_curved_border(input_path, output_path, border_width=10, corner_radius=20, border_color=(255, 255, 255, 255)):
    """
    Add a white curved border to an image with perfect circular styling
    
    Args:
        input_path: Path to input image
        output_path: Path to save output image
        border_width: Width of the border in pixels
        corner_radius: Radius of the corner curves
        border_color: Color of the border (R, G, B, A)
    """
    # Open the image
    img = Image.open(input_path)
    
    # Convert to RGBA if not already
    img = img.convert('RGBA')
    
    # Make image square for better circular appearance
    size = min(img.width, img.height)
    left = (img.width - size) // 2
    top = (img.height - size) // 2
    img = img.crop((left, top, left + size, top + size))
    
    # Calculate new dimensions with border
    new_size = size + (2 * border_width)
    
    # Create a new image with border space
    bordered_img = Image.new('RGBA', (new_size, new_size), (0, 0, 0, 0))
    
    # Create rounded rectangle mask for the border
    border_mask = Image.new('L', (new_size, new_size), 0)
    border_draw = ImageDraw.Draw(border_mask)
    
    # Draw the border (outer rounded rectangle) - more circular
    border_draw.rounded_rectangle(
        [(0, 0), (new_size - 1, new_size - 1)],
        radius=corner_radius + border_width,
        fill=255
    )
    
    # Create the inner mask (for the image area)
    inner_mask = Image.new('L', (new_size, new_size), 0)
    inner_draw = ImageDraw.Draw(inner_mask)
    
    # Draw the inner area (where the original image will go) - perfectly circular
    inner_draw.rounded_rectangle(
        [(border_width, border_width), (new_size - border_width - 1, new_size - border_width - 1)],
        radius=corner_radius,
        fill=255
    )
    
    # Create border by subtracting inner from border mask
    border_only = Image.new('L', (new_size, new_size), 0)
    for x in range(new_size):
        for y in range(new_size):
            border_pixel = border_mask.getpixel((x, y))
            inner_pixel = inner_mask.getpixel((x, y))
            if border_pixel > 0 and inner_pixel == 0:
                border_only.putpixel((x, y), 255)
    
    # Create the final image
    result = Image.new('RGBA', (new_size, new_size), (0, 0, 0, 0))
    
    # Add the white border
    border_color_img = Image.new('RGBA', (new_size, new_size), border_color)
    result.paste(border_color_img, (0, 0), border_only)
    
    # Resize original image to fit the inner area perfectly
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Add the original image with rounded corners
    img_with_mask = Image.new('RGBA', img.size, (0, 0, 0, 0))
    img_mask = Image.new('L', img.size, 0)
    img_draw = ImageDraw.Draw(img_mask)
    img_draw.rounded_rectangle(
        [(0, 0), (img.width - 1, img.height - 1)],
        radius=corner_radius,
        fill=255
    )
    
    img_with_mask.paste(img, (0, 0), img_mask)
    result.paste(img_with_mask, (border_width, border_width), img_mask)
    
    # Save the result
    result.save(output_path, 'PNG')
    print(f"Created stylish bordered image: {output_path}")
    print(f"Made image square: {size}x{size}")
    print(f"Final size: {new_size}x{new_size}")
    print(f"Border width: {border_width}px (reduced for better fit)")
    print(f"Corner radius: {corner_radius}px (perfectly circular)")

def main():
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_path = os.path.join(base_dir, 'public', 'meowl.png')
    output_path = os.path.join(base_dir, 'public', 'meowl.png')
    
    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        return
    
    # Add curved border with mild white color (subtle and stylish)
    add_curved_border(
        input_path=input_path,
        output_path=output_path,
        border_width=5,  # Very thin border for subtle effect
        corner_radius=60, # Perfectly circular
        border_color=(255, 255, 255, 180)  # Mild white with transparency
    )

if __name__ == "__main__":
    main()