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
    const weeklyCheckoutBtn = document.getElementById('weekly-checkout-btn');
    const monthlyCheckoutBtn = document.getElementById('monthly-checkout-btn');
    const weeklyCheckout = document.getElementById('checkout-weekly');
    const monthlyCheckout = document.getElementById('checkout-monthly');
    
    if (weeklyCheckoutBtn) {
        weeklyCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            weeklyCheckout.style.display = 'block';
            monthlyCheckout.style.display = 'none';
            
            // Smooth scroll to checkout section
            weeklyCheckout.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (monthlyCheckoutBtn) {
        monthlyCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            monthlyCheckout.style.display = 'block';
            weeklyCheckout.style.display = 'none';
            
            // Smooth scroll to checkout section
            monthlyCheckout.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Back to plans links
    const backLinks = document.querySelectorAll('.back-link');
    
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            weeklyCheckout.style.display = 'none';
            monthlyCheckout.style.display = 'none';
            
            // Smooth scroll to pricing section
            document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Solana Pay functionality
    const RECIPIENT_ADDRESS = 'GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p';
    
    const PRICES = {
        weekly: 1,  // 1 SOL
        monthly: 10 // 10 SOL
    };
    
    function generateSolanaPayUrl(amount, recipient) {
        // Create a Solana Pay URL
        return `solana:${recipient}?amount=${amount}&label=PrimeAlpha%20Subscription&message=Thank%20you%20for%20subscribing%20to%20PrimeAlpha!`;
    }
    
    // Set up payment links
    const weeklyPayLink = document.getElementById('weekly-pay-link');
    const monthlyPayLink = document.getElementById('monthly-pay-link');
    
    if (weeklyPayLink) {
        const weeklyPayUrl = generateSolanaPayUrl(PRICES.weekly, RECIPIENT_ADDRESS);
        weeklyPayLink.setAttribute('href', weeklyPayUrl);
    }
    
    if (monthlyPayLink) {
        const monthlyPayUrl = generateSolanaPayUrl(PRICES.monthly, RECIPIENT_ADDRESS);
        monthlyPayLink.setAttribute('href', monthlyPayUrl);
    }

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
