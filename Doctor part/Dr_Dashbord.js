// Current active patient (modal open thakle track rakhar jonno)
let activePatientCard = null; 

// Patients dropdown toggle (header click korle list open/close hobe)
document.getElementById("patients-toggle").addEventListener("click", function() {
    const dropdown = document.getElementById("patients-dropdown");
    const isOpen = dropdown.classList.toggle("open");
    // Accessibility er jonno aria-expanded update
    this.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Patient list er moddhe click event handle (Call & Prescribe)
document.getElementById("patients-list").addEventListener("click", function(e) {
    
    // Call button click hoise kina check
    const callBtn = e.target.closest('.call-btn');
    if (callBtn && !callBtn.disabled) {
        e.preventDefault();
        
        const card = callBtn.closest('.patient-card');
        const badge = card.querySelector('.status-badge');
        badge.textContent = 'In Call';
        badge.classList.remove('badge-yellow');
        badge.classList.add('badge-blue');

        // Call button off kori jate abar click na hoy
        callBtn.classList.replace('btn-blue', 'btn-disabled');
        callBtn.disabled = true;

        // Prescribe button on korle
        const prescribeBtn = card.querySelector('.prescribe-btn');
        prescribeBtn.classList.replace('btn-disabled', 'btn-green');
        prescribeBtn.disabled = false;

        // counter er part ta update kora
        let waitingCount = parseInt(document.getElementById('count-waiting').textContent);
        let inCallCount = parseInt(document.getElementById('count-incall').textContent);
        
        if(waitingCount > 0) document.getElementById('count-waiting').textContent = waitingCount - 1;
        document.getElementById('count-incall').textContent = inCallCount + 1;
    }

    // Prescribe button click hoise kina check
    const prescribeBtn = e.target.closest('.prescribe-btn');
    if (prescribeBtn && !prescribeBtn.disabled) {
        e.preventDefault();
        
        activePatientCard = prescribeBtn.closest('.patient-card');
        
        // modal-e show korar jonno patient name ber
        // childNodes[0] diye badge span er age-er text ta dhora hocche
        const patientName = activePatientCard.querySelector('.patient-name').childNodes[0].textContent.trim();
        document.getElementById('modal-patient-name').textContent = `Patient: ${patientName}`;
        
        // form reset + medicine list empty + modal open
        document.getElementById('prescription-form').reset();
        document.getElementById('medicine-list').innerHTML = ''; 
        document.getElementById('prescription-modal').classList.add('active');
    }
});



// UI te medicine add kori (dynamic list)
document.getElementById("btn-add-medicine").addEventListener("click", function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('med-name');
    const dosageInput = document.getElementById('med-dosage');

    const name = nameInput.value.trim();
    const dosage = dosageInput.value.trim();

    if (name && dosage) {
        const list = document.getElementById('medicine-list');
        // UI te new item add korar jonno HTML banai
        const itemHTML = `
            <div class="med-item">
                <div>
                    <strong>${name}</strong><br>
                    <span class="text-muted" style="font-size: 0.85rem">${dosage}</span>
                </div>
                <button type="button" class="med-delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', itemHTML);
        
        // input clean kori jate porer item add kora easy hoy
        nameInput.value = '';
        dosageInput.value = '';
    } else {
        alert("Please enter both medicine name and dosage.");
    }
});

// UI theke medicine delete kori (trash icon click)
document.getElementById("medicine-list").addEventListener("click", function(e) {
    const deleteBtn = e.target.closest('.med-delete');
    if (deleteBtn) {
        e.preventDefault();
        // DOM theke item remove kori
        deleteBtn.closest('.med-item').remove();
    }
});

// Prescription submit korle status/counter update hobe
document.getElementById("btn-submit-prescription").addEventListener("click", function(e) {
    e.preventDefault();
    
    if(!document.getElementById('diag-input').value) {
        // Diagnosis na thakle submit allow na
        alert('Diagnosis is required!');
        return;
    }

    if (activePatientCard) {
        // status badge update kori (In Call -> Completed)
        const badge = activePatientCard.querySelector('.status-badge');
        badge.textContent = 'Completed';
        badge.classList.remove('badge-blue');
        badge.classList.add('badge-green');

        // Prescribe button disable
        const prescribeBtn = activePatientCard.querySelector('.prescribe-btn');
        prescribeBtn.classList.replace('btn-green', 'btn-disabled');
        prescribeBtn.disabled = true;

        // counter update kora
        let inCallCount = parseInt(document.getElementById('count-incall').textContent);
        let completedCount = parseInt(document.getElementById('count-completed').textContent);
        
        if(inCallCount > 0) document.getElementById('count-incall').textContent = inCallCount - 1;
        document.getElementById('count-completed').textContent = completedCount + 1;
    }

    // submit seshe modal close kori
    closeModal();
});

// Modal close (Cancel button)
document.getElementById("btn-cancel-prescription").addEventListener("click", function(e) {
    e.preventDefault();
    closeModal();
});

// Modal close (X icon)
document.getElementById("modal-close-icon").addEventListener("click", function(e) {
    e.preventDefault();
    closeModal();
});

function closeModal() {
    // modal close korar somoy active patient reset kori
    activePatientCard = null;
    document.getElementById('prescription-modal').classList.remove('active');
}