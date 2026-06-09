 
// 1. INITIAL STATE (Dummy Data Array)
 
// Ei array ta puro frontend logic handle korbe. Pore backend thon fetch korba.
let notificationsArray = [
    {
        id: 1,
        type: "prescription", // Jeta diye check korbo prescription page e jabe kina
        message: "New prescription from Dr. Michael Chen",
        date: "2026-04-25",
        isUnread: true // True hole blue theme thakbe card e
    },
    {
        id: 2,
        type: "appointment",
        message: "Appointment reminder: Dr. Sarah Johnson on Apr 28",
        date: "2026-04-26",
        isUnread: false
    }
];


 
// 2. DOMContentLoaded & EVENT LISTENERS
 
document.addEventListener("DOMContentLoaded", () => {
    
    // Initial Render: Page load howar sathe sathe list show korbe
    renderNotifications();

    // Event Delegation: List container dhore dynamic card click handle kora
    const notifListContainer = document.getElementById("notifications-list");
    
    if (notifListContainer) {
        notifListContainer.addEventListener("click", (e) => {
            const card = e.target.closest(".notification-card");
            if (!card) return;

            e.preventDefault();
            const notifId = parseInt(card.getAttribute("data-id"));
            
            // Array theke target notification khuje ber kora
            const notifData = notificationsArray.find(n => n.id === notifId);
            
            if (notifData) {
                // Click korle unread state false hobe (Read hoye jabe)
                notifData.isUnread = false;
                renderNotifications(); // UI refresh hobe dot soraite
                
                // Prescription related notification hole prescription.html e niye jabe
                if (notifData.type === "prescription") {
                    window.location.href = "prescription.html";
                }
            }
        });
    }

});


 
// 3. RENDER FUNCTION
 
// renderNotifications() er kaj holo UI clear kora ebong notun card insert kora
function renderNotifications() {
    const listContainer = document.getElementById("notifications-list");
    const sidebarBadge = document.getElementById("sidebar-badge-count");
    
    if (!listContainer) return;
    listContainer.innerHTML = ""; // Purono dynamic html clear kora

    // Unread count ber kora sidebar badge update er jonno
    let unreadCount = notificationsArray.filter(n => n.isUnread).length;
    if (sidebarBadge) {
        sidebarBadge.innerText = unreadCount;
        if (unreadCount === 0) {
            sidebarBadge.classList.add("hidden"); // Unread na thakle badge hide hobe
        } else {
            sidebarBadge.classList.remove("hidden");
        }
    }

    // Loop chaliye notification card insert kora
    notificationsArray.forEach(notif => {
        
        // Unread check kore classes ebong right side blue dot config kora
        const unreadClass = notif.isUnread ? "unread" : "";
        const dotHTML = notif.isUnread ? `<div class="blue-dot"></div>` : "";
        
        // Dynamically icon select kora type onujayi
        const iconClass = notif.type === "prescription" ? "fa-regular fa-bell" : "fa-regular fa-bell"; 

        const cardHTML = `
            <div class="notification-card ${unreadClass}" data-id="${notif.id}">
                <div class="notif-left">
                    <i class="${iconClass} notif-icon"></i>
                    <div class="notif-text-wrapper">
                        <h4>${notif.message}</h4>
                        <p class="notif-date">${notif.date}</p>
                    </div>
                </div>
                ${dotHTML}
            </div>
        `;

        listContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
}