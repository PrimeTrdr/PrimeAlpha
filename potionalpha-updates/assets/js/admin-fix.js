// Add sample payment confirmations for testing
function addSampleConfirmations() {
    const existingConfirmations = loadConfirmations();
    
    // Only add samples if there are no existing confirmations
    if (existingConfirmations.length === 0) {
        const sampleConfirmations = [
            {
                id: 'conf_1713420001000',
                name: 'John Smith',
                email: 'john.smith@example.com',
                plan: 'weekly',
                transactionId: '5KL4jTRxmKQiucd9KFm5KQiucd9KL4jTRxm',
                notes: 'Please activate my account as soon as possible',
                status: 'verified',
                submittedAt: '2025-04-16T10:00:01.000Z',
                verifiedAt: '2025-04-16T10:30:01.000Z',
                adminNotes: 'Payment verified on Solana explorer'
            },
            {
                id: 'conf_1713420002000',
                name: 'Emma Johnson',
                email: 'emma.johnson@example.com',
                plan: 'lifetime',
                transactionId: '3NF7hTRxmKQiucd9KL4jTRxmKQiucd9K',
                notes: 'Looking forward to using the bot!',
                status: 'pending',
                submittedAt: '2025-04-16T14:00:02.000Z',
                verifiedAt: null,
                adminNotes: null
            },
            {
                id: 'conf_1713420003000',
                name: 'Michael Brown',
                email: 'michael.brown@example.com',
                plan: 'weekly',
                transactionId: '7PQ9jTRxmKQiucd9KL4jTRxmKQiucd9K',
                notes: '',
                status: 'verified',
                submittedAt: '2025-04-15T09:00:03.000Z',
                verifiedAt: '2025-04-15T09:45:03.000Z',
                adminNotes: 'Transaction confirmed'
            },
            {
                id: 'conf_1713420004000',
                name: 'Sophia Garcia',
                email: 'sophia.garcia@example.com',
                plan: 'lifetime',
                transactionId: '2BC5jTRxmKQiucd9KL4jTRxmKQiucd9K',
                notes: 'Please send me access details via email',
                status: 'rejected',
                submittedAt: '2025-04-14T16:00:04.000Z',
                verifiedAt: null,
                adminNotes: 'Transaction not found on blockchain'
            },
            {
                id: 'conf_1713420005000',
                name: 'William Davis',
                email: 'william.davis@example.com',
                plan: 'weekly',
                transactionId: '8RS2jTRxmKQiucd9KL4jTRxmKQiucd9K',
                notes: '',
                status: 'verified',
                submittedAt: '2025-04-13T11:00:05.000Z',
                verifiedAt: '2025-04-13T11:20:05.000Z',
                adminNotes: 'Payment confirmed'
            }
        ];
        
        // Save sample confirmations
        saveConfirmations(sampleConfirmations);
        console.log('Added sample payment confirmations for testing');
        return true;
    }
    
    return false;
}

// Call this function after initialization
addSampleConfirmations();
