"""
Add curved borders and white border to an image
Requires: pip install pillow
"""

from PIL import Image, ImageDraw, ImageOps
import os

def add_curved_border(input_path, output_path, border_width=10, corner_radius=20, border_color=(255, 255, 255, 255)):
    """
    Add a white curved border to an image
    
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
    
    # Calculate new dimensions with border
    new_width = img.width + (2 * border_width)
    new_height = img.height + (2 * border_width)
    
    # Create a new image with border space
    bordered_img = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    
    # Create rounded rectangle mask for the border
    border_mask = Image.new('L', (new_width, new_height), 0)
    border_draw = ImageDraw.Draw(border_mask)
    
    # Draw the border (outer rounded rectangle)
    border_draw.rounded_rectangle(
        [(0, 0), (new_width - 1, new_height - 1)],
        radius=corner_radius + border_width,
        fill=255
    )
    
    # Create the inner mask (for the image area)
    inner_mask = Image.new('L', (new_width, new_height), 0)
    inner_draw = ImageDraw.Draw(inner_mask)
    
    # Draw the inner area (where the original image will go)
    inner_draw.rounded_rectangle(
        [(border_width, border_width), (new_width - border_width - 1, new_height - border_width - 1)],
        radius=corner_radius,
        fill=255
    )
    
    # Create border by subtracting inner from border mask
    border_only = Image.new('L', (new_width, new_height), 0)
    for x in range(new_width):
        for y in range(new_height):
            border_pixel = border_mask.getpixel((x, y))
            inner_pixel = inner_mask.getpixel((x, y))
            if border_pixel > 0 and inner_pixel == 0:
                border_only.putpixel((x, y), 255)
    
    # Create the final image
    result = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
    
    # Add the white border
    border_color_img = Image.new('RGBA', (new_width, new_height), border_color)
    result.paste(border_color_img, (0, 0), border_only)
    
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
    print(f"Created bordered image: {output_path}")
    print(f"Original size: {img.width}x{img.height}")
    print(f"New size: {new_width}x{new_height}")
    print(f"Border width: {border_width}px")
    print(f"Corner radius: {corner_radius}px")

def main():
    # Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_path = os.path.join(base_dir, 'public', 'tomo-image.png')
    output_path = os.path.join(base_dir, 'public', 'tomo-image.png')
    
    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        return
    
    # Add curved border with white color
    add_curved_border(
        input_path=input_path,
        output_path=output_path,
        border_width=15,  # 15px white border
        corner_radius=25, # Nicely curved corners
        border_color=(255, 255, 255, 255)  # White border
    )

if __name__ == "__main__":
    main()