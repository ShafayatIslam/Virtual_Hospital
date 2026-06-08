const base_url = "http://localhost:8080";
const patient_url = base_url + "/user/patient/details";

const patientId = localStorage.getItem("userId");
const username = localStorage.getItem("username");

const fullName_html = document.querySelector(".user-info h2");
const username_html = document.querySelector(".user-info p");
const userLogo = document.querySelector(".user-logo");
const find_button = document.getElementById("findBtn");
const description_box = document.querySelector(".description-box textarea");

document.addEventListener("DOMContentLoaded", () => {
    loadPatientInfo();
});

async function loadPatientInfo(){
    try{
        const response = await fetch(`${patient_url}/${patientId}`);
        const patient = await response.json();

        fullName_html.textContent = patient.fullName;
        username_html.textContent = username;

        let fullName = patient.fullName;
        let logo = fullName
            .trim()
            .split(/\s+/)
            .map(word => word[0].toUpperCase())
            .join("");

        userLogo.textContent = logo;
    }catch(e){
        console.error(e);
    }
}

description_box.addEventListener("input", () => {
    const text = description_box.value.trim();

    if (text.length > 0) {
        find_button.disabled = false;
        find_button.classList.replace("inactive-find-btn","active-find-btn");
    } else {
        find_button.disabled = true;
        find_button.classList.replace("active-find-btn","inactive-find-btn");
    }
});

find_button.addEventListener("click", () => {
    const symptom = description_box.value.trim();

    localStorage.setItem("symptom", symptom);
    window.location.href = "Available_Dr.html";
});