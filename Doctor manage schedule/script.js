 
// 1. INITIAL STATE (Dummy Data for Frontend Logic)
 
// Ei file ta puro frontend logic (array diye data store) diye cholbe
// Backend/fetch nai - mane reload dile dummy data thekei abar start hobe
let locationsArray = [
    // Ei gula sample location data - page load hole egula render hoy
    {
        id: 1,
        name: "City General Hospital",
        address: "Floor 3, Room 305",
        expanded: false, // Kon location ta open ache setar track
        slots: [
            { id: 101, time: "9:00 AM - 10:00 AM", maxPatients: 10, days: ["Mon", "Wed", "Fri"] },
            { id: 102, time: "10:00 AM - 11:00 AM", maxPatients: 10, days: ["Mon", "Wed", "Fri"] },
            { id: 103, time: "2:00 PM - 3:00 PM", maxPatients: 8, days: ["Tue", "Thu"] }
        ]
    },
    {
        id: 2,
        name: "HealthCare Medical Center",
        address: "Floor 2, Room 201",
        expanded: false,
        slots: [
            { id: 201, time: "11:00 AM - 12:00 PM", maxPatients: 5, days: ["Mon", "Thu"] }
        ]
    }
];

// Helper variables days map korar jonno
const dayMap = { "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday" };
const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


 
// 2. DOMContentLoaded & EVENT LISTENERS
 
