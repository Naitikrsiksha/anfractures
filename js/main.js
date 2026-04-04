// ==========================================
// GLOBAL LOCAL STORAGE ENGINE (For Profile)
// ==========================================
window.logActivity = function(actionDetail) {
    let history = JSON.parse(localStorage.getItem('clinic_history')) || [];
    const date = new Date().toLocaleString();
    history.unshift({ date: date, action: actionDetail });
    localStorage.setItem('clinic_history', JSON.stringify(history));
};

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
        if(sidebar) sidebar.classList.remove('active');
        if(overlay) overlay.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // 2. Language Translator Engine
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            if (typeof siteData !== 'undefined' && siteData[selectedLang]) {
                const texts = siteData[selectedLang]; 

                // Homepage Grid Update
                const gridItems = document.querySelectorAll('.grid-item p');
                if(gridItems.length >= 4) {
                    gridItems[0].innerText = texts.appointment;
                    gridItems[2].innerText = texts.shop;
                    gridItems[3].innerText = texts.feedback;
                }

                // Sidebar Menu Update
                const navLinks = document.querySelectorAll('.nav-links a');
                if(navLinks.length > 0) {
                    navLinks[0].innerHTML = `<i class="fa-solid fa-house"></i> ${texts.home}`;
                    navLinks[1].innerHTML = `<i class="fa-solid fa-calendar-check"></i> ${texts.appointment}`;
                    navLinks[6].innerHTML = `<i class="fa-solid fa-bag-shopping"></i> ${texts.shop}`;
                    navLinks[5].innerHTML = `<i class="fa-regular fa-comment-dots"></i> ${texts.feedback}`;
                }
            }
        });
    }

    // 3. URL check (agar Health Care se "Ask AI" daba kar aaya hai)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openchat') === 'true') {
        const chatWrapper = document.getElementById('chat-wrapper');
        if (chatWrapper) chatWrapper.classList.add('active');
    }

    // 4. Feedback Star UI
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        const stars = document.querySelectorAll('#star-rating i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                let selectedRating = parseInt(star.getAttribute('data-value'));
                stars.forEach(s => {
                    s.classList.remove('active', 'fa-solid');
                    s.classList.add('fa-regular');
                });
                for (let i = 0; i < selectedRating; i++) {
                    stars[i].classList.remove('fa-regular');
                    stars[i].classList.add('fa-solid', 'active');
                }
            });
        });
    }
});
