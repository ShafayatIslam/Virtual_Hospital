const base_url = "http://localhost:8080";
const details_url = "http://localhost:8080/user/doctor/details";
const edu_url = "http://localhost:8080/doctor/educations";
const exp_url = "http://localhost:8080/doctor/experiences";

const doctorId = 27;

// Profile data backup for Cancel action 
let profileBackup = {};

document.addEventListener("DOMContentLoaded", async () => {
    await loadProfileSectionData();
    await loadEducation();
    await loadExperience();
});

// 1. PROFILE SECTION EVENTS
document.getElementById("profile-edit-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('profile-section', true);
});

document.getElementById("profile-save-btn").addEventListener("click", async function(e) {
    e.preventDefault();

    const profileData = {
        fullName: document.getElementById("full-name").value,
        email: document.getElementById("prof-email").value,
        phone: document.getElementById("prof-phone").value,
        gender: document.getElementById("gender").value,
        license: document.getElementById("prof-license").value,
        specialization: document.getElementById("specialization").value,
        qualification: document.getElementById("qualification").value,
        experience: document.getElementById("prof-exp").value,
        consultationFee: document.getElementById("prof-fee").value
        ? parseFloat(document.getElementById("prof-fee").value)
        : null, 
        about: document.getElementById("prof-about").value
    }

    const response = await fetch(`${details_url}/${doctorId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
    });

    if(!response.ok){
        let overlay = document.getElementById('overlay');
        let popup = document.getElementById('error-alert');
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");

        const error = await response.json();
        popup.querySelector("p").textContent = error.message;
        
        let button = popup.querySelector("button");
        button.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });

        return;
    }

    loadProfileSectionData();
    toggleEdit("profile-section", false);
});

document.getElementById("profile-cancel-btn").addEventListener("click", function(e) {
    e.preventDefault();
    cancelProfile();
});

// 2. EDUCATION SECTION EVENTS

document.getElementById("edu-edit-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('education-section', true);
});

document.getElementById("edu-done-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('education-section', false);
});

document.getElementById("edu-add-btn").addEventListener("click", function(e) {
    e.preventDefault();
    addEducation();
});

// Event Delegation for Delete Buttons (Handle delete buttons inside the education list)
document.getElementById("education-list").addEventListener("click", function(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const edu_id = deleteBtn.dataset.id;
        deleteEducation(edu_id);
    }
});

// 3. EXPERIENCE SECTION EVENTS
document.getElementById("exp-edit-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('experience-section', true);
});

document.getElementById("exp-done-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('experience-section', false);
});

document.getElementById("exp-add-btn").addEventListener("click", function(e) {
    e.preventDefault();
    addExperience();
});

// Event Delegation for Delete Buttons (Handle delete buttons inside the experience list)
document.getElementById("experience-list").addEventListener("click", function(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const exp_id = deleteBtn.dataset.id;
        deleteExperience(exp_id);
    }
});


// Event Delegation for Delete Icons in Tags
document.getElementById("skills-list").addEventListener("click", function(e) {
    if (e.target.classList.contains('tag-delete')) {
        e.target.parentElement.remove();
    }
});

// HELPER LOGIC FUNCTIONS (No Changes Here)

// Section edit mode on/off toggle
function toggleEdit(sectionId, isEditing) {
    const section = document.getElementById(sectionId);
    if(!section) return;

    const editBtn = section.querySelector('.edit-btn');
    const saveCancelBtns = section.querySelector('.save-cancel-btns');
    
    if(isEditing) {
        editBtn.classList.add('hidden');
        saveCancelBtns.classList.remove('hidden');
    } else {
        editBtn.classList.remove('hidden');
        saveCancelBtns.classList.add('hidden');
    }

    // Profile section er input/textarea enable/disable
    if(sectionId === 'profile-section') {
        const inputs = section.querySelectorAll('input, textarea, select');
        if(isEditing) {
            inputs.forEach(input => {
                profileBackup[input.id] = input.value; 
                input.removeAttribute('disabled');
                input.style.padding = "12px"; 
            });
        } else {
            inputs.forEach(input => {
                input.setAttribute('disabled', 'true');
                input.style.padding = "12px 0"; 
            });
        }
    }

    // delete/add field control in another sections
    if(sectionId !== 'profile-section') {
        const deleteBtns = section.querySelectorAll('.delete-btn, .tag-delete');
        const addForm = section.querySelector('.add-form');
        
        deleteBtns.forEach(btn => {
            if(btn.classList.contains('tag-delete')) {
                btn.style.display = isEditing ? 'inline' : 'none';
            } else {
                btn.style.display = isEditing ? 'block' : 'none';
            }
        });

        if(isEditing) {
            addForm.classList.remove('hidden');
        } else {
            addForm.classList.add('hidden');
        }
    }
}

// Load profile data
async function loadProfileSectionData(){
    try {

        const response = await fetch(`${details_url}/${doctorId}`);

        if(!response.ok) {
            const error = response.json();

            let overlay = document.getElementById("overlay");
            let popup = document.getElementById("issue");
            overlay.classList.replace("hidden", "overlay");
            popup.classList.replace("hidden", "popup");
            let message = popup.querySelector("p");
            message.textContent = error.message;
            let button = popup.querySelector("button");
            
            button.addEventListener("click", () => {
                overlay.classList.replace("overlay", "hidden");
                popup.classList.replace("popup", "hidden");
            });

            return;
        }

        const doctor = await response.json();

        // Header
        document.querySelector(".title-info h2").innerText = doctor.fullName;
        document.querySelector(".title-info .role").innerText = doctor.specialization;

        // Inputs
        document.getElementById("full-name").value = doctor.fullName || profileBackup["full-name"];
        document.getElementById("prof-email").value = doctor.email || profileBackup["prof-email"];
        document.getElementById("prof-phone").value = doctor.phone || profileBackup["prof-phone"];
        document.getElementById("prof-license").value = doctor.license || profileBackup["prof-license"];
        document.getElementById("prof-exp").value = doctor.experience || profileBackup["prof-exp"];
        document.getElementById("qualification").value = doctor.qualification || profileBackup["qualification"];
        document.getElementById("prof-fee").value = doctor.consultationFee || profileBackup["prof-fee"];
        document.getElementById("prof-about").value = doctor.about || profileBackup["prof-about"];

        // Select fields
        const selects = document.querySelectorAll("#profile-section select");

        selects[0].value = doctor.specialization || profileBackup["specialization"];
        selects[1].value = doctor.gender || profileBackup["gender"];

    } catch(error) {

        console.error(error);
        alert("Failed to load profile data");
    }
}

// Cancel dile profile er ager data restore
function cancelProfile() {
    const section = document.getElementById('profile-section');
    const inputs = section.querySelectorAll('input, textarea, select');
    profileBackup["specialization"] = "Dermatology";
    inputs.forEach(input => {
        if(profileBackup[input.id] !== undefined) {
            input.value = profileBackup[input.id];
            console.log(input.id," ",profileBackup[input.id]);
        }
    });
    
    toggleEdit('profile-section', false);
}

// Load education
async function loadEducation(){
    try{
        const response = await fetch(`${edu_url}/${doctorId}`);

        if(!response.ok) {
            const error = response.json();
            showPopup("issue", error.message);
            return;
        }

        const educations = await response.json();

        const education_list = document.getElementById("education-list");
        education_list.innerHTML = "";

        if(educations.length === 0){
            let h4 = document.createElement("h4");
            h4.textContent = "No Education Found!";
            education_list.appendChild(h4);
            return;
        }

        educations.forEach(edu => {

            const edu_card = document.createElement("div");
            edu_card.className = "list-item";

            edu_card.innerHTML = `
                <div>
                    <h4>${edu.degree}</h4>
                    <p>${edu.institution} • ${edu.passingYear}</p>
                </div>

                <button 
                    type="button"
                    class="delete-btn"
                    data-id="${edu.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            education_list.appendChild(edu_card);
        });
    }catch(e){
        console.error(e);
        alert("Failed loading educations!");
    }
}

