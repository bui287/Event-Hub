

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingPage();
});

function initializeBookingPage() {
    setupFormValidation();
    setupFormReset();
    loadSelectedEvent();
    setupPhoneFormatting();
    setupMobileMenu();
    loadBookedEvents();
}

function setupFormValidation() {
    const bookingForm = document.getElementById('bookingForm');
    const messageDiv = document.getElementById('bookingMessage');
    
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateBookingForm()) {
            processBooking();
        }
    });
    
    // Real-time validation
    const inputs = bookingForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return false;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number (123-456-7890)';
            isValid = false;
        }
    }
    
    // Number validation
    if (field.type === 'number') {
        const min = parseInt(field.getAttribute('min'));
        const max = parseInt(field.getAttribute('max'));
        const numValue = parseInt(value);
        
        if (isNaN(numValue) || numValue < min || numValue > max) {
            errorMessage = `Please enter a number between ${min} and ${max}`;
            isValid = false;
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid;
}

function setupPriceCalculation() {
    const eventSelect = document.getElementById('eventSelect');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const ticketType = document.getElementById('ticketType');
    
    if (eventSelect) eventSelect.addEventListener('change', updateBookingSummary);
    if (ticketQuantity) ticketQuantity.addEventListener('input', updateBookingSummary);
    if (ticketType) ticketType.addEventListener('change', updateBookingSummary);
    
    // Initial calculation
    updateBookingSummary();
}

function updateBookingSummary() {
    const eventSelect = document.getElementById('eventSelect');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const ticketType = document.getElementById('ticketType');
    
    const summaryEvent = document.getElementById('summaryEvent');
    const summaryTickets = document.getElementById('summaryTickets');
    const summaryType = document.getElementById('summaryType');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (!eventSelect || !ticketQuantity || !ticketType) return;
    
    // Get base price from selected event
    let basePrice = 0;
    let eventName = 'Not selected';
    
    if (eventSelect.value) {
        const option = eventSelect.options[eventSelect.selectedIndex];
        const text = option.text;
        const priceMatch = text.match(/\$(\d+)/);
        if (priceMatch) {
            basePrice = parseInt(priceMatch[1]);
        }
        eventName = text.replace(/ - \$\d+/, '');
    }
    
    // Calculate ticket type modifier
    let typeModifier = 0;
    let typeName = 'General Admission';
    
    switch(ticketType.value) {
        case 'vip':
            typeModifier = 20;
            typeName = 'VIP';
            break;
        case 'student':
            typeModifier = -10;
            typeName = 'Student';
            break;
    }
    
    // Calculate total
    const quantity = parseInt(ticketQuantity.value) || 1;
    const ticketPrice = basePrice + typeModifier;
    const total = Math.max(0, ticketPrice * quantity);
    
    // Update summary
    if (summaryEvent) summaryEvent.textContent = eventName;
    if (summaryTickets) summaryTickets.textContent = quantity;
    if (summaryType) summaryType.textContent = typeName;
    if (summaryTotal) summaryTotal.textContent = total;
}

function setupFormReset() {
    const resetBtn = document.getElementById('resetForm');
    const bookingForm = document.getElementById('bookingForm');
    
    if (resetBtn && bookingForm) {
        resetBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear the form?')) {
                bookingForm.reset();
                updateBookingSummary();
                clearValidationErrors();
                hideMessage();
            }
        });
    }
}

function clearValidationErrors() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    const errorFields = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

