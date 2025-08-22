from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import messages
from django.utils import timezone
from django.conf import settings
from .utils import log_activity
import datetime

class ActivityLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to automatically log user activities
    """
    
    def process_request(self, request):
        # Store request for later use
        request._activity_logged = False
        return None
    
    def process_response(self, request, response):
        # Only log if not already logged and user is authenticated
        if (hasattr(request, 'user') and 
            request.user.is_authenticated and 
            not getattr(request, '_activity_logged', False)):
            
            # Get the view name
            view_name = getattr(request.resolver_match, 'view_name', 'unknown') if hasattr(request, 'resolver_match') and request.resolver_match else 'unknown'
            
            # Skip logging for certain views to avoid spam
            skip_views = [
                'static', 'media', 'admin:jsi18n', 'admin:login', 'admin:logout',
                'favicon', 'robots', 'sitemap'
            ]
            
            if not any(skip_view in view_name for skip_view in skip_views):
                # Log the page view
                log_activity(
                    request=request,
                    action='view',
                    description=f"Viewed page: {view_name}",
                    table_cible='page_view'
                )
                
                # Mark as logged to prevent duplicate entries
                request._activity_logged = True
        
        return response


class AutoLogoutMiddleware(MiddlewareMixin):
    """
    Middleware to automatically logout users after inactivity
    """

    def process_request(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Get the last activity time from session
            last_activity = request.session.get('last_activity')

            if last_activity:
                # Convert string back to datetime and check inactivity
                try:
                    last_activity = datetime.datetime.fromisoformat(last_activity)
                    now = timezone.now()
                    elapsed = (now - last_activity).total_seconds()

                    # Timeout in seconds (default: 30 minutes)
                    timeout = getattr(settings, 'AUTO_LOGOUT_DELAY', 1800)

                    if elapsed > timeout:
                        # Log and perform auto logout
                        log_activity(
                            request=request,
                            action='auto_logout',
                            description=f"User '{request.user.username}' automatically logged out due to inactivity",
                            table_cible='auth_user',
                            id_element=request.user.id,
                        )

                        logout(request)
                        messages.warning(request, 'You have been automatically logged out due to inactivity.')
                        return redirect('login')

                except (ValueError, TypeError):
                    # Ignore parsing issues and reset timestamp below
                    pass

            # Update last activity time
            request.session['last_activity'] = timezone.now().isoformat()

        return None
