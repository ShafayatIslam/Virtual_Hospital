let activePatientCard = null; 
//1. PATIENT LIST EVENTS (Call & Prescribe)
document.getElementById("patients-list").addEventListener("click", function(e) {
    
    // Call Button Clicked
    const callBtn = e.target.closest('.call-btn');
    if (callBtn && !callBtn.disabled) {
        e.preventDefault();
        
        // Find the specific card that was clicked
        const card = callBtn.closest('.patient-card');
        
        // Change Status Badge
        const badge = card.querySelector('.status-badge');
        badge.textContent = 'In Call';
        badge.classList.remove('badge-yellow');
        badge.classList.add('badge-blue');

        // Disable Call Button
        callBtn.classList.replace('btn-blue', 'btn-disabled');
        callBtn.disabled = true;

        // Enable Prescribe Button
        const prescribeBtn = card.querySelector('.prescribe-btn');
        prescribeBtn.classList.replace('btn-disabled', 'btn-green');
        prescribeBtn.disabled = false;

        // Update Counters Manually
        let waitingCount = parseInt(document.getElementById('count-waiting').textContent);
        let inCallCount = parseInt(document.getElementById('count-incall').textContent);
        
        if(waitingCount > 0) document.getElementById('count-waiting').textContent = waitingCount - 1;
        document.getElementById('count-incall').textContent = inCallCount + 1;
    }

    // Prescribe Button Clicked
    const prescribeBtn = e.target.closest('.prescribe-btn');
    if (prescribeBtn && !prescribeBtn.disabled) {
        e.preventDefault();
        
        activePatientCard = prescribeBtn.closest('.patient-card');
        
        // Get patient name from HTML to show in Modal
        // childNodes[0] is used to get the text before the badge span
        const patientName = activePatientCard.querySelector('.patient-name').childNodes[0].textContent.trim();
        document.getElementById('modal-patient-name').textContent = `Patient: ${patientName}`;
        
        // Reset form and open modal
        document.getElementById('prescription-form').reset();
        document.getElementById('medicine-list').innerHTML = ''; 
        document.getElementById('prescription-modal').classList.add('active');
    }
});



// Add Medicine into UI directly
document.getElementById("btn-add-medicine").addEventListener("click", function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('med-name');
    const dosageInput = document.getElementById('med-dosage');

    const name = nameInput.value.trim();
    const dosage = dosageInput.value.trim();

    if (name && dosage) {
        const list = document.getElementById('medicine-list');
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
        
        nameInput.value = '';
        dosageInput.value = '';
    } else {
        alert("Please enter both medicine name and dosage.");
    }
});

// Delete Medicine directly from UI
document.getElementById("medicine-list").addEventListener("click", function(e) {
    const deleteBtn = e.target.closest('.med-delete');
    if (deleteBtn) {
        e.preventDefault();
        deleteBtn.closest('.med-item').remove(); // remove element from DOM
    }
});

// Submit Prescription
document.getElementById("btn-submit-prescription").addEventListener("click", function(e) {
    e.preventDefault();
    
    if(!document.getElementById('diag-input').value) {
        alert('Diagnosis is required!');
        return;
    }

    if (activePatientCard) {
        // Update Status Badge to Completed
        const badge = activePatientCard.querySelector('.status-badge');
        badge.textContent = 'Completed';
        badge.classList.remove('badge-blue');
        badge.classList.add('badge-green');

        // Disable Prescribe Button
        const prescribeBtn = activePatientCard.querySelector('.prescribe-btn');
        prescribeBtn.classList.replace('btn-green', 'btn-disabled');
        prescribeBtn.disabled = true;

        // Update Counters
        let inCallCount = parseInt(document.getElementById('count-incall').textContent);
        let completedCount = parseInt(document.getElementById('count-completed').textContent);
        
        if(inCallCount > 0) document.getElementById('count-incall').textContent = inCallCount - 1;
        document.getElementById('count-completed').textContent = completedCount + 1;
    }

    closeModal();
});

// Close Modal
document.getElementById("btn-cancel-prescription").addEventListener("click", function(e) {
    e.preventDefault();
    closeModal();
});

document.getElementById("modal-close-icon").addEventListener("click", function(e) {
    e.preventDefault();
    closeModal();
});

function closeModal() {
    activePatientCard = null;
    document.getElementById('prescription-modal').classList.remove('active');
}