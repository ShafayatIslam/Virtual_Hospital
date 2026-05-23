document.addEventListener("DOMContentLoaded", function() {
    // BACK BUTTON (dashboard e back jawar jonno)
    document.getElementById("back-btn").addEventListener("click", function(e) {
        e.preventDefault();
         window.location.href = "Dr_Dashbord.html"; // home html er link
    });

    // Appointment list er parent container
    const appointmentContainer = document.getElementById("appointment-container");

    appointmentContainer.addEventListener("click", function(e) {
        // 1. Hospital Level Accordion Toggle (ekta open thakbe)
        const hospitalHeader = e.target.closest('.hospital-header');
        if (hospitalHeader) {
            e.preventDefault();
            const currentHospital = hospitalHeader.parentElement;
            const allHospitals = document.querySelectorAll('.hospital-card');

            // Onno hospital gula close kore dei
            allHospitals.forEach(hospital => {
                if (hospital !== currentHospital) {
                    hospital.classList.remove('open');
                }
            });
            // Current hospital toggle
            currentHospital.classList.toggle('open');
            return;
        }


        // 2. Time Slot Level Accordion Toggle (hospital er vitore ekta open)
        const timeslotHeader = e.target.closest('.timeslot-header');
        if (timeslotHeader) {
            e.preventDefault();
            const currentTimeslot = timeslotHeader.parentElement;
            const parentHospitalBody = currentTimeslot.closest('.hospital-body');
            const allTimeslots = parentHospitalBody.querySelectorAll('.timeslot-card');

            // Ei hospital er vitore onno timeslot gula close kore dei
            allTimeslots.forEach(timeslot => {
                if (timeslot !== currentTimeslot) {
                    timeslot.classList.remove('open');
                }
            });
            // Current timeslot toggle
            currentTimeslot.classList.toggle('open');
            return;
        }


        // 3. Call Button Logic
        const callBtn = e.target.closest('.btn-call');
        if (callBtn && !callBtn.disabled) {
            e.preventDefault();
            const patientCard = callBtn.closest('.patient-card');

            // A. Status badge update (Waiting -> Called)
            const badgeContainer = patientCard.querySelector('.badge-container');
            if (badgeContainer) {
                badgeContainer.innerHTML = `
                    <span class="badge badge-green status-badge">
                        <i class="fa-solid fa-check-circle"></i> Called
                    </span>
                `;
            }

            // B. Call button disable
            callBtn.disabled = true;
            callBtn.classList.remove('btn-blue');
            callBtn.classList.add('btn-disabled');

            // C. Prescribe button enable
            const prescribeBtn = patientCard.querySelector('.btn-prescribe');
            if (prescribeBtn) {
                prescribeBtn.disabled = false;
                prescribeBtn.classList.remove('btn-disabled');
                prescribeBtn.classList.add('btn-primary');
            }

            // D. "Consulted" counter update (0/3 -> 1/3)
            const timeslotCard = patientCard.closest('.timeslot-card');
            const counterBadge = timeslotCard.querySelector('.consulted-badge');
            
            if (counterBadge) {
                let text = counterBadge.innerText;
                let mathPart = text.split(' ')[0]; // "0/3"
                let currentCount = parseInt(mathPart.split('/')[0]); // 0
                let totalCount = parseInt(mathPart.split('/')[1]); // 3

                if (currentCount < totalCount) {
                    currentCount++; 
                    counterBadge.innerText = `${currentCount}/${totalCount} consulted`;
                }
            }
            return;
        }

        // 4. Prescribe Button Prevention (demo structure)
        const prescribeBtn = e.target.closest('.btn-prescribe');
        if (prescribeBtn && !prescribeBtn.disabled) {
            e.preventDefault();
       
            // openPrescriptionModal();
        }
    });
});