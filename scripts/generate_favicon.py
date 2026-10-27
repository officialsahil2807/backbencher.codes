import struct
import os

def create_svg():
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="backbencherGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFA217"/>
      <stop offset="50%" stop-color="#FF7900"/>
      <stop offset="100%" stop-color="#FF5200"/>
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#FF7900" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Base Rounded Squircle with Shadow -->
  <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#backbencherGrad)" filter="url(#subtleGlow)"/>

  <!-- Subtle Top Highlight / Gloss -->
  <rect x="5" y="5" width="54" height="26" rx="15" fill="white" fill-opacity="0.12"/>

  <!-- Code Brackets: < and > in Deep Charcoal (#0B0B0D) -->
  <path d="M25 21L15 32L25 43" stroke="#0B0B0D" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M39 21L49 32L39 43" stroke="#0B0B0D" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
'''
    return svg_content

def make_ico(width, height):
    # Palette / Colors
    trans = (0, 0, 0, 0)
    dark_text = (11, 11, 13, 255)       # #0B0B0D

    grid = [[trans for _ in range(width)] for _ in range(height)]

    # Draw rounded rect: x from 2 to width-3, y from 2 to height-3
    r = 6 if width == 32 else 3
    x_min, x_max = 2, width - 3
    y_min, y_max = 2, height - 3
    
    for y in range(y_min, y_max + 1):
        for x in range(x_min, x_max + 1):
            # check corners
            in_corner = False
            cx, cy = None, None
            if x < x_min + r and y < y_min + r:
                cx, cy = x_min + r, y_min + r
            elif x > x_max - r and y < y_min + r:
                cx, cy = x_max - r, y_min + r
            elif x < x_min + r and y > y_max - r:
                cx, cy = x_min + r, y_max - r
            elif x > x_max - r and y > y_max - r:
                cx, cy = x_max - r, y_max - r
            
            if cx is not None and cy is not None:
                dist_sq = (x - cx)**2 + (y - cy)**2
                if dist_sq > r**2:
                    continue

            # gradient from top to bottom
            t = (y - y_min) / float(y_max - y_min)
            red = 255
            green = int(160 - t * 75)
            blue = int(10 - t * 10)
            grid[y][x] = (red, green, blue, 255)

    if width == 32:
        # Left bracket '<': apex at (9, 16)
        # points along the upper arm (x, y): (14, 10), (13, 11), (12, 12), (11, 13), (10, 14), (9, 15), (9, 16)
        left_arm = [
            (14, 10), (13, 11), (12, 12), (11, 13), (10, 14), (9, 15), (9, 16),
            (9, 17), (10, 18), (11, 19), (12, 20), (13, 21), (14, 22)
        ]
        for px, py in left_arm:
            for dx in [0, 1]:
                grid[py][px + dx] = dark_text

        # Right bracket '>': apex at (22, 16)
        right_arm = [
            (17, 10), (18, 11), (19, 12), (20, 13), (21, 14), (22, 15), (22, 16),
            (22, 17), (21, 18), (20, 19), (19, 20), (18, 21), (17, 22)
        ]
        for px, py in right_arm:
            for dx in [0, 1]:
                grid[py][px + dx] = dark_text
    elif width == 16:
        # 16x16 simplified brackets
        left_arm = [(6, 5), (5, 6), (4, 7), (4, 8), (5, 9), (6, 10)]
        for px, py in left_arm:
            grid[py][px] = dark_text

        right_arm = [(9, 5), (10, 6), (11, 7), (11, 8), (10, 9), (9, 10)]
        for px, py in right_arm:
            grid[py][px] = dark_text

    # Build BMP pixel data (bottom-up: row height-1 down to 0)
    pixel_data = bytearray()
    and_mask = bytearray()
    for y in reversed(range(height)):
        mask_row = 0
        for x in range(width):
            r, g, b, a = grid[y][x]
            pixel_data.extend([b, g, r, a]) # BGRA format
            if a == 0:
                mask_row |= (1 << (7 - (x % 8)))
            if (x % 8) == 7 or x == width - 1:
                and_mask.append(mask_row)
                mask_row = 0
        # pad mask row to 32 bits (4 bytes)
        while len(and_mask) % 4 != 0:
            and_mask.append(0)

    # DIB Header (40 bytes)
    dib_header = struct.pack(
        '<IIIHHIIIIII',
        40, width, height * 2, 1, 32, 0, len(pixel_data) + len(and_mask), 0, 0, 0, 0
    )

    image_bytes = dib_header + pixel_data + and_mask
    return width, height, image_bytes

def write_multi_ico(filename, image_list):
    # ICO Header
    num_images = len(image_list)
    ico_header = struct.pack('<HHH', 0, 1, num_images)

    dir_entries = bytearray()
    offset = 6 + 16 * num_images

    for w, h, data in image_list:
        entry = struct.pack(
            '<BBBBHHII',
            w if w < 256 else 0,
            h if h < 256 else 0,
            0, 0, 1, 32, len(data), offset
        )
        dir_entries.extend(entry)
        offset += len(data)

    with open(filename, 'wb') as f:
        f.write(ico_header + dir_entries)
        for _, _, data in image_list:
            f.write(data)
    print(f"Generated {filename} ({os.path.getsize(filename)} bytes)")

if __name__ == '__main__':
    svg = create_svg()
    
    # 1. Write SVG to src/app/icon.svg and public/favicon.svg
    with open('src/app/icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg)
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg)
    with open('src/app/apple-icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg)
    print("Generated SVG icons")

    # 2. Generate multi-resolution ICO (16x16 and 32x32)
    img32 = make_ico(32, 32)
    img16 = make_ico(16, 16)
    write_multi_ico('src/app/favicon.ico', [img32, img16])
    write_multi_ico('public/favicon.ico', [img32, img16])
