const base_url = "http://localhost:8080";
const appointment_url = base_url + "/api/appointments";
const location_url = base_url + "/doctor/consultation-locations";
const timeslot_url = base_url + "/doctor/consultation-timeslots";
const patient_url = base_url + "/user/patient/details/age";
const notification_url = base_url + "/api/notification";
const prescription_url = base_url + "/api/prescription";

const doctorId = localStorage.getItem("userId");
const username = localStorage.getItem("username");

const loadingOverlay = document.getElementById("loading-overlay");
const prescriptionModal = document.getElementById('prescription-modal');

let medicines = [];

document.addEventListener("DOMContentLoaded", () => {
    loadConsultationLocations();
});

async function loadConsultationLocations(){
    try{
        const locationResponse = await fetch(`${location_url}/${doctorId}`);
        const locations = await locationResponse.json();

        const container = document.querySelector("#appointment-container");
        container.innerHTML = "";

        for(const location of locations){
            const locationId = location.id;

            const totalAppointmentsResponse = await fetch(`${appointment_url}/total-patient/${locationId}`);
            const totalAppointments = await totalAppointmentsResponse.json();

            const locationCard = createLocationCard(location, totalAppointments);
            container.appendChild(locationCard);
        }
    }catch(e){
        console.error(e);
        alert("Failed to load locations!");
    }
}

function createLocationCard(location, totalAppointments){
    const locationCard = document.createElement("div");
    locationCard.className = "hospital-card";

    locationCard.innerHTML = `
    <div class="hospital-header">
        <div class="header-info">
            <i class="fa-solid fa-location-dot icon-green"></i>
            <div>
                <h3>${location.hospitalName}</h3>
                <p class="text-muted">${totalAppointments} patients today</p>
            </div>
        </div>
        <i class="fa-solid fa-chevron-down chevron"></i>
    </div>
    <div class="hospital-body">
        <p class="text-muted" style="padding: 20px;">[Schedules will appear here]</p>
    </div>
    `;

    loadConsultationTimeslots(location, locationCard); // Load timeslots inside hospital-body
    return locationCard;
}

async function loadConsultationTimeslots(locaiton, locationCard){
    try{
        const response = await fetch(`${timeslot_url}/${locaiton.id}`);
        const timeslots = await response.json();

        if(timeslots.length === 0) return;

        const timeslotContainer = locationCard.querySelector(".hospital-body");
        timeslotContainer.innerHTML = "";

        for(const timeslot of timeslots){
            const timeslotId = timeslot.id;

            const[
                totalAppointmentsResponse,
                totalConsultedPatientsResponse,
            ] = await Promise.all([
                fetch(`${appointment_url}/timeslot/${timeslotId}`),
                fetch(`${appointment_url}/timeslot/total-consulted/${timeslotId}`)
            ]);

            totalAppointments = await totalAppointmentsResponse.json();
            totalConsultedPatients = await totalConsultedPatientsResponse.json();

            const timeslotCard = createTimeslotCard(locaiton.id, timeslot, totalAppointments, totalConsultedPatients);

            timeslotContainer.appendChild(timeslotCard); // Add timeslot cards to hospital-body
        }
    }catch(e){
        console.error(e);
    }
}

function createTimeslotCard(locationId, timeslot, totalAppointments, totalConsultedPatients){
    const timeslotCard = document.createElement("div");
    timeslotCard.className = "timeslot-card";

    timeslotCard.innerHTML = `
    <div class="timeslot-header">
        <div class="header-info">
            <i class="fa-regular fa-clock icon-blue"></i>
            <div>
                <h4>${formatTime(timeslot.startTime)} - ${formatTime(timeslot.endTime)}</h4>
                <p class="text-muted">${totalAppointments} patients booked</p>
            </div>
        </div>
        <div class="header-actions">
            <span class="consulted-badge">${totalConsultedPatients}/${totalAppointments} consulted</span>
            <i class="fa-solid fa-chevron-down chevron"></i>
        </div>
    </div>
                            
    <div class="timeslot-body">
        <p class="text-muted" style="padding: 20px;">[Patients will appear here]</p>
    </div>
    `;

    loadPatients(locationId, timeslot, timeslotCard);
    return timeslotCard;
}

async function loadPatients(locationId, timeslot, timeslotCard){
    try{
        
        const response = await fetch(`${appointment_url}/patient/list/${timeslot.id}/${locationId}`);
        const patients = await response.json();

        if(patients.length === 0) return;

        const callResponse = await fetch(`${base_url}/doctor/consultation-timeslot/can-call/${timeslot.id}`);
        const canCall = await callResponse.json();

        const patientContainer = timeslotCard.querySelector(".timeslot-body");
        patientContainer.innerHTML = "";

        for(const patient of patients){

            const ageResponse = await fetch(`${patient_url}/${patient.patientId}`);
            const age = await ageResponse.json();
            
            let patientAge;
            if(age === 0) patientAge = "Age: Undefined";
            else patientAge = age + " years old";

            const patientCard = createPatientCard(canCall, patient, patientAge);
            patientContainer.appendChild(patientCard);
        }
    }catch(e){
        console.error(e);
    }
}

