// Main page wallet copy button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Function to copy wallet address to clipboard
    function copyWalletAddress() {
        const walletAddressElement = document.querySelector('.wallet-address');
        if (!walletAddressElement) return;
        
        const walletAddress = walletAddressElement.textContent.trim();
        
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = walletAddress;
        document.body.appendChild(tempInput);
        
        // Select the text
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // For mobile devices
        
        // Execute copy command
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // Show success feedback
                const copyButton = document.querySelector('.copy-wallet-btn');
                if (copyButton) {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    copyButton.classList.add('copied');
                    
                    // Reset button text after 2 seconds
                    setTimeout(function() {
                        copyButton.textContent = originalText;
                        copyButton.classList.remove('copied');
                    }, 2000);
                }
            }
        } catch (err) {
            console.error('Failed to copy wallet address:', err);
        }
        
        // Remove the temporary input
        document.body.removeChild(tempInput);
    }
    
    // Add click event to all wallet copy buttons
    const copyButtons = document.querySelectorAll('.copy-wallet-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            copyWalletAddress();
        });
    });
    
    // Add styles for copy button feedback
    const style = document.createElement('style');
    style.textContent = `
        .copy-wallet-btn.copied {
            background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%) !important;
            color: white !important;
        }
    `;
    document.head.appendChild(style);
});
