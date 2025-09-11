// Reservation Management JavaScript functionality
// Modal management and bulk selection features

// Modal functions for reservation
function openReservationModal() {
    try {
        const modal = document.getElementById("reservationModal");
        if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
        }
    } catch (error) {
        console.error('Error opening reservation modal:', error);
    }
}

function closeReservationModal() {
    try {
        const modal = document.getElementById("reservationModal");
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    } catch (error) {
        console.error('Error closing reservation modal:', error);
    }
}

function closeEditReservationModal() {
    try {
        const modal = document.getElementById("editReservationModal");
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    } catch (error) {
        console.error('Error closing edit reservation modal:', error);
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    try {
        const reservationModal = document.getElementById("reservationModal");
        const editReservationModal = document.getElementById("editReservationModal");
        
        if (event.target === reservationModal) {
            closeReservationModal();
        }
        
        if (event.target === editReservationModal) {
            closeEditReservationModal();
        }
    } catch (error) {
        console.error('Error handling modal click outside:', error);
    }
});

// Bulk selection functionality
function toggleSelectAll() {
    try {
        const selectAllCheckbox = document.getElementById('selectAll');
        const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox');
        
        reservationCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        
        updateBulkActions();
    } catch (error) {
        console.error('Error toggling select all:', error);
    }
}

function updateBulkActions() {
    try {
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
    } catch (error) {
        console.error('Error updating bulk actions:', error);
    }
}

function clearSelection() {
    try {
        const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox');
        const selectAllCheckbox = document.getElementById('selectAll');
        
        reservationCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        updateBulkActions();
    } catch (error) {
        console.error('Error clearing selection:', error);
    }
}

function deleteSelectedReservations() {
    try {
        const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox:checked');
        
        if (reservationCheckboxes.length === 0) {
            showNotification('Please select reservations to delete.', 'warning');
            return;
        }
        
        if (!confirm(`Are you sure you want to delete ${reservationCheckboxes.length} selected reservation(s)?`)) {
            return;
        }
        
        const reservationIds = Array.from(reservationCheckboxes).map(checkbox => checkbox.value);
        
        // Send bulk delete request
        fetch('/bulk_delete_reservations/', {
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
            console.error('Error deleting reservations:', error);
            showNotification('Error deleting reservations', 'error');
        });
    } catch (error) {
        console.error('Error deleting selected reservations:', error);
        showNotification('Error deleting reservations', 'error');
    }
}

// Initialize bulk selection when page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Add event listeners to individual checkboxes
        const reservationCheckboxes = document.querySelectorAll('.reservation-checkbox');
        reservationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateBulkActions);
        });
        
        // Initialize bulk actions
        updateBulkActions();
    } catch (error) {
        console.error('Error initializing reservation management:', error);
    }
});

// Notification system
function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation by adding show class after a small delay
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                // Wait for animation to complete before removing
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
        alert(message);
    }
}







// Initialize status colors when page loads
document.addEventListener('DOMContentLoaded', function() {
    applyStatusColors();
    console.log('Status colors applied to all badges');
});

// Generate reservation facture
function generateReservationFacture(reservationId, clientName, animalName, service, price, date) {
    try {
        // Validate inputs
        if (!reservationId || !clientName) {
            showNotification('Données de réservation manquantes!', 'error');
            return;
        }
        
        // Parse price
        const servicePrice = parseFloat(price) || 0;
        const tax = servicePrice * 0.20; // 20% TVA
        const total = servicePrice + tax;
        
        // Generate receipt number
        const receiptNumber = 'FAC-RES-' + reservationId.toString().padStart(4, '0');
        
        // Get current date and time
        const now = new Date();
        const receiptDate = now.toLocaleDateString('fr-FR');
        const receiptTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        // Create facture content
        const factureHTML = `
            <div class="facture-container">
                <div class="facture-header">
                    <h2><i class="fas fa-file-invoice"></i> Facture Vétérinaire</h2>
                    <div class="facture-info">
                        <p><strong>Facture N°:</strong> ${receiptNumber}</p>
                        <p><strong>Date d'émission:</strong> ${receiptDate} à ${receiptTime}</p>
                        <p><strong>Date de service:</strong> ${date}</p>
                    </div>
                </div>
                
                <div class="facture-client-info">
                    <h3>Informations Client</h3>
                    <p><strong>Client:</strong> ${clientName}</p>
                    <p><strong>Animal:</strong> ${animalName}</p>
                </div>
                
                <div class="facture-body">
                    <table class="facture-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Prix HT</th>
                                <th>TVA (20%)</th>
                                <th>Total TTC</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${service}</td>
                                <td>${date}</td>
                                <td>${servicePrice.toFixed(2)} MAD</td>
                                <td>${tax.toFixed(2)} MAD</td>
                                <td><strong>${total.toFixed(2)} MAD</strong></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="facture-totals">
                        <div class="total-row">
                            <span>Sous-total HT:</span>
                            <span>${servicePrice.toFixed(2)} MAD</span>
                        </div>
                        <div class="total-row">
                            <span>TVA (20%):</span>
                            <span>${tax.toFixed(2)} MAD</span>
                        </div>
                        <div class="total-row grand-total">
                            <span><strong>Total TTC:</strong></span>
                            <span><strong>${total.toFixed(2)} MAD</strong></span>
                        </div>
                    </div>
                </div>
                
                <div class="facture-footer">
                    <p>Merci pour votre confiance!</p>
                    <p>VetStock - Système de Gestion Vétérinaire</p>
                    <p>Cette facture est générée automatiquement</p>
                </div>
            </div>
        `;
        
        // Show facture modal
        showFactureModal(factureHTML);
        
    } catch (error) {
        console.error('Error generating reservation facture:', error);
        showNotification('Erreur lors de la génération de la facture!', 'error');
    }
}

