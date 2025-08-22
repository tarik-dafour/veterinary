from django.contrib.auth.models import User
from django.utils import timezone
from .models import Log
import json

def log_activity(request, action, description, table_cible=None, id_element=None):
    """
    Log an activity in the system
    
    Args:
        request: Django request object
        action: One of the ACTION_CHOICES from Log model
        description: Detailed description of the action
        table_cible: Target table/model name (optional)
        id_element: ID of the affected element (optional)
    """
    try:
        # Get user from request
        user = request.user if hasattr(request, 'user') and request.user.is_authenticated else None
        
        # Get IP address
        ip_address = None
        if hasattr(request, 'META'):
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(',')[0]
            else:
                ip_address = request.META.get('REMOTE_ADDR')
        
        # Get user agent
        user_agent = request.META.get('HTTP_USER_AGENT', '') if hasattr(request, 'META') else ''
        
        # Create log entry
        Log.objects.create(
            user=user,
            action=action,
            description=description,
            table_cible=table_cible,
            id_element=id_element,
            ip_address=ip_address,
            user_agent=user_agent
        )
    except Exception as e:
        # If logging fails, don't break the main functionality
        print(f"Logging failed: {e}")

def log_login(request, user):
    """Log user login"""
    log_activity(
        request=request,
        action='login',
        description=f"User '{user.username}' logged in successfully",
        table_cible='auth_user',
        id_element=user.id
    )

def log_logout(request, user):
    """Log user logout"""
    log_activity(
        request=request,
        action='logout',
        description=f"User '{user.username}' logged out",
        table_cible='auth_user',
        id_element=user.id
    )

def log_create(request, model_name, object_id, object_name):
    """Log record creation"""
    log_activity(
        request=request,
        action='create',
        description=f"Created {model_name}: {object_name}",
        table_cible=model_name,
        id_element=object_id
    )

def log_update(request, model_name, object_id, object_name):
    """Log record update"""
    log_activity(
        request=request,
        action='update',
        description=f"Updated {model_name}: {object_name}",
        table_cible=model_name,
        id_element=object_id
    )

def log_delete(request, model_name, object_id, object_name):
    """Log record deletion"""
    log_activity(
        request=request,
        action='delete',
        description=f"Deleted {model_name}: {object_name}",
        table_cible=model_name,
        id_element=object_id
    )

def log_view(request, model_name, object_id=None, object_name=None):
    """Log record view"""
    description = f"Viewed {model_name}"
    if object_name:
        description += f": {object_name}"
    
    log_activity(
        request=request,
        action='view',
        description=description,
        table_cible=model_name,
        id_element=object_id
    )

def log_export(request, model_name, format_type):
    """Log data export"""
    log_activity(
        request=request,
        action='export',
        description=f"Exported {model_name} data in {format_type} format",
        table_cible=model_name
    )

def log_password_change(request, user):
    """Log password change"""
    log_activity(
        request=request,
        action='password_change',
        description=f"User '{user.username}' changed their password",
        table_cible='auth_user',
        id_element=user.id
    )

def log_profile_update(request, user):
    """Log profile update"""
    log_activity(
        request=request,
        action='profile_update',
        description=f"User '{user.username}' updated their profile",
        table_cible='auth_user',
        id_element=user.id
    )

def log_theme_change(request, user, theme):
    """Log theme change"""
    log_activity(
        request=request,
        action='theme_change',
        description=f"User '{user.username}' changed theme to {theme}",
        table_cible='auth_user',
        id_element=user.id
    )

def log_report_sent(request, user, subject, recipient):
    """Log report sent"""
    log_activity(
        request=request,
        action='report_sent',
        description=f"User '{user.username}' sent report '{subject}' to {recipient}",
        table_cible='core_rapportenvoie'
    )

def log_stock_alert(request, product_name, current_quantity, threshold=10):
    """Log stock alert"""
    log_activity(
        request=request,
        action='stock_alert',
        description=f"Stock alert: {product_name} has {current_quantity} items remaining (threshold: {threshold})",
        table_cible='core_produit'
    )

def log_system_action(request, description):
    """Log system-level actions"""
    log_activity(
        request=request,
        action='system',
        description=description
    )
