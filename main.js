// The Sarvatra Urja Foundation Website - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Gallery filter functionality
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active filter
            galleryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    
    // Donation amount selection
    const donationAmounts = document.querySelectorAll('.donation-amount');
    const customAmountInput = document.getElementById('custom-amount');
    let selectedAmount = '';
    
    donationAmounts.forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            
            // Update selection state
            donationAmounts.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            
            // Clear custom amount
            customAmountInput.value = '';
            selectedAmount = amount;
        });
    });
    
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            if (this.value) {
                donationAmounts.forEach(btn => btn.classList.remove('selected'));
                selectedAmount = this.value;
            }
        });
    }
    
    // Donation functionality
    const donateIndiaBtn = document.getElementById('donate-india');
    const donateInternationalBtn = document.getElementById('donate-international');
    const contactDonationBtn = document.getElementById('contact-donation');
    
    if (donateIndiaBtn) {
        donateIndiaBtn.addEventListener('click', function() {
            handleIndiaDonation();
        });
    }
    
    if (donateInternationalBtn) {
        donateInternationalBtn.addEventListener('click', function() {
            handleInternationalDonation();
        });
    }
    
    if (contactDonationBtn) {
        contactDonationBtn.addEventListener('click', function() {
            handleContactDonation();
        });
    }
    
    // Contact form functionality
    const partnershipForm = document.getElementById('partnership-form');
    const contactForm = document.getElementById('contact-form');
    
    if (partnershipForm) {
        partnershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePartnershipForm(this);
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm(this);
        });
    }
});

// Donation handlers
function handleIndiaDonation() {
    if (!validateDonationForm()) return;
    
    const donorInfo = getDonorInfo();
    const amount = getSelectedAmount();
    
    // For India donations, we'll provide UPI and bank transfer options
    // In a real implementation, you would integrate with Razorpay or similar
    const upiId = 'tsufindia@paytm'; // Replace with actual UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=The%20Sarvatra%20Urja%20Foundation&am=${amount}&cu=INR&tn=Donation%20for%20${donorInfo.category}`;
    
    showMessage('info', `
        <strong>Indian Donation Options:</strong><br>
        1. <a href="${upiUrl}" class="text-blue-600 underline">Pay via UPI (${amount} INR)</a><br>
        2. Bank Transfer: Contact us at tsufindia@gmail.com for bank details<br>
        3. Or contact us directly for other payment methods
    `);
    
    // Also trigger email contact
    setTimeout(() => {
        handleContactDonation();
    }, 2000);
}

function handleInternationalDonation() {
    if (!validateDonationForm()) return;
    
    const amount = getSelectedAmount();
    const donorInfo = getDonorInfo();
    
    // Convert INR to USD (approximate)
    const usdAmount = (parseFloat(amount) / 80).toFixed(2);
    
    // For international donations, create PayPal link
    // In a real implementation, you would use PayPal's Donate Button or API
    const paypalUrl = `https://www.paypal.com/donate/?business=tsufindia@gmail.com&amount=${usdAmount}&currency_code=USD&item_name=Donation%20to%20The%20Sarvatra%20Urja%20Foundation`;
    
    window.open(paypalUrl, '_blank');
    
    showMessage('success', `Redirecting to PayPal for donation of $${usdAmount} USD (approximately ₹${amount} INR)`);
}

function handleContactDonation() {
    const donorInfo = getDonorInfo();
    const amount = getSelectedAmount();
    
    const subject = 'Donation Inquiry - The Sarvatra Urja Foundation';
    const body = `Hello,

I would like to make a donation to The Sarvatra Urja Foundation.

Donation Details:
- Amount: ${amount ? `₹${amount}` : 'To be discussed'}
- Category: ${donorInfo.category || 'General Fund'}
- Name: ${donorInfo.name}
- Email: ${donorInfo.email}
- Phone: ${donorInfo.phone}

Please provide information about payment options and next steps.

Thank you for your important work!

Best regards,
${donorInfo.name}`;

    const mailtoUrl = `mailto:tsufindia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

// Form handlers
function handlePartnershipForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const subject = 'Partnership Inquiry - The Sarvatra Urja Foundation';
    const body = `Hello,

I am interested in partnering with The Sarvatra Urja Foundation.

Partnership Details:
- Organization/Name: ${data.name}
- Email: ${data.email}
- Partnership Type: ${data['partnership-type']}
- Message: ${data.message}

Looking forward to collaborating with your team.

Best regards,
${data.name}`;

    const mailtoUrl = `mailto:tsufindia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    showMessage('success', 'Opening email client... Please send the pre-filled email to complete your partnership inquiry.');
    form.reset();
}

function handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const subject = data.subject || 'General Inquiry - The Sarvatra Urja Foundation';
    const body = `Hello,

${data.message}

Contact Information:
- Name: ${data.name}
- Email: ${data.email}

Best regards,
${data.name}`;

    const mailtoUrl = `mailto:tsufindia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    showMessage('success', 'Opening email client... Please send the pre-filled email to complete your inquiry.');
    form.reset();
}

// Utility functions
function validateDonationForm() {
    const name = document.getElementById('donor-name')?.value.trim();
    const email = document.getElementById('donor-email')?.value.trim();
    const amount = getSelectedAmount();
    
    if (!name) {
        showMessage('error', 'Please enter your name');
        return false;
    }
    
    if (!email) {
        showMessage('error', 'Please enter your email address');
        return false;
    }
    
    if (!amount) {
        showMessage('error', 'Please select or enter a donation amount');
        return false;
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        showMessage('error', 'Please enter a valid donation amount');
        return false;
    }
    
    return true;
}

function getDonorInfo() {
    return {
        name: document.getElementById('donor-name')?.value.trim() || '',
        email: document.getElementById('donor-email')?.value.trim() || '',
        phone: document.getElementById('donor-phone')?.value.trim() || '',
        category: document.getElementById('donation-category')?.value || 'General Fund'
    };
}

function getSelectedAmount() {
    const customAmount = document.getElementById('custom-amount')?.value.trim();
    if (customAmount) return customAmount;
    
    const selectedButton = document.querySelector('.donation-amount.selected');
    return selectedButton ? selectedButton.getAttribute('data-amount') : '';
}

function showMessage(type, text) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = text;
    
    // Insert before donation form
    const donationSection = document.getElementById('donate');
    if (donationSection) {
        const container = donationSection.querySelector('.container');
        if (container) {
            container.insertBefore(message, container.firstChild);
        }
    }
    
    // Auto-hide after 5 seconds (except for info messages)
    if (type !== 'info') {
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    }
});