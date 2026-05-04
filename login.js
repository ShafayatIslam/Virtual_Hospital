document.addEventListener("DOMContentLoaded", function() {
    const btnPatient = document.getElementById("btn-patient");
    const btnDoctor = document.getElementById("btn-doctor");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    let currentRole = "patient";
    // TOGGLE LOGIC
   
    btnPatient.addEventListener("click", function(e) {
        e.preventDefault();
        currentRole = "patient";
        
        // Change Theme Classes on Body
        document.body.classList.remove("theme-doctor");
        document.body.classList.add("theme-patient");
        
        // Update Button Active States
        btnPatient.classList.add("active");
        btnDoctor.classList.remove("active");
    });

    // Click on Doctor Button
    btnDoctor.addEventListener("click", function(e) {
        e.preventDefault();
        currentRole = "doctor";
        
        // Change Theme Classes on Body
        document.body.classList.remove("theme-patient");
        document.body.classList.add("theme-doctor");
        
        // Update Button Active States
        btnDoctor.classList.add("active");
        btnPatient.classList.remove("active");
    });


    // LOGIN FORM SUBMISSION LOGIC
    loginForm.addEventListener("submit", function(e) {
        // Prevent page reload
        e.preventDefault();

        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validation: Check if fields are empty
        if (usernameValue === "" || passwordValue === "") {
            alert("Please enter both username and password to login.");
            return; 
        }
        if (currentRole === "doctor") {
            window.location.href = "home.html";
        } else if (currentRole === "patient") {
            alert(" Under Construction :)");
        }
    });

});