#!/usr/bin/env python3
"""
Database initialization script for Flask SQLite application
Run this script to create tables and populate with sample data
"""

from app import app
from models import db, User, Post, Category
from datetime import datetime

def init_database():
    """Initialize database with tables and sample data"""
    with app.app_context():
        # Drop all tables and recreate them (for development)
        db.drop_all()
        db.create_all()
        
        print("Creating database tables...")
        
        # Create sample categories
        categories = [
            Category(name="Technology", description="Posts about technology and programming"),
            Category(name="Science", description="Scientific articles and discoveries"),
            Category(name="Travel", description="Travel experiences and guides"),
            Category(name="Food", description="Recipes and food reviews")
        ]
        
        for category in categories:
            db.session.add(category)
        
        # Create sample users
        users = [
            User(username="admin", password="admin123", is_active=True),
            User(username="john_doe", password="password123", is_active=True),
            User(username="jane_smith", password="password123", is_active=True),
            User(username="astronaut", password="space2024", is_active=True)
        ]
        
        for user in users:
            db.session.add(user)
        
        # Commit users and categories first to get their IDs
        db.session.commit()
        
        # Create sample posts
        posts = [
            Post(
                title="Welcome to Our Platform",
                content="This is the first post on our new platform. We're excited to share content with you!",
                is_published=True,
                user_id=1  # admin user
            ),
            Post(
                title="Getting Started with Flask",
                content="Flask is a lightweight web framework for Python. Here's how to get started with building web applications...",
                is_published=True,
                user_id=2  # john_doe
            ),
            Post(
                title="SQLAlchemy Best Practices",
                content="When working with SQLAlchemy, there are several best practices to keep in mind for optimal performance...",
                is_published=False,
                user_id=3  # jane_smith
            ),
            Post(
                title="Space Exploration Updates",
                content="The latest news from space exploration missions and what we can expect in the coming years...",
                is_published=True,
                user_id=4  # astronaut
            )
        ]
        
        for post in posts:
            db.session.add(post)
        
        db.session.commit()
        
        print("Database initialized successfully!")
        print(f"Created {len(users)} users, {len(posts)} posts, and {len(categories)} categories")
        
        # Display summary
        print("\nSample Users:")
        for user in User.query.all():
            print(f"  - {user.username}")
        
        print("\nSample Posts:")
        for post in Post.query.all():
            status = "Published" if post.is_published else "Draft"
            print(f"  - {post.title} by {post.author.username} ({status})")
        
        print("\nSample Categories:")
        for category in Category.query.all():
            print(f"  - {category.name}: {category.description}")

if __name__ == "__main__":
    init_database()
