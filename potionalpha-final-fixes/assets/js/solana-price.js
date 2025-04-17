// Script for Solana payment functionality

// Fixed prices in USD
const USD_PRICES = {
    weekly: 250,   // $250 USD
    monthly: 2500  // $2500 USD
};

// Function to get current Solana price
async function getSolanaPrice() {
    try {
        // Use Yahoo Finance API to get Solana price
        const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/SOL-USD?interval=1d&range=1d');
        const data = await response.json();
        
        // Extract current Solana price
        const currentPrice = data.chart.result[0].meta.regularMarketPrice;
        
        return currentPrice;
    } catch (error) {
        console.error('Error getting Solana price:', error);
        // Default value in case of error (approximately $150 USD per SOL)
        return 150;
    }
}

// Function to calculate SOL equivalent
function calculateSolAmount(usdAmount, solanaPrice) {
    return (usdAmount / solanaPrice).toFixed(2);
}

// Function to update payment information
async function updateSolanaPrices() {
    try {
        // Get current Solana price
        const solanaPrice = await getSolanaPrice();
        
        // Calculate SOL equivalents
        const weeklySOL = calculateSolAmount(USD_PRICES.weekly, solanaPrice);
        const monthlySOL = calculateSolAmount(USD_PRICES.monthly, solanaPrice);
        
        // Update global PRICES object for payment processing
        window.PRICES = {
            weekly: weeklySOL,
            monthly: monthlySOL
        };
        
        // Update checkout SOL amounts
        const weeklyCheckoutSol = document.getElementById('weekly-checkout-sol');
        const monthlyCheckoutSol = document.getElementById('monthly-checkout-sol');
        
        if (weeklyCheckoutSol) {
            weeklyCheckoutSol.textContent = weeklySOL;
        }
        
        if (monthlyCheckoutSol) {
            monthlyCheckoutSol.textContent = monthlySOL;
        }
        
        // Update QR codes with current SOL amounts
        updateQRCodes(weeklySOL, monthlySOL);
        
        console.log(`Solana price updated: $${solanaPrice} USD`);
        console.log(`Weekly price: ${weeklySOL} SOL ($${USD_PRICES.weekly} USD)`);
        console.log(`Monthly price: ${monthlySOL} SOL ($${USD_PRICES.monthly} USD)`);
        
        return {
            solanaPrice,
            weeklySOL,
            monthlySOL
        };
    } catch (error) {
        console.error('Error updating Solana prices:', error);
    }
}

// Function to generate Solana Pay URL
function generateSolanaPayUrl(amount, recipient, planType) {
    return `solana:${recipient}?amount=${amount}&label=PrimeAlpha%20${planType}%20Plan&message=Payment%20for%20PrimeAlpha%20${planType}%20Plan`;
}

// Function to update QR codes
function updateQRCodes(weeklySOL, monthlySOL) {
    // Check if the RECIPIENT_ADDRESS is defined
    if (typeof RECIPIENT_ADDRESS !== 'undefined') {
        const weeklyPayUrl = generateSolanaPayUrl(weeklySOL, RECIPIENT_ADDRESS, 'Weekly');
        const monthlyPayUrl = generateSolanaPayUrl(monthlySOL, RECIPIENT_ADDRESS, 'Monthly');
        
        // Generate QR codes if the function exists
        if (typeof generateQRCode === 'function') {
            generateQRCode('weekly-qr-code', weeklyPayUrl);
            generateQRCode('monthly-qr-code', monthlyPayUrl);
        }
    }
}

// Update prices when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update prices immediately
    updateSolanaPrices();
    
    // Update prices every 5 minutes
    setInterval(updateSolanaPrices, 5 * 60 * 1000);
});