// Show facture modal
function showFactureModal(factureHTML) {
    try {
        // Remove existing facture modal if any
        const existingModal = document.getElementById('facture-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create facture modal
        const modal = document.createElement('div');
        modal.id = 'facture-modal';
        modal.className = 'facture-modal';
        modal.innerHTML = `
            <div class="facture-modal-overlay" onclick="closeFactureModal()"></div>
            <div class="facture-modal-content">
                <div class="facture-modal-header">
                    <h3><i class="fas fa-file-invoice"></i> Facture Générée</h3>
                    <button class="btn-close-facture" onclick="closeFactureModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="facture-modal-body">
                    ${factureHTML}
                </div>
                <div class="facture-modal-footer">
                    <div class="facture-actions">
                        <button class="btn btn-secondary" onclick="printFacture()">
                            <i class="fas fa-print"></i> Imprimer
                        </button>
                        <button class="btn btn-primary" onclick="downloadFacture()">
                            <i class="fas fa-download"></i> Télécharger
                        </button>
                        <button class="btn btn-success" onclick="closeFactureModal()">
                            <i class="fas fa-check"></i> Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
    } catch (error) {
        console.error('Error showing facture modal:', error);
        showNotification('Erreur lors de l\'affichage de la facture!', 'error');
    }
}

// Close facture modal
function closeFactureModal() {
    const modal = document.getElementById('facture-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Print facture
function printFacture() {
    try {
        const factureContent = document.querySelector('.facture-container');
        if (factureContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Facture Vétérinaire</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .facture-container { max-width: 800px; margin: 0 auto; }
                            .facture-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #013847; padding-bottom: 20px; }
                            .facture-header h2 { color: #013847; margin: 0 0 15px 0; }
                            .facture-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
                            .facture-client-info { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                            .facture-client-info h3 { color: #013847; margin: 0 0 10px 0; }
                            .facture-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                            .facture-table th { background: #013847; color: white; padding: 12px; text-align: left; }
                            .facture-table td { padding: 12px; border-bottom: 1px solid #ddd; }
                            .facture-totals { border-top: 3px solid #013847; padding-top: 15px; margin-top: 20px; }
                            .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
                            .grand-total { font-size: 1.2em; border-top: 1px solid #013847; padding-top: 10px; }
                            .facture-footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
                        </style>
                    </head>
                    <body>
                        ${factureContent.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    } catch (error) {
        console.error('Error printing facture:', error);
        showNotification('Erreur lors de l\'impression!', 'error');
    }
}

// Download facture as PDF (simplified version)
function downloadFacture() {
    try {
        // For now, we'll just show a message
        showNotification('Fonctionnalité de téléchargement en cours de développement!', 'info');
    } catch (error) {
        console.error('Error downloading facture:', error);
        showNotification('Erreur lors du téléchargement!', 'error');
    }
}

// Show notification function (if not already defined)
function showNotification(message, type = 'success') {
    try {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set notification content and type
        notification.innerHTML = `
            <div class="notification-content ${type}">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Show notification
        notification.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
        alert(message); // Fallback to alert
    }
}