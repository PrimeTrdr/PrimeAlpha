// Main JavaScript for PrimeAlpha

document.addEventListener('DOMContentLoaded', function() {
    // Toggle FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            item.classList.toggle('active');
            
            // Update toggle icon
            const toggle = question.querySelector('.faq-toggle');
            if (item.classList.contains('active')) {
                toggle.textContent = '-';
            } else {
                toggle.textContent = '+';
            }
        });
    });
    
    // Checkout functionality
    const lifetimeCheckoutBtn = document.getElementById('lifetime-checkout-btn');
    const lifetimeCheckout = document.getElementById('checkout-lifetime');
    
    if (lifetimeCheckoutBtn) {
        lifetimeCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            lifetimeCheckout.style.display = 'block';
            
            // Smooth scroll to checkout section
            lifetimeCheckout.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Back to plans links
    const backLinks = document.querySelectorAll('.back-link');
    
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            lifetimeCheckout.style.display = 'none';
            
            // Smooth scroll to pricing section
            document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Transaction links
    const transactionLinks = document.querySelectorAll('.transaction-link');
    
    transactionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.paymentConfirmation) {
                window.paymentConfirmation.showConfirmationForm();
            }
        });
    });

    // Solana Pay functionality
    const RECIPIENT_ADDRESS = 'GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p';
    
    const PRICES = {
        lifetime: 2500 // $2500.00
    };
    
    function generateSolanaPayUrl(amount, recipient) {
        // Create a Solana Pay URL
        return `solana:${recipient}?amount=${amount}&label=PrimeAlpha%20Subscription&message=Thank%20you%20for%20subscribing%20to%20PrimeAlpha!`;
    }
    
    // Set up payment links
    const lifetimePayLink = document.getElementById('lifetime-pay-link');
    
    if (lifetimePayLink) {
        const lifetimePayUrl = generateSolanaPayUrl(PRICES.lifetime, RECIPIENT_ADDRESS);
        lifetimePayLink.setAttribute('href', lifetimePayUrl);
    }
    
    // Set up confirmation buttons
    const confirmButtons = document.querySelectorAll('.confirm-payment-btn');
    confirmButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (window.paymentConfirmation) {
                window.paymentConfirmation.showConfirmationForm();
            }
        });
    });

    // Button hover and click effects enhancement
    const buttons = document.querySelectorAll('.btn-primary, .nav-button, .promo-button');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple effect if not already in styles.css
    const style = document.createElement('style');
    style.textContent = `
        .btn-primary, .nav-button, .promo-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
