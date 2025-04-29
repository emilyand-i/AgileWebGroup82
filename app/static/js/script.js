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

let plants = [];

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

    plants.push({
        id: myPlantCount,
        name: plantName,
        type: plantType
    });

    // Remove the destructuring here
    const newPlantTab = addPlantTab(plantName, myPlantCount);

    updateShareContent(plants);

    // Change this variable name to avoid conflict
    const addPlantButton = document.getElementById("add-plant-tab").parentNode;
    plantTabs.insertBefore(newPlantTab.tab, addPlantButton);

    plantTabsContent.appendChild(newPlantTab.content);

    addPlantForm.reset();

    const newTabButton = document.getElementById(`plant${myPlantCount}-tab`);
    const tab = new bootstrap.Tab(newTabButton);
    tab.show();

  });
});

function addPlantTab(plantName, myPlantCount) {
  // Create tab
  const newTab = document.createElement("li");
  newTab.role = "presentation";
  newTab.className = "nav-item";

  newTab.innerHTML = `
    <button class="nav-link" id="plant${myPlantCount}-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#plant${myPlantCount}" 
            type="button" 
            role="tab"> 
      ${plantName}
    </button>`;

  // Create tab content
  const newTabContent = document.createElement("div");
  newTabContent.className = "tab-pane fade";
  newTabContent.id = `plant${myPlantCount}`;
  newTabContent.role = "tabpanel";

  newTabContent.innerHTML = `
    <div class="text-center flower-avatar-container">
      <img src="assets/flower-avatar.png" class="img-fluid text-center" id="flower-avatar-${myPlantCount}">
    </div>
    <div class="daily-streak text-center mt-4">
      <h2 class="streak">Daily Streak</h2>
      <p class="streak-count display-4 fw-bold">0 🔥</p>
    </div>
    <div class="share-controls text-center mt-4">
      <button class="btn btn-success share-btn" onclick="sharePlant(${myPlantCount})">
        <i class="bi bi-share"></i> Share Plant
      </button>
    </div>
  `;

  return { tab: newTab, content: newTabContent };
}

function updateShareContent(plants) {
  const shareContent = document.getElementById("share-content");
  shareContent.innerHTML = `
      <h3 class="text-white"> Share Your Plant! </h3>
          <div class="d-flex justify-content-center">
          <img src="assets/flower-avatar.png" class="img-fluid text-center share-image centered">
          </div>
          <h4 class="text-white text-center">${plants[plants.length - 1].name}</h4>
          <div class="share-controls text-center mt-4">
          <button class="btn btn-success share-btn">
            <i class="bi bi-share"></i> Share Plant
          </button>
          </div>
    `
}