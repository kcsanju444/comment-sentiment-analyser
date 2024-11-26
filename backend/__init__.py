# backend/auth/__init__.py
from flask import Blueprint

auth_blueprint = Blueprint('auth', __name__)

from .auth import (
    login,
    register,
    change_password,
    admin_login,
    admin_register
)
