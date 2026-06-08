const base_url = "http://localhost:8080";
const symptom_url = base_url + "/api/symptom";
const edu_url = base_url + "/doctor/educations";
const rating_url = base_url + "/api/rating/average";
const timeslot_url = base_url + "/doctor/consultation-timeslots/days";

const page_header = document.querySelector(".page-header h1");
const doctor_container = document.getElementById("doctor-grid-container");

const patientId = localStorage.getItem("userId");
const username = localStorage.getItem("username");
const symptom = localStorage.getItem("symptom");

const dayMap = {"MONDAY": "Mon", "TUESDAY": "Tue", "WEDNESDAY": "Wed", "THURSDAY": "Thu", "FRIDAY": "Fri", "SATURDAY": "Sat", "SUNDAY": "Sun"};

document.addEventListener("DOMContentLoaded", () => {
    loadMedicalField();
    loadSpecialists();
});

async function loadMedicalField(){
    try{
        const response = await fetch(`${symptom_url}/medical-field/${symptom}`);

        if(!response.ok){
            page_header.textContent = "No Medical Field Found!";
            return;
        }

        const medical_field = await response.text();
        page_header.textContent = medical_field;
    }catch(e){
        console.error(e);
        alert("Server error! Please try again later.");
    }
}

async function loadSpecialists(){
    try{
        const response = await fetch(`${symptom_url}/specialist/${symptom}`);
        const doctors = await response.json();

        if(doctors.length === 0) return;

        doctor_container.innerHTML = "";

        for(const doctor of doctors){
            const eduResponse = await fetch(`${edu_url}/${doctor.id}`);
            const educations = await eduResponse.json();
            
            let edu_arr = [];
            for(const education of educations){
                edu_arr.push(education.degree);
            }
            let edu_status = edu_arr.join(", ");
            if(edu_status.trim() == "") edu_status = "undefined";
            
            const ratingResponse = await fetch(`${rating_url}/${doctor.id}`);
            const rating = await ratingResponse.json();

            const totalRatingsResponse = await fetch(`${base_url}/api/rating/total/${doctor.id}`);
            const totalRatings = await totalRatingsResponse.json();

            let docLogo = doctor.fullName
                .trim()
                .split(/\s+/)
                .map(word => word[0].toUpperCase())
                .join("");

            const doctorCard = createDoctorCard(doctor, edu_status, rating, totalRatings, docLogo);
            doctor_container.appendChild(doctorCard);
        }
        
    }catch(e){
        console.error(e);
    }
}

function createDoctorCard(doctor, edu_status, rating, totalRatings, docLogo){
    const doctorCard = document.createElement("div");
    doctorCard.classList = "doctor-card";

    doctorCard.innerHTML = `
    <div class="doctor-header">
        <div class="avatar">${docLogo}</div>
        <div class="doctor-title">
            <h2>Dr. ${doctor.fullName}</h2>
            <p class="specialty">${doctor.specialization}</p>
            <div class="rating">
                <i class="fa-solid fa-star text-yellow"></i>
                <strong>${rating}</strong> <span class="text-muted">(${totalRatings} review${totalRatings !== 1 ? 's' : ''})</span>
            </div>
        </div>
    </div>

    <div class="doctor-info-list">
        <p class="info-link"><i class="fa-solid fa-medal"></i> ${edu_status}</p>
        <p class="info-link"><i class="fa-solid fa-briefcase"></i> ${doctor.experience} years experience</p>
        <p class="info-link"><i class="fa-solid fa-dollar-sign"></i> Consultation Fee: $${doctor.consultationFee === null ? 'Undefined' : doctor.consultationFee}</p>
    </div>

    <div class="availability-section">
        <p class="available-text"><i class="fa-regular fa-circle-check"></i> Available on</p>
        <div class="day-blocks">
            <h4>[Not Available]</h4>
        </div>
    </div>

    <button type="button" class="btn btn-blue btn-book" doc-id="${doctor.id}">View Full Profile & Book</button>
    `;

    loadAvailableDays(doctor.id, doctorCard);

    return doctorCard;
}

async function loadAvailableDays(doctorId, doctorCard){
    try{
        const response = await fetch(`${timeslot_url}/${doctorId}`);
        const days = await response.json();

        if(days.length == 0) return;
        const shortDays = days.map(d => dayMap[d]);

        const day_container = doctorCard.querySelector(".day-blocks");
        day_container.innerHTML = "";

        for(const shortDay of shortDays){
            const day_card = document.createElement("span");
            day_card.classList = "day-block";
            day_card.textContent = shortDay;
            day_container.appendChild(day_card);
        }
        
    }catch(e){
        console.log(e);
    }
}

document.getElementById("doctor-grid-container").addEventListener("click", (e) => {
    e.defaultPrevented;
    
    const btn_book = e.target.closest(".btn-book");
    if(btn_book){
        const doctorId = btn_book.getAttribute("doc-id");
        localStorage.setItem("doctorId", doctorId);
        window.location.href = "available-dr-profile.html";
    }
});