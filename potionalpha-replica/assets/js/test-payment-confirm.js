// Test script for payment confirmation system
// This script simulates user payment confirmations and admin verification

// Helper function to generate a random Solana transaction ID
function generateRandomTransactionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 88; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Helper function to generate a random name
function generateRandomName() {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
}

// Helper function to generate a random email
function generateRandomEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const nameParts = name.toLowerCase().split(' ');
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    return `${nameParts.join('.')}@${domain}`;
}

// Helper function to generate a random plan
function generateRandomPlan() {
    const plans = ['weekly', 'monthly'];
    return plans[Math.floor(Math.random() * plans.length)];
}

// Helper function to generate a random note
function generateRandomNote() {
    const notes = [
        'Please activate my account as soon as possible.',
        'I paid using my friend\'s wallet.',
        'I\'m excited to start using PrimeAlpha!',
        'This is my second payment, my previous subscription expired.',
        'I sent the payment from my Phantom wallet.',
        ''
    ];
    
    return notes[Math.floor(Math.random() * notes.length)];
}

// Function to create a test confirmation
function createTestConfirmation() {
    const name = generateRandomName();
    const email = generateRandomEmail(name);
    const plan = generateRandomPlan();
    const transactionId = generateRandomTransactionId();
    const notes = generateRandomNote();
    
    return {
        id: 'conf_' + Date.now() + Math.floor(Math.random() * 1000),
        name,
        email,
        plan,
        transactionId,
        notes,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        verifiedAt: null,
        adminNotes: null
    };
}

// Function to save confirmation to local storage
function saveConfirmation(confirmation) {
    const stored = localStorage.getItem('primealpha_payment_confirmations');
    const confirmations = stored ? JSON.parse(stored) : [];
    confirmations.push(confirmation);
    localStorage.setItem('primealpha_payment_confirmations', JSON.stringify(confirmations));
    console.log('Saved confirmation:', confirmation);
}

// Function to clear all confirmations
function clearConfirmations() {
    localStorage.removeItem('primealpha_payment_confirmations');
    console.log('Cleared all confirmations');
}

// Function to generate multiple test confirmations
function generateTestConfirmations(count) {
    console.log(`Generating ${count} test confirmations...`);
    
    for (let i = 0; i < count; i++) {
        const confirmation = createTestConfirmation();
        saveConfirmation(confirmation);
    }
    
    console.log('Test confirmations generated successfully');
}

// Function to verify a random confirmation
function verifyRandomConfirmation() {
    const stored = localStorage.getItem('primealpha_payment_confirmations');
    const confirmations = stored ? JSON.parse(stored) : [];
    
    // Find pending confirmations
    const pendingConfirmations = confirmations.filter(c => c.status === 'pending');
    
    if (pendingConfirmations.length === 0) {
        console.log('No pending confirmations to verify');
        return;
    }
    
    // Select a random pending confirmation
    const randomIndex = Math.floor(Math.random() * pendingConfirmations.length);
    const confirmation = pendingConfirmations[randomIndex];
    
    // Update status
    confirmation.status = 'verified';
    confirmation.verifiedAt = new Date().toISOString();
    
    // Find index in original array
    const originalIndex = confirmations.findIndex(c => c.id === confirmation.id);
    confirmations[originalIndex] = confirmation;
    
    // Save back to local storage
    localStorage.setItem('primealpha_payment_confirmations', JSON.stringify(confirmations));
    
    console.log('Verified confirmation:', confirmation);
}

// Function to reject a random confirmation
function rejectRandomConfirmation() {
    const stored = localStorage.getItem('primealpha_payment_confirmations');
    const confirmations = stored ? JSON.parse(stored) : [];
    
    // Find pending confirmations
    const pendingConfirmations = confirmations.filter(c => c.status === 'pending');
    
    if (pendingConfirmations.length === 0) {
        console.log('No pending confirmations to reject');
        return;
    }
    
    // Select a random pending confirmation
    const randomIndex = Math.floor(Math.random() * pendingConfirmations.length);
    const confirmation = pendingConfirmations[randomIndex];
    
    // Update status
    confirmation.status = 'rejected';
    
    // Find index in original array
    const originalIndex = confirmations.findIndex(c => c.id === confirmation.id);
    confirmations[originalIndex] = confirmation;
    
    // Save back to local storage
    localStorage.setItem('primealpha_payment_confirmations', JSON.stringify(confirmations));
    
    console.log('Rejected confirmation:', confirmation);
}

// Function to print confirmation statistics
function printConfirmationStats() {
    const stored = localStorage.getItem('primealpha_payment_confirmations');
    const confirmations = stored ? JSON.parse(stored) : [];
    
    const total = confirmations.length;
    const pending = confirmations.filter(c => c.status === 'pending').length;
    const verified = confirmations.filter(c => c.status === 'verified').length;
    const rejected = confirmations.filter(c => c.status === 'rejected').length;
    
    console.log('=== Confirmation Statistics ===');
    console.log(`Total confirmations: ${total}`);
    console.log(`Pending confirmations: ${pending}`);
    console.log(`Verified confirmations: ${verified}`);
    console.log(`Rejected confirmations: ${rejected}`);
    console.log('==============================');
}

// Function to run a complete test scenario
function runTestScenario() {
    console.log('Starting payment confirmation test scenario...');
    
    // Clear existing confirmations
    clearConfirmations();
    
    // Generate 5 test confirmations
    generateTestConfirmations(5);
    
    // Print initial stats
    console.log('\nInitial state:');
    printConfirmationStats();
    
    // Verify 2 confirmations
    verifyRandomConfirmation();
    verifyRandomConfirmation();
    
    // Reject 1 confirmation
    rejectRandomConfirmation();
    
    // Print final stats
    console.log('\nFinal state:');
    printConfirmationStats();
    
    console.log('\nTest scenario completed successfully!');
    console.log('You can now check the admin panel to see the test confirmations.');
}

// Export functions for use in browser console
window.testPaymentConfirmation = {
    generateTestConfirmations,
    verifyRandomConfirmation,
    rejectRandomConfirmation,
    clearConfirmations,
    printConfirmationStats,
    runTestScenario
};

console.log('Payment confirmation test script loaded.');
console.log('Use window.testPaymentConfirmation.runTestScenario() to run a complete test scenario.');
