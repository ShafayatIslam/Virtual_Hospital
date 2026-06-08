const base_url = "http://localhost:8080";
const userDetails_url = base_url + "/user/info";
const docDetails_url = base_url + "/user/doctor/details";
const appointment_url = base_url + "/api/appointments";
const location_url = base_url + "/doctor/consultation-locations";
const timeslot_url = base_url + "/doctor/consultation-timeslots";

const doctorId = localStorage.getItem("userId");
const username = localStorage.getItem("username");

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorInfo();
    loadDashboardStats();
    loadConsultationLocations();
});

async function loadDoctorInfo(){
    try{
        const docResponse = await fetch(`${docDetails_url}/${doctorId}`);
        const docInfo = await docResponse.json();

        const userResponse = await fetch(`${userDetails_url}/${doctorId}`);
        const userInfo = await userResponse.json();

        let fullName = docInfo.fullName;
        let docLogo = fullName
            .trim()
            .split(/\s+/)
            .map(word => word[0].toUpperCase())
            .join("");

        document.querySelector(".user-logo p").textContent = docLogo;
        document.querySelector(".user-info h2").textContent = fullName;
        document.querySelector(".user-info p").textContent = userInfo.username;
        document.querySelector(".welcome-card h1").textContent = "Welcome, Dr. " + fullName;
        document.querySelector(".welcome-card p").textContent = docInfo.specialization;
    }catch(e){
        console.error(e);
        
    }
}

async function loadDashboardStats(){
    try{
        const [
            todayAppointments,
            weekAppointments,
            totalConsultedPatients
        ] = await Promise.all([
            fetch(`${appointment_url}/current-day/${doctorId}`),
            fetch(`${appointment_url}/current-week/${doctorId}`),
            fetch(`${appointment_url}/total-consulted/${doctorId}`)
        ]);

        const todayData = await todayAppointments.json();
        const weekData = await weekAppointments.json();
        const totalData = await totalConsultedPatients.json();

        let statCards = document.querySelectorAll(".stat-card h2");
        statCards[0].textContent = todayData;
        statCards[1].textContent = weekData;
        statCards[2].textContent = totalData;

    }catch(e){
        console.error(e);
        
    }
} 

async function loadConsultationLocations(){
    try{
        const locationResponse = await fetch(`${location_url}/${doctorId}`);
        const locations = await locationResponse.json();
        
        if(locations.length === 0) return;

        const container = document.querySelector(".location-timeslot-list");
        container.innerHTML = "";

        for(const location of locations){
            const locationId = location.id;

            const[
                totalTimeslotsResponse,
                totalAppointmentsResponse,
                maxCapacityResponse
            ] = await Promise.all([
                fetch(`${timeslot_url}/location/total/${locationId}`),
                fetch(`${appointment_url}/total-patient/${locationId}`),
                fetch(`${timeslot_url}/capacity/total/${locationId}`)
            ]);

            const totalTimeslots = await totalTimeslotsResponse.json();
            const totalAppointments = await totalAppointmentsResponse.json();
            const maxCapacity = await maxCapacityResponse.json();

            const locationCard = createLocationCard(location, totalTimeslots, totalAppointments, maxCapacity);
            
            container.appendChild(locationCard);
        }
    }catch(e){
        console.error(e);
        
    }
}

function createLocationCard(location, totalTimeslots, totalAppointments, maxCapacity){
    const locationCard = document.createElement("div");
    locationCard.className = "location-timeslot-card";

    locationCard.innerHTML = `
    <div class="info-item">
        <div class="icon-circle icon-green"><i class="fa-solid fa-location-dot"></i></div>
        <div>
            <h3>${location.hospitalName}</h3>
            <p class="text-muted">${location.address} (${location.floor}, Room ${location.room})</p>
        </div>
    </div>
    <div class="info-item">
        <div class="icon-circle icon-blue"><i class="fa-regular fa-clock"></i></div>
        <div>
            <h4>Total Time Slots</h4>
            <p class="text-muted">${totalTimeslots}</p>
        </div>
    </div>
    <div class="card-bottom">
        <div class="card-bottom-group">
            <i class="fa-solid fa-users"></i>
            <p>Total appointments:</p>
            <p>${totalAppointments}</p>
        </div>
        <div class="card-bottom-group">
            <i class="fa-solid fa-users-between-lines"></i>
            <p>Maximum capacity: </p>
            <p>${maxCapacity}</p>
        </div>
    </div>
    `;

    return locationCard;
}