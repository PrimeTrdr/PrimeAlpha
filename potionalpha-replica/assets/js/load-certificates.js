document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando certificados...');
    // Cargar los certificados PNG
    const certificateImages = [
        'assets/images/certificates/certificado1.png',
        'assets/images/certificates/certificado2.png',
        'assets/images/certificates/certificado3.png',
        'assets/images/certificates/certificado4.png'
    ];
    
    // Usar la función que preparamos para cargar las imágenes
    if (window.loadCertificatesFromImages) {
        console.log('Usando loadCertificatesFromImages');
        window.loadCertificatesFromImages(certificateImages);
    } else {
        console.error('La función loadCertificatesFromImages no está disponible');
        // Intentar cargar los certificados manualmente
        const certificatesContainer = document.getElementById('certificates-container');
        if (certificatesContainer) {
            console.log('Cargando certificados manualmente');
            certificatesContainer.innerHTML = '';
            certificateImages.forEach(function(imageFile) {
                const certificateCard = document.createElement('div');
                certificateCard.className = 'certificate-card';
                
                const certificateImage = document.createElement('img');
                certificateImage.src = imageFile;
                certificateImage.alt = 'Trading Certificate';
                certificateImage.className = 'certificate-image';
                certificateImage.style.boxShadow = 'none';
                certificateImage.style.filter = 'none';
                certificateImage.style.maxHeight = '200px';
                
                certificateCard.appendChild(certificateImage);
                certificatesContainer.appendChild(certificateCard);
            });
            
            // Inicializar el carrusel si jQuery y slick están disponibles
            if (typeof $ !== 'undefined' && typeof $.fn.slick !== 'undefined') {
                console.log('Inicializando carrusel manualmente');
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
                    centerMode: false,
                    variableWidth: false,
                    arrows: true,
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
                console.log('Carrusel inicializado correctamente');
            } else {
                console.error('jQuery o Slick no están disponibles');
            }
        } else {
            console.error('Contenedor de certificados no encontrado');
        }
    }
    
    // Añadir evento para el botón de confirmación de pago
    const confirmButtons = document.querySelectorAll('.btn-confirm-payment, .payment-confirm-link, .footer-link');
    confirmButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón de confirmación de pago clickeado');
            if (window.paymentConfirmation) {
                window.paymentConfirmation.showConfirmationForm();
            } else {
                console.error('Sistema de confirmación de pago no inicializado');
                // Intentar inicializar si no existe
                if (typeof PaymentConfirmation === 'function') {
                    window.paymentConfirmation = new PaymentConfirmation();
                    window.paymentConfirmation.showConfirmationForm();
                }
            }
        });
    });
});
