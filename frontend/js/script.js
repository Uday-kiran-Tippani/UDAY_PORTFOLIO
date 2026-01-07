  const scriptURL = 'https://script.google.com/macros/s/AKfycbwwKAS_1LUQBeobs5Fn7Q8joMwxKrRYSYA4d8qhU0oahdzmJu5kZV5fYacAuB2e5qJxsw/exec';
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        msg.innerHTML = "Message sent successfully!";
        setTimeout(() => msg.innerHTML = "", 5000);
        form.reset();
      })
      .catch(error => console.error('Error!', error.message));
  });

// TOGGLE MENU
  const toggleBtn = document.querySelector('.toggle-btn');
  const navList = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');
  const toggleIcon = toggleBtn.querySelector('i');

  // Toggle nav and icon
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navList.classList.toggle('active');

    // Toggle icon between bars and X
    if (navList.classList.contains('active')) {
      toggleIcon.classList.remove('fa-bars');
      toggleIcon.classList.add('fa-xmark');
    } else {
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
    }
  });

  // Close nav on link click and reset icon
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
    });
  });

  // Close nav on outside click and reset icon
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !toggleBtn.contains(e.target)) {
      navList.classList.remove('active');
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
    }
  });


//REVELING EFFECT

  const reveals = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const revealTop = reveals[i].getBoundingClientRect().top;
      const revealPoint = 100;

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add('active');
      } else {
        reveals[i].classList.remove('active');
      }
    }
  }

  // Run on scroll
  window.addEventListener('scroll', revealOnScroll);
  // Run once after page load
  window.addEventListener('load', revealOnScroll);
