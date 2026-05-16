const patient_api = "http://localhost:8080/user/patient/registration";
const doctor_api = "http://localhost:8080/user/doctor/registration";

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

patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = patientForm.querySelectorAll("input, select");

    const password = inputs[11].value.trim();
    const confirmPassword = inputs[12].value.trim();
    console.log(password+" "+confirmPassword);
    if(password !== confirmPassword){
        let overlay = document.getElementById('overlay');
        let popup = document.getElementById('password-confirmation');
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");

        let button = popup.querySelector("button");
        button.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });
    }

    const patientData = {
        fullName: (inputs[0].value+" "+inputs[1].value).trim(),
        email: inputs[2].value.trim(),
        phone: inputs[3].value.trim(),
        bloodGroup: inputs[4].value,
        gender: inputs[5].value,
        dateOfBirth: inputs[6].value,
        address: inputs[7].value,
        emergencyContact: inputs[8].value.trim(),
        emergencyContactRelation: inputs[9].value,
        username: inputs[10].value.trim(),
        role: "PATIENT",
        password: password
    }

    const response = await fetch(patient_api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patientData)
    });

    if(!response.ok){
        let overlay = document.getElementById('overlay');
        let popup = document.getElementById('error-alert');
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");

        let button = popup.querySelector("button");
        button.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });

        return;
    }

    let overlay = document.getElementById('overlay');
    let popup = document.getElementById('reg-success');
    overlay.classList.replace("hidden", "overlay");
    popup.classList.replace("hidden", "popup");

    let cancel_btn = document.getElementById('cancel-btn');
    let go_to_login_btn = document.getElementById('go-to-login-page');

    cancel_btn.addEventListener("click", () => {
        overlay.classList.replace("overlay", "hidden");
        popup.classList.replace("popup", "hidden");
    });

    go_to_login_btn.addEventListener("click", () => {
        window.location.href = "";
    });
});

doctorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = doctorForm.querySelectorAll("input, select");

    const password = inputs[10].value.trim();
    const confirmPassword = inputs[11].value.trim();
    console.log(password+" "+confirmPassword);
    if(password !== confirmPassword){
        let overlay = document.getElementById('overlay');
        let popup = document.getElementById('password-confirmation');
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");

        let button = popup.querySelector("button");
        button.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });
    }

    const doctorData = {
        fullName: (inputs[0].value+" "+inputs[1].value).trim(),
        email: inputs[2].value.trim(),
        phone: inputs[3].value.trim(),
        specialization: inputs[4].value,
        qualification: inputs[5].value,
        gender: inputs[6].value,
        username: inputs[8].value.trim(),
        license: inputs[9].value.trim(),
        role: "DOCTOR",
        password: password
    }

    const response = await fetch(doctor_api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(doctorData)
    });

    if(!response.ok){
        let overlay = document.getElementById('overlay');
        let popup = document.getElementById('error-alert');
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");

        let button = popup.querySelector("button");
        button.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });

        return;
    }

    let overlay = document.getElementById('overlay');
    let popup = document.getElementById('reg-success');
    overlay.classList.replace("hidden", "overlay");
    popup.classList.replace("hidden", "popup");

    let cancel_btn = document.getElementById('cancel-btn');
    let go_to_login_btn = document.getElementById('go-to-login-page');

    cancel_btn.addEventListener("click", () => {
        overlay.classList.replace("overlay", "hidden");
        popup.classList.replace("popup", "hidden");
    });

    go_to_login_btn.addEventListener("click", () => {
        window.location.href = "";
    });
})