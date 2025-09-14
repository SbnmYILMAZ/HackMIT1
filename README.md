# 🚀 Space Mission: Interactive Earth Learning Platform

A comprehensive web-based educational platform combining Flask backend with interactive 3D Earth visualization and gamified learning experiences. Built for HackMIT, this project transforms space science education through immersive gameplay and progressive difficulty systems.

## 🌟 Features

### 🎮 Interactive Gaming Experience
- **3D Earth Visualization**: Realistic Earth rendering with texture mapping and atmospheric effects
- **Progressive Difficulty System**: Easy → Medium → Hard question progression with adaptive scoring
- **Real-time Score Tracking**: Dynamic scoring system with streak bonuses and performance analytics
- **WebGL Integration**: Browser-based 3D graphics for seamless cross-platform compatibility

### 🔐 User Management System
- **Secure Authentication**: Username/password login with session management
- **Account Recovery**: Security question-based password recovery system
- **User Profiles**: Track scores, levels, experience points, and playtime
- **Registration System**: Complete user onboarding with validation

### 📚 Educational Content
- **Astronomy Quiz Bank**: 21+ engaging questions across three difficulty levels
- **Earth Science Focus**: Questions covering geology, atmosphere, magnetosphere, and space phenomena
- **Interactive Learning**: Hover-based tooltips and contextual information
- **Progress Tracking**: Monitor learning progress and knowledge retention

### 🎨 Modern UI/UX
- **Space-themed Design**: Immersive cosmic interface with animated stars and gradients
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Real-time Feedback**: Instant notifications and visual feedback systems
- **Accessibility**: Clean typography and intuitive navigation

## 🛠️ Technology Stack

### Backend
- **Flask 2.2.5**: Python web framework for robust server-side logic
- **SQLAlchemy 3.0.5**: ORM for database management and relationships
- **SQLite**: Lightweight database for user data and game progress
- **Flask-WTF**: Form handling and CSRF protection

### Frontend
- **HTML5 Canvas**: 2D graphics rendering for game interface
- **JavaScript ES6+**: Interactive game logic and DOM manipulation
- **CSS3**: Modern styling with animations and responsive design
- **WebGL**: 3D graphics acceleration for Earth visualization

### Game Engine
- **Pygame 2.5.2**: Python game development framework
- **Pygbag**: Web deployment system for Pygame applications
- **Canvas API**: Browser-native graphics rendering

## 📁 Project Structure

```
pygame/
├── app.py                 # Main Flask application
├── models.py             # Database models (User, Post, Category)
├── forms.py              # WTForms for user input validation
├── main.py               # Pygame application entry point
├── init_db.py            # Database initialization script
├── requirements.txt      # Python dependencies
├── database.db          # SQLite database file
├── templates/           # Jinja2 HTML templates
│   ├── index.html       # Landing page with authentication
│   ├── game.html        # Main game interface
│   ├── register.html    # User registration form
│   ├── dashboard.html   # User dashboard
│   └── ...             # Additional templates
├── build/web/          # Web deployment files
│   ├── index.html      # Pygbag web wrapper
│   └── hackmit.apk     # Compiled game package
└── static/             # Static assets
    ├── Earth.png       # Earth texture image
    └── earth_texture.jpg
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+ 
- pip package manager
- Modern web browser with WebGL support

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pygame
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize the database**
   ```bash
   python init_db.py
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   - Open your browser to `http://localhost:3000`
   - Create an account or use demo credentials
   - Start your space mission!

### Development Setup

For development with auto-reload:
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

## 🎯 How to Play

### Getting Started
1. **Register**: Create your astronaut account with security questions
2. **Login**: Access the mission control dashboard
3. **Launch Game**: Click "Launch Mission" to start Level 1: Earth

