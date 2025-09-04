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

// Function to generate facture for a reservation
function generateFacture(reservationId) {
    try {
        console.log('Generating facture for reservation ID:', reservationId);
        
        // Show loading notification
        showNotification('Génération de la facture en cours...', 'info');
        
        // Get reservation data from the current page
        const reservationRow = document.querySelector(`input[value="${reservationId}"]`)?.closest('tr');
        if (!reservationRow) {
            showNotification('Données de réservation non trouvées', 'error');
            return;
        }
        
        // Extract reservation data from the table row
        const cells = reservationRow.querySelectorAll('td');
        const clientName = cells[1]?.textContent?.trim() || 'N/A';
        const animalInfo = cells[2]?.textContent?.trim() || 'N/A';
        const dateTime = cells[3]?.textContent?.trim() || 'N/A';
        const service = cells[4]?.textContent?.trim() || 'N/A';
        const status = cells[5]?.textContent?.trim() || 'N/A';
        const price = cells[6]?.textContent?.trim() || '0.00 MAD';
        
        // Parse animal name and type
        const animalMatch = animalInfo.match(/^(.+?)\s*\((.+?)\)$/);
        const animalName = animalMatch ? animalMatch[1] : animalInfo;
        const animalType = animalMatch ? animalMatch[2] : 'N/A';
        
        // Generate facture content
        const factureContent = generateFactureContent({
            id: reservationId,
            clientName: clientName,
            animalName: animalName,
            animalType: animalType,
            dateTime: dateTime,
            service: service,
            status: status,
            price: price
        });
        
        // Simulate facture generation
        setTimeout(() => {
            // Create and display facture modal
            showFactureModal(factureContent);
            showNotification('Facture générée avec succès!', 'success');
        }, 1500);
        
    } catch (error) {
        console.error('Error generating facture:', error);
        showNotification('Erreur lors de la génération de la facture', 'error');
    }
}

// Function to generate facture content
function generateFactureContent(reservationData) {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const currentTime = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return {
        factureNumber: `FAC-${reservationData.id}-${Date.now().toString().slice(-6)}`,
        date: currentDate,
        time: currentTime,
        reservation: reservationData
    };
}

// Function to show facture modal
function showFactureModal(factureData) {
    try {
        // Remove existing facture modal if any
        const existingModal = document.getElementById('factureModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create facture modal
        const modal = document.createElement('div');
        modal.id = 'factureModal';
        modal.className = 'facture-modal';
        modal.innerHTML = `
            <div class="facture-modal-overlay" onclick="closeFactureModal()"></div>
            <div class="facture-modal-content">
                <div class="facture-header">
                    <h2><i class="fas fa-file-invoice"></i> Facture Vétérinaire</h2>
                    <button class="btn-close-facture" onclick="closeFactureModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="facture-body">
                    <!-- Facture Info -->
                    <div class="facture-info">
                        <div class="facture-number">
                            <strong>Facture N°:</strong> ${factureData.factureNumber}
                        </div>
                        <div class="facture-date">
                            <strong>Date:</strong> ${factureData.date} à ${factureData.time}
                        </div>
                    </div>
                    
                    <!-- Client Information -->
                    <div class="facture-section">
                        <h3><i class="fas fa-user"></i> Informations Client</h3>
                        <div class="client-info">
                            <div class="info-row">
                                <span class="label">Nom complet:</span>
                                <span class="value">${factureData.reservation.clientName}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Animal Information -->
                    <div class="facture-section">
                        <h3><i class="fas fa-paw"></i> Informations Animal</h3>
                        <div class="animal-info">
                            <div class="info-row">
                                <span class="label">Nom:</span>
                                <span class="value">${factureData.reservation.animalName}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Type:</span>
                                <span class="value">${factureData.reservation.animalType}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Service Information -->
                    <div class="facture-section">
                        <h3><i class="fas fa-stethoscope"></i> Détails du Service</h3>
                        <div class="service-info">
                            <div class="info-row">
                                <span class="label">Service:</span>
                                <span class="value">${factureData.reservation.service}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Date du rendez-vous:</span>
                                <span class="value">${factureData.reservation.dateTime}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Statut:</span>
                                <span class="value status-${factureData.reservation.status.toLowerCase()}">${factureData.reservation.status}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pricing -->
                    <div class="facture-section pricing-section">
                        <h3><i class="fas fa-coins"></i> Détails de Facturation</h3>
                        <div class="pricing-table">
                            <div class="pricing-row">
                                <span class="service-name">${factureData.reservation.service}</span>
                                <span class="service-price">${factureData.reservation.price}</span>
                            </div>
                            <div class="pricing-row total-row">
                                <span class="total-label">Total:</span>
                                <span class="total-price">${factureData.reservation.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="facture-footer">
                    <div class="facture-actions">
                        <button class="btn btn-secondary" onclick="closeFactureModal()">
                            <i class="fas fa-times"></i> Fermer
                        </button>
                        <button class="btn btn-primary" onclick="printFacture()">
                            <i class="fas fa-print"></i> Imprimer
                        </button>
                        <button class="btn btn-success" onclick="downloadFacture()">
                            <i class="fas fa-download"></i> Télécharger PDF
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
        showNotification('Erreur lors de l\'affichage de la facture', 'error');
    }
}

// Function to close facture modal
function closeFactureModal() {
    const modal = document.getElementById('factureModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Function to print facture
function printFacture() {
    try {
        const factureContent = document.querySelector('.facture-modal-content');
        if (factureContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Facture Vétérinaire</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .facture-header { text-align: center; margin-bottom: 30px; }
                            .facture-section { margin-bottom: 20px; }
                            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                            .pricing-table { border: 1px solid #ccc; padding: 15px; }
                            .total-row { border-top: 2px solid #000; font-weight: bold; }
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
        showNotification('Erreur lors de l\'impression', 'error');
    }
}

// Function to download facture as PDF (placeholder)
function downloadFacture() {
    // Placeholder function - Implement PDF generation logic here
    console.log('Downloading facture as PDF...');
    showNotification('Fonctionnalité de téléchargement PDF en cours de développement', 'info');
}

