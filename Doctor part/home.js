let activePatientCard = null; 
//patient list er moddhe click event handle (Call & Prescribe)
document.getElementById("patients-list").addEventListener("click", function(e) {
    
    //   Call button click hoise kina check
    const callBtn = e.target.closest('.call-btn');
    if (callBtn && !callBtn.disabled) {
        e.preventDefault();
        
        const card = callBtn.closest('.patient-card');
        const badge = card.querySelector('.status-badge');
        badge.textContent = 'In Call';
        badge.classList.remove('badge-yellow');
        badge.classList.add('badge-blue');

        //   Call button off kori jate abar click na hoy
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

    //Prescribe button click hoise kina check
    const prescribeBtn = e.target.closest('.prescribe-btn');
    if (prescribeBtn && !prescribeBtn.disabled) {
        e.preventDefault();
        
        activePatientCard = prescribeBtn.closest('.patient-card');
        
        //  modal-e show korar jonno patient name ber 
        //  childNodes[0] diye badge span er age-er text ta dhora hocche
        const patientName = activePatientCard.querySelector('.patient-name').childNodes[0].textContent.trim();
        document.getElementById('modal-patient-name').textContent = `Patient: ${patientName}`;
        
        //   form reset + medicine list empty + modal open
        document.getElementById('prescription-form').reset();
        document.getElementById('medicine-list').innerHTML = ''; 
        document.getElementById('prescription-modal').classList.add('active');
    }
});



//   UI te medicine add kori (dynamic list)
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

//   UI theke medicine delete kori (trash icon click)
document.getElementById("medicine-list").addEventListener("click", function(e) {
    const deleteBtn = e.target.closest('.med-delete');
    if (deleteBtn) {
        e.preventDefault();
        deleteBtn.closest('.med-item').remove(); //   DOM theke item remove kori
    }
});

//   prescription submit korle status/counter update hobe
document.getElementById("btn-submit-prescription").addEventListener("click", function(e) {
    e.preventDefault();
    
    if(!document.getElementById('diag-input').value) {
        alert('Diagnosis is required!');
        return;
    }

    if (activePatientCard) {
        //   status badge update করি (In Call -> Completed)
        const badge = activePatientCard.querySelector('.status-badge');
        badge.textContent = 'Completed';
        badge.classList.remove('badge-blue');
        badge.classList.add('badge-green');

        //   Prescribe button disable
        const prescribeBtn = activePatientCard.querySelector('.prescribe-btn');
        prescribeBtn.classList.replace('btn-green', 'btn-disabled');
        prescribeBtn.disabled = true;

        //   counter update kora 
        let inCallCount = parseInt(document.getElementById('count-incall').textContent);
        let completedCount = parseInt(document.getElementById('count-completed').textContent);
        
        if(inCallCount > 0) document.getElementById('count-incall').textContent = inCallCount - 1;
        document.getElementById('count-completed').textContent = completedCount + 1;
    }

    closeModal();
});

//   modal close (Cancel button)
document.getElementById("btn-cancel-prescription").addEventListener("click", function(e) {
    e.preventDefault();
    closeModal();
});

//   modal close (X icon)
document.getElementById("modal-close-icon").addEventListener("click", function(e) {
    e.preventDefault();
    closeModal();
});

function closeModal() {
    //   modal close korar somoy active patient reset kori
    activePatientCard = null;
    document.getElementById('prescription-modal').classList.remove('active');
}