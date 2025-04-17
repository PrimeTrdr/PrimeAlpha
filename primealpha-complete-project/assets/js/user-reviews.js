document.addEventListener('DOMContentLoaded', function() {
    // User reviews data with English names
    const userReviews = [
        {
            text: "Best Alpha group I've ever joined. The Twitter screener detected several memecoins before they went viral, and the trenching strategy has been extremely profitable even during market downturns. The automated bot saved me countless hours of chart watching.",
            name: "Michael Anderson",
            role: "Crypto Trader",
            avatar: "assets/images/reviews/review_avatar1.jpg"
        },
        {
            text: "Achieved 5x gains in just one month using the bot and wallet tracking features. The ability to monitor whale wallets gave me confidence to hold positions longer than I normally would, resulting in much better profits than my previous trading approach.",
            name: "Jennifer Roberts",
            role: "Investment Analyst",
            avatar: "assets/images/reviews/review_avatar2.jpg"
        },
        {
            text: "Turned 2 SOL into 13 SOL in just one week thanks to the PumpFun graduation alerts. The system notified me about three tokens before they exploded, and the timing was perfect. The subscription fee paid for itself within the first few days.",
            name: "Daniel Wilson",
            role: "Blockchain Enthusiast",
            avatar: "assets/images/reviews/review_avatar3.jpg"
        }
    ];

    // Create the reviews carousel
    const reviewsSection = document.createElement('section');
    reviewsSection.id = 'user-reviews';
    reviewsSection.className = 'user-reviews';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    const heading = document.createElement('h2');
    heading.textContent = "Here's what Our Members are Saying";
    
    const subtitle = document.createElement('p');
    subtitle.className = 'section-subtitle';
    subtitle.textContent = 'Real experiences from PrimeAlpha traders';
    
    const carousel = document.createElement('div');
    carousel.className = 'reviews-carousel';
    
    // Create review cards
    userReviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        const content = document.createElement('div');
        content.className = 'review-content';
        content.innerHTML = `<p>${review.text}</p>`;
        
        const author = document.createElement('div');
        author.className = 'review-author';
        
        const avatar = document.createElement('div');
        avatar.className = 'review-avatar';
        const img = document.createElement('img');
        img.src = review.avatar;
        img.alt = review.name;
        avatar.appendChild(img);
        
        const info = document.createElement('div');
        info.className = 'review-info';
        
        const name = document.createElement('h4');
        name.textContent = review.name;
        
        const role = document.createElement('p');
        role.textContent = review.role;
        
        const rating = document.createElement('div');
        rating.className = 'review-rating';
        
        // Add 5 stars
        for (let i = 0; i < 5; i++) {
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            star.innerHTML = '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>';
            star.setAttribute('viewBox', '0 0 24 24');
            star.setAttribute('width', '18');
            star.setAttribute('height', '18');
            star.setAttribute('fill', '#ffb400');
            rating.appendChild(star);
        }
        
        info.appendChild(name);
        info.appendChild(role);
        info.appendChild(rating);
        
        author.appendChild(avatar);
        author.appendChild(info);
        
        card.appendChild(content);
        card.appendChild(author);
        
        carousel.appendChild(card);
    });
    
    container.appendChild(heading);
    container.appendChild(subtitle);
    container.appendChild(carousel);
    reviewsSection.appendChild(container);
    
    // Insert the reviews section before the Trading Results section
    const tradingResultsSection = document.getElementById('trading-results');
    if (tradingResultsSection) {
        tradingResultsSection.parentNode.insertBefore(reviewsSection, tradingResultsSection);
        
        // Initialize the carousel with Slick
        $(carousel).slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
    
    // Remove the "What Our Users Say" section
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        testimonialsSection.remove();
    }
});
