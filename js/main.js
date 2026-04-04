// ==========================================
// MAIN CLINIC WEBSITE LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------
    // 1. Sidebar Navigation Toggle
    // ----------------------------------------
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
        if(sidebar) sidebar.classList.remove('active');
        if(overlay) overlay.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);


    // ----------------------------------------
    // 2. Announcement Banner Logic
    // ----------------------------------------
    const announcementBanner = document.getElementById('announcement-banner');
    const announcementText = document.getElementById('announcement-text');

    function showAnnouncement(message) {
        if (announcementBanner && announcementText) {
            announcementBanner.style.display = 'block';
            announcementText.innerText = message;
        }
    }


    // ----------------------------------------
    // 3. Language Translator (6 Languages Engine)
    // ----------------------------------------
    const langSelector = document.getElementById('language-selector');
    
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            
            // siteData humara data.js file se aayega
            if (typeof siteData !== 'undefined' && siteData[selectedLang]) {
                const texts = siteData[selectedLang]; 

                // A. Homepage Grid Menu Update
                const gridItems = document.querySelectorAll('.grid-item p');
                if(gridItems.length >= 4) {
                    gridItems[0].innerText = texts.appointment;
                    // Index 1 Health Care hai, use same rakhte hain ya aap data.js me add kar sakte hain
                    gridItems[2].innerText = texts.shop;
                    gridItems[3].innerText = texts.feedback;
                }

                // B. Sidebar Menu Update
                const navLinks = document.querySelectorAll('.nav-links a');
                navLinks.forEach(link => {
                    const html = link.innerHTML;
                    // Icon check karke text change kar rahe hain taaki icon delete na ho
                    if(html.includes('fa-house')) link.innerHTML = `<i class="fa-solid fa-house"></i> ${texts.home}`;
                    if(html.includes('fa-calendar-check')) link.innerHTML = `<i class="fa-solid fa-calendar-check"></i> ${texts.appointment}`;
                    if(html.includes('fa-bag-shopping')) link.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> ${texts.shop}`;
                    if(html.includes('fa-comment-dots')) link.innerHTML = `<i class="fa-regular fa-comment-dots"></i> ${texts.feedback}`;
                });
            } else {
                console.warn("Language data missing! data.js check karein.");
            }
        });
    }


    // ----------------------------------------
    // 4. URL check (agar Health Care se "Ask AI" dabaya)
    // ----------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openchat') === 'true') {
        const chatWrapper = document.getElementById('chat-wrapper');
        if (chatWrapper) chatWrapper.classList.add('active');
    }


    // ----------------------------------------
    // 5. Feedback Form (Star Rating Design)
    // ----------------------------------------
    // Note: Form ka main 'submit' logic forms.js me hai Google Sheets ke liye.
    // Yahan sirf Star par click karne ka design logic hai.
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        const stars = document.querySelectorAll('#star-rating i');
        let selectedRating = 0;

        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.getAttribute('data-value'));
                
                // Pehle saare stars ko empty (regular) kar do
                stars.forEach(s => {
                    s.classList.remove('active', 'fa-solid');
                    s.classList.add('fa-regular');
                });

                // Phir click kiye hue star tak sabko fill (solid) kar do
                for (let i = 0; i < selectedRating; i++) {
                    stars[i].classList.remove('fa-regular');
                    stars[i].classList.add('fa-solid', 'active');
                }
            });
        });
    }

}); // DOMContentLoaded ka final closing bracket
