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
    }
});
