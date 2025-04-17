// Direct testimonials implementation
document.addEventListener('DOMContentLoaded', function() {
  // Create testimonials data
  const testimonials = [
    {
      name: "Michael Thompson",
      role: "Crypto Investor",
      testimonial: "PrimeAlpha has completely transformed my trading experience. I've been generating consistent 20-25% daily returns since I started using the bot. The automated system works flawlessly, allowing me to earn passive income without spending hours analyzing charts. Definitely the best investment I've made this year!",
      avatar: "assets/images/avatars/avatar1.jpg"
    },
    {
      name: "Sarah Johnson",
      role: "Day Trader",
      testimonial: "After trying several trading bots in the Solana ecosystem, PrimeAlpha stands out as truly exceptional. The early token detection feature has helped me get into promising projects before they explode in value. I'm consistently seeing 15-30% daily returns, which has exceeded all my expectations. The team behind it is responsive and professional.",
      avatar: "assets/images/avatars/avatar2.jpg"
    },
    {
      name: "David Wilson",
      role: "Blockchain Developer",
      testimonial: "As someone who understands the technical aspects of blockchain, I'm impressed by PrimeAlpha's sophisticated algorithms. The bot's ability to analyze on-chain data and execute trades at optimal moments is remarkable. I've been averaging 18% daily returns, which compounds to incredible growth over time. This is cutting-edge technology at its finest.",
      avatar: "assets/images/avatars/avatar3.jpg"
    },
    {
      name: "Jennifer Parker",
      role: "Financial Analyst",
      testimonial: "I was skeptical at first, but PrimeAlpha has proven its worth many times over. The automated trading strategies are clearly built on solid financial principles, and the results speak for themselves. My portfolio has grown by over 400% in just one month. The Telegram integration makes it incredibly easy to manage everything.",
      avatar: "assets/images/avatars/avatar4.jpg"
    },
    {
      name: "Robert Anderson",
      role: "Crypto Enthusiast",
      testimonial: "PrimeAlpha has given me financial freedom I never thought possible. The bot consistently finds profitable opportunities in the Solana ecosystem that I would have missed on my own. With daily returns averaging 22%, I've been able to quit my day job and focus on what I love. The minimum investment requirement is accessible, and the returns are life-changing.",
      avatar: "assets/images/avatars/avatar5.jpg"
    },
    {
      name: "Emily Martinez",
      role: "Investment Advisor",
      testimonial: "I recommend PrimeAlpha to all my clients interested in crypto. The bot's performance is unmatched in the current market, consistently generating 15-35% daily returns even during market downturns. The whale tracking feature provides insights you simply can't get elsewhere. It's a professional-grade tool that delivers exceptional results.",
      avatar: "assets/images/avatars/avatar6.jpg"
    }
  ];

  // Find testimonials container
  const testimonialsSection = document.getElementById('testimonials');
  if (!testimonialsSection) {
    console.error('Testimonials section not found');
    return;
  }

  const testimonialsGrid = testimonialsSection.querySelector('.testimonials-grid');
  if (!testimonialsGrid) {
    console.error('Testimonials grid not found');
    return;
  }

  // Clear any existing content
  testimonialsGrid.innerHTML = '';

  // Create testimonial cards
  testimonials.forEach(testimonial => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    const content = document.createElement('div');
    content.className = 'testimonial-content';
    const contentP = document.createElement('p');
    contentP.textContent = testimonial.testimonial;
    content.appendChild(contentP);
    
    const author = document.createElement('div');
    author.className = 'testimonial-author';
    
    const avatar = document.createElement('div');
    avatar.className = 'testimonial-avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = testimonial.avatar;
    avatarImg.alt = testimonial.name;
    avatar.appendChild(avatarImg);
    
    const info = document.createElement('div');
    info.className = 'testimonial-info';
    const nameH4 = document.createElement('h4');
    nameH4.textContent = testimonial.name;
    const roleP = document.createElement('p');
    roleP.textContent = testimonial.role;
    
    const rating = document.createElement('div');
    rating.className = 'testimonial-rating';
    for (let i = 0; i < 5; i++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      star.innerHTML = '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>';
      star.setAttribute('viewBox', '0 0 24 24');
      star.setAttribute('width', '18');
      star.setAttribute('height', '18');
      star.setAttribute('fill', '#ffb400');
      rating.appendChild(star);
    }
    
    info.appendChild(nameH4);
    info.appendChild(roleP);
    info.appendChild(rating);
    
    author.appendChild(avatar);
    author.appendChild(info);
    
    card.appendChild(content);
    card.appendChild(author);
    
    testimonialsGrid.appendChild(card);
  });
});
