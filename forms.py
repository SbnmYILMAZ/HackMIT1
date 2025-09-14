from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length, EqualTo

class RegistrationForm(FlaskForm):
    """Registration form with username, password, and security questions"""
    username = StringField('Username', validators=[
        DataRequired(),
        Length(min=3, max=80, message='Username must be between 3 and 80 characters')
    ])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=6, message='Password must be at least 6 characters long')
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    
    # Security Questions
    security_question_1 = SelectField('Security Question 1', choices=[
        ('', 'Select a security question...'),
        ('What was the name of your first pet?', 'What was the name of your first pet?'),
        ('What city were you born in?', 'What city were you born in?'),
        ('What was your childhood nickname?', 'What was your childhood nickname?'),
        ('What is your mother\'s maiden name?', 'What is your mother\'s maiden name?'),
        ('What was the name of your first school?', 'What was the name of your first school?')
    ], validators=[DataRequired()])
    
    security_answer_1 = StringField('Answer 1', validators=[
        DataRequired(),
        Length(min=2, max=200, message='Answer must be between 2 and 200 characters')
    ])
    
    security_question_2 = SelectField('Security Question 2', choices=[
        ('', 'Select a security question...'),
        ('What was your favorite food as a child?', 'What was your favorite food as a child?'),
        ('What was the model of your first car?', 'What was the model of your first car?'),
        ('What is your favorite movie?', 'What is your favorite movie?'),
        ('What street did you grow up on?', 'What street did you grow up on?'),
        ('What was your favorite subject in school?', 'What was your favorite subject in school?')
    ], validators=[DataRequired()])
    
    security_answer_2 = StringField('Answer 2', validators=[
        DataRequired(),
        Length(min=2, max=200, message='Answer must be between 2 and 200 characters')
    ])
    
    submit = SubmitField('Create Account')

class LoginForm(FlaskForm):
    """Simple login form"""
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class ForgotPasswordForm(FlaskForm):
    """Form to initiate password recovery"""
    username = StringField('Username', validators=[DataRequired()])
    submit = SubmitField('Recover Password')

class SecurityQuestionForm(FlaskForm):
    """Form to answer security questions for password recovery"""
    security_answer_1 = StringField('Answer to Security Question 1', validators=[DataRequired()])
    security_answer_2 = StringField('Answer to Security Question 2', validators=[DataRequired()])
    new_password = PasswordField('New Password', validators=[
        DataRequired(),
        Length(min=6, message='Password must be at least 6 characters long')
    ])
    confirm_new_password = PasswordField('Confirm New Password', validators=[
        DataRequired(),
        EqualTo('new_password', message='Passwords must match')
    ])
    submit = SubmitField('Reset Password')
