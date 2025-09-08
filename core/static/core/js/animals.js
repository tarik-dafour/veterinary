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
// Bulk selection functionality
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const animalCheckboxes = document.querySelectorAll('.animal-checkbox');
    
    animalCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActions();
}

function updateBulkActions() {
    const animalCheckboxes = document.querySelectorAll('.animal-checkbox:checked');
    const bulkActionsBar = document.getElementById('bulk-actions-bar');
    const bulkSelectionCount = document.querySelector('.bulk-selection-count');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    if (animalCheckboxes.length > 0) {
        bulkActionsBar.style.display = 'block';
        bulkSelectionCount.textContent = `${animalCheckboxes.length} animal(s) selected`;
        
        // Update select all checkbox state
        const totalCheckboxes = document.querySelectorAll('.animal-checkbox');
        selectAllCheckbox.checked = animalCheckboxes.length === totalCheckboxes.length;
        selectAllCheckbox.indeterminate = animalCheckboxes.length > 0 && animalCheckboxes.length < totalCheckboxes.length;
    } else {
        bulkActionsBar.style.display = 'none';
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
}

function clearSelection() {
    const animalCheckboxes = document.querySelectorAll('.animal-checkbox');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    animalCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    updateBulkActions();
}

function deleteSelectedAnimals() {
    const animalCheckboxes = document.querySelectorAll('.animal-checkbox:checked');
    
    if (animalCheckboxes.length === 0) {
        alert('Please select animals to delete.');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${animalCheckboxes.length} selected animal(s)?`)) {
        confirm('Are you sure you want to delete the selected animals?');
        return;
    }
    
    const animalIds = Array.from(animalCheckboxes).map(checkbox => checkbox.value);
    
    // Send bulk delete request
    fetch('{% url "bulk_delete_animals" %}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({
            animal_ids: animalIds
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove deleted rows from table
            animalCheckboxes.forEach(checkbox => {
                checkbox.closest('tr').remove();
            });
            
            // Clear selection and hide bulk actions
            clearSelection();
            
            // Show success message
            showNotification(data.message, 'success');
            
            // Reload page to refresh data
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred while deleting animals.', 'error');
    });
}

// Initialize bulk actions
document.addEventListener('DOMContentLoaded', function() {
    updateBulkActions();
});