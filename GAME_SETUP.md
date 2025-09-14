# Luminara Learning Game Setup

This guide explains how to set up and run the pygame learning game alongside your Next.js application.

## Prerequisites

1. **Python 3.7+** installed on your system
2. **pip** (Python package installer)
3. **Node.js** and **npm/pnpm** for the Next.js app

## Installation Steps

### 1. Install Python Dependencies

Navigate to the project root and install pygame:

```bash
# Windows
cd game
pip install -r requirements.txt

# Or install pygame directly
pip install pygame==2.5.2
```

### 2. Test the Game Independently

You can run the game directly to test it:

```bash
# From the project root
cd game
python main.py
```

This will launch the pygame window with the learning game.

### 3. Run the Next.js Application

In a separate terminal, start your Next.js development server:

```bash
# From the project root
npm run dev
# or
pnpm dev
```

## How the Integration Works

### Frontend Integration
- The homepage now includes a new "Learn Through Play" section after "Everything You Need to Excel"
- Clicking the "Launch Learning Game" button sends a POST request to `/api/launch-game`
- The API endpoint spawns the pygame process as a separate application

### API Endpoint
- Located at `app/api/launch-game/route.ts`
- Uses Node.js `child_process.spawn()` to launch the Python game
- Runs the game as a detached process so it doesn't block the web server

### Game Features
- **Interactive Quiz Game**: Multiple choice questions with immediate feedback
- **Progress Tracking**: Visual progress bar and score tracking
- **Cyberpunk Theme**: Matches your website's aesthetic with gradients and neon effects
- **Responsive Design**: Clean UI with proper text wrapping and button interactions

## Game Structure

```
game/
├── main.py           # Main game file with QuizGame class
├── requirements.txt  # Python dependencies
└── README.md        # This file
```

## Customization Options

### Adding Your Own Questions
Edit the `questions` array in `game/main.py`:

```python
self.questions = [
    {
        "question": "Your question here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,  # Index of correct answer (0-3)
        "explanation": "Explanation of the correct answer."
    }
]
```

### Connecting to Your Quiz API
Replace the hardcoded questions with API calls to your existing quiz system:

```python
# In the __init__ method, replace self.questions with:
self.questions = self.fetch_questions_from_api()

def fetch_questions_from_api(self):
    # Make HTTP request to your quiz API
    # Return formatted questions array
    pass
```

## Troubleshooting

### Common Issues

1. **"Python not found"**
   - Make sure Python is installed and added to your system PATH
   - Try `python3` instead of `python` on macOS/Linux

2. **"pygame not found"**
   - Install pygame: `pip install pygame`
   - On some systems: `pip3 install pygame`

3. **Game doesn't launch from web button**
   - Check the browser console for errors
   - Ensure the Next.js server is running
   - Verify Python and pygame are properly installed

4. **Permission errors**
   - On Windows, you might need to run as administrator
   - On macOS/Linux, ensure the script has execute permissions

### Testing the API Endpoint

You can test the API endpoint directly:

```bash
curl -X POST http://localhost:3000/api/launch-game
```

## Future Enhancements

- **Real-time Communication**: Use WebSockets to sync game progress with the web app
- **User Authentication**: Connect game scores to user accounts
- **Custom Quiz Integration**: Pull questions from your existing quiz database
- **Multiplayer Features**: Add competitive elements between users
- **Advanced Analytics**: Track detailed learning metrics

## Development Notes

- The game runs as a separate process from the web server
- Game state is currently local to the pygame application
- For production deployment, consider containerization or cloud gaming solutions
- The current implementation is designed for local development and testing
