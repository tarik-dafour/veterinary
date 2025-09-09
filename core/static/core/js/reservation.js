// Reservation Page JavaScript Functionality

// Fonctions pour le modal de réservation
function openReservationModal() {
    document.getElementById("reservationModal").style.display = "block";
}

function closeReservationModal() {
    document.getElementById("reservationModal").style.display = "none";
}

function closeEditReservationModal() {
    document.getElementById("editReservationModal").style.display = "none";
}

// Fermer le modal si l'utilisateur clique en dehors
window.onclick = function(event) {
    const modal = document.getElementById("reservationModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Bulk Selection JavaScript
// Bulk selection functionality
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox');
    
    reservationCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActions();
}

function updateBulkActions() {
    const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox:checked');
    const bulkActionsBar = document.getElementById('bulk-actions-bar');
    const bulkSelectionCount = document.querySelector('.bulk-selection-count');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    if (reservationCheckboxes.length > 0) {
        bulkActionsBar.style.display = 'block';
        bulkSelectionCount.textContent = `${reservationCheckboxes.length} reservation(s) selected`;
        
        // Update select all checkbox state
        const totalCheckboxes = document.querySelectorAll('.reservation-checkbox');
        selectAllCheckbox.checked = reservationCheckboxes.length === totalCheckboxes.length;
        selectAllCheckbox.indeterminate = reservationCheckboxes.length > 0 && reservationCheckboxes.length < totalCheckboxes.length;
    } else {
        bulkActionsBar.style.display = 'none';
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
}

function clearSelection() {
    const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    reservationCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    updateBulkActions();
}

function deleteSelectedReservations() {
    const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox:checked');
    
    if (reservationCheckboxes.length === 0) {
        alert('Please select reservations to delete.');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${reservationCheckboxes.length} selected reservation(s)?`)) {
        return;
    }
    
    const reservationIds = Array.from(reservationCheckboxes).map(checkbox => checkbox.value);
    
    // Send bulk delete request
    fetch(window.bulkDeleteReservationsUrl || '/bulk-delete/reservations/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({
            reservation_ids: reservationIds
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove deleted rows from table
            reservationCheckboxes.forEach(checkbox => {
                checkbox.closest('tr').remove();
            });
            
            // Clear selection and hide bulk actions
            clearSelection();
            
            // Show success message
            alert(data.message);
            
            // Reload page to refresh data
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting reservations.');
    });
}

// Status Change Functions
function toggleStatusDropdown(statusBadge) {
    const reservationId = statusBadge.getAttribute('data-reservation-id');
    const dropdown = document.getElementById(`status-dropdown-${reservationId}`);
    
    // Close all other dropdowns
    document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
        if (menu.id !== `status-dropdown-${reservationId}`) {
            menu.style.display = 'none';
        }
    });
    
    // Toggle current dropdown
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}

function changeReservationStatus(reservationId, newStatus, optionElement) {
    // Close dropdown
    const dropdown = document.getElementById(`status-dropdown-${reservationId}`);
    dropdown.style.display = 'none';
    
    // Show loading state
    const statusBadge = document.querySelector(`[data-reservation-id="${reservationId}"]`);
    const originalText = statusBadge.innerHTML;
    statusBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Changing...';
    statusBadge.style.pointerEvents = 'none';
    
    // Send AJAX request
    fetch('/change-reservation-status/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({
            reservation_id: reservationId,
            new_status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the status badge
            updateStatusBadge(statusBadge, newStatus, data.new_status_display);
            
            // Show success message
            showStatusMessage(data.message, 'success');
        } else {
            // Restore original text on error
            statusBadge.innerHTML = originalText;
            statusBadge.style.pointerEvents = 'auto';
            
            // Show error message
            showStatusMessage(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Restore original text on error
        statusBadge.innerHTML = originalText;
        statusBadge.style.pointerEvents = 'auto';
        
        // Show error message
        showStatusMessage('An error occurred while changing status.', 'error');
    });
}

function updateStatusBadge(statusBadge, newStatus, displayText) {
    // Update the badge content and class
    statusBadge.innerHTML = `${displayText} <i class="fa-solid fa-chevron-down status-arrow"></i>`;
    statusBadge.setAttribute('data-current-status', newStatus);
    statusBadge.style.pointerEvents = 'auto';
    
    // Remove all status classes and add the new one
    statusBadge.classList.remove('status-scheduled', 'status-confirmed', 'status-completed', 'status-cancelled', 'status-pending');
    
    const statusClassMap = {
        'Scheduled': 'status-scheduled',
        'Confirmed': 'status-confirmed',
        'Completed': 'status-completed',
        'Cancelled': 'status-cancelled',
        'Pending': 'status-pending'
    };
    
    if (statusClassMap[newStatus]) {
        statusBadge.classList.add(statusClassMap[newStatus]);
    }
}

function showStatusMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Show with animation
    setTimeout(() => messageDiv.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.status-dropdown-container')) {
        document.querySelectorAll('.status-dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Initialize bulk actions
document.addEventListener('DOMContentLoaded', function() {
    const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    // Add event listeners to individual checkboxes
    reservationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActions);
    });
    
    // Add event listener to select all checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
});
