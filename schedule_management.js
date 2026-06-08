const base_url = "http://localhost:8080";
const location_url = base_url + "/doctor/consultation-locations";
const timeslot_url = base_url + "/doctor/consultation-timeslots";

const doctorId = localStorage.getItem("userId");
const username = localStorage.getItem("username");

let updatedLocId = null;
let locations = [];
let timeslots = [];
let days = [];
let slotSummary = ``;

const addLocationFormCard = document.getElementById("add-location-form-card");
const btnShowLocationForm = document.getElementById("btn-show-location-form");
const formAddLocation = document.getElementById("form-add-location");
const formUpdateLocation = document.getElementById("form-update-location");
const btnCancelLocation = document.getElementById("btn-cancel-location");
const locationsContainer = document.getElementById("locations-list");
const btnSaveChanges = document.getElementById("btn-save-changes");
const loadingOverlay = document.getElementById("loading-overlay");
const location_modal = document.getElementById("location-modal");
const btnCancelUpdate = document.getElementById("btn-cancel-loc-update");
const stats = document.querySelectorAll(".stat-card h2");

const dayMap = { "Mon": "MONDAY", "Tue": "TUESDAY", "Wed": "WEDNESDAY", "Thu": "THURSDAY", "Fri": "FRIDAY", "Sat": "SATURDAY", "Sun": "SUNDAY" };
const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


document.addEventListener("DOMContentLoaded", () => {
    loadStats();
    loadLocations();
});

async function loadStats(){
    try{
        const [
            locationResponse,
            timeslotResponse,
            capacityResponse
        ] = await Promise.all([
            fetch(`${location_url}/total/${doctorId}`),
            fetch(`${timeslot_url}/total/${doctorId}`),
            fetch(`${timeslot_url}/max/capacity/${doctorId}`)
        ]);

        totalLocations = await locationResponse.json();
        totalTimeslots = await timeslotResponse.json();
        maxCapacity = await capacityResponse.json();

        stats[0].textContent = totalLocations;
        stats[1].textContent = totalTimeslots;
        stats[2].textContent = maxCapacity;
    }catch(e){
        console.error(e);
    }
}

async function loadLocations(){
    try{
        const response = await fetch(`${location_url}/${doctorId}`);
        locations = await response.json();

        const locaiton_list = document.querySelector("#locations-list");
        locaiton_list.innerHTML = "";

        for(const location of locations){
            const locationId = location.id;
            console.log(location);
            const[
                totalTimeslotsResponse,
                maxCapacityResponse
            ] = await Promise.all([
                fetch(`${timeslot_url}/location/total/${locationId}`),
                fetch(`${timeslot_url}/capacity/total/${locationId}`)
            ]);

            const totalTimeslots = await totalTimeslotsResponse.json();
            const maxCapacity = await maxCapacityResponse.json();

            const locationCard = createLocationCard(location, totalTimeslots, maxCapacity);
            
            locaiton_list.appendChild(locationCard);
        }
    }catch(e){
        console.error(e);
    }
}

