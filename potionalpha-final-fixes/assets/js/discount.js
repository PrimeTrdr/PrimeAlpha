// Discount code functionality for PrimeAlpha

document.addEventListener('DOMContentLoaded', function() {
    // Discount code configuration
    const DISCOUNT_CODE = 'PRIMEALPHA20';
    const DISCOUNT_PERCENTAGE = 20; // 20% discount
    
    // Original prices in USD
    const ORIGINAL_PRICES = {
        weekly: 250,   // $250 USD
        monthly: 2500  // $2500 USD
    };
    
    // Function to calculate discounted price
    function calculateDiscountedPrice(originalPrice, discountPercentage) {
        return originalPrice * (1 - (discountPercentage / 100));
    }
    
    // Function to update displayed prices
    function updateDisplayedPrices(applyDiscount = false) {
        const solanaPrice = parseFloat(document.getElementById('solana-price-value').textContent) || 150;
        
        // Get price elements
        const weeklyPriceUSD = document.getElementById('weekly-price-usd');
        const weeklyPriceSOL = document.getElementById('weekly-price-sol');
        const monthlyPriceUSD = document.getElementById('monthly-price-usd');
        const monthlyPriceSOL = document.getElementById('monthly-price-sol');
        
        // Calculate prices
        let weeklyUSD = ORIGINAL_PRICES.weekly;
        let monthlyUSD = ORIGINAL_PRICES.monthly;
        
        // Apply discount if code is valid
        if (applyDiscount) {
            weeklyUSD = calculateDiscountedPrice(weeklyUSD, DISCOUNT_PERCENTAGE);
            monthlyUSD = calculateDiscountedPrice(monthlyUSD, DISCOUNT_PERCENTAGE);
            
            // Show discount applied message
            document.querySelectorAll('.discount-applied').forEach(el => {
                el.style.display = 'block';
            });
        } else {
            // Hide discount applied message
            document.querySelectorAll('.discount-applied').forEach(el => {
                el.style.display = 'none';
            });
        }
        
        // Calculate SOL equivalents
        const weeklySOL = (weeklyUSD / solanaPrice).toFixed(2);
        const monthlySOL = (monthlyUSD / solanaPrice).toFixed(2);
        
        // Update displayed prices
        if (weeklyPriceUSD) weeklyPriceUSD.textContent = '$' + weeklyUSD.toFixed(2);
        if (weeklyPriceSOL) weeklyPriceSOL.textContent = weeklySOL;
        if (monthlyPriceUSD) monthlyPriceUSD.textContent = '$' + monthlyUSD.toFixed(2);
        if (monthlyPriceSOL) monthlyPriceSOL.textContent = monthlySOL;
        
        // Update payment links and QR codes with new amounts
        updatePaymentLinks(weeklySOL, monthlySOL);
    }
    
    // Function to update payment links and QR codes
    function updatePaymentLinks(weeklySOL, monthlySOL) {
        const RECIPIENT_ADDRESS = 'GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p';
        
        // Generate Solana Pay URLs
        function generateSolanaPayUrl(amount, planType) {
            const planName = planType === 'weekly' ? 'Weekly' : 'Monthly';
            return `solana:${RECIPIENT_ADDRESS}?amount=${amount}&label=PrimeAlpha%20${planName}%20Plan&message=Payment%20for%20PrimeAlpha%20${planName}%20Plan`;
        }
        
        // Generate QR codes
        function generateQRCode(elementId, url) {
            const qrContainer = document.getElementById(elementId);
            if (!qrContainer) return;
            
            // Clear previous content
            qrContainer.innerHTML = '';
            
            // Create QR code
            const qr = qrcode(0, 'M');
            qr.addData(url);
            qr.make();
            
            // Create and append QR code element
            const qrImg = document.createElement('div');
            qrImg.innerHTML = qr.createImgTag(4);
            qrContainer.appendChild(qrImg);
        }
        
        // Set up weekly plan checkout
        const weeklyPayUrl = generateSolanaPayUrl(weeklySOL, 'weekly');
        generateQRCode('weekly-qr-code', weeklyPayUrl);
        const weeklyPayLink = document.getElementById('weekly-pay-link');
        if (weeklyPayLink) {
            weeklyPayLink.href = weeklyPayUrl;
        }
        
        // Set up monthly plan checkout
        const monthlyPayUrl = generateSolanaPayUrl(monthlySOL, 'monthly');
        generateQRCode('monthly-qr-code', monthlyPayUrl);
        const monthlyPayLink = document.getElementById('monthly-pay-link');
        if (monthlyPayLink) {
            monthlyPayLink.href = monthlyPayUrl;
        }
    }
    
    // Set up discount code form
    const discountForms = document.querySelectorAll('.discount-form');
    
    discountForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const codeInput = this.querySelector('.discount-code-input');
            const feedbackEl = this.querySelector('.discount-feedback');
            
            if (codeInput.value.trim().toUpperCase() === DISCOUNT_CODE) {
                // Valid code
                if (feedbackEl) {
                    feedbackEl.textContent = '¡Código aplicado! 20% de descuento';
                    feedbackEl.className = 'discount-feedback success';
                }
                
                // Apply discount to prices
                updateDisplayedPrices(true);
                
                // Store discount state in session
                sessionStorage.setItem('discountApplied', 'true');
            } else {
                // Invalid code
                if (feedbackEl) {
                    feedbackEl.textContent = 'Código inválido. Intenta de nuevo.';
                    feedbackEl.className = 'discount-feedback error';
                }
                
                // Reset to original prices
                updateDisplayedPrices(false);
                
                // Clear discount state
                sessionStorage.removeItem('discountApplied');
            }
        });
    });
    
    // Check if discount was previously applied in this session
    if (sessionStorage.getItem('discountApplied') === 'true') {
        // Apply discount automatically
        updateDisplayedPrices(true);
        
        // Update feedback elements
        document.querySelectorAll('.discount-feedback').forEach(el => {
            el.textContent = '¡Código aplicado! 20% de descuento';
            el.className = 'discount-feedback success';
        });
    } else {
        // Initialize with regular prices
        updateDisplayedPrices(false);
    }
});