// DOMContentLoaded mane: HTML elements gula load hoye gele tarpor JS run hobe
document.addEventListener("DOMContentLoaded", () => {
    
    // Initial Render: page load hole prothome locations list ta UI te dekhabe
    renderLocations();
    updateStats(); // Stats card gula update korbe

    // --- DOM Elements ---
    const addLocationFormCard = document.getElementById("add-location-form-card");
    const btnShowLocationForm = document.getElementById("btn-show-location-form");
    const formAddLocation = document.getElementById("form-add-location");
    const btnCancelLocation = document.getElementById("btn-cancel-location");
    const locationsContainer = document.getElementById("locations-list");
    const btnSaveChanges = document.getElementById("btn-save-changes");

    // --- Open Add Location Form ---
    // Add New Consultation Location dashed button click korle form open hobe
    if (btnShowLocationForm) {
        btnShowLocationForm.addEventListener("click", (e) => {
            e.preventDefault();
            btnShowLocationForm.classList.add("hidden");
            addLocationFormCard.classList.remove("hidden");
        });
    }

    // --- Close Add Location Form ---
    // Cancel button click korle form hide hobe ar dashed button abar show korbe
    if (btnCancelLocation) {
        btnCancelLocation.addEventListener("click", (e) => {
            e.preventDefault();
            formAddLocation.reset(); // form clean kore dilam
            addLocationFormCard.classList.add("hidden");
            btnShowLocationForm.classList.remove("hidden");
        });
    }

    // --- Submit Add Location Form ---
    // Form submit hole notun location object banabo + array te push + UI re-render
    if (formAddLocation) {
        formAddLocation.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // New location data collect kora hocche input theke
            const newLocation = {
                id: Date.now(), // Unique ID generation for frontend
                name: document.getElementById("new-loc-name").value.trim(),
                address: document.getElementById("new-loc-address").value.trim(),
                expanded: false,
                slots: [] // Notun location e kono slot thakbe na prothome
            };

            locationsArray.push(newLocation); // Array te add hocche
            
            formAddLocation.reset(); 
            addLocationFormCard.classList.add("hidden"); // Form close hocche
            btnShowLocationForm.classList.remove("hidden");
            
            renderLocations(); // UI update hocche
            updateStats();     // Stats update hocche
        });
    }

    // --- Save Changes Button ---
    if (btnSaveChanges) {
        btnSaveChanges.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Final Data Ready for Backend:", locationsArray);
            alert("Schedule updated successfully!");
        });
    }

    // --- Location List Actions: Expand, Delete, Add Slot, Toggle Day (Event Delegation) ---
    // Locations list er bhetore jekono button click hole eikhan theke handle hobe
    if (locationsContainer) {
        locationsContainer.addEventListener("click", (e) => {
            
            // 1. Expand/Collapse Location
            const locHeader = e.target.closest(".loc-header");
            const isDeleteBtn = e.target.closest(".btn-delete-loc");
            
            if (locHeader && !isDeleteBtn) {
                const locId = parseInt(locHeader.closest(".location-card").getAttribute("data-id"));
                
                locationsArray.forEach(loc => {
                    if (loc.id === locId) {
                        loc.expanded = !loc.expanded; // Click kora ta toggle hobe
                    } else {
                        loc.expanded = false; // Baki sob bondho hobe
                    }
                });
                renderLocations();
            }

            // 2. Delete Location
            const deleteLocBtn = e.target.closest(".btn-delete-loc");
            if (deleteLocBtn) {
                e.preventDefault();
                const locId = parseInt(deleteLocBtn.closest(".location-card").getAttribute("data-id"));
                
                if(confirm("Are you sure you want to delete this location? All schedules will be removed.")) {
                    locationsArray = locationsArray.filter(loc => loc.id !== locId);
                    renderLocations();
                    updateStats();
                }
            }

            // 3. Delete Time Slot
            const deleteSlotBtn = e.target.closest(".btn-delete-slot");
            if (deleteSlotBtn) {
                e.preventDefault();
                const locId = parseInt(deleteSlotBtn.closest(".location-card").getAttribute("data-id"));
                const slotId = parseInt(deleteSlotBtn.getAttribute("data-slot-id"));
                
                const location = locationsArray.find(loc => loc.id === locId);
                if(location) {
                    location.slots = location.slots.filter(s => s.id !== slotId);
                    renderLocations();
                    updateStats();
                }
            }

            // 4. Add New Time Slot
            const addSlotBtn = e.target.closest(".btn-add-slot");
            if (addSlotBtn) {
                e.preventDefault();
                const locId = parseInt(addSlotBtn.closest(".location-card").getAttribute("data-id"));
                const location = locationsArray.find(loc => loc.id === locId);
                
                if(location) {
                    location.slots.push({
                        id: Date.now(),
                        time: "", 
                        maxPatients: 10, // Default max patient
                        days: [] 
                    });
                    renderLocations();
                    updateStats();
                }
            }

            // 5. Toggle Available Days (Mon, Tue, etc.)
            const dayBtn = e.target.closest(".day-btn");
            if (dayBtn) {
                e.preventDefault();
                const locId = parseInt(dayBtn.closest(".location-card").getAttribute("data-id"));
                const slotId = parseInt(dayBtn.closest(".time-slot-card").getAttribute("data-slot-id"));
                const clickedDay = dayBtn.getAttribute("data-day");

                const location = locationsArray.find(loc => loc.id === locId);
                const slot = location.slots.find(s => s.id === slotId);

                if(slot) {
                    if (slot.days.includes(clickedDay)) {
                        slot.days = slot.days.filter(d => d !== clickedDay); // Remove day
                    } else {
                        slot.days.push(clickedDay); // Add day
                        // Real-world order maintain korar jonno sort
                        slot.days.sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b)); 
                    }
                    
                    // DOM theke direct class update korchi jate input theke focus na haray
                    dayBtn.classList.toggle("active");
                    updateSlotSummaryDOM(slotId, slot);
                    updateStats();
                }
            }
        });

        // --- Handle Input Changes Real-time (Time & Capacity) ---
        // Input type korar somoy array update hobe but full UI re-render hobe na
        locationsContainer.addEventListener("input", (e) => {
            if (e.target.classList.contains("input-time") || e.target.classList.contains("input-capacity")) {
                const locId = parseInt(e.target.closest(".location-card").getAttribute("data-id"));
                const slotId = parseInt(e.target.closest(".time-slot-card").getAttribute("data-slot-id"));
                
                const location = locationsArray.find(loc => loc.id === locId);
                const slot = location.slots.find(s => s.id === slotId);

                if(slot) {
                    if(e.target.classList.contains("input-time")) {
                        slot.time = e.target.value;
                    }
                    if(e.target.classList.contains("input-capacity")) {
                        slot.maxPatients = parseInt(e.target.value) || 0;
                        updateSlotSummaryDOM(slotId, slot); // Shudhu nicher lekha ta update hobe
                        updateStats();
                    }
                }
            }
        });
    }

});


 
// 3. RENDER & HELPER FUNCTIONS
 