function createPatientCard(canCall, patient, patientAge){
    const patientCard = document.createElement("div");
    patientCard.className = "patient-card";
    patientCard.setAttribute("patient-id", patient.patientId);
    patientCard.setAttribute("appointment-id", patient.appointmentId);

    let btn_disabled = canCall ? "" : "btn-disabled";
    let disabled = canCall ? "" : "disabled";

    let btn_hidden = patient.status === "CALLED" ? "" : "hidden";
    let hide_call_btn = patient.status === "CALLED" ? "hidden" : "";

    patientCard.innerHTML = `
        <div class="patient-info">
            <div class="avatar bg-green">J</div>
            <div class="patient-details">
                <div class="name-row">
                    <h4>${patient.fullName}</h4>
                    <div class="badge-container">
                        <span class="badge badge-yellow status-badge">${patient.status}</span>
                    </div>
                </div>
                <p class="text-muted">${patientAge} • Username: ${patient.username}</p>
            </div>
        </div>
        <div class="patient-actions">
            <button type="button" class="btn btn-blue btn-history ${btn_hidden}">
                <i class="fa-solid fa-book-medical"></i> Medical History
            </button>
            <button type="button" class="btn ${btn_disabled} ${hide_call_btn} btn-blue btn-call" ${disabled} patient-id="${patient.patientId}" appointment-id="${patient.appointmentId}">
                <i class="fa-solid fa-bullhorn"></i> Call
            </button>
            <button type="button" class="btn btn-primary btn-prescribe ${btn_hidden}" patient-id="${patient.patientId}">
                <i class="fa-regular fa-file-lines"></i> Provide Prescription
            </button>
            <button type="button" class="btn btn-gray btn-cancel ${btn_hidden}" patient-id="${patient.patientId}" appointment-id="${patient.appointmentId}">
                <i class="fa-solid fa-xmark"></i> Cancel
            </button>
        </div>
    `;

    return patientCard;
}

function formatTime(time){
    return new Date(`2026-01-06T${time}`)
    .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}


// Event delegation
document.getElementById("appointment-container")
.addEventListener("click", function(e) {

    const hospitalHeader = e.target.closest(".hospital-header");

    if (hospitalHeader) {
        hospitalHeader.parentElement.classList.toggle("open");
        return;
    }

    const timeslotHeader = e.target.closest(".timeslot-header");

    if (timeslotHeader) {
        timeslotHeader.parentElement.classList.toggle("open");
        return;
    }

});

// Prescription + Patient Logic

// Current active patient
let activePatientCard = null;

// Patient action buttons
document.getElementById("appointment-container").addEventListener("click", function(e) {

    // Call Button Logic
    const callBtn = e.target.closest('.btn-call');

    if (callBtn) {
        e.preventDefault();

        const card = callBtn.closest('.patient-card');
        const patientId = callBtn.getAttribute("patient-id");
        const appointmentId = callBtn.getAttribute("appointment-id");

        // Status badge update
        const badge = card.querySelector('.status-badge');
        badge.textContent = 'In Call';

        badge.classList.remove('badge-yellow');
        badge.classList.add('badge-blue');

        // Hide call button
        callBtn.classList.add('hidden');

        // History button
        const historyBtn = card.querySelector('.btn-history');
        historyBtn.classList.remove('hidden');

        // Cancel button
        const cancelBtn = card.querySelector('.btn-cancel');
        cancelBtn.classList.remove('hidden');

        // Prescription button enable
        const prescribeBtn = card.querySelector('.btn-prescribe');
        prescribeBtn.classList.remove('hidden');

        callPatient(patientId, appointmentId, card);
    }

    // Patient card cancel button clicked
    const cancelBtn = e.target.closest('.btn-cancel');

    if(cancelBtn){
        const card = cancelBtn.closest('.patient-card');
        const patientId = cancelBtn.getAttribute("patient-id");
        const appointmentId = cancelBtn.getAttribute("appointment-id");

        const historyBtn = card.querySelector('.btn-history');
        historyBtn.classList.add('hidden');

        cancelBtn.classList.add('hidden');

        const callBtn = card.querySelector('.btn-call');
        callBtn.classList.remove('hidden');

        const prescribeBtn = card.querySelector('.btn-prescribe');
        prescribeBtn.classList.add('hidden');

        putPatientOnHold(patientId, appointmentId, card);
    }

    // Provide Prescription Button
    const prescribeBtn = e.target.closest('.btn-prescribe');

    if (prescribeBtn) {
        e.preventDefault();

        activePatientCard = prescribeBtn.closest('.patient-card');

        // Get patient name
        const patientName =
            activePatientCard.querySelector('h4').textContent.trim();

        // Show patient name in modal
        document.getElementById('modal-patient-name').textContent =
            `Patient: ${patientName}`;

        // Reset form
        document.getElementById('prescription-form').reset();

        // Clear medicine list
        document.getElementById('medicine-list').innerHTML = '';

        // Open modal
        prescriptionModal.classList.add('active');
    }
});

