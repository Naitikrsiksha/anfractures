let currentProductPrice = 0;
let currentQuantity = 1;
let currentProductName = "";

function openOrderModal(productName, price) {
    const orderModal = document.getElementById('order-modal');
    if (!orderModal) return;
    currentProductName = productName;
    currentProductPrice = price;
    currentQuantity = 1;
    document.getElementById('modal-product-name').innerText = 'Order: ' + productName;
    document.getElementById('modal-product-price').innerText = '₹' + price;
    updateQuantityUI();
    orderModal.style.display = 'flex';
}

function closeModals() {
    const orderModal = document.getElementById('order-modal');
    const confirmModal = document.getElementById('confirm-modal');
    if (orderModal) orderModal.style.display = 'none';
    if (confirmModal) confirmModal.style.display = 'none';
}

function changeQuantity(amount) {
    currentQuantity += amount;
    if (currentQuantity < 1) currentQuantity = 1;
    updateQuantityUI();
}

function updateQuantityUI() {
    const quantitySpan = document.querySelector('.order-modal-box div span');
    if (quantitySpan) quantitySpan.innerText = currentQuantity;
    const total = currentProductPrice * currentQuantity;
    const btnPrice = document.getElementById('btn-price');
    if (btnPrice) btnPrice.innerText = '₹' + total;
}

document.addEventListener('DOMContentLoaded', () => {
    // Modal buttons
    const modalButtons = document.querySelectorAll('.order-modal-box div button');
    if (modalButtons.length >= 2) {
        modalButtons[0].addEventListener('click', () => changeQuantity(-1));
        modalButtons[1].addEventListener('click', () => changeQuantity(1));
    }

    // Categories
    const categoryBadges = document.querySelectorAll('.category-badge');
    categoryBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            categoryBadges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
        });
    });

    // ADD TO CART FIX
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('.product-title').innerText;
            if(window.logActivity) window.logActivity("Added to Cart: " + title);
            alert(`🛒 ${title} has been added to your cart! (Saved in profile)`);
        });
    });
});