function createLocationCard(location, totalTimeslots, maxCapacity){
    const locationCard = document.createElement("div");
    locationCard.className = "location-card";

    let daysHtml = ``;
    allDays.forEach(day => {
        daysHtml += `<button type="button" class="form-day-btn day-btn" data-day="${day}">${day}</button>`;
    });

    let add_slot_html = `
    <div class="time-slot-card add-slot-form hidden" >
        <div class="slot-inputs">
            <div class="form-group">
                <label>Time Slot</label>
                <div class="time-input-grp">
                    <div class="time">
                        <p>Start Time: </p><input id="start-time" type="time" class="input-time" value="" placeholder="Start Time">
                    </div>
                    <div class="time">
                        <p>End Time: </p><input id="end-time" type="time" class="input-time" value="" placeholder="End Time">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Max Patients</label>
                <input id="capacity" type="number" class="input-capacity" value="">
            </div>
        </div>
                    
        <div class="form-group" style="margin-bottom: 20px;">
            <label>Available Days</label>
            <div class="days-container">
                ${daysHtml} 
            </div>
        </div>

        <div class="slot-footer">
            <div class="slot-summary" id="">
                <span class="empty-summary">No days selected</span>
            </div>
            <div class="slot-btn-grp">
                <div class="action-buttons">
                    <button type="submit" class="btn btn-green add-slot" loc-id="${location.id}">Add Time Slot</button>
                    <button type="button" class="btn btn-gray cancel-slot-form" id="btn-cancel-location">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    `;

    locationCard.innerHTML = `
    <div class="loc-header">
        <div class="loc-info">
            <i class="fa-solid fa-location-dot loc-icon"></i>
            <div>
                <h3 class="loc-title">${location.hospitalName}</h3>
                <p class="loc-meta">${location.address} (${location.floor}, Room ${location.room})</p>
                <p class="loc-meta" style="margin-top: 6px;">
                    ${totalTimeslots} time slot${totalTimeslots !== 1 ? 's' : ''} <span>•</span> Capacity: ${maxCapacity} patient${maxCapacity !== 1 ? 's' : ''}/week
                </p>
            </div>
        </div>
        <div class="loc-btn-grp">
            <button type="button" class="btn-edit-icon btn-edit-loc" loc-id="${location.id}">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-delete-icon btn-delete-loc" loc-id="${location.id}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    </div>
                
    <div class="loc-body">
        <h4 class="section-title"><i class="fa-regular fa-clock"></i> Time Slots</h4>
        <div class="timeslot-list" id="timeslot-list">
        </div>
        <button type="button" class="btn btn-text-green btn-add-slot" style="margin-top: 10px;">
            <i class="fa-solid fa-plus"></i> Add Time Slot
        </button>
        ${add_slot_html}
    </div>
    `;

    loadTimeslots(location.id, locationCard);

    return locationCard;
}

//Load timeslots
async function loadTimeslots(locationId, locationCard){

    try{
        const response = await fetch(`${timeslot_url}/${locationId}`);
        timeslots = await response.json();

        const timeslotList = locationCard.querySelector(".timeslot-list");
        timeslotList.innerHTML = "";

        for(const timeslot of timeslots){
            console.log(timeslot.days);
            const timeslotCard = createTimeslotCard(timeslot);
            timeslotList.appendChild(timeslotCard);
        }
    }catch(e){
        console.error(e);
    }
}

function createTimeslotCard(timeslot){
    const timeslotCard = document.createElement("div");
    timeslotCard.classList = "time-slot-card";

    let daysHtml = "";
    allDays.forEach(day => {
        const isActive = timeslot.days.some(d => d.day === dayMap[day]) ? "active" : ""; //Think of it like- Is there any object in timeslot.days whose day property equals a day from allDays array.
        daysHtml += `<button type="button" class="day-btn ${isActive}" data-day="${day}">${day}</button>`;
    });

    timeslotCard.innerHTML = `
    <div class="slot-inputs">
        <div class="form-group">
            <label>Time Slot</label>
            <div class="time-input-grp">
                <div class="time">
                    <p>Start Time: </p><input type="time" class="input-time" value="${timeslot.startTime}" placeholder="Start Time">
                </div>
                <div class="time">
                    <p>End Time: </p><input type="time" class="input-time" value="${timeslot.endTime}" placeholder="End Time">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>Max Patients</label>
            <input type="number" class="input-capacity" value="${timeslot.maxPatients}">
        </div>
    </div>
                    
    <div class="form-group" style="margin-bottom: 20px;">
        <label>Available Days</label>
        <div class="days-container">
            ${daysHtml}
        </div>
    </div>

    <div class="slot-footer">
        <div class="slot-summary" id="summary-${timeslot.id}">
            
        </div>
        <div class="slot-btn-grp">
            <button type="button" class="btn-edit-icon btn-edit-slot" slot-id="${timeslot.id}">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-delete-icon btn-delete-slot" slot-id="${timeslot.id}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    </div>
    `;

    return timeslotCard;
}