// renderLocations() er main kaj:
// 1) UI list clear kora
// 2) Prottek location er jonno card HTML banano
// 3) Bhetorer slot gula loop kore HTML toiri kora
// 4) HTML container a add kora
function renderLocations() {
    const container = document.getElementById("locations-list");
    if(!container) return;
    
    container.innerHTML = ""; // Clear existing list (purono card remove)

    locationsArray.forEach(loc => {
        
        let totalSlots = loc.slots.length;
        let totalSessions = loc.slots.reduce((sum, slot) => sum + slot.days.length, 0);
        const isExpandedClass = loc.expanded ? "expanded" : "";

        // Slots HTML Generate
        let slotsHTML = "";
        loc.slots.forEach(slot => {
            
            // Days HTML Generate
            let daysHTML = "";
            allDays.forEach(day => {
                const isActive = slot.days.includes(day) ? "active" : "";
                daysHTML += `<button type="button" class="day-btn ${isActive}" data-day="${day}">${day}</button>`;
            });

            let summaryHTML = getSummaryHTML(slot);

            // Time Slot Card
            slotsHTML += `
                <div class="time-slot-card" data-slot-id="${slot.id}">
                    <div class="slot-inputs">
                        <div class="form-group">
                            <label>Time Slot</label>
                            <input type="text" class="input-time" value="${slot.time}" placeholder="e.g., 9:00 AM - 10:00 AM">
                        </div>
                        <div class="form-group">
                            <label>Max Patients</label>
                            <input type="number" class="input-capacity" value="${slot.maxPatients}">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label>Available Days</label>
                        <div class="days-container">
                            ${daysHTML}
                        </div>
                    </div>

                    <div class="slot-footer">
                        <div class="slot-summary" id="summary-${slot.id}">
                            ${summaryHTML}
                        </div>
                        <button type="button" class="btn-delete-icon btn-delete-slot" data-slot-id="${slot.id}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        // Expanded hole 'Add Time Slot' button add hobe
        if (loc.expanded) {
            slotsHTML += `
                <button type="button" class="btn btn-text-green btn-add-slot" style="margin-top: 10px;">
                    <i class="fa-solid fa-plus"></i> Add Time Slot
                </button>
            `;
        }

        // Location Card HTML Generate
        const locHTML = `
            <div class="location-card ${isExpandedClass}" data-id="${loc.id}">
                <div class="loc-header">
                    <div class="loc-info">
                        <i class="fa-solid fa-location-dot loc-icon"></i>
                        <div>
                            <h3 class="loc-title">${loc.name}</h3>
                            <p class="loc-meta">${loc.address}</p>
                            <p class="loc-meta" style="margin-top: 6px;">
                                ${totalSlots} time slot${totalSlots !== 1 ? 's' : ''} <span>•</span> ${totalSessions} session${totalSessions !== 1 ? 's' : ''}/week
                            </p>
                        </div>
                    </div>
                    <button type="button" class="btn-delete-icon btn-delete-loc">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                
                <div class="loc-body">
                    <h4 class="section-title"><i class="fa-regular fa-clock"></i> Time Slots</h4>
                    ${slotsHTML}
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", locHTML); // UI te card add
    });
}

// Stats Card gulo update korar function
function updateStats() {
    let totalLocs = locationsArray.length;
    let totalTimeSlotsWeek = 0;
    let maxCapacityWeek = 0;

    locationsArray.forEach(loc => {
        loc.slots.forEach(slot => {
            let sessionCount = slot.days.length;
            totalTimeSlotsWeek += sessionCount;
            maxCapacityWeek += (sessionCount * slot.maxPatients);
        });
    });

    const statLocsEl = document.getElementById("stat-locations");
    const statSlotsEl = document.getElementById("stat-slots");
    const statCapEl = document.getElementById("stat-capacity");

    if(statLocsEl) statLocsEl.innerText = totalLocs;
    if(statSlotsEl) statSlotsEl.innerText = totalTimeSlotsWeek;
    if(statCapEl) statCapEl.innerText = maxCapacityWeek;
}

// Helper: Slot er bottom description bananor jonno
function getSummaryHTML(slot) {
    if (slot.days.length === 0) {
        return `<span class="empty-summary">No days selected</span>`;
    }

    const fullDays = slot.days.map(d => dayMap[d]).join(", ");
    const sessionCount = slot.days.length;
    const weeklyMax = sessionCount * slot.maxPatients;

    return `Active on: <strong>${fullDays}</strong> • ${sessionCount} days • ${weeklyMax} patients max/week`;
}

// Helper: Shudhu description text ta update korar jonno (Focus na haranor jnno)
function updateSlotSummaryDOM(slotId, slot) {
    const summaryEl = document.getElementById(`summary-${slotId}`);
    if(summaryEl) {
        summaryEl.innerHTML = getSummaryHTML(slot);
    }
}