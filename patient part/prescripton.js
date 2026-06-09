 
// 1. INITIAL STATE (Dummy Data Array)
 
// Ei file ta puro frontend logic diye cholbe. Backend connected hole fetch kore nibe.
let prescriptionsArray = [
    { 
        id: 1, 
        doctorName: "Dr. Michael Chen", 
        date: "2026-04-25", 
        diagnosis: "Mild Hypertension",
        medications: "Amlodipine 5mg - Once daily Aspirin 75mg - Once daily",
        instructions: "Take medications with food. Monitor blood pressure daily.",
        followUp: "Follow up in 2 weeks",
        rating: 5 // 1 theke 5 er moddhe rating
    }
    // Tumi chaile ekhane aro prescription object add korte paro
];


 
// 2. DOMContentLoaded & EVENT LISTENERS
 
document.addEventListener("DOMContentLoaded", () => {
    
    // Initial Render: Page load hole array theke data niye UI te dekhabe
    renderPrescriptions();

    // Event Delegation for Rating Stars (Star e click korle rating update hobe)
    const prescriptionsList = document.getElementById("prescriptions-list");
    
    if (prescriptionsList) {
        prescriptionsList.addEventListener("click", (e) => {
            const clickedStar = e.target.closest(".star-icon");
            
            if (clickedStar) {
                e.preventDefault();
                
                // Kon card er star click hoise tar ID ber kora
                const card = clickedStar.closest(".prescription-card");
                const rxId = parseInt(card.getAttribute("data-id"));
                
                // Koto number star click hoise (1 to 5)
                const ratingValue = parseInt(clickedStar.getAttribute("data-rating"));
                
                // Array te giye oi prescription er rating update kora
                const index = prescriptionsArray.findIndex(rx => rx.id === rxId);
                if (index !== -1) {
                    prescriptionsArray[index].rating = ratingValue;
                    
                    // Update korar por UI abar render kora
                    renderPrescriptions();
                    
                    // Backend thakle ekhane ekta fetch API/POST request jabe
                    console.log(`Updated rating for Prescription ID ${rxId} to ${ratingValue} stars.`);
                }
            }
        });
    }

});


 
// 3. RENDER FUNCTION
 
// renderPrescriptions() er kaj: UI clear kora ebong Array theke data niye HTML banano
function renderPrescriptions() {
    const listContainer = document.getElementById("prescriptions-list");
    if (!listContainer) return;

    listContainer.innerHTML = ""; // Clear existing list

    prescriptionsArray.forEach(rx => {
        
        // Dynamic Star Rating HTML generate kora
        let starsHTML = "";
        for (let i = 1; i <= 5; i++) {
            // Joto rating toto gulo star 'filled' class pabe (yellow color)
            const filledClass = i <= rx.rating ? "filled" : "";
            starsHTML += `<i class="fa-solid fa-star star-icon ${filledClass}" data-rating="${i}"></i>`;
        }

        // HTML structure for a single prescription card
        const cardHTML = `
            <div class="prescription-card" data-id="${rx.id}">
                <div class="rx-header">
                    <h3>${rx.doctorName}</h3>
                    <i class="fa-regular fa-file-lines icon-blue"></i>
                </div>
                
                <p class="rx-date">Date: ${rx.date}</p>
                
                <div class="rx-section">
                    <p class="rx-label">Diagnosis:</p>
                    <p class="rx-value">${rx.diagnosis}</p>
                </div>
                
                <div class="rx-section">
                    <p class="rx-label">Medications:</p>
                    <p class="rx-value">${rx.medications}</p>
                </div>
                
                <div class="rx-section">
                    <p class="rx-label">Instructions:</p>
                    <p class="rx-value">${rx.instructions}</p>
                </div>
                
                <div class="rx-section">
                    <p class="rx-label">Follow-up:</p>
                    <p class="rx-value">${rx.followUp}</p>
                </div>
                
                <div class="rx-divider"></div>
                
                <div class="rx-rating">
                    <p class="rating-label">Rate this doctor:</p>
                    <div class="stars-container">
                        ${starsHTML}
                    </div>
                </div>
            </div>
        `;

        listContainer.insertAdjacentHTML("beforeend", cardHTML); // Insert into DOM
    });
}