async function callPatient(patientId, appointmentId, patientCard){
    showLoading();
    try{
        let status = "CALLED";
        const statusResponse = await fetch(`${base_url}/api/appointment/status/${appointmentId}/${status}`, {
            method: "PUT"
        });

        if(!statusResponse.ok){
            const error = await statusResponse.json();
            showPopup("error-alert", error.message);
            return;
        }

        patientCard.querySelector(".status-badge").textContent = status;

        const notification = {
            senderId : doctorId,
            receiverId : patientId,
            subject : "Called for consultation session.",
            body : ""
        }

        const notificationResponse = await fetch(notification_url, {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(notification)
        });

    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }
}

async function putPatientOnHold(patientId, appointmentId, patientCard){
    showLoading();
    try{
        let status = "UPCOMING";
        const statusResponse = await fetch(`${base_url}/api/appointment/status/${appointmentId}/${status}`, {
            method: "PUT"
        });

        if(!statusResponse.ok){
            const error = await statusResponse.json();
            showPopup("error-alert", error.message);
            return;
        }

        patientCard.querySelector(".status-badge").textContent = status;

        const notification = {
            senderId : doctorId,
            receiverId : patientId,
            subject : "Session Delayed",
            body : "Please wait. Your consultation session has been delayed. You will be called shortly."
        }

        const notificationResponse = await fetch(notification_url, {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(notification)
        });

    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }
}



// Add Medicine
document.getElementById("btn-add-medicine").addEventListener("click", function(e) {

    e.preventDefault();

    const nameInput = document.getElementById('med-name');
    const dosageInput = document.getElementById('med-dosage');

    const name = nameInput.value.trim();
    const dosage = dosageInput.value.trim();

    medicines.push({
        medicineName: name,
        instruction: dosage
    });
    console.log(medicines);

    if (name && dosage) {

        const list = document.getElementById('medicine-list');

        const itemHTML = `
            <div class="med-item">
                <div>
                    <strong id="name">${name}</strong><br>
                    <span id="dosage" class="text-muted" style="font-size: 0.85rem">
                        ${dosage}
                    </span>
                </div>

                <button type="button" class="med-delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        list.insertAdjacentHTML('beforeend', itemHTML);

        // Clear inputs
        nameInput.value = '';
        dosageInput.value = '';

    } else {
        alert("Please enter both medicine name and dosage.");
    }
});

// ===============================
// Delete Medicine
// ===============================
document.getElementById("medicine-list").addEventListener("click", function(e) {

    const deleteBtn = e.target.closest('.med-delete');

    if (deleteBtn) {
        e.preventDefault();

        const med_item = deleteBtn.closest('.med-item');
        const med_name = med_item.querySelector("#name").textContent.trim();
        const med_dosage = med_item.querySelector("#dosage").textContent.trim();

        medicines = medicines.filter(
            medicine => 
                !(medicine.medicineName === med_name 
                    && medicine.instruction === med_dosage)
        );

        deleteBtn.closest('.med-item').remove();
    }
});

// ===============================
// Submit Prescription
// ===============================
document.getElementById("btn-submit-prescription").addEventListener("click", async function(e) {

    e.preventDefault();

    // Validation
    if (!document.getElementById('diag-input').value.trim()) {
        showPopup("error-alert","Diagnosis is required!");
        return;
    }

    if (activePatientCard) {

        const patientId = parseInt(activePatientCard.getAttribute("patient-id"));
        const appointmentId = parseInt(activePatientCard.getAttribute("appointment-id"));

        const prescription = {
            doctorId: doctorId,
            patientId: patientId,
            diagnosis: prescriptionModal.querySelector("#diag-input").value.trim(),
            additionalNotes: prescriptionModal.querySelector("#med-notes").value.trim(),
            medicines: medicines
        }
        
        console.log(prescription);

        showLoading();
        try{
            const response = await fetch(prescription_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(prescription)
            });

            if(!response.ok){
                const error = await response.json();
                showPopup("error-alert", error.message);
            }

            let status = "COMPLETED";
            const statusResponse = await fetch(`${base_url}/api/appointment/status/${appointmentId}/${status}`, {
                method: "PUT"
            });

            if(!statusResponse.ok){
                const error = await statusResponse.json();
                showPopup("error-alert", error.message);
                return;
            }

            activePatientCard.querySelector(".status-badge").textContent = status;

        }catch(e){
            console.error(e);
            showPopup("error-alert", "Server error. Please try again later.");
        }finally{
            hideLoading();
        }
    }

    closeModal();
});

// ===============================
// Modal Close Buttons
// ===============================
document.getElementById("btn-cancel-prescription").addEventListener("click", function(e) {

    e.preventDefault();
    closeModal();
});

document.getElementById("modal-close-icon").addEventListener("click", function(e) {

    e.preventDefault();
    closeModal();
});

// ===============================
// Close Modal Function
// ===============================
function closeModal() {

    activePatientCard = null;

    document
        .getElementById('prescription-modal')
        .classList.remove('active');
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
    loadingOverlay.classList.replace("hidden","overlay");
}
function hideLoading() {
    loadingOverlay.classList.replace("overlay","hidden");
}

