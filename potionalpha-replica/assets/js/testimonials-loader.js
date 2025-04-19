document.addEventListener('DOMContentLoaded', function() {
    // Load testimonials section
    const testimonialsSection = document.getElementById('testimonials-placeholder');
    if (testimonialsSection) {
        fetch('assets/templates/testimonials.html')
            .then(response => response.text())
            .then(html => {
                testimonialsSection.innerHTML = html;
                initTestimonialsCarousel();
            })
            .catch(error => {
                console.error('Error loading testimonials section:', error);
            });
    }
    
    // Initialize testimonials carousel functionality
    function initTestimonialsCarousel() {
        const prevButton = document.querySelector('.carousel-nav.prev');
        const nextButton = document.querySelector('.carousel-nav.next');
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        
        if (!prevButton || !nextButton || testimonialItems.length === 0) return;
        
        let currentIndex = 0;
        const itemsPerView = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const totalSlides = Math.ceil(testimonialItems.length / itemsPerView);
        
        // Initially hide all items except the first set
        updateVisibleItems();
        
        // Add event listeners for navigation
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateVisibleItems();
        });
        
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateVisibleItems();
        });
        
        // Update which items are visible based on current index
        function updateVisibleItems() {
            testimonialItems.forEach((item, index) => {
                const startIdx = currentIndex * itemsPerView;
                const endIdx = startIdx + itemsPerView;
                
                if (index >= startIdx && index < endIdx) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const newItemsPerView = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
            if (newItemsPerView !== itemsPerView) {
                itemsPerView = newItemsPerView;
                currentIndex = 0;
                updateVisibleItems();
            }
        });
    }
});