// Add Education
async function addEducation() {
    const degreeInput = document.getElementById('new-edu-degree');
    const instInput = document.getElementById('new-edu-inst');
    const yearInput = document.getElementById('new-edu-year');

    const degree = degreeInput.value.trim();
    const inst = instInput.value.trim();
    const year = yearInput.value.trim();

    if(!degree || !inst || !year) {
        showPopup("error-alert", "All fields are required.");
        return;
    }

    const educationData = {
        doctorId: doctorId,
        degree: degree,
        institution: inst,
        passingYear: year
    }

    const response = await fetch(`${base_url}/doctor/education`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(educationData)
    });

    if(!response.ok) {
        const error = await response.json();
        showPopup("error-alert", error.message);
        return;
    }
    loadEducation();
}

// Delete Education
async function deleteEducation(edu_id){
    try{
        const response = await fetch(`${base_url}/doctor/education/${edu_id}`, {
            method: "DELETE"
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("issue", error.message);
            return;
        }

        loadEducation();
    }catch(e){
        console.error(e);
        alert("Failed deleting education!");
    }
}

// Load Experience
async function loadExperience(){
    try{
        const response = await fetch(`${exp_url}/${doctorId}`);

        if(!response.ok){
            const error = await response.json();
            showPopup("issue", error.message);
            return;
        }

        const experiences = await response.json();

        const experience_list = document.getElementById("experience-list");
        experience_list.innerHTML = "";

        if(experiences.length === 0){
            let h4 = document.createElement("h4");
            h4.textContent = "No Experience Found!";
            experience_list.appendChild(h4);
            return;
        }

        experiences.forEach(exp => {
            const exp_card = document.createElement("div");

            exp_card.innerHTML = `
                <div class="list-item">
                    <div>
                        <h4>${exp.position}</h4>
                        <p>${exp.hospital} • ${exp.startYear} - ${exp.endYear}</p>
                    </div>
                    <button type="button" class="delete-btn" data-id=${exp.id}><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;

            experience_list.appendChild(exp_card);
        })
    }catch(e){
        console.error(e);
        alert("Failed loading experiences!");
    }
}

// Experience item add kora
async function addExperience() {
    const posInput = document.getElementById('new-exp-pos');
    const hospInput = document.getElementById('new-exp-hosp');
    const startYearInput = document.getElementById('exp-start-year');
    const endYearInput = document.getElementById('exp-end-year');

    const position = posInput.value.trim();
    const hospital = hospInput.value.trim();
    const startYear = startYearInput.value.trim();
    const endYear = endYearInput.value.trim();

    if(!position || !hospital || !startYear || !endYear) {
        showPopup("error-alert", "All fields are required.");
        return;
    }

    const experienceData = {
        doctorId: doctorId,
        position: position,
        hospital: hospital,
        startYear: startYear,
        endYear: endYear
    }

    const response = await fetch(`${base_url}/doctor/experience`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(experienceData)
    });

    if(!response.ok) {
        const error = await response.json();
        showPopup("error-alert", error.message);
        return;
    }

    loadExperience();
}

// Delete Experience
async function deleteExperience(exp_id){
    try{
        const response = await fetch(`${base_url}/doctor/experience/${exp_id}`, {
            method: "DELETE"
        });

        if(!response.ok) {
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        loadExperience();
    }catch(e){
        console.error(e);
        alert("Failed to delete experience!");
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