// Location list events
document.getElementById("locations-list")
.addEventListener("click", function(e) {

    const locationCard = e.target.closest(".location-card");
    const locationHeader = e.target.closest(".loc-header");
    const locDeleteBtn = e.target.closest(".btn-delete-loc");
    const locEditBtn = e.target.closest(".btn-edit-loc");
    const showSlotFormBtn = e.target.closest(".btn-add-slot");
    const cancelSlotFormBtn = e.target.closest(".cancel-slot-form");
    const formDayBtn = e.target.closest(".form-day-btn");
    const addSlotBtn = e.target.closest(".add-slot");
    const slotDeleteBtn = e.target.closest(".btn-delete-slot");

    if (locationHeader && !locDeleteBtn && !locEditBtn && !addSlotBtn && !showSlotFormBtn && !cancelSlotFormBtn ) {
        locationCard.classList.toggle("expanded");
        return;
    }

    //Add time slot
    if(addSlotBtn){
        const locId = addSlotBtn.getAttribute("loc-id");
        const timeslotForm = addSlotBtn.closest(".add-slot-form");

        addTimeSlot(locId, timeslotForm);

        showSlotFormBtn.classList.remove("hidden");
        addSlotBtn.closest(".add-slot-form").classList.add("hidden");
        days = [];
    }

    //Toggle days and store them in 'days' array
    if(formDayBtn){
        formDayBtn.classList.toggle("active");
        const clickedDay = formDayBtn.getAttribute("data-day");
        
        if(days.includes(clickedDay))
            days = days.filter(d => d !== clickedDay); //Remove clicked day is already exists.
        else days.push(clickedDay);

        const addSlotForm = formDayBtn.closest(".add-slot-form");
        const summaryDiv = addSlotForm.querySelector(".slot-summary");

        summaryDiv.innerHTML = "";
        if(days.length === 0)
            summaryDiv.innerHTML = `<span class="empty-summary">No days selected</span>`;
        else {
            const fullDays = days.map(d => dayMap[d]);
            summaryDiv.innerHTML  = `Active on: <strong>${fullDays.join(", ")}</strong>`;
        }
    }

    //Close Time Slot Florm
    if(cancelSlotFormBtn){
        const locationCard = cancelSlotFormBtn.closest(".location-card");
        const addSlotForm = locationCard.querySelector(".add-slot-form");
        addSlotForm.classList.add("hidden");
        locationCard.querySelector(".btn-add-slot").classList.remove("hidden");

        makeSlotFormDaysInactive(addSlotForm);
    }

    //Show Time Slot Form
    if(showSlotFormBtn){
        showSlotFormBtn.classList.add("hidden");
        
        const locationCard = showSlotFormBtn.closest(".location-card");
        const addSlotForm = locationCard.querySelector(".add-slot-form");

        addSlotForm.classList.remove("hidden");

        return;
    }

    // Delete Location
    if(locDeleteBtn){
        const locationId = parseInt(locDeleteBtn.getAttribute("loc-id"));
        
        let overlay = document.getElementById("overlay");
        let popup = document.getElementById("warning");
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");
        let message = popup.querySelector("p");
        message.textContent = "Are you sure you want to delete this location? All schedules will be removed.";

        let yesButton = popup.querySelector("#yes");
        let noButton = popup.querySelector("#no");

        noButton.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });
        yesButton.onclick = () => {
            deleteLocation(locationId);
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        };
    }

    // Delete Time Slot
    if(slotDeleteBtn){
        const slotId = parseInt(slotDeleteBtn.getAttribute("slot-id"));

        let overlay = document.getElementById("overlay");
        let popup = document.getElementById("warning");
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");
        let message = popup.querySelector("p");
        message.textContent = "Are you sure you want to delete this time slot?";

        let yesButton = popup.querySelector("#yes");
        let noButton = popup.querySelector("#no");

        noButton.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });
        yesButton.onclick = () => {
            deleteTimeslot(slotId);
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        };
    }

    // Show Location Update Modal
    if(locEditBtn){
        location_modal.classList.replace("hidden", "overlay");
        updatedLocId = parseInt(locEditBtn.getAttribute("loc-id"));

        const location = locations.find(loc => loc.id === updatedLocId);

        location_modal.querySelector("#new-loc-name").value = location.hospitalName;
        location_modal.querySelector("#new-loc-address").value = location.address;
        location_modal.querySelector("#new-loc-floor").value = location.floor;
        location_modal.querySelector("#new-loc-room").value = location.room;
    }

});

// Show Location Form
btnShowLocationForm.addEventListener("click", (e) => {
    e.preventDefault();
    btnShowLocationForm.classList.add("hidden");
    addLocationFormCard.classList.remove("hidden");
});

// Cancel Location Form
btnCancelLocation.addEventListener("click", (e) => {
    e.preventDefault();
    formAddLocation.reset(); 
    addLocationFormCard.classList.add("hidden");
    btnShowLocationForm.classList.remove("hidden");
});

