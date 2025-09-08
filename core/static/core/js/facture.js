// Facture Page JavaScript Functionality

function facturedate() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if(day < 10) day = "0" + day;
    if(month < 10) month = "0" + month;

    document.getElementById("facture-date").innerHTML = day + "/" + month + "/" + year;
}

function loadFactureData() {
    try {
        // Load cart data from localStorage
        const cartData = localStorage.getItem('factureCart');
        const factureDate = localStorage.getItem('factureDate');
        
        if (!cartData) {
            // No cart data, show empty state
            document.getElementById('facture-items').innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #718096;">Aucun article dans la facture</td></tr>';
            return;
        }

        const cart = JSON.parse(cartData);
        const tbody = document.getElementById('facture-items');
        let subtotal = 0;

        // Clear existing content
        tbody.innerHTML = '';

        // Populate table with cart items
        cart.forEach(item => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} MAD</td>
                <td>${itemTotal.toFixed(2)} MAD</td>
            `;
            tbody.appendChild(row);
        });

        // Calculate totals
        const tva = subtotal * 0.20; // 20% TVA
        const grandTotal = subtotal + tva;

        // Update totals display
        document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' MAD';
        document.getElementById('tva').textContent = tva.toFixed(2) + ' MAD';
        document.getElementById('grand-total').textContent = grandTotal.toFixed(2) + ' MAD';

        // Update date if available
        if (factureDate) {
            const date = new Date(factureDate);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            document.getElementById("facture-date").innerHTML = day + "/" + month + "/" + year;
        }

    } catch (error) {
        console.error('Error loading facture data:', error);
        document.getElementById('facture-items').innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #DC2626;">Erreur lors du chargement des données</td></tr>';
    }
}

function clearFactureData() {
    // Clear the cart data from localStorage after generating facture
    localStorage.removeItem('factureCart');
    localStorage.removeItem('factureDate');
}

// Client Information Management
function editClientInfo() {
    const displayDiv = document.getElementById('client-info-display');
    const editDiv = document.getElementById('client-info-edit');
    const editBtn = document.getElementById('btn-edit-client');
    
    // Hide display, show edit form
    displayDiv.style.display = 'none';
    editDiv.style.display = 'block';
    editBtn.style.display = 'none';
    
    // Populate edit fields with current values
    document.getElementById('edit-name').value = document.getElementById('client-name').textContent;
    document.getElementById('edit-phone').value = document.getElementById('client-phone').textContent;
    document.getElementById('edit-email').value = document.getElementById('client-email').textContent;
    
    // Focus on first input
    document.getElementById('edit-name').focus();
}

function saveClientInfo() {
    const name = document.getElementById('edit-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    
    // Basic validation
    if (!name || !phone || !email) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    // Update display values
    document.getElementById('client-name').textContent = name;
    document.getElementById('client-phone').textContent = phone;
    document.getElementById('client-email').textContent = email;
    
    // Save to localStorage
    localStorage.setItem('factureClientName', name);
    localStorage.setItem('factureClientPhone', phone);
    localStorage.setItem('factureClientEmail', email);
    
    // Show success message
    showClientNotification('Informations client mises à jour avec succès!', 'success');
    
    // Return to display mode
    cancelEditClient();
}

function cancelEditClient() {
    const displayDiv = document.getElementById('client-info-display');
    const editDiv = document.getElementById('client-info-edit');
    const editBtn = document.getElementById('btn-edit-client');
    
    // Show display, hide edit form
    displayDiv.style.display = 'block';
    editDiv.style.display = 'none';
    editBtn.style.display = 'block';
}

function showClientNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `client-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function loadClientInfo() {
    // Load client info from localStorage if available
    const savedName = localStorage.getItem('factureClientName');
    const savedPhone = localStorage.getItem('factureClientPhone');
    const savedEmail = localStorage.getItem('factureClientEmail');
    
    if (savedName) document.getElementById('client-name').textContent = savedName;
    if (savedPhone) document.getElementById('client-phone').textContent = savedPhone;
    if (savedEmail) document.getElementById('client-email').textContent = savedEmail;
}

// Load facture data when page loads
window.onload = function() {
    facturedate();
    loadFactureData();
    loadClientInfo();
};

// Clear data when printing (optional)
window.addEventListener('beforeprint', clearFactureData);
