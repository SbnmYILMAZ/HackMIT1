from flask import Flask, render_template, request, redirect, url_for, flash
from models import db, User
from forms import RegistrationForm, LoginForm
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
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        # Check if username already exists
        existing_user = User.query.filter_by(username=form.username.data).first()
        if existing_user:
            flash('Username already exists. Please choose a different one.', 'error')
            return render_template('register.html', form=form)
        
        # Create new user
        user = User(
            username=form.username.data,
            password=form.password.data  # In production, hash this password
        )
        db.session.add(user)
        db.session.commit()
        flash(f'Account created successfully! Welcome, {user.username}! 🚀', 'success')
        return redirect(url_for('dashboard'))
    
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
            flash(f'Welcome back, {user.username}! 🚀', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password. Please try again.', 'error')
            return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    total_users = User.query.count()
    return render_template('dashboard.html', total_users=total_users)

if __name__ == '__main__':
    # Create database tables
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='127.0.0.1', port=3000)
