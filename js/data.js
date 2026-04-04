// ==========================================
// 1. WEBSITE TRANSLATIONS (6 Languages)
// ==========================================
const siteData = {
    hinglish: { home: "Home", appointment: "Appointment", shop: "Shop", feedback: "Feedback" },
    hindi: { home: "मुख्य पृष्ठ", appointment: "अपॉइंटमेंट", shop: "दुकान", feedback: "सुझाव" },
    english: { home: "Home", appointment: "Appointment", shop: "Shop", feedback: "Feedback" },
    sanskrit: { home: "गृहम्", appointment: "नियुक्तिः", shop: "आपणः", feedback: "प्रतिक्रिया" },
    urdu: { home: "ہوم", appointment: "اپوائنٹمنٹ", shop: "دکان", feedback: "رائے" },
    upLocal: { home: "घरे", appointment: "नंबर लगावल", shop: "दुकानिया", feedback: "राय-मशवरा" }
};

// ==========================================
// 2. AI KNOWLEDGE BASE (Pure Hinglish)
// ==========================================
const aiBrain = [
    {
        keywords: ["hello", "hi", "hey", "namaste", "pranam"],
        response: "Namaste! Main AN Clinic ka AI health assistant hu. Main aapki appointment book karne, clinic ki jankari dene aur basic health guidance me madad kar sakta hu. Boliye kya help karu?"
    },
    {
        keywords: ["kya haal", "kaise ho", "how are you"],
        response: "Main ekdum badhiya hu! Aap sunaiye, aapki health kaisi hai? Koi problem ya pain to nahi hai?"
    },
    {
        keywords: ["appointment", "book", "number lagana", "dikhaana", "visit"],
        response: `I can help you book an appointment! Please click the button below to open the form. <br><br> 
        <button onclick="window.location.href = window.location.pathname.includes('pages/') ? 'appointment.html' : 'pages/appointment.html';" 
        style="width:100%; padding:10px; background:#2F6BFF; color:white; border:none; border-radius:8px; cursor:pointer; margin-top:10px; font-weight:bold;">
        <i class="fa-solid fa-calendar-check"></i> Open Booking Form
        </button>`
    },
    {
        keywords: ["fracture", "haddi", "tut gai", "broken bone", "crack"],
        response: "Agar aapko lagta hai haddi tut gayi hai (fracture), toh kripya use hilayein nahi. Us hisse ko seedha rakhein aur support dein. Dard kam karne ke liye barf (ice) laga sakte hain. Please emergency me clinic visit karein."
    },
    {
        keywords: ["dard", "pain", "dard ho raha", "swelling", "sujan"],
        response: "Dard aur sujan (swelling) ke liye aap affected area par ice pack laga sakte hain aur aaram karein. Agar dard bahut zyada hai, toh jald se jald appointment book karke doctor ko dikhayein."
    },
    {
        keywords: ["shop", "belt", "buy", "order", "khareedna"],
        response: "Aap hamari online shop se Knee Cap, Lumbar Belt, aur baaki orthopaedic saman order kar sakte hain. Delivery sirf Jaunpur city aur villages me available hai."
    }
];

const aiFallback = "Maaf karna, mujhe theek se samajh nahi aaya. Kya aap thoda aur detail me bata sakte hain? Ya phir aap sidhe 'Appointment' book kar sakte hain.";
