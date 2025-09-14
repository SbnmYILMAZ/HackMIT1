from flask import Flask, render_template, request, redirect, url_for, flash, session
from models import db, User
from forms import RegistrationForm, LoginForm, ForgotPasswordForm, SecurityQuestionForm
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
    if request.method == 'GET':
        form = LoginForm()
        return render_template('login.html', form=form)
    
    # Handle both form submission and direct POST
    if request.form.get('username') and request.form.get('password'):
        username = request.form['username']
        password = request.form['password']
        
        # Check database for user
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            # Add user to session
            session['user_id'] = user.id
            session['username'] = user.username
            
            # Update last_login timestamp
            from datetime import datetime
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            # Auto-launch the game (non-blocking)
            import subprocess
            import os
            
            try:
                # Get the path to main.py
                game_path = os.path.join(os.path.dirname(__file__), 'main.py')
                
                # Launch the game as a subprocess (detached)
                subprocess.Popen(['python3', game_path], 
                               stdout=subprocess.DEVNULL, 
                               stderr=subprocess.DEVNULL,
                               start_new_session=True)
                
                flash(f'Welcome back, {user.username}! Game launching... 🚀', 'success')
            except Exception as e:
                flash(f'Welcome back, {user.username}! 🚀', 'success')
            
            return redirect(url_for('index'))
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

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully. 🚀', 'success')
    return redirect(url_for('index'))



if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='127.0.0.1', port=3000)
