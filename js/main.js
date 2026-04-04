// ==========================================
// MAIN CLINIC WEBSITE LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sidebar Navigation Toggle
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.style.display = 'block';
        });
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // 2. Announcement Banner Logic
    const announcementBanner = document.getElementById('announcement-banner');
    const announcementText = document.getElementById('announcement-text');

    function showAnnouncement(message) {
        if (announcementBanner && announcementText) {
            announcementBanner.style.display = 'block';
            announcementText.innerText = message;
        }
    }
    // Example: showAnnouncement("Clinic will be closed tomorrow.");

    // 3. Appointment Form Handling
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Appointment Booked Successfully! (Next step: Connect to Google Sheets)");
            appointmentForm.reset();
        });
    }

    // 4. Health Care Grid Click
    const healthCareGrid = document.querySelector('.grid-item:nth-child(2)');
    if (healthCareGrid) {
        healthCareGrid.addEventListener('click', () => {
            window.location.href = 'pages/healthcare.html';
        });
    }

    // 5. URL check (agar Health Care se "Ask AI" daba kar aaya hai)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openchat') === 'true') {
        const chatWrapper = document.getElementById('chat-wrapper');
        if (chatWrapper) chatWrapper.classList.add('active');
    }

    // 6. Feedback Form Handling
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        const stars = document.querySelectorAll('#star-rating i');
        let selectedRating = 0;

        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = star.getAttribute('data-value');
                stars.forEach(s => s.classList.remove('active', 'fa-solid'));
                stars.forEach(s => s.classList.add('fa-regular'));

                for (let i = 0; i < selectedRating; i++) {
                    stars[i].classList.remove('fa-regular');
                    stars[i].classList.add('fa-solid', 'active');
                }
            });
        }); // ← yahan star forEach ka closing bracket tha jo missing tha

        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (selectedRating === 0) {
                alert("Please select a star rating!");
                return;
            }
            alert("Thank you for your feedback! (Next step: Connect to Google Sheets)");
            feedbackForm.reset();
            stars.forEach(s => {
                s.classList.remove('active', 'fa-solid');
                s.classList.add('fa-regular');
            });
            selectedRating = 0;
        });
    }

}); // ← DOMContentLoaded closing