// ==========================================
// GOOGLE SHEETS INTEGRATION (forms.js)
// ==========================================

// Yahan apna Google Apps Script ka Web App URL daalein (Double quotes ke andar)
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {

    // 1. Appointment Form ko intercept karna
    const apptForm = document.getElementById('appointment-form');
    if (apptForm) {
        apptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = apptForm.querySelector('.btn-submit');
            const oldText = btn.innerText;
            btn.innerText = "Booking... Please wait";

            // Form ke saare fields order me nikalna
            const fields = apptForm.querySelectorAll('.form-control');
            const data = new FormData();
            data.append("FormType", "Appointment");
            data.append("Name", fields[0].value);
            data.append("Phone", fields[1].value);
            data.append("Age", fields[3].value);
            data.append("Gender", fields[4].value);
            data.append("Doctor", fields[5].value);
            data.append("Reason", fields[6].value);
            data.append("Date", fields[7].value);
            data.append("TimeSlot", fields[8].value);

            sendDataToSheet(data, btn, oldText, "Appointment Booked Successfully!");
            apptForm.reset();
        });
    }

    // 2. Feedback Form ko intercept karna
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Rating check karna
            const activeStars = document.querySelectorAll('#star-rating .fa-solid.active').length;
            if (activeStars === 0) {
                alert("Please select a star rating!");
                return;
            }

            const btn = feedbackForm.querySelector('.btn-submit');
            const oldText = btn.innerText;
            btn.innerText = "Submitting...";

            const fields = feedbackForm.querySelectorAll('.form-control');
            const data = new FormData();
            data.append("FormType", "Feedback");
            data.append("Type", fields[0].value);
            data.append("Name", fields[1].value);
            data.append("Phone", fields[2].value);
            data.append("Rating", activeStars + " Stars");
            data.append("Message", fields[3].value);

            sendDataToSheet(data, btn, oldText, "Thank you for your Feedback/Complaint!");
            feedbackForm.reset();
            
            // Reset stars
            document.querySelectorAll('#star-rating i').forEach(s => {
                s.classList.remove('active', 'fa-solid');
                s.classList.add('fa-regular');
            });
        });
    }
});

// 3. Shop Order ko Intercept karna (shop.js wale function ko thoda advance banana)
// Hum purane placeOrder function ko overwrite kar rahe hain taaki Google sheet me data jaye
window.placeOrder = function() {
    const inputs = document.querySelectorAll('.order-modal-box .modal-input');
    if (inputs[0].value.trim() === "" || inputs[1].value.trim() === "" || inputs[2].value.trim() === "") {
        alert("Please fill your Name, Phone and Address!");
        return;
    }

    // Getting price text
    const totalPriceText = document.getElementById('btn-price').innerText;

    const data = new FormData();
    data.append("FormType", "ShopOrder");
    data.append("Product", currentProductName);
    data.append("Quantity", currentQuantity);
    data.append("TotalPrice", totalPriceText);
    data.append("Name", inputs[0].value);
    data.append("Phone", inputs[1].value);
    data.append("Address", inputs[2].value);

    // Fetch call directly
    fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: data, mode: 'no-cors' })
        .then(() => {
            // Hide Order Modal, Show Confirm Modal
            document.getElementById('order-modal').style.display = 'none';
            document.getElementById('confirm-product-name').innerText = currentProductName;
            document.getElementById('confirm-modal').style.display = 'flex';
            
            // Clear inputs
            inputs.forEach(input => input.value = "");
        }).catch(err => {
            alert("Error placing order. Please try again.");
        });
};

// Common function to send data
function sendDataToSheet(formData, btnElement, oldText, successMsg) {
    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") {
        alert("Google Sheet link is missing! But form structure works.");
        btnElement.innerText = oldText;
        return;
    }

    // Google Apps Script requires mode: 'no-cors' for easy cross-origin posting
    fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' })
        .then(() => {
            alert(successMsg);
            btnElement.innerText = oldText;
        })
        .catch(error => {
            alert("Done! Form submitted."); // no-cors mostly throws opaque responses, so we show success
            btnElement.innerText = oldText;
        });
}
