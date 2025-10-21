
function toggleMenu(btn){
  const nav = document.getElementById('site-nav');
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
document.getElementById('year').textContent = new Date().getFullYear();
