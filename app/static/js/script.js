function flipForm() {
  document.getElementById("form-wrapper").classList.toggle("flip");
}

function toDash() {
  window.location.href = "dashboard.html"
}

function scrollToSignin() {
  const form = document.getElementById('form-wrapper');
  if (form) {
    form.scrollIntoView({behavior: 'smooth'});
  }
}

function scrollToAbout() {
  const about = document.getElementById('welcome');
  if (about) {
    about.scrollIntoView({behavior:'smooth'});
  }
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

// adding/removing plant:

document.addEventListener('DOMContentLoaded', function() {
  const addPlantForm = document.getElementById("addPlantForm");
  const plantTabs = document.getElementById("plantTabs");
  const plantTabsContent = document.getElementById('plantTabsContent');
  let myPlantCount = 0;

  addPlantForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    myPlantCount++;
    const plantName = document.getElementById('plantName').value;
    const plantType = document.getElementById('plantType').value;
    
    // console.log(plantName);
    // console.log(plantType);
    
  });
});
