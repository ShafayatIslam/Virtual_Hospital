// Profile data backup for Cancel action
let profileBackup = {};

document.getElementById("profile-edit-btn").addEventListener("click", function(e) {
    e.preventDefault(); // ata dile bar bar reload hoibo na
    toggleEdit('profile-section', true);
});

document.getElementById("profile-save-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('profile-section', false);
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

// Event Delegation for Delete Buttons
document.getElementById("education-list").addEventListener("click", function(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        deleteBtn.parentElement.remove();
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

// Event Delegation for Delete Buttons
document.getElementById("experience-list").addEventListener("click", function(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        deleteBtn.parentElement.remove();
    }
});


// 4. SKILLS SECTION EVENTS


document.getElementById("skills-edit-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('skills-section', true);
});

document.getElementById("skills-done-btn").addEventListener("click", function(e) {
    e.preventDefault();
    toggleEdit('skills-section', false);
});

document.getElementById("skills-add-btn").addEventListener("click", function(e) {
    e.preventDefault();
    addSkill();
});

// Event Delegation for Delete Icons in Tags
document.getElementById("skills-list").addEventListener("click", function(e) {
    if (e.target.classList.contains('tag-delete')) {
        e.target.parentElement.remove();
    }
});

// HELPER LOGIC FUNCTIONS (No Changes Here)

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

    if(sectionId === 'profile-section') {
        const inputs = section.querySelectorAll('input, textarea');
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

function cancelProfile() {
    const section = document.getElementById('profile-section');
    const inputs = section.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if(profileBackup[input.id] !== undefined) {
            input.value = profileBackup[input.id];
        }
    });
    
    toggleEdit('profile-section', false);
}

function addEducation() {
    const degreeInput = document.getElementById('new-edu-degree');
    const instInput = document.getElementById('new-edu-inst');
    const yearInput = document.getElementById('new-edu-year');

    const degree = degreeInput.value.trim();
    const inst = instInput.value.trim();
    const year = yearInput.value.trim();

    if(degree && inst) {
        const list = document.getElementById('education-list');
        const newItem = document.createElement('div');
        newItem.className = 'list-item';
        
        let yearText = year ? ` • ${year}` : '';
        
        newItem.innerHTML = `
            <div>
                <h4>${degree}</h4>
                <p>${inst}${yearText}</p>
            </div>
            <button type="button" class="delete-btn" style="display: block;">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        list.appendChild(newItem);

        degreeInput.value = '';
        instInput.value = '';
        yearInput.value = '';
    } else {
        alert("Degree and Institution are required!");
    }
}

function addExperience() {
    const posInput = document.getElementById('new-exp-pos');
    const hospInput = document.getElementById('new-exp-hosp');
    const durInput = document.getElementById('new-exp-dur');

    const pos = posInput.value.trim();
    const hosp = hospInput.value.trim();
    const dur = durInput.value.trim();

    if(pos && hosp) {
        const list = document.getElementById('experience-list');
        const newItem = document.createElement('div');
        newItem.className = 'list-item';
        
        let durText = dur ? ` • ${dur}` : '';

        newItem.innerHTML = `
            <div>
                <h4>${pos}</h4>
                <p>${hosp}${durText}</p>
            </div>
            <button type="button" class="delete-btn" style="display: block;">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        list.appendChild(newItem);

        posInput.value = '';
        hospInput.value = '';
        durInput.value = '';
    } else {
        alert("Position and Hospital/Clinic are required!");
    }
}

function addSkill() {
    const skillInput = document.getElementById('new-skill-name');
    const skill = skillInput.value.trim();

    if(skill) {
        const list = document.getElementById('skills-list');
        const newTag = document.createElement('div');
        newTag.className = 'tag';
        
        newTag.innerHTML = `
            ${skill}
            <i class="fa-solid fa-times tag-delete" style="display: inline;"></i>
        `;
        list.appendChild(newTag);
        
        skillInput.value = '';
    }
}