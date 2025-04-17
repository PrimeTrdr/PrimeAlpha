// Load certificate templates and initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    // Esta función será utilizada para cargar los nuevos certificados PNG
    // cuando el usuario los proporcione
    
    const certificatesContainer = document.getElementById('certificates-container');
    
    // Función para cargar los certificados desde archivos PNG
    function loadCertificatesFromImages(imageFiles) {
        // Limpiar el contenedor de certificados
        certificatesContainer.innerHTML = '';
        
        // Cargar cada imagen como un certificado
        imageFiles.forEach(function(imageFile) {
            const certificateCard = document.createElement('div');
            certificateCard.className = 'certificate-card';
            
            const certificateImage = document.createElement('img');
            certificateImage.src = imageFile;
            certificateImage.alt = 'Trading Certificate';
            certificateImage.className = 'certificate-image';
            
            certificateCard.appendChild(certificateImage);
            certificatesContainer.appendChild(certificateCard);
        });
        
        // Inicializar el carrusel después de cargar las imágenes
        initializeCarousel();
    }
    
    // Función para inicializar el carrusel
    function initializeCarousel() {
        // Comprobar si slick está disponible
        if (typeof $.fn.slick !== 'undefined') {
            // Destruir el carrusel existente si ya está inicializado
            if ($('.certificates-carousel').hasClass('slick-initialized')) {
                $('.certificates-carousel').slick('unslick');
            }
            
            // Inicializar el nuevo carrusel
            $('.certificates-carousel').slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                variableWidth: false,
                arrows: true,
                adaptiveHeight: false,
                swipe: true,
                touchMove: true,
                draggable: true,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
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
            
            console.log('Certificate carousel initialized successfully');
        } else {
            console.warn('Slick carousel not available. Make sure to include slick.js and slick.css.');
        }
    }
    
    // Exponer la función para que pueda ser llamada cuando se reciban los certificados
    window.loadCertificatesFromImages = loadCertificatesFromImages;
    
    // Añadir estilos para las imágenes de certificados
    const style = document.createElement('style');
    style.textContent = `
        .certificate-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .certificate-placeholder {
            text-align: center;
            padding: 50px;
            background: rgba(40, 40, 40, 0.5);
            border-radius: 12px;
            border: 1px solid rgba(79, 96, 250, 0.3);
        }
        
        .certificate-placeholder p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
});
