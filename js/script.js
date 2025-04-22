function flipForm() {
  document.getElementById("form-wrapper").classList.toggle("flip");
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.signin-btn').addEventListener('click', flipForm);
});