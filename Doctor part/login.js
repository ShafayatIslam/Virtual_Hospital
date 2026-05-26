document.addEventListener("DOMContentLoaded", function() {
    // DOM theke important element gula dhora
    const btnPatient = document.getElementById("btn-patient");
    const btnDoctor = document.getElementById("btn-doctor");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // default vabe patient role thakbe
    let currentRole = "patient";

    // Patient button click korle role + theme update hoy
    btnPatient.addEventListener("click", function(e) {
        e.preventDefault();
        currentRole = "patient";

        // Body te patient theme set kora
        document.body.classList.remove("theme-doctor");
        document.body.classList.add("theme-patient");

        // Active button state update
        btnPatient.classList.add("active");
        btnDoctor.classList.remove("active");
    });

    // Doctor button click korle role + theme update hoy
    btnDoctor.addEventListener("click", function(e) {
        e.preventDefault();
        currentRole = "doctor";

        // Body te doctor theme set kora
        document.body.classList.remove("theme-patient");
        document.body.classList.add("theme-doctor");

        // Active button state update
        btnDoctor.classList.add("active");
        btnPatient.classList.remove("active");
    });

    // Login form submit handle
    loginForm.addEventListener("submit", function(e) {
        // page reload off kora
        e.preventDefault();

        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // empty hole alert deya
        if (usernameValue === "" || passwordValue === "") {
            alert("Please enter both username and password to login.");
            return;
        }

        // role onujayi next action
        if (currentRole === "doctor") {
            // doctor login hole dashboard e redirect
            window.location.href = "home.html";
        } else if (currentRole === "patient") {
            // patient part ekhono ready na
            alert(" Under Construction :)");
        }
    });
});