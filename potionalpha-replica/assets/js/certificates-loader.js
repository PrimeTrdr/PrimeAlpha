// Load certificate templates and initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    // Load certificate templates
    fetch('assets/templates/certificates.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            // Insert the templates into the carousel
            document.querySelector('.certificates-carousel').innerHTML = html;
            
            // Initialize the carousel with Slick
            $('.certificates-carousel').slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
            
            // Add hover effects to certificates
            $('.certificate-card').hover(
                function() {
                    $(this).find('.certificate-profit').css('text-shadow', '0 0 20px rgba(156, 39, 176, 0.9)');
                },
                function() {
                    $(this).find('.certificate-profit').css('text-shadow', '0 0 10px rgba(156, 39, 176, 0.7)');
                }
            );
            
            console.log('Certificate carousel initialized successfully');
        })
        .catch(error => {
            console.error('Error loading certificate templates:', error);
            // Fallback: Insert certificates directly if fetch fails
            const certificatesCarousel = document.querySelector('.certificates-carousel');
            if (certificatesCarousel) {
                // Create a simple message to indicate there was an error
                certificatesCarousel.innerHTML = '<div class="certificate-card"><div class="certificate-header"><div class="certificate-logo"><img src="assets/images/primelogo.svg" alt="PrimeAlpha"><h3>PRIMEALPHA</h3></div><div class="certificate-token">SOL</div></div><div class="certificate-profit">+49.0 SOL<span class="certificate-multiplier">50.0x</span></div><div class="certificate-details"><div class="certificate-detail"><div class="certificate-detail-label">Total Invested</div><div class="certificate-detail-value">1.0 SOL</div></div><div class="certificate-detail"><div class="certificate-detail-label">Total Sold</div><div class="certificate-detail-value">50.0 SOL</div></div><div class="certificate-detail"><div class="certificate-detail-label">Total Profit</div><div class="certificate-detail-value profit">49.0 SOL</div></div></div><div class="certificate-footer">IT\'S TIME TO WIN</div></div>';
                
                // Initialize the carousel with Slick
                try {
                    $('.certificates-carousel').slick({
                        dots: true,
                        infinite: true,
                        speed: 500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 3000
                    });
                    console.log('Fallback certificate carousel initialized');
                } catch (slickError) {
                    console.error('Error initializing fallback Slick carousel:', slickError);
                }
            }
        });
});
