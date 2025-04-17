document.addEventListener('DOMContentLoaded', function() {
  // Load testimonials template
  fetch('assets/templates/testimonials.html')
    .then(response => response.text())
    .then(html => {
      // Insert the template HTML
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;
      document.body.appendChild(tempContainer);
      
      // Load testimonials data
      return fetch('assets/data/testimonials.json');
    })
    .then(response => response.json())
    .then(testimonials => {
      const template = document.getElementById('testimonial-template');
      const container = document.querySelector('.testimonials-grid');
      
      if (!template || !container) {
        console.error('Testimonials template or container not found');
        return;
      }
      
      // Create testimonial cards
      testimonials.forEach((testimonial, index) => {
        const card = template.content.cloneNode(true);
        
        // Set testimonial content
        card.querySelector('.testimonial-content p').textContent = testimonial.testimonial;
        card.querySelector('.testimonial-info h4').textContent = testimonial.name;
        card.querySelector('.testimonial-info p').textContent = testimonial.role;
        
        // Set avatar image
        const avatarImg = card.querySelector('.testimonial-avatar img');
        avatarImg.src = `assets/images/avatars/avatar${index + 1}.jpg`;
        avatarImg.alt = testimonial.name;
        
        // Add to container
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading testimonials:', error);
    });
});
