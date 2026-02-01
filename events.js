
const eventsData = [
    {
        id: 1,
        title: 'BERMEL FEST',
        category: 'music',
        date: '2026-02-07',
        time: 'starting from 6:00 PM to 2:00 AM',
        location: 'KANA Warehouse',
        price: 45,
        image: 'assets/images/event1.jpg',
        description: 'Join us for an amazing evening of live music featuring local and international artists. Food trucks and craft vendors will be available.',
        featured: true
    },
    {
        id: 2,
        title: 'WORLD AFRICA',
        category: 'MUSICAL ',
        date: '2026-07-20',
        time: 'starting from 11:00 pm to 2:00 AM',
        location: 'Millenium hall',
        price: 75,
        image: 'assets/images/event2.jpg',
        description: 'A vibrant celebration of African culture,music,fashion bringing together diverse traditions from across Africa.',
        featured: false
    },
    {
        id: 3,
        title: 'The Lab',
        category: 'music showcase',
        date: '2026-07-25',
        time: 'Starting from 12:00 pM to 2:00 AM',
        location: 'Ghion',
        price: 20,
        image: 'assets/images/event3.jpg',
        description: 'An experimental space for Djs,producers and creatives.',
        featured: false
    },
    {
        id: 4,
        title: 'Chobe Fest',
        category: 'Electronic music fest',
        date: '2026-07-30',
        time: 'starting from 8:00 PM TO 7:00 AM',
        location: 'The venuee', 
        price: 35,
        image: 'assets/images/event4.jpg',
        description: 'A high energy festival featuring top ethiopian and africans Djs.',
        featured: false
    },
    {
        id: 5,
        title: 'Food & Wine Festival',
        category: 'music',
        date: '2026-08-05',
        time: 'starting from 12:00 PM to 00:30 AM',
        location: 'Riverside Park',
        price: 60,
        image: 'assets/images/event5.jpg',
        description: 'Taste cuisines from around the world paired with fine wines. Live cooking demonstrations and wine tasting sessions.',
        featured: true
    },
    {
        id: 6,
        title: 'Marathon Training Workshop',
        category: 'sports',
        date: '2026-08-10',
        time: 'starting from 7:00 AM To 9:00 AM',
        location: 'Sports Complex',
        price: 30,
        image: 'assets/images/event6.jpg',
        description: 'Professional coaches will guide you through marathon training techniques. Includes nutrition advice and injury prevention tips.',
        featured: false
    },
    {
        id: 7,
        title: 'Photography Masterclass',
        category: 'workshop',
        date: '2026-08-15',
        time: 'starting from 2:00 PM to 12:00 PM',
        location: 'Art Studio',
        price: 85,
        image: 'assets/images/event7.jpg',
        description: 'Learn professional photography techniques from award-winning photographers. Bring your camera!',
        featured: false
    },
    {
        id: 8,
        title: 'Yoga and Wellness Retreat',
        category: 'workshop',
        date: '2026-08-20',
        time: 'Starting from 9:00 AM to 5:00 AM',
        location: 'Wellness Center',
        price: 55,
        image: 'assets/images/event8.jpg',
        description: 'A full day of yoga, meditation, and wellness activities. Includes healthy lunch and wellness workshops.',
        featured: false
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeEventsPage();
});

function initializeEventsPage() {
    renderEvents(eventsData);
    setupModal();
    setupMobileMenu();
}

function renderEvents(events) {
    const container = document.getElementById('eventsContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    container.innerHTML = events.map(event => {
    return createEventCard(event);
}).join('');
    

    container.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', function() {
            const eventId = parseInt(this.dataset.eventId);
            showEventModal(eventId);
        });
    });
}

function createEventCard(event) {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    return `
        <article class="event-card" data-event-id="${event.id}">
        <div class="event-info">
                <h3>${event.title}</h3>
                <p class="event-date">${formattedDate} at ${event.time}</p>
                <p class="event-location">${event.location}</p>
                <p class="event-price">$${event.price}</p>
            </div>
        </article>
    `;
}







function setupModal() {
    const modal = document.getElementById('eventModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    if (modalClose && modal) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay && modal) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
            closeModal();
        }
    });
}

function showEventModal(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    modalBody.innerHTML = `
        <h2>${event.title}</h2>
        <div style="margin: 1rem 0;">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Price:</strong> $${event.price}</p>
        </div>
        <div style="margin: 1.5rem 0;">
            <h3>About this event</h3>
            <p>${event.description}</p>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button onclick="closeModal()" class="btn btn-outline">Close</button>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function bookEvent(eventId) {

    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        localStorage.setItem('selectedEvent', JSON.stringify(event));
        window.location.href = 'booking.html';
    }
}

function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


