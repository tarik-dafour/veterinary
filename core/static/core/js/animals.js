// Modal management functions
function openAnimalModal() {
    try {
        const modal = document.getElementById("animalModal");
        if (modal) {
            modal.style.display = "block";
            // Focus on first input field
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    } catch (error) {
        console.error('Error opening animal modal:', error);
    }
}

function closeAnimalModal() {
    try {
        const modal = document.getElementById("animalModal");
        if (modal) {
            modal.style.display = "none";
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    } catch (error) {
        console.error('Error closing animal modal:', error);
    }
}

function closeEditAnimalModal() {
    try {
        const modal = document.getElementById("editAnimalModal");
        if (modal) {
            modal.style.display = "none";
        }
    } catch (error) {
        console.error('Error closing edit animal modal:', error);
    }
}

// Initialize animals management when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeAnimalsManagement();
    } catch (error) {
        console.error('Error initializing animals management:', error);
    }
});

function initializeAnimalsManagement() {
    try {
        // Close modals on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
        
        // Close modals on outside click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                closeAllModals();
            }
        });
        
        // Form validation
        initializeFormValidation();
        
    } catch (error) {
        console.error('Error in animals management initialization:', error);
    }
}

function closeAllModals() {
    try {
        closeAnimalModal();
        closeEditAnimalModal();
    } catch (error) {
        console.error('Error closing all modals:', error);
    }
}

// Form validation
function initializeFormValidation() {
    try {
        const forms = document.querySelectorAll('#addAnimalForm, #editAnimalForm');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!validateAnimalForm(this)) {
                    e.preventDefault();
                    showNotification('Please fill in all required fields correctly', 'error');
                }
            });
        });
    } catch (error) {
        console.error('Error initializing form validation:', error);
    }
}

function validateAnimalForm(form) {
    try {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('invalid');
                isValid = false;
            } else {
                field.classList.remove('invalid');
            }
        });
        
        return isValid;
    } catch (error) {
        console.error('Error validating form:', error);
        return false;
    }
}

// Notification system (if not already available)
function showNotification(message, type = 'info') {
    try {
        // Check if notification function already exists
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
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
        alert(message);
    }
}
