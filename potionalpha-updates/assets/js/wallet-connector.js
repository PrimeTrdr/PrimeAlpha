/**
 * Wallet Connector for Solana Payments
 * Allows users to connect with different Solana wallets like Phantom, Solflare, etc.
 */

class WalletConnector {
    constructor() {
        this.wallets = [
            {
                name: 'Phantom',
                icon: 'assets/images/wallets/phantom.png',
                checkInstalled: () => window.phantom?.solana,
                connect: this.connectPhantom.bind(this),
                deepLink: 'https://phantom.app/ul/browse/'
            },
            {
                name: 'Solflare',
                icon: 'assets/images/wallets/solflare.png',
                checkInstalled: () => window.solflare?.isSolflare,
                connect: this.connectSolflare.bind(this),
                deepLink: 'https://solflare.com/ul/'
            },
            {
                name: 'Backpack',
                icon: 'assets/images/wallets/backpack.png',
                checkInstalled: () => window.backpack?.isBackpack,
                connect: this.connectBackpack.bind(this),
                deepLink: 'https://www.backpack.app/'
            },
            {
                name: 'Glow',
                icon: 'assets/images/wallets/glow.png',
                checkInstalled: () => window.glow?.isGlow,
                connect: this.connectGlow.bind(this),
                deepLink: 'https://glow.app/'
            }
        ];
        
        this.currentWallet = null;
        this.publicKey = null;
        this.onConnectCallback = null;
    }

    /**
     * Shows the wallet selection modal
     * @param {Function} onConnect - Callback function to execute after successful connection
     */
    showWalletModal(onConnect) {
        this.onConnectCallback = onConnect;
        
        // Create modal if it doesn't exist
        if (!document.getElementById('wallet-modal')) {
            this.createWalletModal();
        }
        
        // Show modal
        document.getElementById('wallet-modal').style.display = 'flex';
    }

    /**
     * Creates the wallet selection modal
     */
    createWalletModal() {
        const modal = document.createElement('div');
        modal.id = 'wallet-modal';
        modal.className = 'wallet-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'wallet-modal-content';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'wallet-modal-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Connect Wallet';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'wallet-modal-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = () => {
            document.getElementById('wallet-modal').style.display = 'none';
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Add wallet list
        const walletList = document.createElement('div');
        walletList.className = 'wallet-list';
        
        this.wallets.forEach(wallet => {
            const walletItem = document.createElement('div');
            walletItem.className = 'wallet-item';
            walletItem.onclick = () => this.handleWalletSelection(wallet);
            
            // Contenedor para el logo y nombre de la wallet
            const walletLogoName = document.createElement('div');
            walletLogoName.className = 'wallet-logo-name';
            
            const walletIcon = document.createElement('img');
            walletIcon.src = wallet.icon;
            walletIcon.alt = `${wallet.name} icon`;
            walletIcon.className = 'wallet-icon';
            
            const walletName = document.createElement('span');
            walletName.textContent = wallet.name;
            walletName.className = 'wallet-name';
            
            walletLogoName.appendChild(walletIcon);
            walletLogoName.appendChild(walletName);
            walletItem.appendChild(walletLogoName);
            
            // Indicador de instalación
            const walletStatus = document.createElement('div');
            walletStatus.className = 'wallet-install-status';
            const isInstalled = wallet.checkInstalled();
            if (isInstalled) {
                walletStatus.innerHTML = '<span class="wallet-installed">Installed</span>';
            }
            
            walletItem.appendChild(walletStatus);
            walletList.appendChild(walletItem);
        });
        
        modalContent.appendChild(header);
        modalContent.appendChild(walletList);
        modal.appendChild(modalContent);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .wallet-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }
            
            .wallet-modal-content {
                background-color: rgba(19, 14, 28, 0.95);
                border-radius: 24px;
                width: 450px;
                max-width: 90%;
                border: 1px solid rgba(207, 126, 237, 0.3);
                box-shadow: 0 8px 25px rgba(207, 126, 237, 0.3);
                overflow: hidden;
            }
            
            .wallet-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .wallet-modal-header h3 {
                margin: 0;
                color: white;
                font-size: 22px;
            }
            
            .wallet-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .wallet-list {
                padding: 20px;
            }
            
            .wallet-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                background-color: rgba(255, 255, 255, 0.05);
                border: 1px solid transparent;
            }
            
            .wallet-item:hover {
                background-color: rgba(207, 126, 237, 0.1);
                transform: translateY(-2px);
                border: 1px solid rgba(207, 126, 237, 0.3);
                box-shadow: 0 4px 12px rgba(207, 126, 237, 0.2);
            }
            
            .wallet-logo-name {
                display: flex;
                align-items: center;
            }
            