### Gameplay Mechanics
- **Earth Interaction**: Hover over Earth to reveal quiz questions
- **Answer Questions**: Select correct answers to earn points
- **Difficulty Progression**: 
  - Easy: 100 points per question
  - Medium: 200 points per question  
  - Hard: 300 points per question
- **Streak System**: Maintain correct answers for bonus multipliers
- **Score Persistence**: Your high scores are automatically saved

### Question Categories
- **Easy**: Basic Earth facts and solar system position
- **Medium**: Geological processes and atmospheric phenomena
- **Hard**: Advanced physics and space science concepts

## 🏗️ Architecture Overview

### Database Schema
```sql
Users Table:
- id (Primary Key)
- username (Unique)
- password (Hashed)
- score, level, experience_points
- security questions & answers
- game statistics (playtime, last_login)

Posts Table:
- id, title, content
- user_id (Foreign Key)
- created_at, is_published

Categories Table:
- id, name, description
- created_at
```

### API Endpoints
- `GET /` - Landing page with authentication
- `POST /login` - User authentication
- `POST /register` - Account creation
- `GET /game` - Game interface (authenticated)
- `POST /save_score` - Score persistence
- `GET /logout` - Session termination

### Game State Management
```javascript
gameState = {
    earthRotation: 0,
    score: 0,
    difficulty: 'easy|medium|hard',
    correctAnswersInLevel: 0,
    usedQuestions: { easy: [], medium: [], hard: [] },
    currentQuestionPotentialScore: 100|200|300
}
```

## 🔧 Configuration

### Environment Variables
```bash
FLASK_SECRET_KEY=your-secure-secret-key
DATABASE_URL=sqlite:///database.db
FLASK_ENV=production|development
```

### Game Settings
- **Screen Resolution**: 1920x1080 (scales to viewport)
- **Frame Rate**: 30 FPS for optimal performance
- **Question Pool**: 7 questions per difficulty level
- **Score Multipliers**: Based on difficulty and streak

## 🚀 Deployment

### Web Deployment
The application includes Pygbag configuration for web deployment:

1. **Build web version**
   ```bash
   pygbag main.py --width 1920 --height 1080 --name "Level 1: The Earth"
   ```

2. **Deploy to web server**
   - Upload `build/web/` contents to your web server
   - Ensure proper MIME types for `.wasm` and `.js` files
   - Configure HTTPS for WebGL compatibility

### Production Considerations
- Use environment variables for sensitive configuration
- Implement proper password hashing (currently simplified for demo)
- Add rate limiting for API endpoints
- Configure proper database connection pooling
- Enable GZIP compression for static assets

## 🤝 Contributing

### Development Guidelines
1. Follow PEP 8 style guidelines for Python code
2. Use semantic commit messages
3. Add tests for new features
4. Update documentation for API changes

### Code Structure
- **Models**: Database schema in `models.py`
- **Views**: Route handlers in `app.py`
- **Templates**: Jinja2 templates in `templates/`
- **Game Logic**: Pygame code in `main.py`
- **Frontend**: JavaScript in template files

## 📝 License

This project was created for HackMIT educational purposes. Please refer to the event's licensing terms for usage guidelines.

## 🎖️ Acknowledgments

- **HackMIT**: For providing the platform and inspiration
- **Pygame Community**: For excellent documentation and examples
- **Flask Team**: For the robust web framework
- **NASA**: For Earth texture images and scientific accuracy

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Review existing documentation
- Check the troubleshooting section below

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Reinitialize the database
python init_db.py
```

**Static Files Not Loading**
- Ensure `Earth.png` and `earth_texture.jpg` are in the project root
- Check file permissions and paths

**WebGL Not Working**
- Verify browser WebGL support at `webglreport.com`
- Enable hardware acceleration in browser settings
- Try a different browser (Chrome/Firefox recommended)

**Performance Issues**
- Reduce canvas resolution in game settings
- Close other browser tabs
- Check system graphics drivers

---

**Built with ❤️ for space education and interactive learning**
