import pygame
import math
import random

# Initialize pygame
pygame.init()

# Constants
SCREEN_WIDTH = 1000
SCREEN_HEIGHT = 1000
EARTH_RADIUS = 200
EARTH_CENTER = (SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)

# Colors
BLACK = (0, 0, 0)
DEEP_BLUE = (0, 50, 100)
OCEAN_BLUE = (30, 144, 255)
LAND_GREEN = (34, 139, 34)
LAND_BROWN = (139, 69, 19)
CLOUD_WHITE = (255, 255, 255, 100)
ATMOSPHERE_BLUE = (135, 206, 250, 50)

# Create screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Earth from Space - HackMIT Mission")
clock = pygame.time.Clock()

# Generate random stars
stars = []
for _ in range(300):
    x = random.randint(0, SCREEN_WIDTH)
    y = random.randint(0, SCREEN_HEIGHT)
    brightness = random.randint(100, 255)
    size = random.choice([1, 1, 1, 2])  # Mostly small stars
    stars.append((x, y, brightness, size))

def draw_stars(surface):
    """Draw twinkling stars in space"""
    for star in stars:
        x, y, brightness, size = star
        # Add slight twinkling effect
        twinkle = random.randint(-30, 30)
        current_brightness = max(50, min(255, brightness + twinkle))
        color = (current_brightness, current_brightness, current_brightness)
        
        if size == 1:
            pygame.draw.circle(surface, color, (x, y), 1)
        else:
            pygame.draw.circle(surface, color, (x, y), 2)

def draw_earth_continents(surface, center, radius, rotation_angle=0):
    """Draw simplified Earth continents"""
    # Create a surface for the Earth
    earth_surface = pygame.Surface((radius * 2, radius * 2), pygame.SRCALPHA)
    
    # Draw ocean base
    pygame.draw.circle(earth_surface, OCEAN_BLUE, (radius, radius), radius)
    
    # Simplified continent shapes (rotated based on rotation_angle)
    continents = [
        # North America (approximate)
        [(0.3, 0.2), (0.5, 0.15), (0.6, 0.3), (0.4, 0.4), (0.2, 0.35)],
        # Europe/Africa
        [(0.5, 0.2), (0.7, 0.25), (0.65, 0.6), (0.55, 0.7), (0.45, 0.5)],
        # Asia
        [(0.7, 0.15), (0.9, 0.2), (0.95, 0.4), (0.8, 0.45), (0.75, 0.3)],
        # South America
        [(0.3, 0.5), (0.4, 0.45), (0.45, 0.8), (0.35, 0.85), (0.25, 0.7)],
    ]
    
    for continent in continents:
        # Convert relative coordinates to actual coordinates and apply rotation
        points = []
        for rel_x, rel_y in continent:
            # Convert to centered coordinates
            x = (rel_x - 0.5) * radius * 1.8
            y = (rel_y - 0.5) * radius * 1.8
            
            # Apply rotation
            rotated_x = x * math.cos(rotation_angle) - y * math.sin(rotation_angle)
            rotated_y = x * math.sin(rotation_angle) + y * math.cos(rotation_angle)
            
            # Convert back to surface coordinates
            final_x = rotated_x + radius
            final_y = rotated_y + radius
            
            # Only add points that are visible (within the circle)
            if (rotated_x ** 2 + rotated_y ** 2) <= (radius ** 2):
                points.append((final_x, final_y))
        
        if len(points) >= 3:
            pygame.draw.polygon(earth_surface, LAND_GREEN, points)
    
    # Add some brown landmasses for variety
    brown_areas = [
        [(0.6, 0.3), (0.75, 0.35), (0.7, 0.5), (0.55, 0.45)],
        [(0.2, 0.6), (0.35, 0.65), (0.3, 0.75), (0.15, 0.7)],
    ]
    
    for area in brown_areas:
        points = []
        for rel_x, rel_y in area:
            x = (rel_x - 0.5) * radius * 1.8
            y = (rel_y - 0.5) * radius * 1.8
            
            rotated_x = x * math.cos(rotation_angle) - y * math.sin(rotation_angle)
            rotated_y = x * math.sin(rotation_angle) + y * math.cos(rotation_angle)
            
            final_x = rotated_x + radius
            final_y = rotated_y + radius
            
            if (rotated_x ** 2 + rotated_y ** 2) <= (radius ** 2):
                points.append((final_x, final_y))
        
        if len(points) >= 3:
            pygame.draw.polygon(earth_surface, LAND_BROWN, points)
    
    # Blit the Earth surface to the main surface
    earth_rect = earth_surface.get_rect(center=center)
    surface.blit(earth_surface, earth_rect)

def draw_atmosphere(surface, center, radius):
    """Draw atmospheric glow around Earth"""
    # Create multiple layers for atmospheric effect
    for i in range(5):
        glow_radius = radius + (i * 8)
        alpha = max(10, 50 - (i * 10))
        
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
    
    # Create cloud patterns
    cloud_patches = [
        (0.2, 0.3, 0.15), (0.7, 0.2, 0.12), (0.4, 0.6, 0.18),
        (0.8, 0.5, 0.1), (0.1, 0.7, 0.13), (0.6, 0.8, 0.11),
        (0.3, 0.1, 0.09), (0.9, 0.7, 0.14), (0.5, 0.4, 0.16)
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

# Main game loop
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
    
    # Draw atmospheric glow first (behind Earth)
    draw_atmosphere(screen, EARTH_CENTER, EARTH_RADIUS)
    
    # Draw Earth with continents
    draw_earth_continents(screen, EARTH_CENTER, EARTH_RADIUS, rotation_angle)
    
    # Draw clouds
    draw_clouds(screen, EARTH_CENTER, EARTH_RADIUS, cloud_rotation)
    
    # Update rotation angles for animation
    rotation_angle += 0.005  # Earth rotates slowly
    cloud_rotation += 0.003  # Clouds move slightly faster
    
    # Add title text
    font = pygame.font.Font(None, 36)
    title_text = font.render("Earth from Space - HackMIT Mission", True, (255, 255, 255))
    screen.blit(title_text, (SCREEN_WIDTH // 2 - title_text.get_width() // 2, 50))
    
    # Add controls text
    small_font = pygame.font.Font(None, 24)
    controls_text = small_font.render("Press ESC to exit", True, (200, 200, 200))
    screen.blit(controls_text, (20, SCREEN_HEIGHT - 30))
    
    # Update display
    pygame.display.flip()
    clock.tick(60)  # 60 FPS

pygame.quit()
