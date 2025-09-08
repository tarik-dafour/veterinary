// Dashboard Page JavaScript Functionality

// Calendar Initialization Script
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize FullCalendar
        var calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            var calendar = new FullCalendar.Calendar(calendarEl, {
                // Basic Settings
                initialView: 'dayGridMonth',
                height: 'auto',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,listWeek',
                },
                events: window.calendarEventsUrl || "/api/appointments/",
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                
                // Event handling
                eventClick: function(info) {
                    try {
                        // Show appointment details
                        const eventTitle = info.event.title || 'Appointment';
                        const eventDate = info.event.start ? 
                            new Date(info.event.start).toLocaleDateString() : 'Unknown date';
                        
                        // Create a more accessible alert
                        const message = `Appointment: ${eventTitle}\nDate: ${eventDate}`;
                        
                        // Use a custom notification instead of alert for better UX
                        showNotification(message, 'info');
                    } catch (error) {
                        console.error('Error handling event click:', error);
                        showNotification('Error loading appointment details', 'error');
                    }
                },
                
                // Selection handling
                select: function(info) {
                    try {
                        const selectedDate = info.startStr;
                        // Redirect to reservation page with selected date
                        window.location.href = window.reservationUrl + `?date=${selectedDate}`;
                    } catch (error) {
                        console.error('Error handling date selection:', error);
                        showNotification('Error selecting date', 'error');
                    }
                },
                
                // Event rendering
                eventDidMount: function(info) {
                    try {
                        // Add custom styling to events
                        info.el.style.cursor = 'pointer';
                        info.el.setAttribute('role', 'button');
                        info.el.setAttribute('tabindex', '0');
                        info.el.setAttribute('aria-label', `Appointment: ${info.event.title}`);
                        
                        // Add keyboard support
                        info.el.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                info.event.setProp('display', 'background');
                            }
                        });
                    } catch (error) {
                        console.error('Error mounting event:', error);
                    }
                }
            });
            
            calendar.render();
            console.log('Calendar initialized successfully');
        } else {
            console.error('Calendar element not found');
        }
    } catch (error) {
        console.error('Error initializing calendar:', error);
        showNotification('Error loading calendar', 'error');
    }
});

// Notification system for better UX
function showNotification(message, type = 'info') {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `dashboard-notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Set content
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa-solid fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}" aria-hidden="true"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-solid fa-times" aria-hidden="true"></i>
                </button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert
        alert(message);
    }
}

// Add keyboard navigation for dashboard
document.addEventListener('keydown', function(e) {
    try {
        // Escape key to close any open modals or panels
        if (e.key === 'Escape') {
            // Close any open dropdowns or modals
            const openElements = document.querySelectorAll('.open, .active');
            openElements.forEach(el => el.classList.remove('open', 'active'));
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            // Add visual focus indicator
            focusableElements.forEach(el => {
                el.addEventListener('focus', function() {
                    this.style.outline = '2px solid var(--primary-blue)';
                    this.style.outlineOffset = '2px';
                });
                
                el.addEventListener('blur', function() {
                    this.style.outline = '';
                    this.style.outlineOffset = '';
                });
            });
        }
    } catch (error) {
        console.error('Error handling keyboard navigation:', error);
    }
});
