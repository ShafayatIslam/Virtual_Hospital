const patientCard = document.getElementById('patient-card');
patientCard.querySelector(".icon").style.color = "#005cff";
const doctorCard = document.getElementById('doctor-card');

const patientSection = document.getElementById('patient-form');
const doctorSection = document.getElementById('doctor-form');

const patientForm = patientSection.querySelector("form");
const doctorForm = doctorSection.querySelector("form");


patientCard.addEventListener("click", () => {
    patientSection.classList.remove("hidden");
    doctorSection.classList.add("hidden");

    patientCard.classList.add("blue-style");
    patientCard.querySelector(".icon").style.color = "#005cff";

    doctorCard.classList.remove("green-style");
    doctorCard.querySelector(".icon").style.color = "#8f96a3";
});

doctorCard.addEventListener("click", () => {
    doctorSection.classList.remove("hidden");
    patientSection.classList.add("hidden");

    doctorCard.classList.add("green-style");
    doctorCard.querySelector(".icon").style.color = "green";

    patientCard.classList.remove("blue-style");
    patientCard.querySelector(".icon").style.color = "#8f96a3";
});

