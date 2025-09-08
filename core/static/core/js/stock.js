// Stock Page JavaScript Functionality

// Tab Management System
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeTabs();
        initializeSearch();
        initializeFilters();
        initializeAccessibility();
        initializeModals();
    } catch (error) {
        console.error('Error initializing stock management:', error);
    }
});

// Utility function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Tab functionality
function initializeTabs() {
    try {
        const tabButtons = document.querySelectorAll('.tab-nav-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Update button states
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Update panel visibility
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.setAttribute('aria-hidden', 'true');
                });
                
                const targetPanel = document.getElementById(targetTab + '-panel');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.setAttribute('aria-hidden', 'false');
                }
            });
        });
    } catch (error) {
        console.error('Error initializing tabs:', error);
    }
}

// Search functionality
function initializeSearch() {
    try {
        // Initialize product search
        const productSearchInput = document.getElementById('product-search');
        if (productSearchInput) {
            productSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('.table-row');
                
                rows.forEach(row => {
                    const productName = row.querySelector('.product-name')?.textContent.toLowerCase() || '';
                    const productDesc = row.querySelector('.product-description')?.textContent.toLowerCase() || '';
                    
                    if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }

        // Initialize supplier search
        const supplierSearchInput = document.getElementById('supplier-search');
        if (supplierSearchInput) {
            supplierSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const supplierCards = document.querySelectorAll('.supplier-card');
                const clearButton = document.getElementById('supplier-search-clear');
                
                let hasResults = false;
                
                supplierCards.forEach(card => {
                    const supplierName = card.querySelector('.supplier-name')?.textContent.toLowerCase() || '';
                    const supplierPhone = card.querySelector('.supplier-phone')?.textContent.toLowerCase() || '';
                    const supplierEmail = card.querySelector('.supplier-email')?.textContent.toLowerCase() || '';
                    const supplierAddress = card.querySelector('.supplier-address')?.textContent.toLowerCase() || '';
                    
                    if (supplierName.includes(searchTerm) || 
                        supplierPhone.includes(searchTerm) || 
                        supplierEmail.includes(searchTerm) || 
                        supplierAddress.includes(searchTerm)) {
                        card.style.display = '';
                        hasResults = true;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show/hide clear button
                if (clearButton) {
                    clearButton.style.display = searchTerm ? 'block' : 'none';
                }
                
                // Show no results message if needed
                showSupplierSearchResults(searchTerm, hasResults);
            });
        }

        // Initialize category search
        const categorySearchInput = document.getElementById('category-search');
        if (categorySearchInput) {
            categorySearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const categoryCards = document.querySelectorAll('.category-card');
                const clearButton = document.getElementById('category-search-clear');
                
                let hasResults = false;
                
                categoryCards.forEach(card => {
                    const categoryName = card.querySelector('.category-name')?.textContent.toLowerCase() || '';
                    
                    if (categoryName.includes(searchTerm)) {
                        card.style.display = '';
                        hasResults = true;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show/hide clear button
                if (clearButton) {
                    clearButton.style.display = searchTerm ? 'block' : 'none';
                }
                
                // Show no results message if needed
                showCategorySearchResults(searchTerm, hasResults);
            });
        }
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}

// Filter functionality
function initializeFilters() {
    try {
        const categoryFilter = document.getElementById('category-filter');
        const supplierFilter = document.getElementById('supplier-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyFilters);
        }
        if (supplierFilter) {
            supplierFilter.addEventListener('change', applyFilters);
        }
    } catch (error) {
        console.error('Error initializing filters:', error);
    }
}

function applyFilters() {
    try {
        const categoryValue = document.getElementById('category-filter')?.value || '';
        const supplierValue = document.getElementById('supplier-filter')?.value || '';
        const rows = document.querySelectorAll('.table-row');
        
        rows.forEach(row => {
            const category = row.querySelector('.category-badge')?.textContent || '';
            const supplier = row.querySelector('.supplier-name')?.textContent || '';
            
            const categoryMatch = !categoryValue || category === categoryValue;
            const supplierMatch = !supplierValue || supplier === supplierValue;
            
            if (categoryMatch && supplierMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

// Modal functionality
function initializeModals() {
    try {
        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAddProductModal();
                closeAddCategoryModal();
                closeEditCategoryModal();
                closeAddSupplierModal();
                closeEditSupplierModal();
            }
        });
        
        // Prevent modal close when clicking inside modal content
        const modalContainers = document.querySelectorAll('.modal-container');
        modalContainers.forEach(container => {
            container.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    } catch (error) {
        console.error('Error initializing modals:', error);
    }
}

// Accessibility enhancements
function initializeAccessibility() {
    try {
        // Keyboard navigation for tabs
        const tabButtons = document.querySelectorAll('.tab-nav-btn');
        tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextButton = tabButtons[index + 1] || tabButtons[0];
                    nextButton.focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevButton = tabButtons[index - 1] || tabButtons[tabButtons.length - 1];
                    prevButton.focus();
                }
            });
        });
        
        // Focus management
        document.addEventListener('focusin', function(e) {
            if (e.target.matches('.btn-edit, .btn-delete, .btn-add-product')) {
                e.target.closest('tr, .header-actions')?.classList.add('focused');
            }
        });
        
        document.addEventListener('focusout', function(e) {
            if (e.target.matches('.btn-edit, .btn-delete, .btn-add-product')) {
                e.target.closest('tr, .header-actions')?.classList.remove('focused');
            }
        });
    } catch (error) {
        console.error('Error initializing accessibility:', error);
    }
}

// Add Product Modal Functions
function openAddProductModal() {
    try {
        console.log('openAddProductModal called');
        const modal = document.getElementById('addProductModal');
        console.log('Modal element:', modal);
        
        if (modal) {
            console.log('Modal found, adding active class');
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('product-name');
                if (firstInput) firstInput.focus();
            }, 100);
            
            console.log('Modal should now be visible');
        } else {
            console.error('Modal element not found!');
        }
    } catch (error) {
        console.error('Error opening add product modal:', error);
    }
}

function closeAddProductModal() {
    try {
        const modal = document.getElementById('addProductModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Reset form
            document.getElementById('addProductForm').reset();
            
            // Remove any error states
            document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
                input.classList.remove('error');
            });
            
            // Reset modal to add mode
            document.getElementById('modal-title').innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i> Add New Product';
            document.getElementById('submit-product-btn').innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> Add Product';
            
            // Remove edit ID field if it exists
            const editIdField = document.getElementById('edit-product-id');
            if (editIdField) {
                editIdField.remove();
            }
        }
    } catch (error) {
        console.error('Error closing add product modal:', error);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}" aria-hidden="true"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
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
    }
}