// Cancel Location Update Form
btnCancelUpdate.addEventListener("click", (e) => {
    e.preventDefault();
    formUpdateLocation.reset(); 
    location_modal.classList.replace("overlay", "hidden");
});

// Submit Location Form
formAddLocation.addEventListener("submit", async (e) => {
    e.preventDefault();
            
    const newLocation = {
        hospitalName: document.getElementById("new-loc-name").value.trim(),
        address: document.getElementById("new-loc-address").value.trim(),
        floor: document.getElementById("new-loc-floor").value.trim(),
        room: document.getElementById("new-loc-room").value.trim(),
        doctorId: doctorId
    };

    showLoading();

    try{
        const response = await fetch(`${base_url}/doctor/consultation-location`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newLocation)
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "Location Added Successfully.");
            
        formAddLocation.reset(); 
        addLocationFormCard.classList.add("hidden"); 
        btnShowLocationForm.classList.remove("hidden");
            
        loadLocations();
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }     
});

// Submit Location Update form
formUpdateLocation.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedLocation = {
        hospitalName: location_modal.querySelector("#new-loc-name").value.trim(),
        address: location_modal.querySelector("#new-loc-address").value.trim(),
        floor: location_modal.querySelector("#new-loc-floor").value.trim(),
        room: location_modal.querySelector("#new-loc-room").value.trim(),
        doctorId: doctorId
    };

    showLoading();

    try{

        const response = await fetch(`${base_url}/doctor/consultation-location/${updatedLocId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedLocation)
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "Location updated successfully.");
            
        formUpdateLocation.reset(); 
        location_modal.classList.replace("overlay","hidden"); 
            
        loadLocations();
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }     
});

// Delete Location
async function deleteLocation(locationId){
    showLoading();
    try{
        const response = await fetch(`${base_url}/doctor/consultation-location/${locationId}`, {
            method: "DELETE"
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "Location deleted successfully.");

        loadLocations();
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }
}

// Delete Time Slot
async function deleteTimeslot(slotId){
    showLoading();
    try{
        const response = await fetch(`${base_url}/doctor/consultation-timeslot/${slotId}`, {
            method: "DELETE"
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "Time Slot deleted successfully.");

        loadLocations();
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }
}

// Add Time Slot 
async function addTimeSlot(locationId, timeslotForm){
    
    const fullDays = days.map(d => dayMap[d]);
    console.log(fullDays);

    const newTimeslot = {
        startTime: timeslotForm.querySelector("#start-time").value,
        endTime: timeslotForm.querySelector("#end-time").value,
        maxPatients: timeslotForm.querySelector("#capacity").value,
        locationId: locationId,
        days: fullDays
    };

    showLoading();

    try{
        const response = await fetch(`${base_url}/doctor/consultation-timeslot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTimeslot)
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "Time Slot Added Successfully.")
        loadLocations();
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }
} 

// Make Time Slot Form days Inactive
function makeSlotFormDaysInactive(addSlotForm){
    const summaryDiv = addSlotForm.querySelector(".slot-summary");
    summaryDiv.innerHTML = "";
    summaryDiv.innerHTML = `<span class="empty-summary">No days selected</span>`;

    const daysContainer = addSlotForm.querySelector(".days-container");
    daysContainer.innerHTML = "";

    let daysHtml = ``;
    allDays.forEach(day => {
        daysHtml += `<button type="button" class="form-day-btn day-btn" data-day="${day}">${day}</button>`;
    });
    daysContainer.innerHTML = `${daysHtml}`;
    days = [];
}

function showPopup(popupId, popupMsg){
    let overlay = document.getElementById("overlay");
    let popup = document.getElementById(popupId);
    overlay.classList.replace("hidden", "overlay");
    popup.classList.replace("hidden", "popup");
    let message = popup.querySelector("p");
    message.textContent = popupMsg;
    let button = popup.querySelector("button");
            
    button.addEventListener("click", () => {
        overlay.classList.replace("overlay", "hidden");
        popup.classList.replace("popup", "hidden");
    });
}


function showLoading() {
    loadingOverlay.classList.remove("hidden");
}
function hideLoading() {
    loadingOverlay.classList.add("hidden");
}