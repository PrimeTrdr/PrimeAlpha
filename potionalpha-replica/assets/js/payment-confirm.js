/**
 * Payment Confirmation System
 * Allows users to submit their payment transaction IDs and notifies administrators
 */

class PaymentConfirmation {
    constructor() {
        this.confirmations = this.loadConfirmations();
        this.modalCreated = false;
        this.initializeEventListeners();
    }

    /**
     * Initialize event listeners for payment confirmation links
     */
    initializeEventListeners() {
        // Add event listeners after DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Create confirmation links in checkout sections
            this.addConfirmationLinks();
            
            // Listen for successful payments to show confirmation form
            document.addEventListener('paymentSuccessful', (event) => {
                const { transactionId, amount } = event.detail;
                this.showConfirmationForm(transactionId);
            });
        });
    }

    /**
     * Add confirmation links to checkout sections and footer
     */
    addConfirmationLinks() {
        // Add to weekly checkout
        const weeklyCheckout = document.querySelector('#checkout-weekly .checkout-footer');
        if (weeklyCheckout) {
            const weeklyLink = document.createElement('a');
            weeklyLink.href = '#';
            weeklyLink.className = 'payment-confirm-link';
            weeklyLink.textContent = 'Already paid? Submit your transaction ID here';
            weeklyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showConfirmationForm();
            });
            weeklyCheckout.appendChild(weeklyLink);
        }

        // Add to lifetime checkout
        const lifetimeCheckout = document.querySelector('#checkout-lifetime .checkout-footer');
        if (lifetimeCheckout) {
            const lifetimeLink = document.createElement('a');
            lifetimeLink.href = '#';
            lifetimeLink.className = 'payment-confirm-link';
            lifetimeLink.textContent = 'Already paid? Submit your transaction ID here';
            lifetimeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showConfirmationForm();
            });
            lifetimeCheckout.appendChild(lifetimeLink);
        }

        // Add to footer
        const footer = document.querySelector('footer');
        if (footer) {
            const footerLinks = footer.querySelector('.footer-links') || footer;
            const footerLink = document.createElement('a');
            footerLink.href = '#';
            footerLink.className = 'footer-link';
            footerLink.textContent = 'Confirm Your Payment';
            footerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showConfirmationForm();
            });
            footerLinks.appendChild(footerLink);
        }
    }

    /**
     * Create the confirmation form modal
     */
    createConfirmationModal() {
        if (this.modalCreated) return;

        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'payment-confirm-modal';
        modal.className = 'payment-confirm-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.zIndex = '9999';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.overflowY = 'auto';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'payment-confirm-content';
        modalContent.style.backgroundColor = 'rgba(19, 14, 28, 0.95)';
        modalContent.style.borderRadius = '16px';
        modalContent.style.width = '400px';
        modalContent.style.maxWidth = '90%';
        modalContent.style.maxHeight = '90vh';
        modalContent.style.margin = '20px auto';
        modalContent.style.overflowY = 'auto';
        modalContent.style.border = '1px solid rgba(207, 126, 237, 0.3)';

        // Add header
        const header = document.createElement('div');
        header.className = 'payment-confirm-header';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.padding = '15px';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';

        const title = document.createElement('h3');
        title.textContent = 'Confirm Your Payment';
        title.style.margin = '0';
        title.style.color = 'white';
        title.style.fontSize = '20px';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'payment-confirm-close';
        closeBtn.textContent = '×';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => {
            document.getElementById('payment-confirm-modal').style.display = 'none';
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Add QR code section
        const qrSection = document.createElement('div');
        qrSection.className = 'payment-qr-section';
        qrSection.style.padding = '15px';
        qrSection.style.textAlign = 'center';
        qrSection.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        qrSection.style.display = 'block';
        qrSection.style.visibility = 'visible';
        
        const qrTitle = document.createElement('h4');
        qrTitle.textContent = 'Scan QR Code to Pay';
        qrTitle.className = 'qr-title';
        qrTitle.style.margin = '0 0 10px 0';
        qrTitle.style.color = 'white';
        qrTitle.style.fontSize = '16px';
        
        const qrContainer = document.createElement('div');
        qrContainer.id = 'payment-qr-container';
        qrContainer.className = 'payment-qr-container';
        qrContainer.style.display = 'flex';
        qrContainer.style.justifyContent = 'center';
        qrContainer.style.marginBottom = '10px';
        qrContainer.style.visibility = 'visible';
        
        // Create QR code element
        const qrCode = document.createElement('div');
        qrCode.id = 'lifetime-qr-code';
        qrCode.className = 'payment-qr-code';
        qrCode.style.backgroundColor = 'white';
        qrCode.style.padding = '10px';
        qrCode.style.borderRadius = '8px';
        qrCode.style.display = 'inline-block';
        qrCode.style.visibility = 'visible';
        
        // Add wallet address text
        const walletAddress = document.createElement('div');
        walletAddress.className = 'wallet-address';
        walletAddress.style.marginTop = '8px';
        walletAddress.style.fontSize = '13px';
        walletAddress.style.color = 'rgba(255, 255, 255, 0.9)';
        
        // Create wallet address container with copy button
        const walletAddressContainer = document.createElement('div');
        walletAddressContainer.style.display = 'flex';
        walletAddressContainer.style.flexDirection = 'column';
        walletAddressContainer.style.alignItems = 'center';
        
        const walletLabel = document.createElement('p');
        walletLabel.style.margin = '0 0 4px 0';
        walletLabel.textContent = 'Wallet Address:';
        
        const walletCodeContainer = document.createElement('div');
        walletCodeContainer.style.display = 'flex';
        walletCodeContainer.style.alignItems = 'center';
        walletCodeContainer.style.width = '100%';
        walletCodeContainer.style.maxWidth = '300px';
        walletCodeContainer.style.position = 'relative';
        
        const walletText = 'GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p';
        
        const walletCode = document.createElement('code');
        walletCode.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        walletCode.style.padding = '4px 8px';
        walletCode.style.borderRadius = '4px';
        walletCode.style.fontFamily = 'monospace';
        walletCode.style.fontSize = '11px';
        walletCode.style.wordBreak = 'break-all';
        walletCode.style.display = 'inline-block';
        walletCode.style.width = 'calc(100% - 50px)';
        walletCode.style.maxWidth = '250px';
        walletCode.style.overflowX = 'auto';
        walletCode.textContent = walletText;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-wallet-button';
        copyButton.style.marginLeft = '8px';
        copyButton.style.background = 'linear-gradient(90deg, #9c44ff 0%, #6a11cb 100%)';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.padding = '4px 8px';
        copyButton.style.fontSize = '11px';
        copyButton.style.color = 'white';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontWeight = 'bold';
        copyButton.style.minWidth = '50px';
        copyButton.style.textAlign = 'center';
        copyButton.textContent = 'Copy';
        
        // Direct copy function without using class methods
        copyButton.addEventListener('click', function() {
            // Create a temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = walletText;
            document.body.appendChild(tempInput);
            
            // Select the text
            tempInput.select();
            tempInput.setSelectionRange(0, 99999); // For mobile devices
            
            // Execute copy command
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    copyButton.textContent = 'Copied!';
                    setTimeout(function() {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                } else {
                    copyButton.textContent = 'Failed!';
                    setTimeout(function() {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                }
            } catch (err) {
                console.error('Error copying text: ', err);
                copyButton.textContent = 'Failed!';
                setTimeout(function() {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }
            
            // Remove the temporary element
            document.body.removeChild(tempInput);
        });
        
        walletCodeContainer.appendChild(walletCode);
        walletCodeContainer.appendChild(copyButton);
        
        walletAddressContainer.appendChild(walletLabel);
        walletAddressContainer.appendChild(walletCodeContainer);
        
        walletAddress.appendChild(walletAddressContainer);
        
        qrContainer.appendChild(qrCode);
        qrSection.appendChild(qrTitle);
        qrSection.appendChild(qrContainer);
        qrSection.appendChild(walletAddress);

        // Create form
        const form = document.createElement('form');
        form.className = 'payment-confirm-form';
        form.id = 'payment-confirm-form';
        form.onsubmit = (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        };

        // Name field
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';

        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'confirm-name';
        nameLabel.textContent = 'Your Name';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'confirm-name';
        nameInput.name = 'name';
        nameInput.placeholder = 'Enter your full name';
        nameInput.required = true;

        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);

        // Email field
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';

        const emailLabel = document.createElement('label');
        emailLabel.htmlFor = 'confirm-email';
        emailLabel.textContent = 'Email Address';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'confirm-email';
        emailInput.name = 'email';
        emailInput.placeholder = 'Enter your email address';
        emailInput.required = true;

        emailGroup.appendChild(emailLabel);
        emailGroup.appendChild(emailInput);

        // Plan field
        const planGroup = document.createElement('div');
        planGroup.className = 'form-group';

        const planLabel = document.createElement('label');
        planLabel.htmlFor = 'confirm-plan';
        planLabel.textContent = 'Subscription Plan';

        const planSelect = document.createElement('select');
        planSelect.id = 'confirm-plan';
        planSelect.name = 'plan';
        planSelect.required = true;

        const lifetimeOption = document.createElement('option');
        lifetimeOption.value = 'lifetime';
        lifetimeOption.textContent = 'Lifetime ($1500.00)';

        planSelect.appendChild(lifetimeOption);

        planGroup.appendChild(planLabel);
        planGroup.appendChild(planSelect);

        // Transaction ID field
        const txGroup = document.createElement('div');
        txGroup.className = 'form-group';

        const txLabel = document.createElement('label');
        txLabel.htmlFor = 'confirm-transaction-id';
        txLabel.textContent = 'Transaction ID';

        const txInput = document.createElement('input');
        txInput.type = 'text';
        txInput.id = 'confirm-transaction-id';
        txInput.name = 'transactionId';
        txInput.placeholder = 'Enter your Solana transaction ID';
        txInput.required = true;

        const txHelp = document.createElement('span');
        txHelp.className = 'help-text';
        txHelp.textContent = 'The transaction ID (signature) from your Solana payment';

        txGroup.appendChild(txLabel);
        txGroup.appendChild(txInput);
        txGroup.appendChild(txHelp);

        // Notes field
        const notesGroup = document.createElement('div');
        notesGroup.className = 'form-group';

        const notesLabel = document.createElement('label');
        notesLabel.htmlFor = 'confirm-notes';
        notesLabel.textContent = 'Additional Notes';

        const notesTextarea = document.createElement('textarea');
        notesTextarea.id = 'confirm-notes';
        notesTextarea.name = 'notes';
        notesTextarea.placeholder = 'Any additional information (optional)';

        notesGroup.appendChild(notesLabel);
        notesGroup.appendChild(notesTextarea);

        // Submit button
        const submitGroup = document.createElement('div');
        submitGroup.className = 'form-submit';

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn-submit';
        submitButton.textContent = 'Submit Payment Confirmation';

        submitGroup.appendChild(submitButton);

        // Result message container
        const resultDiv = document.createElement('div');
        resultDiv.className = 'form-result';
        resultDiv.id = 'form-result';

        // Add all elements to form
        form.appendChild(nameGroup);
        form.appendChild(emailGroup);
        form.appendChild(planGroup);
        form.appendChild(txGroup);
        form.appendChild(notesGroup);
        form.appendChild(submitGroup);
        form.appendChild(resultDiv);

        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(qrSection);
        modalContent.appendChild(form);
        modal.appendChild(modalContent);

        // Add modal to document
        document.body.appendChild(modal);

        // Generate QR code if library is available
        if (typeof qrcode === 'function') {
            const lifetimeQRCode = qrcode(0, 'L');
            lifetimeQRCode.addData('solana:GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p?amount=1500&label=PrimeAlpha%20Lifetime&message=PrimeAlpha%20Lifetime%20Subscription');
            lifetimeQRCode.make();
            document.getElementById('lifetime-qr-code').innerHTML = lifetimeQRCode.createImgTag(5);
        }

        this.modalCreated = true;
    }

    /**
     * Show the confirmation form modal
     */
    showConfirmationForm(transactionId = '') {
        // Create modal if it doesn't exist
        if (!this.modalCreated) {
            this.createConfirmationModal();
        }

        // Show modal
        const modal = document.getElementById('payment-confirm-modal');
        if (modal) {
            modal.style.display = 'flex';
        }

        // Pre-fill transaction ID if provided
        if (transactionId) {
            const txInput = document.getElementById('confirm-transaction-id');
            if (txInput) {
                txInput.value = transactionId;
            }
        }
    }

    /**
     * Handle form submission
     */
    handleFormSubmission() {
        const form = document.getElementById('payment-confirm-form');
        const resultDiv = document.getElementById('form-result');
        
        if (!form || !resultDiv) return;
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            id: `conf_${Date.now()}`,
            name: formData.get('name'),
            email: formData.get('email'),
            plan: formData.get('plan'),
            transactionId: formData.get('transactionId'),
            notes: formData.get('notes'),
            status: 'pending',
            date: new Date().toISOString()
        };
        
        // Add to confirmations
        this.confirmations.push(data);
        this.saveConfirmations();
        
        // Show success message
        resultDiv.innerHTML = `
            <div class="success-message">
                <h4>Payment Confirmation Submitted!</h4>
                <p>Thank you for your submission. Your payment is being verified.</p>
                <p>Confirmation ID: <strong>${data.id}</strong></p>
                <p>Please save this ID for your records.</p>
            </div>
        `;
        
        // Reset form
        form.reset();
        
        // Hide form after 5 seconds
        setTimeout(() => {
            const modal = document.getElementById('payment-confirm-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }, 5000);
    }

    /**
     * Load confirmations from localStorage
     */
    loadConfirmations() {
        try {
            const stored = localStorage.getItem('paymentConfirmations');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading confirmations:', error);
            return [];
        }
    }

    /**
     * Save confirmations to localStorage
     */
    saveConfirmations() {
        try {
            localStorage.setItem('paymentConfirmations', JSON.stringify(this.confirmations));
        } catch (error) {
            console.error('Error saving confirmations:', error);
        }
    }
}

// Initialize payment confirmation system
document.addEventListener('DOMContentLoaded', () => {
    // Create QR codes for checkout sections
    if (typeof qrcode === 'function') {
        const weeklyQRCode = qrcode(0, 'L');
        weeklyQRCode.addData('solana:GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p?amount=250&label=PrimeAlpha%20Weekly&message=PrimeAlpha%20Weekly%20Subscription');
        weeklyQRCode.make();
        
        const lifetimeQRCode = qrcode(0, 'L');
        lifetimeQRCode.addData('solana:GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p?amount=1500&label=PrimeAlpha%20Lifetime&message=PrimeAlpha%20Lifetime%20Subscription');
        lifetimeQRCode.make();
        
        // Add QR codes to checkout sections
        const weeklyQRContainer = document.getElementById('weekly-qr-code');
        const lifetimeQRContainer = document.getElementById('lifetime-qr-code');
        
        if (weeklyQRContainer) {
            weeklyQRContainer.innerHTML = weeklyQRCode.createImgTag(5);
        }
        
        if (lifetimeQRContainer) {
            lifetimeQRContainer.innerHTML = lifetimeQRCode.createImgTag(5);
        }
    }
    
    // Initialize payment confirmation system
    window.paymentConfirmation = new PaymentConfirmation();
});
