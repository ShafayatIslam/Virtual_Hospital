// DOM ready howar pori JS run hobe
document.addEventListener("DOMContentLoaded", () => {

    // Profile data backup for Cancel action (cancel dile ager data restore hobe)
    let profileBackup = {};

    // 1. PROFILE SECTION EVENTS
    // button gula dhore rakhi jate event add kora jay
    const profileEditBtn = document.getElementById("profile-edit-btn");
    const profileSaveBtn = document.getElementById("profile-save-btn");
    const profileCancelBtn = document.getElementById("profile-cancel-btn");

    if (profileEditBtn) {
        profileEditBtn.addEventListener("click", function(e) {
            e.preventDefault(); // default action off (form submit/anchor reload hobe na)
            // edit mode on kori
            toggleEdit('profile-section', true);
        });
    }

    if (profileSaveBtn) {
        profileSaveBtn.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Backend Developer will add Fetch API here
            // demo success message
            alert("Patient Information Saved Successfully!");
            
            // edit mode off kori
            toggleEdit('profile-section', false);
        });
    }

    if (profileCancelBtn) {
        profileCancelBtn.addEventListener("click", function(e) {
            e.preventDefault();
            // cancel dile previous data restore
            cancelProfile();
        });
    }

    // HELPER LOGIC FUNCTIONS

    // Section edit mode on/off toggle
    function toggleEdit(sectionId, isEditing) {
        // sectionId diye specific section dhori
        const section = document.getElementById(sectionId);
        if(!section) return;

        // Edit button + Save/Cancel group toggle
        const editBtn = section.querySelector('.edit-btn');
        const saveCancelBtns = section.querySelector('.save-cancel-btns');
        
        if(isEditing) {
            editBtn.classList.add('hidden');
            saveCancelBtns.classList.remove('hidden');
        } else {
            editBtn.classList.remove('hidden');
            saveCancelBtns.classList.add('hidden');
        }

        // Profile section er input enable/disable
        if(sectionId === 'profile-section') {
            const inputs = section.querySelectorAll('input, textarea');
            if(isEditing) {
                inputs.forEach(input => {
                    // edit mode e jawar age current value backup
                    profileBackup[input.id] = input.value; // Data Backup
                    input.removeAttribute('disabled');
                    // input.style.padding = "12px"; (CSS handle korbe)
                });
                // Focus first input automatically
                document.getElementById('full-name').focus();
            } else {
                inputs.forEach(input => {
                    // edit off e input lock
                    input.setAttribute('disabled', 'true');
                    // input.style.padding = "12px 0"; (CSS handle korbe)
                });
            }
        }
    }

    // Cancel dile profile er ager data restore
    function cancelProfile() {
        const section = document.getElementById('profile-section');
        const inputs = section.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if(profileBackup[input.id] !== undefined) {
                // backup theke value restore
                input.value = profileBackup[input.id]; // Restore Value
            }
        });
        
        // edit mode off kore UI reset
        toggleEdit('profile-section', false);
    }

});