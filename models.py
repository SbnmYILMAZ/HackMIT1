from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """User model with username, password, score, and security questions"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    score = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Security questions for password recovery
    security_question_1 = db.Column(db.String(200), nullable=False)
    security_answer_1 = db.Column(db.String(200), nullable=False)
    security_question_2 = db.Column(db.String(200), nullable=False)
    security_answer_2 = db.Column(db.String(200), nullable=False)
    
    # Game-related columns
    level = db.Column(db.Integer, default=1, nullable=False)
    experience_points = db.Column(db.Integer, default=0, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    total_playtime = db.Column(db.Integer, default=0, nullable=False)  # in minutes
    
    def __repr__(self):
        return f'<User {self.username}>'