function processBooking() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    
    // Calculate total
    const eventSelect = document.getElementById('eventSelect');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const ticketType = document.getElementById('ticketType');
    
    let totalPrice = 0;
    if (eventSelect.value && ticketQuantity.value) {
        const selectedOption = eventSelect.options[eventSelect.selectedIndex];
        const priceText = selectedOption.text;
        const price = parseFloat(priceText.match(/\$(\d+)/)[1]);
        const quantity = parseInt(ticketQuantity.value);
        
        // Apply ticket type multiplier
        let multiplier = 1;
        if (ticketType.value === 'vip') {
            multiplier = 2;
        } else if (ticketType.value === 'student') {
            multiplier = 0.5;
        }
        
        totalPrice = price * quantity * multiplier;
    }
    
    // Collect form data
    const formData = {
        event: document.getElementById('eventSelect').value,
        eventName: document.getElementById('eventSelect').options[document.getElementById('eventSelect').selectedIndex].text,
        quantity: document.getElementById('ticketQuantity').value,
        ticketType: document.getElementById('ticketType').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        specialRequests: document.getElementById('specialRequests').value,
        newsletter: document.getElementById('newsletter').checked,
        total: totalPrice.toFixed(2),
        bookingDate: new Date().toISOString(),
        bookingId: generateBookingId()
    };
    
    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('eventBookings') || '[]');
    bookings.push(formData);
    localStorage.setItem('eventBookings', JSON.stringify(bookings));
    
    // Show success message
    showBookingSuccess(formData);
    
    // Update booked events list
    loadBookedEvents();
    
    // Reset form
    bookingForm.reset();
    clearValidationErrors();
    
    // Scroll to top to see the success message and booked events
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateBookingId() {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function showBookingSuccess(bookingData) {
    const messageDiv = document.getElementById('bookingMessage');
    if (!messageDiv) return;
    
    messageDiv.innerHTML = `
        <div style="background: #10b981; color: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <h3 style="margin-bottom: 0.5rem;">🎉 Booking Confirmed!</h3>
            <p>Your booking has been successfully processed.</p>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2);">
                <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
                <p><strong>Event:</strong> ${bookingData.eventName}</p>
                <p><strong>Tickets:</strong> ${bookingData.quantity} x ${bookingData.ticketType}</p>
                <p><strong>Total:</strong> $${bookingData.total}</p>
                <p><strong>Email:</strong> ${bookingData.email}</p>
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem;">A confirmation email has been sent to your registered email address.</p>
        </div>
    `;
    
    messageDiv.style.display = 'block';
    
    // Auto hide after 10 seconds
    setTimeout(() => {
        hideMessage();
    }, 10000);
}

function hideMessage() {
    const messageDiv = document.getElementById('bookingMessage');
    if (messageDiv) {
        messageDiv.style.display = 'none';
        messageDiv.innerHTML = '';
    }
}

function loadSelectedEvent() {
    // Check if an event was selected from the events page
    const selectedEvent = localStorage.getItem('selectedEvent');
    if (selectedEvent) {
        try {
            const event = JSON.parse(selectedEvent);
            const eventSelect = document.getElementById('eventSelect');
            
            if (eventSelect && eventSelect) {
                // Find and select the matching event
                for (let i = 0; i < eventSelect.options.length; i++) {
                    const option = eventSelect.options[i];
                    if (option.value === event.id.toString() || 
                        option.text.toLowerCase().includes(event.title.toLowerCase())) {
                        eventSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Clear the selected event from localStorage
            localStorage.removeItem('selectedEvent');
        } catch (e) {
            console.error('Error loading selected event:', e);
        }
    }
}

function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            EventHub.formatPhoneNumber(this);
        });
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

function loadBookedEvents() {
    const bookedEventsList = document.getElementById('bookedEventsList');
    if (!bookedEventsList) return;
    
    const bookings = JSON.parse(localStorage.getItem('eventBookings') || '[]');
    
    if (bookings.length === 0) {
        bookedEventsList.innerHTML = '<p class="no-bookings">No bookings yet. Complete a booking to see it here!</p>';
        return;
    }
    
    // Show only the last 3 bookings
    const recentBookings = bookings.slice(-3).reverse();
    
    const html = recentBookings.map((booking, index) => {
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
        const originalIndex = bookings.length - 1 - index; // Get the original index for cancellation
        
        return `
            <div class="booked-event-item">
                <h4>${booking.eventName}</h4>
                <p><strong>ID:</strong> ${booking.bookingId}</p>
                <p><strong>Date:</strong> ${bookingDate}</p>
                <p><strong>Tickets:</strong> ${booking.quantity} x ${booking.ticketType}</p>
                <p><strong>Total:</strong> $${booking.total}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <button class="cancel-booking-btn" onclick="cancelBooking(${originalIndex})" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    Cancel Booking
                </button>
            </div>
        `;
    }).join('');
    
    bookedEventsList.innerHTML = html;
}

function cancelBooking(index) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const bookings = JSON.parse(localStorage.getItem('eventBookings') || '[]');
        bookings.splice(index, 1); // Remove the booking at the specified index
        localStorage.setItem('eventBookings', JSON.stringify(bookings));
        
        // Show cancellation message
        const messageDiv = document.getElementById('bookingMessage');
        if (messageDiv) {
            messageDiv.innerHTML = `
                <div style="background: #ef4444; color: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">🗑️ Booking Cancelled</h3>
                    <p>Your booking has been successfully cancelled.</p>
                </div>
            `;
            messageDiv.style.display = 'block';
            
            // Hide message after 3 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
        
        // Reload the booked events list
        loadBookedEvents();
    }
}

// Add error field styling
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .error:focus {
        outline: none;
        border-color: #ef4444 !important;
    }
    
    .booking-summary {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        border: 1px solid #e2e8f0;
    }
    
    .booking-summary h3 {
        margin-bottom: 1rem;
        color: #333;
        font-size: 1.2rem;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        padding: 0.25rem 0;
    }
    
    .summary-item.total {
        font-weight: 700;
        font-size: 1.2rem;
        color: #6366f1;
        border-top: 2px solid #ddd;
        padding-top: 0.5rem;
        margin-top: 1rem;
    }
    
    .booked-event-item {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;
        display: block !important;
        visibility: visible !important;
    }
    
    .booked-event-item h4 {
        margin-bottom: 0.5rem;
        color: #333;
        font-size: 1rem;
    }
    
    .booked-event-item p {
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
        color: #666;
    }
    
    .no-bookings {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 1rem;
        display: block !important;
        visibility: visible !important;
    }
    
    .cancel-booking-btn {
        background: #ef4444 !important;
        color: white !important;
        border: none !important;
        padding: 8px 16px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        margin-top: 10px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        transition: background-color 0.3s ease !important;
    }
    
    .cancel-booking-btn:hover {
        background: #dc2626 !important;
    }
`;
document.head.appendChild(style);
