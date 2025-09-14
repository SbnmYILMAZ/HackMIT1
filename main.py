import asyncio
import pygame
import math
import random

# Initialize pygame
pygame.init()

# Fullscreen dimensions
SCREEN_WIDTH = 1920
SCREEN_HEIGHT = 1080
EARTH_RADIUS = min(SCREEN_WIDTH, SCREEN_HEIGHT) // 4
EARTH_CENTER = (SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)

# Colors
BLACK = (0, 0, 0)
DEEP_BLUE = (0, 50, 100)
OCEAN_BLUE = (30, 144, 255)
LAND_GREEN = (34, 139, 34)
LAND_BROWN = (139, 69, 19)
CLOUD_WHITE = (255, 255, 255, 100)
ATMOSPHERE_BLUE = (135, 206, 250, 50)

# Create screen for web embedding
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Earth from Space - HackMIT Mission")
clock = pygame.time.Clock()

# Generate random stars
stars = []
for _ in range(200):
    x = random.randint(0, SCREEN_WIDTH)
    y = random.randint(0, SCREEN_HEIGHT)
    brightness = random.randint(100, 255)
    size = random.choice([1, 1, 1, 2])  # Mostly small stars
    stars.append((x, y, brightness, size))

def draw_stars(surface):
    """Draw twinkling stars"""
    for x, y, brightness, size in stars:
        # Add slight twinkling effect
        twinkle = random.randint(-30, 30)
        current_brightness = max(50, min(255, brightness + twinkle))
        color = (current_brightness, current_brightness, current_brightness)
        
        if size == 1:
            pygame.draw.circle(surface, color, (x, y), 1)
        else:
            pygame.draw.circle(surface, color, (x, y), 2)

