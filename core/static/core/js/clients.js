// Client Management JavaScript Functions
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeClientManagement();
    } catch (error) {
        console.error('Error initializing client management:', error);
    }
});

function initializeClientManagement() {
    try {
        // Form validation
        initializeFormValidation();
        
        // Modal management
        initializeModals();
        
        // Accessibility enhancements
        initializeAccessibility();
        
        // Search enhancement
        initializeSearch();
        
        // Bulk selection functionality
        initializeBulkSelection();
    } catch (error) {
        console.error('Error in client management initialization:', error);
    }
}

// Form validation
function initializeFormValidation() {
    try {
        const forms = document.querySelectorAll('#addClientForm, #editClientForm');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!validateForm(this)) {
                    e.preventDefault();
                    showNotification('Please fill in all required fields correctly', 'error');
                }
            });
        });
    } catch (error) {
        console.error('Error initializing form validation:', error);
    }
}

function validateForm(form) {
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

// Modal management
function initializeModals() {
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
    } catch (error) {
        console.error('Error initializing modals:', error);
    }
}

function openClientModal() {
    try {
        const modal = document.getElementById('clientModal');
        if (modal) {
            modal.style.display = 'block';
            document.getElementById('add-prenom')?.focus();
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error opening client modal:', error);
    }
}

function closeClientModal() {
    try {
        const modal = document.getElementById('clientModal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('addClientForm')?.reset();
            document.body.style.overflow = '';
        }
    } catch (error) {
        console.error('Error closing client modal:', error);
    }
}

function closeEditClientModal() {
    try {
        // Redirect back to clients list without edit parameter
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.delete('edit');
        window.location.href = currentUrl.toString();
    } catch (error) {
        console.error('Error closing edit client modal:', error);
    }
}

function closeAllModals() {
    try {
        closeClientModal();
        closeEditClientModal();
    } catch (error) {
        console.error('Error closing all modals:', error);
    }
}

// Client actions
function editClient(clientId) {
    try {
        console.log('Edit client called with ID:', clientId);
        // Redirect to edit URL
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('edit', clientId);
        console.log('Redirecting to:', currentUrl.toString());
        window.location.href = currentUrl.toString();
    } catch (error) {
        console.error('Error editing client:', error);
        showNotification('Error editing client', 'error');
    }
}

function deleteClient(clientId) {
    try {
        if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            // Redirect to delete URL
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('delete', clientId);
            window.location.href = currentUrl.toString();
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        showNotification('Error deleting client', 'error');
    }
}

// Accessibility enhancements
function initializeAccessibility() {
    try {
        // Focus management
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (firstElement && lastElement) {
                modal.addEventListener('keydown', function(e) {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error initializing accessibility:', error);
    }
}

// Search enhancement
function initializeSearch() {
    try {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                // Real-time search could be implemented here
                // For now, just add visual feedback
                if (this.value.length > 0) {
                    this.classList.add('searching');
                } else {
                    this.classList.remove('searching');
                }
            });
        }
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}

// Bulk selection and deletion functionality
function initializeBulkSelection() {
    try {
        const selectAllCheckbox = document.getElementById('selectAll');
        const clientCheckboxes = document.querySelectorAll('.client-checkbox');
        const bulkActionsBar = document.getElementById('bulkActionsBar');
        const selectedCountSpan = document.getElementById('selectedCount');

        // Select all functionality
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                clientCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
                updateBulkActionsBar();
            });
        }

        // Individual checkbox functionality
        clientCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateBulkActionsBar();
                updateSelectAllCheckbox();
            });
        });

        // Update bulk actions bar visibility and count
        function updateBulkActionsBar() {
            const checkedCheckboxes = document.querySelectorAll('.client-checkbox:checked');
            const count = checkedCheckboxes.length;
            
            if (count > 0) {
                bulkActionsBar.style.display = 'flex';
                selectedCountSpan.textContent = count;
            } else {
                bulkActionsBar.style.display = 'none';
            }
        }
        
        // Make updateBulkActionsBar globally accessible
        window.updateBulkActionsBar = updateBulkActionsBar;

        // Update select all checkbox state
        function updateSelectAllCheckbox() {
            const checkedCheckboxes = document.querySelectorAll('.client-checkbox:checked');
            const totalCheckboxes = clientCheckboxes.length;
            
            if (checkedCheckboxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedCheckboxes.length === totalCheckboxes) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }
    } catch (error) {
        console.error('Error initializing bulk selection:', error);
    }
}

// Toggle select all functionality
function toggleSelectAll() {
    try {
        const selectAllCheckbox = document.getElementById('selectAll');
        const clientCheckboxes = document.querySelectorAll('.client-checkbox');
        
        clientCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        
        updateBulkActionsBar();
    } catch (error) {
        console.error('Error toggling select all:', error);
    }
}

// Clear all selections
function clearSelection() {
    try {
        const selectAllCheckbox = document.getElementById('selectAll');
        const clientCheckboxes = document.querySelectorAll('.client-checkbox');
        
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        
        clientCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.getElementById('bulkActionsBar').style.display = 'none';
    } catch (error) {
        console.error('Error clearing selection:', error);
    }
}

// Bulk delete selected clients
function bulkDeleteClients() {
    try {
        const checkedCheckboxes = document.querySelectorAll('.client-checkbox:checked');
        
        if (checkedCheckboxes.length === 0) {
            showNotification('No clients selected for deletion', 'error');
            return;
        }

        const clientIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);
        const clientNames = Array.from(checkedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            const nameCell = row.querySelector('.client-name');
            return nameCell ? nameCell.textContent.trim() : 'Unknown';
        });

        const confirmMessage = `Are you sure you want to delete the following ${clientIds.length} client(s)?\n\n${clientNames.join('\n')}\n\nThis action cannot be undone.`;
        
        if (confirm(confirmMessage)) {
            // Show loading state
            const bulkDeleteBtn = document.querySelector('.bulk-actions-buttons .btn-danger');
            const originalText = bulkDeleteBtn.innerHTML;
            bulkDeleteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Deleting...';
            bulkDeleteBtn.disabled = true;

            // Get CSRF token from the page
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
                             document.querySelector('meta[name=csrf-token]')?.getAttribute('content');

            if (!csrfToken) {
                showNotification('CSRF token not found. Please refresh the page.', 'error');
                bulkDeleteBtn.innerHTML = originalText;
                bulkDeleteBtn.disabled = false;
                return;
            }

            // Send AJAX request
            fetch('/bulk-delete/clients/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    'client_ids': clientIds
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification(data.message, 'success');
                    // Reload the page to show updated list
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showNotification(data.message, 'error');
                    bulkDeleteBtn.innerHTML = originalText;
                    bulkDeleteBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred while deleting clients', 'error');
                bulkDeleteBtn.innerHTML = originalText;
                bulkDeleteBtn.disabled = false;
            });
        }
    } catch (error) {
        console.error('Error in bulk delete:', error);
        showNotification('An error occurred while deleting clients', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    try {
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
