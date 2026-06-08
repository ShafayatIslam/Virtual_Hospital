let url = "http://localhost:8080/user/login";

const loadingOverlay = document.getElementById("loading-overlay");

document.addEventListener("DOMContentLoaded", function() {
    
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");


    // LOGIN FORM SUBMISSION LOGIC
    loginForm.addEventListener("submit", function(e) {
        // Prevent page reload
        e.preventDefault();

        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validation: Check if fields are empty
        if (usernameValue === "" || passwordValue === "") {
            let overlay = document.querySelector("#overlay");
            let popup = document.querySelector("#empty-input-alert");
            overlay.classList.replace("hidden", "popup");
            popup.classList.replace("hidden", "empty-input-alert");

            let ok_btn = document.querySelector("#ok-btn");
            ok_btn.addEventListener("click", () => {
                overlay.classList.replace("popup", "hidden");
                popup.classList.replace("empty-input-alert", "hidden");
            })

            return; 
        }
        
        login(usernameValue, passwordValue);
    });

});

async function login(username, password){
    const loginData = {
        username: username,
        password: password
    }

    showLoading();
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    if(!response.ok){
        const error = await response.json();
        
        showPopup("error-alert", error.message);
        hideLoading();
        return;
    }

    const userData = await response.json();
    hideLoading();

    if(userData.role === "PATIENT"){
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("username", userData.username);
        window.location.href = "patient_dashboard.html";
        console.log("Patient login success");
    }else if(userData.role === "DOCTOR"){
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("username", userData.username);
        window.location.href = "Dr_Dashbord.html";
        console.log("Doctor login success");
    }
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