def load_astronomical_background():
    """Load or create a realistic astronomical background"""
    global background_image
    
    # Create a deep space background with nebula-like colors and distant galaxies
    background_image = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
    
    # Create a gradient from deep space purple to black
    for y in range(SCREEN_HEIGHT):
        # Create subtle color variations across the background
        color_variation = int(15 * math.sin(y * 0.01) + 15)
        r = min(25, max(5, 15 + color_variation))
        g = min(15, max(2, 8 + color_variation // 2))
        b = min(35, max(10, 25 + color_variation))
        
        pygame.draw.line(background_image, (r, g, b), (0, y), (SCREEN_WIDTH, y))
    
    # Add distant galaxies and nebulae
    for _ in range(8):
        x = random.randint(100, SCREEN_WIDTH - 100)
        y = random.randint(100, SCREEN_HEIGHT - 100)
        
        # Create galaxy spiral effect
        galaxy_surface = pygame.Surface((80, 80), pygame.SRCALPHA)
        center = (40, 40)
        
        # Galaxy core
        pygame.draw.circle(galaxy_surface, (60, 40, 80, 120), center, 15)
        pygame.draw.circle(galaxy_surface, (80, 60, 100, 80), center, 25)
        
        # Spiral arms
        for angle in range(0, 360, 5):
            rad = math.radians(angle)
            spiral_x = center[0] + int(30 * math.cos(rad + angle * 0.1))
            spiral_y = center[1] + int(20 * math.sin(rad + angle * 0.1))
            if 0 <= spiral_x < 80 and 0 <= spiral_y < 80:
                alpha = max(20, 60 - abs(angle % 90 - 45))
                pygame.draw.circle(galaxy_surface, (40, 30, 60, alpha), (spiral_x, spiral_y), 2)
        
        background_image.blit(galaxy_surface, (x - 40, y - 40), special_flags=pygame.BLEND_ADD)
    
    # Add nebula clouds
    for _ in range(12):
        x = random.randint(0, SCREEN_WIDTH)
        y = random.randint(0, SCREEN_HEIGHT)
        
        nebula_surface = pygame.Surface((150, 150), pygame.SRCALPHA)
        
        # Create nebula with multiple color layers
        colors = [(60, 30, 80, 30), (40, 60, 100, 25), (80, 40, 60, 20)]
        for i, color in enumerate(colors):
            size = 75 - i * 15
            pygame.draw.circle(nebula_surface, color, (75, 75), size)
        
        background_image.blit(nebula_surface, (x - 75, y - 75), special_flags=pygame.BLEND_ADD)

def draw_astronomical_background(surface):
    """Draw realistic astronomical background with stars"""
    global background_image
    
    # Load background if not already loaded
    if background_image is None:
        load_astronomical_background()
    
    # Draw the deep space background
    surface.blit(background_image, (0, 0))
    
    # Draw stars
    draw_stars(surface)

# Load Earth image
earth_image = None

def load_earth_image(radius):
    """Load and scale Earth image"""
    global earth_image
    try:
        earth_image = pygame.image.load("Earth.png")
        earth_image = pygame.transform.scale(earth_image, (radius * 2, radius * 2))
    except:
        try:
            earth_image = pygame.image.load("earth_texture.jpg")
            earth_image = pygame.transform.scale(earth_image, (radius * 2, radius * 2))
        except:
            earth_image = None

def draw_earth_continents(surface, center, radius, rotation_angle=0):
    """Draw Earth using static image with transparent background"""
    global earth_image
    
    # Load image if not already loaded
    if earth_image is None:
        load_earth_image(radius)
    
    if earth_image:
        # Create a circular mask to remove background
        mask_surface = pygame.Surface((radius * 2, radius * 2), pygame.SRCALPHA)
        pygame.draw.circle(mask_surface, (255, 255, 255, 255), (radius, radius), radius)
        
        # Create Earth surface with transparency
        earth_surface = pygame.Surface((radius * 2, radius * 2), pygame.SRCALPHA)
        earth_surface.fill((0, 0, 0, 0))  # Transparent background
        
        # Scale and center the Earth image
        scaled_earth = pygame.transform.scale(earth_image, (radius * 2, radius * 2))
        
        # Apply circular mask to remove background
        for x in range(radius * 2):
            for y in range(radius * 2):
                # Check if pixel is within circle
                dx = x - radius
                dy = y - radius
                distance = (dx * dx + dy * dy) ** 0.5
                
                if distance <= radius:
                    # Copy pixel from original image
                    try:
                        pixel = scaled_earth.get_at((x, y))
                        earth_surface.set_at((x, y), pixel)
                    except:
                        pass
        
        # Blit the masked Earth surface
        earth_rect = earth_surface.get_rect(center=center)
        surface.blit(earth_surface, earth_rect)
    else:
        # Fallback to simple circle if image loading fails
        pygame.draw.circle(surface, OCEAN_BLUE, center, radius)

def draw_atmosphere(surface, center, radius):
    """Draw atmospheric glow around Earth"""
    # Reduced layers for faster rendering
    for i in range(3):  # Reduced from 5 to 3 layers
        glow_radius = radius + (i * 10)
        alpha = max(15, 60 - (i * 15))
        
        # Create a surface for the glow layer
        glow_surface = pygame.Surface((glow_radius * 2, glow_radius * 2), pygame.SRCALPHA)
        glow_color = (*ATMOSPHERE_BLUE[:3], alpha)
        
        pygame.draw.circle(glow_surface, glow_color, (glow_radius, glow_radius), glow_radius)
        pygame.draw.circle(glow_surface, (0, 0, 0, 255), (glow_radius, glow_radius), radius)
        
        glow_rect = glow_surface.get_rect(center=center)
        surface.blit(glow_surface, glow_rect, special_flags=pygame.BLEND_ALPHA_SDL2)

def draw_clouds(surface, center, radius, cloud_rotation=0):
    """Draw cloud patterns on Earth"""
    cloud_surface = pygame.Surface((radius * 2, radius * 2), pygame.SRCALPHA)
    
    # Fewer cloud patches for faster rendering
    cloud_patches = [
        (0.2, 0.3, 0.15), (0.7, 0.2, 0.12), (0.4, 0.6, 0.18),
        (0.8, 0.5, 0.1), (0.1, 0.7, 0.13), (0.6, 0.8, 0.11)
    ]
    
    for rel_x, rel_y, cloud_size in cloud_patches:
        # Convert to actual coordinates with rotation
        x = (rel_x - 0.5) * radius * 1.6
        y = (rel_y - 0.5) * radius * 1.6
        
        # Apply cloud rotation (slightly different from Earth rotation)
        rotated_x = x * math.cos(cloud_rotation) - y * math.sin(cloud_rotation)
        rotated_y = x * math.sin(cloud_rotation) + y * math.cos(cloud_rotation)
        
        final_x = rotated_x + radius
        final_y = rotated_y + radius
        
        # Only draw clouds that are visible
        if (rotated_x ** 2 + rotated_y ** 2) <= (radius ** 2):
            cloud_radius = int(cloud_size * radius)
            pygame.draw.circle(cloud_surface, CLOUD_WHITE, (int(final_x), int(final_y)), cloud_radius)
    
    # Blit clouds to main surface
    cloud_rect = cloud_surface.get_rect(center=center)
    surface.blit(cloud_surface, cloud_rect, special_flags=pygame.BLEND_ALPHA_SDL2)

async def main():
    # Main game loop variables
    running = True
    rotation_angle = 0
    cloud_rotation = 0

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        
        # Clear screen with deep space color
        screen.fill(BLACK)
        
        # Draw stars
        draw_stars(screen)
        
        # Draw Earth with continents only
        draw_earth_continents(screen, EARTH_CENTER, EARTH_RADIUS, rotation_angle)
        
        # No rotation - Earth stays static
        # rotation_angle += 0.005  # Earth rotates slowly
        # cloud_rotation += 0.003  # Clouds move slightly faster
        
        # Add title text
        font = pygame.font.Font(None, 72)
        title_text = font.render("LEVEL 1: THE EARTH", True, (79, 172, 254))
        screen.blit(title_text, (SCREEN_WIDTH // 2 - title_text.get_width() // 2, 50))
        
        # Add controls text
        small_font = pygame.font.Font(None, 24)
        controls_text = small_font.render("Press ESC to exit", True, (200, 200, 200))
        screen.blit(controls_text, (20, SCREEN_HEIGHT - 30))
        
        # Update display
        pygame.display.flip()
        await asyncio.sleep(0)  # Required for pygbag
        clock.tick(30)  # Reduced to 30 FPS for better performance

    pygame.quit()

asyncio.run(main())
