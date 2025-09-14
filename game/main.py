import pygame
import sys
import random
import json
import os
from typing import List, Dict, Tuple

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 1200
SCREEN_HEIGHT = 800
FPS = 60

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
PURPLE = (147, 51, 234)
PINK = (236, 72, 153)
CYAN = (6, 182, 212)
GREEN = (34, 197, 94)
RED = (239, 68, 68)
GRAY = (75, 85, 99)
LIGHT_GRAY = (156, 163, 175)

class QuizGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Luminara Learning Game")
        self.clock = pygame.time.Clock()
        self.font_large = pygame.font.Font(None, 48)
        self.font_medium = pygame.font.Font(None, 36)
        self.font_small = pygame.font.Font(None, 24)
        
        # Game state
        self.current_question = 0
        self.score = 0
        self.game_state = "menu"  # menu, playing, results
        self.selected_answer = None
        self.show_feedback = False
        self.feedback_timer = 0
        
        # Sample questions - in a real app, these would come from your quiz API
        self.questions = [
            {
                "question": "What is the capital of France?",
                "options": ["London", "Berlin", "Paris", "Madrid"],
                "correct": 2,
                "explanation": "Paris is the capital and largest city of France."
            },
            {
                "question": "Which planet is known as the Red Planet?",
                "options": ["Venus", "Mars", "Jupiter", "Saturn"],
                "correct": 1,
                "explanation": "Mars is called the Red Planet due to its reddish appearance from iron oxide."
            },
            {
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correct": 1,
                "explanation": "2 + 2 equals 4, a basic arithmetic operation."
            },
            {
                "question": "Who wrote 'Romeo and Juliet'?",
                "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                "correct": 1,
                "explanation": "William Shakespeare wrote this famous tragedy in the early part of his career."
            }
        ]
        
        random.shuffle(self.questions)
    
    def draw_gradient_rect(self, surface, color1, color2, rect):
        """Draw a gradient rectangle"""
        for y in range(rect.height):
            ratio = y / rect.height
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            pygame.draw.line(surface, (r, g, b), 
                           (rect.x, rect.y + y), (rect.x + rect.width, rect.y + y))
    
    def draw_button(self, text, x, y, width, height, color1, color2, text_color=WHITE):
        """Draw a gradient button with text"""
        rect = pygame.Rect(x, y, width, height)
        self.draw_gradient_rect(self.screen, color1, color2, rect)
        pygame.draw.rect(self.screen, WHITE, rect, 2)
        
        text_surface = self.font_medium.render(text, True, text_color)
        text_rect = text_surface.get_rect(center=rect.center)
        self.screen.blit(text_surface, text_rect)
        
        return rect
    
    def draw_menu(self):
        """Draw the main menu"""
        # Background gradient
        self.draw_gradient_rect(self.screen, (30, 30, 60), (60, 30, 90), 
                               pygame.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT))
        
        # Title
        title = self.font_large.render("Luminara Learning Game", True, WHITE)
        title_rect = title.get_rect(center=(SCREEN_WIDTH // 2, 200))
        self.screen.blit(title, title_rect)
        
        # Subtitle
        subtitle = self.font_medium.render("Test your knowledge with interactive quizzes!", True, LIGHT_GRAY)
        subtitle_rect = subtitle.get_rect(center=(SCREEN_WIDTH // 2, 250))
        self.screen.blit(subtitle, subtitle_rect)
        
        # Start button
        start_button = self.draw_button("Start Quiz", SCREEN_WIDTH // 2 - 100, 350, 200, 60, PURPLE, PINK)
        
        # Instructions
        instructions = [
            "Instructions:",
            "• Answer multiple choice questions",
            "• Click on your chosen answer",
            "• Get instant feedback and explanations",
            "• Try to get the highest score!"
        ]
        
        for i, instruction in enumerate(instructions):
            color = WHITE if i == 0 else LIGHT_GRAY
            font = self.font_medium if i == 0 else self.font_small
            text = font.render(instruction, True, color)
            self.screen.blit(text, (SCREEN_WIDTH // 2 - 200, 450 + i * 30))
        
        return {"start_button": start_button}
    
    def draw_question(self):
        """Draw the current question and options"""
        if self.current_question >= len(self.questions):
            self.game_state = "results"
            return {}
        
        question_data = self.questions[self.current_question]
        
        # Background gradient
        self.draw_gradient_rect(self.screen, (20, 40, 60), (40, 20, 80), 
                               pygame.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT))
        
        # Progress bar
        progress_width = (self.current_question / len(self.questions)) * (SCREEN_WIDTH - 100)
        pygame.draw.rect(self.screen, GRAY, (50, 30, SCREEN_WIDTH - 100, 20))
        pygame.draw.rect(self.screen, CYAN, (50, 30, progress_width, 20))
        
        # Question number and score
        progress_text = f"Question {self.current_question + 1} of {len(self.questions)} | Score: {self.score}"
        progress_surface = self.font_small.render(progress_text, True, WHITE)
        self.screen.blit(progress_surface, (50, 60))
        
        # Question text
        question_lines = self.wrap_text(question_data["question"], self.font_medium, SCREEN_WIDTH - 100)
        y_offset = 120
        for line in question_lines:
            text_surface = self.font_medium.render(line, True, WHITE)
            self.screen.blit(text_surface, (50, y_offset))
            y_offset += 40
        
        # Answer options
        option_buttons = {}
        colors = [(PURPLE, PINK), (CYAN, (0, 150, 200)), (GREEN, (0, 180, 100)), (RED, (200, 50, 50))]
        
        for i, option in enumerate(question_data["options"]):
            y_pos = y_offset + 50 + i * 80
            color1, color2 = colors[i % len(colors)]
            
            # Highlight selected answer
            if self.selected_answer == i:
                color1 = tuple(min(255, c + 50) for c in color1)
                color2 = tuple(min(255, c + 50) for c in color2)
            
            button_rect = self.draw_button(f"{chr(65 + i)}. {option}", 50, y_pos, SCREEN_WIDTH - 100, 60, color1, color2)
            option_buttons[i] = button_rect
        
        # Show feedback if answer was selected
        if self.show_feedback and self.selected_answer is not None:
            self.draw_feedback(question_data)
        
        return option_buttons
    
    def draw_feedback(self, question_data):
        """Draw feedback for the selected answer"""
        feedback_rect = pygame.Rect(100, SCREEN_HEIGHT - 200, SCREEN_WIDTH - 200, 150)
        
        # Background
        if self.selected_answer == question_data["correct"]:
            self.draw_gradient_rect(self.screen, (0, 100, 0), (0, 150, 0), feedback_rect)
            feedback_text = "Correct! ✓"
        else:
            self.draw_gradient_rect(self.screen, (100, 0, 0), (150, 0, 0), feedback_rect)
            feedback_text = f"Incorrect. The correct answer is {chr(65 + question_data['correct'])}."
        
        pygame.draw.rect(self.screen, WHITE, feedback_rect, 2)
        
        # Feedback text
        feedback_surface = self.font_medium.render(feedback_text, True, WHITE)
        self.screen.blit(feedback_surface, (feedback_rect.x + 20, feedback_rect.y + 20))
        
        # Explanation
        explanation_lines = self.wrap_text(question_data["explanation"], self.font_small, feedback_rect.width - 40)
        for i, line in enumerate(explanation_lines):
            text_surface = self.font_small.render(line, True, LIGHT_GRAY)
            self.screen.blit(text_surface, (feedback_rect.x + 20, feedback_rect.y + 60 + i * 25))
    
    def draw_results(self):
        """Draw the final results screen"""
        # Background gradient
        self.draw_gradient_rect(self.screen, (40, 20, 60), (20, 40, 80), 
                               pygame.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT))
        
        # Results title
        title = self.font_large.render("Quiz Complete!", True, WHITE)
        title_rect = title.get_rect(center=(SCREEN_WIDTH // 2, 200))
        self.screen.blit(title, title_rect)
        
        # Score
        score_text = f"Your Score: {self.score} / {len(self.questions)}"
        score_surface = self.font_medium.render(score_text, True, WHITE)
        score_rect = score_surface.get_rect(center=(SCREEN_WIDTH // 2, 280))
        self.screen.blit(score_surface, score_rect)
        
        # Performance message
        percentage = (self.score / len(self.questions)) * 100
        if percentage >= 80:
            message = "Excellent work! 🌟"
            color = GREEN
        elif percentage >= 60:
            message = "Good job! 👍"
            color = CYAN
        else:
            message = "Keep practicing! 📚"
            color = PINK
        
        message_surface = self.font_medium.render(message, True, color)
        message_rect = message_surface.get_rect(center=(SCREEN_WIDTH // 2, 330))
        self.screen.blit(message_surface, message_rect)
        
        # Buttons
        play_again_button = self.draw_button("Play Again", SCREEN_WIDTH // 2 - 250, 400, 200, 60, PURPLE, PINK)
        quit_button = self.draw_button("Quit", SCREEN_WIDTH // 2 + 50, 400, 200, 60, GRAY, (100, 100, 100))
        
        return {"play_again": play_again_button, "quit": quit_button}
    
    def wrap_text(self, text, font, max_width):
        """Wrap text to fit within max_width"""
        words = text.split(' ')
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            if font.size(test_line)[0] <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines
    
    def handle_click(self, pos, buttons):
        """Handle mouse clicks"""
        if self.game_state == "menu":
            if "start_button" in buttons and buttons["start_button"].collidepoint(pos):
                self.game_state = "playing"
                self.current_question = 0
                self.score = 0
                
        elif self.game_state == "playing":
            if not self.show_feedback:
                for i, button in buttons.items():
                    if isinstance(i, int) and button.collidepoint(pos):
                        self.selected_answer = i
                        self.show_feedback = True
                        self.feedback_timer = pygame.time.get_ticks()
                        
                        # Check if answer is correct
                        if i == self.questions[self.current_question]["correct"]:
                            self.score += 1
                        break
            else:
                # Move to next question after showing feedback
                if pygame.time.get_ticks() - self.feedback_timer > 2000:  # 2 seconds
                    self.current_question += 1
                    self.selected_answer = None
                    self.show_feedback = False
                    
        elif self.game_state == "results":
            if "play_again" in buttons and buttons["play_again"].collidepoint(pos):
                self.game_state = "menu"
                self.current_question = 0
                self.score = 0
                self.selected_answer = None
                self.show_feedback = False
                random.shuffle(self.questions)
            elif "quit" in buttons and buttons["quit"].collidepoint(pos):
                return False
        
        return True
    
    def run(self):
        """Main game loop"""
        running = True
        
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    if self.game_state == "menu":
                        buttons = self.draw_menu()
                    elif self.game_state == "playing":
                        buttons = self.draw_question()
                    elif self.game_state == "results":
                        buttons = self.draw_results()
                    
                    running = self.handle_click(event.pos, buttons)
            
            # Auto-advance after feedback timeout
            if (self.game_state == "playing" and self.show_feedback and 
                pygame.time.get_ticks() - self.feedback_timer > 3000):
                self.current_question += 1
                self.selected_answer = None
                self.show_feedback = False
            
            # Clear screen
            self.screen.fill(BLACK)
            
            # Draw current screen
            if self.game_state == "menu":
                self.draw_menu()
            elif self.game_state == "playing":
                self.draw_question()
            elif self.game_state == "results":
                self.draw_results()
            
            pygame.display.flip()
            self.clock.tick(FPS)
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = QuizGame()
    game.run()
