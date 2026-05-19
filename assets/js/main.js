// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

// Année dynamique dans le pied de page
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Formulaires (démo locale, sans backend)
document.querySelectorAll('form[data-local]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const notice = form.querySelector('.form-notice');
    if (notice) {
      notice.textContent = 'Merci ! Votre message a bien été enregistré. Nous reviendrons vers vous très rapidement.';
      notice.classList.add('show');
    }
    form.reset();
  });
});
