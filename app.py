from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory, jsonify
from models import db, User
from forms import RegistrationForm, LoginForm, ForgotPasswordForm, SecurityQuestionForm
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'your-secure-secret-key-here'

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "database.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

@app.route('/')
def index():
    # Check if user is logged in
    is_logged_in = 'user_id' in session
    return render_template('index.html', is_logged_in=is_logged_in)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        try:
            # Check if username already exists
            existing_user = User.query.filter_by(username=form.username.data).first()
            if existing_user:
                flash('Username already exists. Please choose a different one.', 'error')
                return render_template('register.html', form=form)
            
            # Create new user with all required fields
            user = User(
                username=form.username.data,
                password=form.password.data,  # In production, hash this password
                score=0,
                level=1,
                experience_points=0,
                total_playtime=0,
                is_active=True,
                security_question_1=form.security_question_1.data,
                security_answer_1=form.security_answer_1.data.lower().strip(),
                security_question_2=form.security_question_2.data,
                security_answer_2=form.security_answer_2.data.lower().strip()
            )
            db.session.add(user)
            db.session.commit()
            flash(f'Account created successfully! Welcome, {user.username}! Please log in to continue. 🚀', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            db.session.rollback()
            flash(f'Registration failed: {str(e)}', 'error')
            return render_template('register.html', form=form)
    else:
        # Show form validation errors
        for field, errors in form.errors.items():
            for error in errors:
                flash(f'{field}: {error}', 'error')
    
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.password == password:
            session['user_id'] = user.id
            session['username'] = user.username
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            flash('Login successful! Welcome back!', 'success')
            
            # Redirect to web-based game instead of launching pygame
            return redirect(url_for('game'))
        else:
            flash('Invalid username or password. Please try again.', 'error')
            return redirect(url_for('index'))

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    form = ForgotPasswordForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            # Store username in session for security question verification
            session['recovery_username'] = user.username
            return redirect(url_for('security_questions'))
        else:
            flash('Username not found. Please check and try again.', 'error')
    
    return render_template('forgot_password.html', form=form)

@app.route('/security-questions', methods=['GET', 'POST'])
def security_questions():
    if 'recovery_username' not in session:
        flash('Please start the password recovery process first.', 'error')
        return redirect(url_for('forgot_password'))
    
    user = User.query.filter_by(username=session['recovery_username']).first()
    if not user:
        flash('User not found. Please try again.', 'error')
        return redirect(url_for('forgot_password'))
    
    form = SecurityQuestionForm()
    if form.validate_on_submit():
        # Check if answers match (case-insensitive)
        answer1_correct = form.security_answer_1.data.lower().strip() == user.security_answer_1
        answer2_correct = form.security_answer_2.data.lower().strip() == user.security_answer_2
        
        if answer1_correct and answer2_correct:
            # Update password
            user.password = form.new_password.data
            db.session.commit()
            
            # Clear session
            session.pop('recovery_username', None)
            
            flash('Password reset successfully! You can now log in with your new password. 🚀', 'success')
            return redirect(url_for('index'))
        else:
            flash('Security answers are incorrect. Please try again.', 'error')
    
    return render_template('security_questions.html', form=form, user=user)

@app.route('/game')
def game():
    # Check if user is logged in
    if 'user_id' not in session:
        flash('Please log in to access the game.', 'error')
        return redirect(url_for('index'))
    
    # Serve the WebGL Earth game directly
    return render_template('game.html')

@app.route('/save_score', methods=['POST'])
def save_score():
    # Check if user is logged in
    if 'user_id' not in session:
        return {'success': False, 'error': 'Not logged in'}, 401
    
    try:
        data = request.get_json()
        score = data.get('score', 0)
        level = data.get('level', 1)
        
        # Get current user
        user = User.query.get(session['user_id'])
        if not user:
            return {'success': False, 'error': 'User not found'}, 404
        
        # Update user's score if it's higher than current
        if score > user.score:
            user.score = score
            user.level = max(user.level, level)
            db.session.commit()
            
            return {'success': True, 'message': 'Score saved successfully', 'new_high_score': True}
        else:
            return {'success': True, 'message': 'Score recorded', 'new_high_score': False}
            
    except Exception as e:
        db.session.rollback()
        return {'success': False, 'error': str(e)}, 500

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('index'))

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(basedir, filename)



if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='127.0.0.1', port=3000)
