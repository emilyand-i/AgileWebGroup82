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

//Plant Graph Dropdown
function graph_show() {
  const graph_section = document.getElementById('growth_graph');
  const style = window.getComputedStyle(graph_section);

  if (style.display == 'none') {
    graph_section.style.display = 'block';
  } else {
    graph_section.style.display = 'none'
  }
}

//Picture show Dropdown
function pic_show() {
  const pic_diary = document.getElementById('user_diary');
  const style = window.getComputedStyle(graph_section);

  if (style.display == 'none') {
    pic_diary.style.display = 'block';
  } else {
    pic_diary.style.display = 'none'
  }
}

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
    
    const newTab = document.createElement("li");
    newTab.role = "presentation";
    newTab.className = "nav-item"

    newTab.innerHTML = ` <button class="nav-link" id="plant${myPlantCount}-tab" data-bs-toggle="tab" data-bs-target="#plant${myPlantCount}" type="button" role="tab"> 
                              ${plantName} 
                          </button>`;

    newTabContent = document.createElement("div");
    newTabContent.className = "tab-pane fade";
    newTabContent.id = `plant${myPlantCount}`;
    newTabContent.role = "tabPanel"

    newTabContent.innerHTML = `
      <div class="text-center flower-avatar-container">
                <img src="assets/flower-avatar.png" class="img-fluid text-center" id="flower-avatar">
              </div>
              <div class="daily-streak text-center mt-4">
                <h2 class="streak">Daily Streak</h2>
                <p class="streak-count display-4 fw-bold">0 🔥</p>
              </div>
    `

    shareContent = document.getElementById("share-content");
    shareContent.innerHTML = `
        <h3 class="text-white"> Share Your Plant! </h3>
              <img src="assets/flower-avatar.png" class="img-fluid text-center" id="flower-avatar">
              <div class="share-controls text-center mt-4">
                <button class="btn btn-success share-btn">
                  <i class="bi bi-share"></i> Share Plant
                </button>
              </div>
    `

    const addPlantTab = document.getElementById("add-plant-tab").parentNode;
    plantTabs.insertBefore(newTab, addPlantTab);

    plantTabsContent.appendChild(newTabContent);

    addPlantForm.reset();

    const newTabButton = document.getElementById(`plant${myPlantCount}-tab`);
    const tab = new bootstrap.Tab(newTabButton);
    tab.show();


    
    
  });
});
