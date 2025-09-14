import asyncio
import pygame

# Initialize pygame
pygame.init()

# Create screen
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Simple Pygame Test")
clock = pygame.time.Clock()

async def main():
    running = True
    x = 400
    y = 300
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        
        # Clear screen
        screen.fill((0, 0, 50))
        
        # Draw a simple moving circle
        pygame.draw.circle(screen, (255, 255, 255), (int(x), int(y)), 50)
        
        # Move circle
        x += 1
        if x > 850:
            x = -50
        
        # Update display
        pygame.display.flip()
        await asyncio.sleep(0)  # Required for pygbag
        clock.tick(60)
    
    pygame.quit()

asyncio.run(main())
