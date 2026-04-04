const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {

    // 1. Appointment Form
    const apptForm = document.getElementById('appointment-form');
    if (apptForm) {
        apptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = apptForm.querySelectorAll('.form-control');
            
            // Validate Phone
            const phoneVal = fields[1].value.trim();
            if (phoneVal.length !== 10 || isNaN(phoneVal)) {
                alert("Please enter exactly 10 digits for Phone Number.");
                return;
            }

            const btn = apptForm.querySelector('.btn-submit');
            const oldText = btn.innerText;
            btn.innerText = "Booking... Please wait";

            const data = new FormData();
            data.append("FormType", "Appointment");
            data.append("Name", fields[0].value);
            data.append("Phone", phoneVal);
            data.append("Age", fields[3].value);
            data.append("Doctor", fields[5].value);
            
            if(window.logActivity) window.logActivity("Booked Appointment with " + fields[5].value);
            sendDataToSheet(data, btn, oldText, "Appointment Booked Successfully!");
            apptForm.reset();
        });
    }

    // 2. Feedback Form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const activeStars = document.querySelectorAll('#star-rating .fa-solid.active').length;
            if (activeStars === 0) {
                alert("Please select a star rating!");
                return;
            }
            const fields = feedbackForm.querySelectorAll('.form-control');
            
            const phoneVal = fields[2].value.trim();
            if (phoneVal.length !== 10 || isNaN(phoneVal)) {
                alert("Please enter exactly 10 digits for Phone Number.");
                return;
            }

            const btn = feedbackForm.querySelector('.btn-submit');
            const oldText = btn.innerText;
            btn.innerText = "Submitting...";

            const data = new FormData();
            data.append("FormType", "Feedback");
            data.append("Name", fields[1].value);
            data.append("Phone", phoneVal);
            data.append("Rating", activeStars + " Stars");

            if(window.logActivity) window.logActivity("Submitted Feedback");
            sendDataToSheet(data, btn, oldText, "Thank you for your Feedback!");
            feedbackForm.reset();
        });
    }
});

// 3. Shop Order API (Strict Check)
window.placeOrder = function() {
    const inputs = document.querySelectorAll('.order-modal-box .modal-input');
    const phoneVal = inputs[1].value.trim();

    // STRICT 10-DIGIT CHECK FOR SHOPPING
    if (phoneVal.length !== 10 || isNaN(phoneVal)) {
        alert("Payment Blocked: Valid 10-digit phone number is mandatory!");
        return;
    }
    
    if (inputs[0].value.trim() === "" || inputs[2].value.trim() === "") {
        alert("Please fill your Name and Address!");
        return;
    }

    const totalPriceText = document.getElementById('btn-price').innerText;
    const data = new FormData();
    data.append("FormType", "ShopOrder");
    data.append("Product", currentProductName);
    data.append("Phone", phoneVal);
    
    if(window.logActivity) window.logActivity("Ordered: " + currentProductName + " (" + totalPriceText + ")");

    // Hide Order Modal, Show Confirm Modal immediately for UX
    document.getElementById('order-modal').style.display = 'none';
    document.getElementById('confirm-product-name').innerText = currentProductName;
    document.getElementById('confirm-modal').style.display = 'flex';
    inputs.forEach(input => input.value = "");

    // Background Fetch
    fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: data, mode: 'no-cors' }).catch(err => console.log(err));
};

function sendDataToSheet(formData, btnElement, oldText, successMsg) {
    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") {
        alert("Success! (Note: Google Sheet URL is not set yet)");
        btnElement.innerText = oldText;
        return;
    }
    fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' })
        .then(() => {
            alert(successMsg);
            btnElement.innerText = oldText;
        })
        .catch(error => {
            alert(successMsg);
            btnElement.innerText = oldText;
        });
}
