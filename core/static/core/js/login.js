// Login Page JavaScript Functionality

// Password visibility toggle
function togglePasswordVisibility() {
    try {
        const passwordInput = document.getElementById('password');
        const passwordEye = document.getElementById('password-eye');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordEye.className = 'fa-solid fa-eye-slash';
            passwordEye.setAttribute('aria-label', 'Hide password');
        } else {
            passwordInput.type = 'password';
            passwordEye.className = 'fa-solid fa-eye';
            passwordEye.setAttribute('aria-label', 'Show password');
        }
    } catch (error) {
        console.error('Error toggling password visibility:', error);
    }
}

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
    try {
        const loginForm = document.querySelector('.login-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.querySelector('.login-btn');
        
        // Add loading state to form
        loginForm.addEventListener('submit', function(e) {
            try {
                // Show loading state
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Connecting...';
                loginBtn.setAttribute('aria-label', 'Connecting to system...');
                
                // Add loading class to form
                loginForm.classList.add('loading');
                
            } catch (error) {
                console.error('Error handling form submission:', error);
            }
        });
        
        // Real-time validation
        usernameInput.addEventListener('input', function() {
            validateField(this, 'username');
        });
        
        passwordInput.addEventListener('input', function() {
            validateField(this, 'password');
        });
        
        // Add keyboard navigation
        usernameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });
        
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                loginForm.submit();
            }
        });
        
        // Focus management
        usernameInput.focus();
        
    } catch (error) {
        console.error('Error initializing login form:', error);
    }
});

// Field validation
function validateField(field, fieldType) {
    try {
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        const helpText = formGroup.querySelector('.help-text');
        
        // Remove existing validation classes
        formGroup.classList.remove('valid', 'invalid');
        
        if (value.length === 0) {
            formGroup.classList.add('invalid');
            helpText.textContent = `${fieldType === 'username' ? 'Username' : 'Password'} is required`;
            helpText.className = 'help-text error';
        } else if (fieldType === 'username' && value.length < 3) {
            formGroup.classList.add('invalid');
            helpText.textContent = 'Username must be at least 3 characters';
            helpText.className = 'help-text error';
        } else if (fieldType === 'password' && value.length < 6) {
            formGroup.classList.add('invalid');
            helpText.textContent = 'Password must be at least 6 characters';
            helpText.className = 'help-text error';
        } else {
            formGroup.classList.add('valid');
            helpText.textContent = fieldType === 'username' ? 'Username looks good!' : 'Password looks good!';
            helpText.className = 'help-text success';
        }
    } catch (error) {
        console.error('Error validating field:', error);
    }
}
