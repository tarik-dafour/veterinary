// Stock Page JavaScript Functionality
console.log('Stock.js loaded successfully!');

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
window.openAddProductModal = function() {
    try {
        console.log('openAddProductModal called');
        const modal = document.getElementById('addProductModal');
        console.log('Modal element:', modal);
        
        if (modal) {
            console.log('Modal found, adding active class');
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Check if modal is visible
            console.log('Modal classes:', modal.className);
            console.log('Modal display style:', window.getComputedStyle(modal).display);
            console.log('Modal visibility:', window.getComputedStyle(modal).visibility);
            
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

window.closeAddProductModal = function() {
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

// Product Management Functions
window.editProduct = function(productId) {
    try {
        console.log('editProduct called with ID:', productId);
        console.log('Product ID type:', typeof productId);
        
        // Get product data from the table row
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (!row) {
            console.error('Product row not found for ID:', productId);
            showNotification('Product not found', 'error');
            return;
        }
        
        // Extract product data from the row
        const productName = row.querySelector('.product-name')?.textContent || '';
        const productDescription = row.querySelector('.product-description')?.textContent || '';
        const categoryName = row.querySelector('.category-badge')?.textContent || '';
        const supplierName = row.querySelector('.supplier-name')?.textContent || '';
        const priceText = row.querySelector('.price-amount')?.textContent || '';
        const quantityText = row.querySelector('.quantity-display')?.textContent || '';
        const expirationText = row.querySelector('.expiration-date')?.textContent || '';
        
        // Parse price (remove 'DH' and convert to number)
        const price = parseFloat(priceText.replace(' DH', '')) || 0;
        
        // Parse quantity
        const quantity = parseInt(quantityText) || 0;
        
        // Parse expiration date (convert from "M d, Y" format to "YYYY-MM-DD")
        let expirationDate = '';
        if (expirationText) {
            try {
                const date = new Date(expirationText);
                expirationDate = date.toISOString().split('T')[0];
            } catch (e) {
                console.error('Error parsing expiration date:', e);
            }
        }
        
        // Open the add product modal
        console.log('Opening add product modal...');
        openAddProductModal();
        
        // Update modal title and button
        document.getElementById('modal-title').innerHTML = '<i class="fas fa-edit" aria-hidden="true"></i> Edit Product';
        document.getElementById('submit-product-btn').innerHTML = '<i class="fas fa-save" aria-hidden="true"></i> Update Product';
        
        // Add hidden input for edit ID
        let editIdField = document.getElementById('edit-product-id');
        if (!editIdField) {
            editIdField = document.createElement('input');
            editIdField.type = 'hidden';
            editIdField.id = 'edit-product-id';
            editIdField.name = 'edit_id';
            document.getElementById('addProductForm').appendChild(editIdField);
        }
        editIdField.value = productId;
        
        // Populate form fields
        document.getElementById('product-name').value = productName;
        document.getElementById('product-description').value = productDescription;
        document.getElementById('product-price').value = price;
        document.getElementById('product-quantity').value = quantity;
        document.getElementById('product-expiration').value = expirationDate;
        
        // Set category (find by name)
        const categorySelect = document.getElementById('product-category');
        if (categorySelect) {
            for (let option of categorySelect.options) {
                if (option.textContent === categoryName) {
                    option.selected = true;
                    break;
                }
            }
        }
        
        // Set supplier (find by name)
        const supplierSelect = document.getElementById('product-supplier');
        if (supplierSelect) {
            for (let option of supplierSelect.options) {
                if (option.textContent === supplierName) {
                    option.selected = true;
                    break;
                }
            }
        }
        
        console.log('Product data populated for editing');
        
    } catch (error) {
        console.error('Error editing product:', error);
        showNotification('Error loading product for editing', 'error');
    }
}

window.deleteProduct = function(productId) {
    try {
        // Get product data for confirmation
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (!row) {
            showNotification('Product not found', 'error');
            return;
        }
        
        const productName = row.querySelector('.product-name')?.textContent || 'Unknown Product';
        
        // Show confirmation dialog
        if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            // Create form and submit
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.location.href;
            
            // Add CSRF token
            const csrfToken = getCookie('csrftoken');
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
            
            // Add delete parameter
            const deleteInput = document.createElement('input');
            deleteInput.type = 'hidden';
            deleteInput.name = 'delete';
            deleteInput.value = productId;
            form.appendChild(deleteInput);
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product', 'error');
    }
}

// Category Management Functions
window.editCategory = function(categoryId) {
    try {
        console.log('editCategory called with ID:', categoryId);
        
        // Get category data from the card
        const card = document.querySelector(`div[data-category-id="${categoryId}"]`);
        if (!card) {
            console.error('Category card not found for ID:', categoryId);
            showNotification('Category not found', 'error');
            return;
        }
        
        const categoryName = card.querySelector('.category-name')?.textContent || '';
        
        // Open the edit category modal
        openEditCategoryModal();
        
        // Populate form fields
        document.getElementById('edit-category-id').value = categoryId;
        document.getElementById('edit-category-name').value = categoryName;
        
        console.log('Category data populated for editing');
        
    } catch (error) {
        console.error('Error editing category:', error);
        showNotification('Error loading category for editing', 'error');
    }
}

window.deleteCategory = function(categoryId) {
    try {
        // Get category data for confirmation
        const card = document.querySelector(`div[data-category-id="${categoryId}"]`);
        if (!card) {
            showNotification('Category not found', 'error');
            return;
        }
        
        const categoryName = card.querySelector('.category-name')?.textContent || 'Unknown Category';
        
        // Show confirmation dialog
        if (confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
            // Create form and submit
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.location.href;
            
            // Add CSRF token
            const csrfToken = getCookie('csrftoken');
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
            
            // Add delete category parameter
            const deleteInput = document.createElement('input');
            deleteInput.type = 'hidden';
            deleteInput.name = 'delete_category';
            deleteInput.value = categoryId;
            form.appendChild(deleteInput);
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        showNotification('Error deleting category', 'error');
    }
}

// Supplier Management Functions
window.editSupplier = function(supplierId) {
    try {
        console.log('editSupplier called with ID:', supplierId);
        
        // Get supplier data from the card
        const card = document.querySelector(`div[data-supplier-id="${supplierId}"]`);
        if (!card) {
            console.error('Supplier card not found for ID:', supplierId);
            showNotification('Supplier not found', 'error');
            return;
        }
        
        const supplierName = card.querySelector('.supplier-name')?.textContent || '';
        const supplierPhone = card.querySelector('.supplier-phone')?.textContent || '';
        const supplierEmail = card.querySelector('.supplier-email')?.textContent || '';
        const supplierAddress = card.querySelector('.supplier-address')?.textContent || '';
        
        // Open the edit supplier modal
        openEditSupplierModal();
        
        // Populate form fields
        document.getElementById('edit-supplier-id').value = supplierId;
        document.getElementById('edit-supplier-name').value = supplierName;
        document.getElementById('edit-supplier-phone').value = supplierPhone;
        document.getElementById('edit-supplier-email').value = supplierEmail;
        document.getElementById('edit-supplier-address').value = supplierAddress;
        
        console.log('Supplier data populated for editing');
        
    } catch (error) {
        console.error('Error editing supplier:', error);
        showNotification('Error loading supplier for editing', 'error');
    }
}

window.deleteSupplier = function(supplierId) {
    try {
        // Get supplier data for confirmation
        const card = document.querySelector(`div[data-supplier-id="${supplierId}"]`);
        if (!card) {
            showNotification('Supplier not found', 'error');
            return;
        }
        
        const supplierName = card.querySelector('.supplier-name')?.textContent || 'Unknown Supplier';
        
        // Show confirmation dialog
        if (confirm(`Are you sure you want to delete "${supplierName}"? This action cannot be undone.`)) {
            // Create form and submit
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.location.href;
            
            // Add CSRF token
            const csrfToken = getCookie('csrftoken');
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
            
            // Add delete supplier parameter
            const deleteInput = document.createElement('input');
            deleteInput.type = 'hidden';
            deleteInput.name = 'delete_supplier';
            deleteInput.value = supplierId;
            form.appendChild(deleteInput);
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
        }
    } catch (error) {
        console.error('Error deleting supplier:', error);
        showNotification('Error deleting supplier', 'error');
    }
}

// Modal Functions for Categories and Suppliers
function openAddCategoryModal() {
    try {
        const modal = document.getElementById('addCategoryModal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('category-name');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    } catch (error) {
        console.error('Error opening add category modal:', error);
    }
}

function closeAddCategoryModal() {
    try {
        const modal = document.getElementById('addCategoryModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Reset form
            document.getElementById('addCategoryForm').reset();
        }
    } catch (error) {
        console.error('Error closing add category modal:', error);
    }
}

function openEditCategoryModal() {
    try {
        const modal = document.getElementById('editCategoryModal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('edit-category-name');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    } catch (error) {
        console.error('Error opening edit category modal:', error);
    }
}

function closeEditCategoryModal() {
    try {
        const modal = document.getElementById('editCategoryModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Reset form
            document.getElementById('editCategoryForm').reset();
        }
    } catch (error) {
        console.error('Error closing edit category modal:', error);
    }
}

function openAddSupplierModal() {
    try {
        const modal = document.getElementById('addSupplierModal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('supplier-name');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    } catch (error) {
        console.error('Error opening add supplier modal:', error);
    }
}

function closeAddSupplierModal() {
    try {
        const modal = document.getElementById('addSupplierModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Reset form
            document.getElementById('addSupplierForm').reset();
        }
    } catch (error) {
        console.error('Error closing add supplier modal:', error);
    }
}

function openEditSupplierModal() {
    try {
        const modal = document.getElementById('editSupplierModal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('edit-supplier-name');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    } catch (error) {
        console.error('Error opening edit supplier modal:', error);
    }
}

function closeEditSupplierModal() {
    try {
        const modal = document.getElementById('editSupplierModal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Reset form
            document.getElementById('editSupplierForm').reset();
        }
    } catch (error) {
        console.error('Error closing edit supplier modal:', error);
    }
}

// Form Submission Handlers
function submitAddProduct(event) {
    try {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = document.getElementById('submit-product-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Submit form
        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to save product');
            }
        })
        .catch(error => {
            console.error('Error saving product:', error);
            showNotification('Error saving product', 'error');
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
        
    } catch (error) {
        console.error('Error submitting add product form:', error);
        showNotification('Error submitting form', 'error');
    }
}

function submitAddCategory(event) {
    try {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = document.getElementById('submit-category-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Submit form
        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to save category');
            }
        })
        .catch(error => {
            console.error('Error saving category:', error);
            showNotification('Error saving category', 'error');
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
        
    } catch (error) {
        console.error('Error submitting add category form:', error);
        showNotification('Error submitting form', 'error');
    }
}

function submitEditCategory(event) {
    try {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = document.getElementById('submit-edit-category-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Submit form
        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to update category');
            }
        })
        .catch(error => {
            console.error('Error updating category:', error);
            showNotification('Error updating category', 'error');
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
        
    } catch (error) {
        console.error('Error submitting edit category form:', error);
        showNotification('Error submitting form', 'error');
    }
}

function submitAddSupplier(event) {
    try {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = document.getElementById('submit-supplier-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Submit form
        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to save supplier');
            }
        })
        .catch(error => {
            console.error('Error saving supplier:', error);
            showNotification('Error saving supplier', 'error');
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
        
    } catch (error) {
        console.error('Error submitting add supplier form:', error);
        showNotification('Error submitting form', 'error');
    }
}

function submitEditSupplier(event) {
    try {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = document.getElementById('submit-edit-supplier-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Submit form
        fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                throw new Error('Failed to update supplier');
            }
        })
        .catch(error => {
            console.error('Error updating supplier:', error);
            showNotification('Error updating supplier', 'error');
        })
        .finally(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
        
    } catch (error) {
        console.error('Error submitting edit supplier form:', error);
        showNotification('Error submitting form', 'error');
    }
}

// Bulk Actions
function updateProductSelection() {
    try {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        const selectAllCheckbox = document.getElementById('select-all-products');
        const bulkActionsBar = document.getElementById('bulk-actions-bar');
        const selectedCount = document.getElementById('selected-count');
        
        let checkedCount = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) checkedCount++;
        });
        
        // Update select all checkbox state
        if (checkedCount === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (checkedCount === checkboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.indeterminate = true;
        }
        
        // Show/hide bulk actions bar
        if (checkedCount > 0) {
            bulkActionsBar.style.display = 'block';
            selectedCount.textContent = checkedCount;
        } else {
            bulkActionsBar.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating product selection:', error);
    }
}

function toggleAllProducts(selectAllCheckbox) {
    try {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateProductSelection();
    } catch (error) {
        console.error('Error toggling all products:', error);
    }
}

function bulkDeleteProducts() {
    try {
        const selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            showNotification('No products selected', 'warning');
            return;
        }
        
        const productNames = Array.from(selectedCheckboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.querySelector('.product-name')?.textContent || 'Unknown Product';
        });
        
        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} product(s)?\n\n${productNames.join('\n')}\n\nThis action cannot be undone.`)) {
            // Create form and submit
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.location.href;
            
            // Add CSRF token
            const csrfToken = getCookie('csrftoken');
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
            
            // Add bulk delete parameter
            const bulkDeleteInput = document.createElement('input');
            bulkDeleteInput.type = 'hidden';
            bulkDeleteInput.name = 'bulk_delete';
            bulkDeleteInput.value = '1';
            form.appendChild(bulkDeleteInput);
            
            // Add selected product IDs
            selectedCheckboxes.forEach(checkbox => {
                const productIdInput = document.createElement('input');
                productIdInput.type = 'hidden';
                productIdInput.name = 'product_ids';
                productIdInput.value = checkbox.value;
                form.appendChild(productIdInput);
            });
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
        }
    } catch (error) {
        console.error('Error bulk deleting products:', error);
        showNotification('Error deleting products', 'error');
    }
}

function clearProductSelection() {
    try {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        const selectAllCheckbox = document.getElementById('select-all-products');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        
        updateProductSelection();
    } catch (error) {
        console.error('Error clearing product selection:', error);
    }
}

