from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, db, Admin  # Import User and db from models.py

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email').strip()
    password = data.get('password').strip()

    user = User.query.filter_by(user_email=email).first()

    if user and check_password_hash(user.user_password, password):
        return jsonify({"message": "Login successful", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid email or password", "status": "error"}), 401

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if email or username already exists
    if User.query.filter_by(user_email=email).first():
        return jsonify({"message": "Email already exists", "status": "error"}), 400
    

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new user instance
    new_user = User(user_name=username, user_email=email, user_password=hashed_password)

    # Add the user to the database session
    db.session.add(new_user)

    # Commit the session to save the user to the database
    db.session.commit()

    return jsonify({"message": "Registration successful", "status": "success"}), 201

@auth.route('/admin-register', methods=['POST'])
def admin_register():
    data = request.json
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    

    # Check if email or username already exists
    if Admin.query.filter_by(admin_email=email).first():
        return jsonify({"message": "Email already exists", "status": "error"}), 400
    if Admin.query.filter_by(admin_username=username).first():
        return jsonify({"message": "Username already exists", "status": "error"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new admin instance
    new_admin = Admin(admin_username=username, admin_email=email, admin_password=hashed_password)

    # Add the admin to the database session
    db.session.add(new_admin)

    # Commit the session to save the admin to the database
    db.session.commit()

    return jsonify({"message": "Registration successful", "status": "success"}), 201

@auth.route('/change-password', methods=['POST'])
def change_password():
    data = request.json
    email = data.get('email').strip()
    old_password = data.get('old-password').strip()
    new_password = data.get('new_password').strip()
    print(old_password)
    print(new_password)

    # Find the user by email
    user = User.query.filter_by(user_email=email).first()

    if not user:
        return jsonify({"message": "User not found", "status": "error"}), 404

    # Check if old password is correct
    if not check_password_hash(user.user_password, old_password):
        return jsonify({"message": "Old password is incorrect", "status": "error"}), 400

    # Hash the new password
    hashed_new_password = generate_password_hash(new_password)

    # Update the user's password
    user.user_password = hashed_new_password

    # Commit the changes to the database
    db.session.commit()

    return jsonify({"message": "Password changed successfully", "status": "success"}), 200


@auth.route('/api/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    # Query the admin user by email
    admin = Admin.query.filter_by(admin_email=email).first()

    if admin and check_password_hash(admin.admin_password, password):
        # Return success response with admin details
        return jsonify({
            "success": True,
            "admin": {
                "id": admin.admin_id,
                "email": admin.admin_email,
                # Add other relevant admin details here
            }
        }), 200
    else:
        # Return error response if credentials are invalid
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401
    


@auth.route('/api/admin-profile', methods=['GET'])
def admin_profile():
    # Assuming you have some way to identify the logged-in admin
    # For example, by using a token or session
    # For simplicity, here we're just querying the first admin
    # You should replace this with proper authentication/authorization mechanism

    admin = Admin.query.first()

    if admin:
        return jsonify({
            "success": True,
            "admin": {
                "id": admin.admin_id,
                "username": admin.admin_username,
                "email": admin.admin_email,
                
            }
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Admin not found"
        }), 404
    
@auth.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        users_list = [{"_id": user.user_id, "email": user.user_email, "name":user.user_name} for user in users]
        return jsonify({"users": users_list}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error fetching users", "status": "error"}), 500
    

@auth.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Find the user by ID
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"message": "User not found", "status": "error"}), 404

        # Delete the user
        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully", "status": "success"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting user: {e}")
        return jsonify({"message": "Failed to delete user", "status": "error"}), 500