document.addEventListener('DOMContentLoaded', function() {
    // Cargar los certificados PNG
    const certificateImages = [
        'assets/images/certificates/certificado1.png',
        'assets/images/certificates/certificado2.png',
        'assets/images/certificates/certificado3.png',
        'assets/images/certificates/certificado4.png'
    ];
    
    // Usar la función que preparamos para cargar las imágenes
    if (window.loadCertificatesFromImages) {
        window.loadCertificatesFromImages(certificateImages);
    } else {
        console.error('La función loadCertificatesFromImages no está disponible');
        // Intentar cargar los certificados manualmente
        const certificatesContainer = document.getElementById('certificates-container');
        if (certificatesContainer) {
            certificatesContainer.innerHTML = '';
            certificateImages.forEach(function(imageFile) {
                const certificateCard = document.createElement('div');
                certificateCard.className = 'certificate-card';
                
                const certificateImage = document.createElement('img');
                certificateImage.src = imageFile;
                certificateImage.alt = 'Trading Certificate';
                certificateImage.className = 'certificate-image';
                
                certificateCard.appendChild(certificateImage);
                certificatesContainer.appendChild(certificateCard);
            });
            
            // Inicializar el carrusel si jQuery y slick están disponibles
            if (typeof $ !== 'undefined' && typeof $.fn.slick !== 'undefined') {
                if ($('.certificates-carousel').hasClass('slick-initialized')) {
                    $('.certificates-carousel').slick('unslick');
                }
                
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
                            breakpoint: 1200,
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
            }
        }
    }
});
