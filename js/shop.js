// ==========================================
// ORTHOPAEDIC SHOP LOGIC
// ==========================================

let currentProductPrice = 0;
let currentQuantity = 1;
let currentProductName = "";

// 1. Open Order Modal
function openOrderModal(productName, price) {
    const orderModal = document.getElementById('order-modal');
    if (!orderModal) return;

    currentProductName = productName;
    currentProductPrice = price;
    currentQuantity = 1;

    document.getElementById('modal-product-name').innerText = 'Order: ' + productName;
    document.getElementById('modal-product-price').innerText = '₹' + price;
    
    // Reset quantity display & Total button price
    updateQuantityUI();
    
    orderModal.style.display = 'flex';
}

// 2. Close All Modals
function closeModals() {
    const orderModal = document.getElementById('order-modal');
    const confirmModal = document.getElementById('confirm-modal');
    
    if (orderModal) orderModal.style.display = 'none';
    if (confirmModal) confirmModal.style.display = 'none';
}

// 3. Change Quantity (Minus / Plus)
function changeQuantity(amount) {
    currentQuantity += amount;
    if (currentQuantity < 1) currentQuantity = 1; // Minimum 1 item zaroori hai
    updateQuantityUI();
}

// 4. Update UI for Price and Quantity
function updateQuantityUI() {
    // Find the span that holds the number '1' inside the flex div in the modal
    const quantitySpan = document.querySelector('.order-modal-box div span');
    if (quantitySpan) {
        quantitySpan.innerText = currentQuantity;
    }

    const total = currentProductPrice * currentQuantity;
    const btnPrice = document.getElementById('btn-price');
    if (btnPrice) {
        btnPrice.innerText = '₹' + total;
    }
}

// 5. Place Order (Show Confirmation)
function placeOrder() {
    const inputs = document.querySelectorAll('.order-modal-box .modal-input');
    let isValid = true;
    
    // Basic validation check
    inputs.forEach(input => {
        if (input.value.trim() === "") isValid = false;
    });

    if (!isValid) {
        alert("Please fill your Name, Phone and Address!");
        return;
    }

    // Hide Order Modal, Show Confirm Modal
    document.getElementById('order-modal').style.display = 'none';
    
    const confirmModal = document.getElementById('confirm-modal');
    document.getElementById('confirm-product-name').innerText = currentProductName;
    
    confirmModal.style.display = 'flex';

    // Clear inputs for next time
    inputs.forEach(input => input.value = "");
}

// 6. Hook up the Plus/Minus buttons inside the Order Modal automatically
document.addEventListener('DOMContentLoaded', () => {
    const modalButtons = document.querySelectorAll('.order-modal-box div button');
    if (modalButtons.length >= 2) {
        modalButtons[0].addEventListener('click', () => changeQuantity(-1)); // Minus Button
        modalButtons[1].addEventListener('click', () => changeQuantity(1));  // Plus Button
    }

    // Add active class toggle for Shop Categories
    const categoryBadges = document.querySelectorAll('.category-badge');
    categoryBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            categoryBadges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
        });
    });
});
