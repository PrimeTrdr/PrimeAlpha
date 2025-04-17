// Load certificate templates and initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    // Load certificate templates
    fetch('assets/templates/certificates.html')
        .then(response => response.text())
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
        })
        .catch(error => {
            console.error('Error loading certificate templates:', error);
        });
});