// Search helper functions
function showSupplierSearchResults(searchTerm, hasResults) {
    try {
        const suppliersGrid = document.querySelector('.suppliers-grid');
        if (!suppliersGrid) return;
        
        // Remove existing no-results message
        const existingNoResults = suppliersGrid.querySelector('.no-search-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        // If search term exists but no results, show message
        if (searchTerm && !hasResults) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-search-results';
            noResultsDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search empty-icon" aria-hidden="true"></i>
                    <h3>No Suppliers Found</h3>
                    <p>No suppliers match your search: "<strong>${searchTerm}</strong>"</p>
                    <button class="btn-clear-search" onclick="clearSupplierSearch()">
                        <i class="fas fa-times" aria-hidden="true"></i>
                        Clear Search
                    </button>
                </div>
            `;
            suppliersGrid.appendChild(noResultsDiv);
        }
    } catch (error) {
        console.error('Error showing supplier search results:', error);
    }
}

function clearSupplierSearch() {
    try {
        const searchInput = document.getElementById('supplier-search');
        const clearButton = document.getElementById('supplier-search-clear');
        const suppliersGrid = document.querySelector('.suppliers-grid');
        
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        
        if (clearButton) {
            clearButton.style.display = 'none';
        }
        
        // Show all supplier cards
        const supplierCards = document.querySelectorAll('.supplier-card');
        supplierCards.forEach(card => {
            card.style.display = '';
        });
        
        // Remove no results message
        const noResults = suppliersGrid?.querySelector('.no-search-results');
        if (noResults) {
            noResults.remove();
        }
    } catch (error) {
        console.error('Error clearing supplier search:', error);
    }
}

function showCategorySearchResults(searchTerm, hasResults) {
    try {
        const categoriesGrid = document.querySelector('.categories-grid');
        if (!categoriesGrid) return;
        
        // Remove existing no-results message
        const existingNoResults = categoriesGrid.querySelector('.no-search-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        // If search term exists but no results, show message
        if (searchTerm && !hasResults) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-search-results';
            noResultsDiv.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search empty-icon" aria-hidden="true"></i>
                    <h3>No Categories Found</h3>
                    <p>No categories match your search: "<strong>${searchTerm}</strong>"</p>
                    <button class="btn-clear-search" onclick="clearCategorySearch()">
                        <i class="fas fa-times" aria-hidden="true"></i>
                        Clear Search
                    </button>
                </div>
            `;
            categoriesGrid.appendChild(noResultsDiv);
        }
    } catch (error) {
        console.error('Error showing category search results:', error);
    }
}

function clearCategorySearch() {
    try {
        const searchInput = document.getElementById('category-search');
        const clearButton = document.getElementById('category-search-clear');
        const categoriesGrid = document.querySelector('.categories-grid');
        
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        
        if (clearButton) {
            clearButton.style.display = 'none';
        }
        
        // Show all category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.style.display = '';
        });
        
        // Remove no results message
        const noResults = categoriesGrid?.querySelector('.no-search-results');
        if (noResults) {
            noResults.remove();
        }
    } catch (error) {
        console.error('Error clearing category search:', error);
    }
}
