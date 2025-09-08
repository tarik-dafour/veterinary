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
