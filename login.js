let url = "http://localhost:8080/users/login";

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

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    if(!response.ok){
        const error = await response.json();
        
        let overlay = document.querySelector("#overlay");
        let popup = document.querySelector("#invalid-input-alert");
        overlay.classList.replace("hidden", "popup");
        popup.classList.replace("hidden", "invalid-input-alert");

        let error_msg = document.querySelector(".error-msg p");
        error_msg.textContent = error.message;

        let try_btn = document.querySelector("#try-btn");
        try_btn.addEventListener("click", () => {
            overlay.classList.replace("popup", "hidden");
            popup.classList.replace("invalid-input-alert", "hidden");
        })
        return;
    }

    const userData = await response.json();
    
    if(userData.role === "PATIENT"){
        localStorage.setItem("userId", userData.id);
        window.location.href = "";
    }else if(userData.role === "DOCTOR"){
        localStorage.setItem("userId", userData.id);
        window.location.href = "";
    }
}