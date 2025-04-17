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
        lifetimeOption.textContent = 'Lifetime ($2500.00)';

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

        // Add to document
        document.body.appendChild(modal);
        this.modalCreated = true;
        
        // Generate QR code
        if (typeof qrcode === 'function') {
            const lifetimeQRCode = qrcode(0, 'L');
            lifetimeQRCode.addData('solana:GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p?amount=2500&label=PrimeAlpha%20Lifetime&message=PrimeAlpha%20Lifetime%20Subscription');
            lifetimeQRCode.make();
            document.getElementById('lifetime-qr-code').innerHTML = lifetimeQRCode.createImgTag(5);
        }
    }

    /**
     * Show the confirmation form modal
     * @param {string} transactionId - Optional transaction ID to pre-fill
     */
    showConfirmationForm(transactionId = '') {
        console.log('Showing confirmation form');
        
        // Create modal if it doesn't exist
        if (!this.modalCreated) {
            console.log('Modal not created yet, creating now');
            this.createConfirmationModal();
        }

        // Pre-fill transaction ID if provided
        if (transactionId) {
            const txField = document.getElementById('confirm-transaction-id');
            if (txField) {
                txField.value = transactionId;
            }
        }

        // Show modal
        const modal = document.getElementById('payment-confirm-modal');
        if (modal) {
            console.log('Modal found, displaying');
            modal.style.display = 'flex';
            
            // Ensure QR code is visible
            const qrSection = modal.querySelector('.payment-qr-section');
            if (qrSection) {
                qrSection.style.display = 'block';
                qrSection.style.visibility = 'visible';
                qrSection.style.opacity = '1';
            }
            
            const qrCode = modal.querySelector('.payment-qr-code');
            if (qrCode) {
                qrCode.style.display = 'inline-block';
                qrCode.style.visibility = 'visible';
                qrCode.style.opacity = '1';
                qrCode.style.backgroundColor = 'white';
            }
            
            // Generate QR code if needed
            if (typeof qrcode === 'function') {
                try {
                    const lifetimeQRCode = qrcode(0, 'L');
                    lifetimeQRCode.addData('solana:GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p?amount=2500&label=PrimeAlpha%20Lifetime&message=PrimeAlpha%20Lifetime%20Subscription');
                    lifetimeQRCode.make();
                    const qrCodeElement = document.getElementById('lifetime-qr-code');
                    if (qrCodeElement) {
                        qrCodeElement.innerHTML = lifetimeQRCode.createImgTag(5);
                        const qrImg = qrCodeElement.querySelector('img');
                        if (qrImg) {
                            qrImg.style.display = 'block';
                            qrImg.style.visibility = 'visible';
                            qrImg.style.opacity = '1';
                            qrImg.style.margin = '0 auto';
                        }
                    }
                } catch (e) {
                    console.error('Error generating QR code:', e);
                    // Fallback QR code
                    const qrCodeElement = document.getElementById('lifetime-qr-code');
                    if (qrCodeElement) {
                        qrCodeElement.innerHTML = '<div style="width:150px;height:150px;background-color:white;display:flex;align-items:center;justify-content:center;margin:0 auto;"><p style="color:black;font-size:12px;text-align:center;">QR Code<br>GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p</p></div>';
                    }
                }
            }
        } else {
            console.error('Payment confirmation modal not found in DOM');
            // Try to recreate the modal if it doesn't exist
            this.modalCreated = false;
            this.createConfirmationModal();
            const recreatedModal = document.getElementById('payment-confirm-modal');
            if (recreatedModal) {
                recreatedModal.style.display = 'flex';
                // Try to generate QR code again
                if (typeof qrcode === 'function') {
                    try {
                        const lifetimeQRCode = qrcode(0, 'L');
                        lifetimeQRCode.addData('solana:GTt4f9gGukB1i7YQMoYJnDdptoEpdTPcMZztBuF3SZ8p?amount=2500&label=PrimeAlpha%20Lifetime&message=PrimeAlpha%20Lifetime%20Subscription');
                        lifetimeQRCode.make();
                        const qrCodeElement = document.getElementById('lifetime-qr-code');
                        if (qrCodeElement) {
                            qrCodeElement.innerHTML = lifetimeQRCode.createImgTag(5);
                            const qrImg = qrCodeElement.querySelector('img');
                            if (qrImg) {
                                qrImg.style.display = 'block';
                                qrImg.style.visibility = 'visible';
                                qrImg.style.opacity = '1';
                                qrImg.style.margin = '0 auto';
                            }
                        }
                    } catch (e) {
                        console.error('Error generating QR code:', e);
                    }
                }
            } else {
                console.error('Failed to create modal');
            }
        }
    }

    /**
     * Fallback method to copy text to clipboard for browsers that don't support clipboard API
     * @param {string} text - Text to copy
     * @param {HTMLElement} button - Button element to update text
     */
    fallbackCopyTextToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Make the textarea out of viewport
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            } else {
                button.textContent = 'Failed!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            button.textContent = 'Failed!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        }
        
        document.body.removeChild(textArea);
    }
    /**
     * Handle form submission
     */
    handleFormSubmission() {
        const formData = {
            name: form.elements['name'].value,
            email: form.elements['email'].value,
            plan: form.elements['plan'].value,
            transactionId: form.elements['transactionId'].value,
            notes: form.elements['notes'].value,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            verifiedAt: null,
            adminNotes: null
        };

        try {
            // Add unique ID
            formData.id = 'conf_' + Date.now();
            
            // Save confirmation
            this.saveConfirmation(formData);
            
            // Send notification
            this.sendNotification(formData);
            
            // Show success message
            resultDiv.className = 'form-result success';
            resultDiv.textContent = 'Thank you! Your payment confirmation has been submitted. We\'ll verify your transaction and activate your account shortly.';
            resultDiv.style.display = 'block';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                resultDiv.style.display = 'none';
                document.getElementById('payment-confirm-modal').style.display = 'none';
            }, 3000);
        } catch (error) {
            console.error('Error saving confirmation:', error);
            
            // Show error message
            resultDiv.className = 'form-result error';
            resultDiv.textContent = 'There was an error submitting your confirmation. Please try again or contact support.';
            resultDiv.style.display = 'block';
        }
    }

    /**
     * Save confirmation to local storage
     * @param {Object} confirmation - The confirmation data
     */
    saveConfirmation(confirmation) {
        const confirmations = this.loadConfirmations();
        confirmations.push(confirmation);
        localStorage.setItem('primealpha_payment_confirmations', JSON.stringify(confirmations));
        this.confirmations = confirmations;
    }

    /**
     * Load confirmations from local storage
     * @returns {Array} Array of confirmation objects
     */
    loadConfirmations() {
        const stored = localStorage.getItem('primealpha_payment_confirmations');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Send notification about new confirmation
     * @param {Object} confirmation - The confirmation data
     */
    sendNotification(confirmation) {
        // Create and dispatch custom event for notification
        const event = new CustomEvent('paymentConfirmationReceived', {
            detail: confirmation
        });
        document.dispatchEvent(event);
        
        // Send email notification with EmailJS
        emailjs.init("cwaCe3fD5TQ0rnKU_");
        
        const templateParams = {
            name: confirmation.name,
            email: confirmation.email,
            plan: confirmation.plan,
            transactionId: confirmation.transactionId,
            date: new Date().toLocaleString()
        };
        
        emailjs.send("service_eaiz0hg", "template_hru3oiq", templateParams)
            .then(function(response) {
                console.log('Email sent!', response.status, response.text);
            }, function(error) {
                console.error('Error sending email:', error);
            });
        
        // For demo purposes, show browser notification if supported
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                this.showBrowserNotification(confirmation);
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showBrowserNotification(confirmation);
                    }
                });
            }
        }
    }

    /**
     * Show browser notification
     * @param {Object} confirmation - The confirmation data
     */
    showBrowserNotification(confirmation) {
        const notification = new Notification('New Payment Confirmation', {
            body: `${confirmation.name} has submitted a payment confirmation for the ${confirmation.plan} plan.`,
            icon: '/assets/images/primelogo.svg'
        });
        
        notification.onclick = function() {
            window.focus();
            // In a real implementation, this would open the admin panel
        };
    }

    /**
     * Get count of unverified confirmations
     * @returns {number} Count of unverified confirmations
     */
    getUnverifiedCount() {
        return this.confirmations.filter(c => c.status === 'pending').length;
    }
}

// Initialize payment confirmation system
const paymentConfirmation = new PaymentConfirmation();

// Override default alert after successful payment to show confirmation form
const originalWalletSendTransaction = window.walletConnector?.sendTransaction;
if (originalWalletSendTransaction) {
    window.walletConnector.sendTransaction = async function(recipient, amount) {
        try {
            const signature = await originalWalletSendTransaction.call(this, recipient, amount);
            console.log('Transaction sent:', signature);
            
            // Dispatch custom event instead of showing alert
            const event = new CustomEvent('paymentSuccessful', {
                detail: {
                    transactionId: signature,
                    amount: amount
                }
            });
            document.dispatchEvent(event);
            
            return signature;
        } catch (error) {
            console.error('Error sending transaction:', error);
            alert('Error sending transaction. Please try again.');
            throw error;
        }
    };
}