            .wallet-icon {
                width: 40px;
                height: 40px;
                margin-right: 16px;
                border-radius: 50%;
                object-fit: contain;
                background-color: rgba(255, 255, 255, 0.1);
                padding: 5px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            .wallet-name {
                font-size: 18px;
                font-weight: 500;
                color: white;
            }
            
            .wallet-install-status {
                font-size: 14px;
            }
            
            .wallet-installed {
                color: #4ade80;
                background-color: rgba(74, 222, 128, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
            }
            
            .wallet-status {
                margin-top: 20px;
                text-align: center;
                color: white;
                padding: 10px;
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
            }
            
            .wallet-error {
                color: #f87171;
                background-color: rgba(248, 113, 113, 0.1);
                padding: 10px;
                border-radius: 8px;
                margin-top: 15px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    /**
     * Handles wallet selection
     * @param {Object} wallet - The selected wallet
     */
    async handleWalletSelection(wallet) {
        try {
            // Check if wallet is installed
            const isInstalled = wallet.checkInstalled();
            
            if (!isInstalled) {
                // If on mobile, redirect to wallet app
                if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    window.location.href = wallet.deepLink + window.location.href;
                    return;
                }
                
                // Show installation message
                this.showWalletStatus(`Please install ${wallet.name} to continue`, true);
                return;
            }
            
            // Connect to wallet
            await wallet.connect();
            
            // Hide modal after successful connection
            document.getElementById('wallet-modal').style.display = 'none';
            
            // Execute callback if provided
            if (this.onConnectCallback) {
                this.onConnectCallback(this.currentWallet, this.publicKey);
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            this.showWalletStatus('Connection error: ' + error.message, true);
        }
    }

    /**
     * Shows status message in the wallet modal
     * @param {string} message - The message to display
     * @param {boolean} isError - Whether the message is an error
     */
    showWalletStatus(message, isError = false) {
        const modalContent = document.querySelector('.wallet-modal-content');
        
        // Remove existing status
        const existingStatus = document.querySelector('.wallet-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Create status element
        const status = document.createElement('div');
        status.className = 'wallet-status';
        if (isError) {
            status.classList.add('wallet-error');
        }
        status.textContent = message;
        
        modalContent.appendChild(status);
    }

    /**
     * Connects to Phantom wallet
     */
    async connectPhantom() {
        try {
            const provider = window.phantom?.solana;
            
            if (!provider) {
                throw new Error('Phantom is not installed');
            }
            
            const response = await provider.connect();
            this.publicKey = response.publicKey.toString();
            this.currentWallet = 'phantom';
            
            console.log('Connected to Phantom:', this.publicKey);
            return this.publicKey;
        } catch (error) {
            console.error('Error connecting to Phantom:', error);
            throw error;
        }
    }

    /**
     * Connects to Solflare wallet
     */
    async connectSolflare() {
        try {
            const provider = window.solflare;
            
            if (!provider) {
                throw new Error('Solflare is not installed');
            }
            
            const response = await provider.connect();
            this.publicKey = response.publicKey.toString();
            this.currentWallet = 'solflare';
            
            console.log('Connected to Solflare:', this.publicKey);
            return this.publicKey;
        } catch (error) {
            console.error('Error connecting to Solflare:', error);
            throw error;
        }
    }

    /**
     * Connects to Backpack wallet
     */
    async connectBackpack() {
        try {
            const provider = window.backpack;
            
            if (!provider) {
                throw new Error('Backpack is not installed');
            }
            
            const response = await provider.connect();
            this.publicKey = response.publicKey.toString();
            this.currentWallet = 'backpack';
            
            console.log('Connected to Backpack:', this.publicKey);
            return this.publicKey;
        } catch (error) {
            console.error('Error connecting to Backpack:', error);
            throw error;
        }
    }

    /**
     * Connects to Glow wallet
     */
    async connectGlow() {
        try {
            const provider = window.glow;
            
            if (!provider) {
                throw new Error('Glow is not installed');
            }
            
            const response = await provider.connect();
            this.publicKey = response.publicKey.toString();
            this.currentWallet = 'glow';
            
            console.log('Connected to Glow:', this.publicKey);
            return this.publicKey;
        } catch (error) {
            console.error('Error connecting to Glow:', error);
            throw error;
        }
    }

    /**
     * Generates a Solana Pay URL
     * @param {number} amount - The amount in SOL
     * @param {string} recipient - The recipient address
     * @returns {string} The Solana Pay URL
     */
    generateSolanaPayUrl(amount, recipient) {
        return `solana:${recipient}?amount=${amount}&label=PrimeAlpha%20Subscription&message=Thank%20you%20for%20subscribing%20to%20PrimeAlpha!`;
    }

    /**
     * Sends a transaction using the connected wallet
     * @param {string} recipient - The recipient address
     * @param {number} amount - The amount in SOL
     */
    async sendTransaction(recipient, amount) {
        if (!this.currentWallet || !this.publicKey) {
            throw new Error('No wallet connected');
        }
        
        try {
            let provider;
            
            switch (this.currentWallet) {
                case 'phantom':
                    provider = window.phantom.solana;
                    break;
                case 'solflare':
                    provider = window.solflare;
                    break;
                case 'backpack':
                    provider = window.backpack;
                    break;
                case 'glow':
                    provider = window.glow;
                    break;
                default:
                    throw new Error('Wallet not supported');
            }
            
            // Create transaction (simplified for example)
            // In a real implementation, you would use @solana/web3.js to create a proper transaction
            const transaction = {
                to: recipient,
                amount: amount
            };
            
            // Send transaction
            const signature = await provider.signAndSendTransaction(transaction);
            
            return signature;
        } catch (error) {
            console.error('Error sending transaction:', error);
            throw error;
        }
    }

    /**
     * Disconnects the current wallet
     */
    async disconnect() {
        if (!this.currentWallet) {
            return;
        }
        
        try {
            let provider;
            
            switch (this.currentWallet) {
                case 'phantom':
                    provider = window.phantom.solana;
                    break;
                case 'solflare':
                    provider = window.solflare;
                    break;
                case 'backpack':
                    provider = window.backpack;
                    break;
                case 'glow':
                    provider = window.glow;
                    break;
                default:
                    throw new Error('Wallet not supported');
            }
            
            await provider.disconnect();
            this.currentWallet = null;
            this.publicKey = null;
            
            console.log('Wallet disconnected');
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            throw error;
        }
    }
}

// Create global instance
window.walletConnector = new WalletConnector();
