 
// 1. INITIAL STATE (Dummy Data for Frontend Logic)
 
// Ei file ta puro frontend logic (array diye data store) diye cholbe.
// Backend connected hole just ei array ta fetch kore niye asbe.
let appointmentsArray = [
    { 
        id: 1, 
        doctorName: "Dr. Sarah Johnson", 
        specialty: "Cardiologist", 
        date: "2026-04-28", 
        time: "9:00 AM", 
        location: "City General Hospital", 
        status: "Upcoming" 
    },
    { 
        id: 2, 
        doctorName: "Dr. Michael Chen", 
        specialty: "Cardiologist", 
        date: "2026-04-25", 
        time: "10:00 AM", 
        location: "HealthCare Medical Center", 
        status: "Completed" 
    }
];


 
// 2. DOMContentLoaded & EVENT LISTENERS
 
// HTML load hoye gele tarpor JS run hobe
document.addEventListener("DOMContentLoaded", () => {
    
    // Initial Render: Page load hole array theke data niye UI te dekhabe
    renderAppointments();

    // Event Delegation for future interactions (jodi pore details page add koro)
    const appointmentsList = document.getElementById("appointments-list");
    
    if (appointmentsList) {
        appointmentsList.addEventListener("click", (e) => {
            // Jemon card e click korle jodi details dekhaite chao
            const card = e.target.closest(".appt-card");
            if (card) {
                const apptId = parseInt(card.getAttribute("data-id"));
                // ekhane kono action nite paro pore, like: openModal(apptId);
                console.log("Clicked Appointment ID:", apptId);
            }
        });
    }

});


 
// 3. RENDER FUNCTION
 
// renderAppointments() er main kaj:
// 1) UI list clear kora
// 2) Prottek appointment er jonno card HTML banano
// 3) HTML container e append kora
function renderAppointments() {
    const listContainer = document.getElementById("appointments-list");
    if (!listContainer) return;

    listContainer.innerHTML = ""; // Clear existing list (purono data remove)

    // Array theke data loop kore UI te card banano hocche
    appointmentsArray.forEach(appt => {
        
        // Status er upor vitti kore badge er CSS class select kora hocche
        let statusClass = appt.status === "Upcoming" ? "status-upcoming" : "status-completed";

        // HTML structure for a single card
        const cardHTML = `
            <div class="appt-card" data-id="${appt.id}">
                <div class="appt-header">
                    <h3>${appt.doctorName}</h3>
                    <span class="badge ${statusClass}">${appt.status}</span>
                </div>
                
                <p class="specialty-text">${appt.specialty}</p>
                
                <div class="appt-meta">
                    <span><i class="fa-regular fa-calendar"></i> ${appt.date}</span>
                    <span><i class="fa-regular fa-clock"></i> ${appt.time}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${appt.location}</span>
                </div>
            </div>
        `;

        listContainer.insertAdjacentHTML("beforeend", cardHTML); // Insert into DOM
    });
}