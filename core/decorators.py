from django.shortcuts import redirect
from django.contrib import messages
from functools import wraps
from django.http import HttpResponseForbidden
from .models import UserProfile

def role_required(allowed_roles):
    """
    Decorator to check if user has required role
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect('login')
            
            # Get user role from profile
            if hasattr(request.user, 'profile'):
                user_role = request.user.profile.role
            else:
                # Create profile if it doesn't exist
                UserProfile.objects.create(user=request.user)
                user_role = request.user.profile.role
            
            if user_role in allowed_roles or request.user.is_superuser:
                return view_func(request, *args, **kwargs)
            else:
                messages.error(request, "You don't have permission to access this page.")
                return redirect('dashboard')
        return _wrapped_view
    return decorator

def admin_required(view_func):
    """
    Decorator to check if user is admin
    """
    return role_required(['admin'])(view_func)

def veterinarian_required(view_func):
    """
    Decorator to check if user is veterinarian or admin
    """
    return role_required(['admin', 'veterinarian'])(view_func)

def assistant_required(view_func):
    """
    Decorator to check if user is assistant, veterinarian or admin
    """
    return role_required(['admin', 'veterinarian', 'assistant'])(view_func)

def receptionist_required(view_func):
    """
    Decorator to check if user is receptionist, assistant, veterinarian or admin
    """
    return role_required(['admin', 'veterinarian', 'assistant', 'receptionist'])(view_func)
