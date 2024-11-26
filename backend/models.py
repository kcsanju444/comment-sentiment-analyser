from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'  # specify table name if it is different from the class name

    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(120), unique=True, nullable=False)
    user_email = db.Column(db.String(120), unique=True, nullable=False)
    user_password = db.Column(db.String(200), nullable=False)

class Admin(db.Model):
    __tablename__ = 'admin'  # specify table name if it is different from the class name

    admin_id = db.Column(db.Integer, primary_key=True)
    admin_username = db.Column(db.String(120), unique=True, nullable=False)
    admin_email = db.Column(db.String(120), unique=True, nullable=False)
    admin_password = db.Column(db.String(200), nullable=False)
