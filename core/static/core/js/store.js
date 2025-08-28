// Store Page JavaScript Functionality

// Shopping cart functionality
let cart = [];

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Add to cart function
function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Product added to cart!', 'success');
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Product removed from cart!', 'info');
}

// Update quantity function
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const modalCartCount = document.getElementById('modal-cart-count');
    const modalCartTotal = document.getElementById('modal-cart-total');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update header cart
    cartCount.textContent = totalItems;
    cartTotal.textContent = '$' + total.toFixed(2);
    
    // Update modal cart
    if (modalCartCount && modalCartTotal) {
        modalCartCount.textContent = totalItems;
        modalCartTotal.textContent = '$' + total.toFixed(2);
    }
    
    // Save cart to localStorage
    localStorage.setItem('storeCart', JSON.stringify(cart));
}

// Update cart modal content
function updateCartModal() {
    const container = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    
    if (cart.length === 0) {
        if (container) container.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
    } else {
        if (container) container.style.display = 'block';
        if (emptyMessage) emptyMessage.style.display = 'none';
        
        if (container) {
            container.innerHTML = '';
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="btn-quantity" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="btn-remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(itemElement);
            });
        }
    }
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('storeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    updateCart();
    updateCartModal();
    showNotification('Cart cleared!', 'info');
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showNotification('Redirecting to checkout...', 'success');
    setTimeout(() => {
        closeCartModal();
    }, 1500);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('cart-notification');
    const messageElement = document.getElementById('notification-message');
    
    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.className = `cart-notification notification-${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCart();
});
