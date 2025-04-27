function flipForm() {
  document.getElementById("form-wrapper").classList.toggle("flip");
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.signin-btn').addEventListener('click', flipForm);
});


// allow scroll of main-info from anywhere on the page
document.addEventListener('wheel', function(e) {
  const scroll_content = document.querySelector('.main-info');
  if (scroll_content) {
    scroll_content.scrollBy({
      top: e.deltaY,
      behaviour: 'smooth'
    });
  }
}, {passive:false});
