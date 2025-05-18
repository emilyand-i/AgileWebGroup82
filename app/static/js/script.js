/**
 * Global Constants & Utilities
 */
// Global plants dictionary to track all plants
// Structure: { plantName: { tabId, contentId, avatarSrc, streakCount, creationDate, etc. } }
let globalPlants = {};

// At the top of script.js after global constants
let canvas = document.getElementById('plantGrowthGraph');
let ctx;

if (canvas) {
    ctx = canvas.getContext('2d');
}

// Draw growth graph for selected plant

function drawGraph(namePlant) {
    if (!ctx || !canvas) {
        console.error('Canvas or context not initialized');
        return;
    }

    console.log(`Drawing graph for ${namePlant}`);
    const data = globalPlants.growthData[namePlant];
    console.log("Retrieved data:", data);

    if (!data || data.length < 2) {
        console.log("Data is missing or too short:", data);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Add at Least 2 Growth Points.`, canvas.width/2, canvas.height/2);
        return;
    }

    try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Canvas cleared");
    } catch (e) {
        console.error("Error clearing canvas:", e);
    }
    
    
    const padding = 70;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;

    const dates = data.map(d => new Date(d.date));
    const heights = data.map(d => d.height);

    const minDate = Math.min(...dates.map(d => d.getTime()));
    const maxDate = Math.max(...dates.map(d => d.getTime()));
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    console.log("minDate", minDate);

    function getX(date) {
        return padding + ((date.getTime() - minDate) / (maxDate - minDate)) * graphWidth;
    }

    function getY(height) {
        return canvas.height - padding - ((height - minHeight) / (maxHeight - minHeight)) * graphHeight;
    }

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    console.log("axes drawn");

    // Plot points and connect them
    ctx.beginPath();
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 4;
    data.forEach((point, index) => {
        const x = getX(new Date(point.date));
        const y = getY(point.height);

        if (index === 0){
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }

        ctx.arc(x, y, 5, 0, 2 * Math.PI);
    });
    ctx.stroke();
    console.log("points plotted");

    // Y-Axis label
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.font = "14px sans-serif";
    ctx.fillText("Height Grown", 0, 0);
    ctx.restore();
    console.log("y-axis label drawn");

    // X-Axis label
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Time Spent Growing", canvas.width / 2, canvas.height - 10);
    console.log("x-axis label drawn");

    // Graph title
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(`${namePlant}'s Growth Journey`, canvas.width / 2, padding - 15);
}


function getCurrentActivePlantName() {
  const activeTab = document.querySelector('#plantTabs .nav-link.active');
  if (!activeTab) return null;

  // Find the tab's label, which matches the plant name
  return activeTab.textContent.trim();
}

function onPlantSelected(plantName) {
  const btn = document.getElementById('fullscreenBtn');
  if (plantName && globalPlants[plantName]) {
    btn.style.display = 'inline-block';
  } else {
    btn.style.display = 'none';
  }
}


/**
 * Event Listeners
 */

// Allow scrolling of main-info from anywhere on the page
document.addEventListener('wheel', function(e) {
  e.preventDefault();
  const scroll_content = document.querySelector('.main-info');
  if (scroll_content) {
    scroll_content.scrollTop += e.deltaY;
  }
}, {passive:false});

/**
 * UI Helpers
 */
// Flip the form between login and register
function flipForm() {
  document.getElementById("form-wrapper").classList.toggle("flip");
}

// Smooth scroll to signin section
function scrollToSignin() {
  const form = document.getElementById('form-wrapper');
  if (form) {
    form.scrollIntoView({behavior: 'smooth'});
  }
}

// Smooth scroll to about section
function scrollToAbout() {
  const about = document.getElementById('welcome');
  if (about) {
    about.scrollIntoView({behavior:'smooth'});
  }
}

// Toggle options in settings modal
function toggleOptions(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = el.style.display === 'block' ? 'none' : 'block';
  }
}

// Toggle light intensity (dimming feature)
function toggleLightIntensity() {
  const overlay = document.getElementById("dark-overlay");
  if (!overlay) return;

  const isOn = overlay.style.display === "block";
  overlay.style.display = isOn ? "none" : "block";
}

// Initialise dimming from localStorage
function initialiseDimming() {
  const overlay = document.getElementById("dark-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

// Toggle fullscreen mode
function toggleFullscreen() {
  console.log('toggleFullscreen called');

  const picsAndGraphs = document.getElementById('picsAndGraphs');
  const leftCol = document.querySelector('.left_col');
  const rightCol = document.querySelector('.right_col');
  const picDiv = document.getElementById('picDiv');
  const currentPlant = getCurrentActivePlantName();

  console.log('Elements:', {
    picsAndGraphs,
    leftCol,
    rightCol,
    picDiv,
  });
  console.log('Current plant:', currentPlant);

  if (!leftCol || !rightCol || !picDiv) {
    console.warn('One or more required elements not found, exiting function');
    return;
  }
  if (!currentPlant || !globalPlants[currentPlant]) {
    console.warn('No current plant or plant data found, exiting function');
    return;
  }

  const isExpanded = leftCol.classList.contains('col-12');
  console.log('Is expanded (leftCol has col-12):', isExpanded);

  if (!isExpanded) {
    console.log('Expanding left column and showing carousel');

    // Expand left column
    picsAndGraphs.classList.remove('flex-column');
    picsAndGraphs.classList.add('gap-5', 'p-5');
    console.log('picsAndGraphs classes:', picsAndGraphs.className);

    leftCol.classList.remove('col-3');
    leftCol.classList.add('col-12', 'vh-100');
    console.log('leftCol classes after expand:', leftCol.className);

    rightCol.classList.add('d-none');
    console.log('rightCol classes after hide:', rightCol.className);

    // Show carousel
    const photos = globalPlants[currentPlant].photos;
    console.log('Photos array:', photos);

    if (!photos || photos.length === 0) {
      console.log('No photos available, updating picDiv accordingly');
      picDiv.innerHTML = `<p class="text-white">No photos available.</p>`;
      return;
    }

    const carouselItems = photos.map((photo, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <div class="card photo-card mb-3 bg-dark text-white">
          <div class="card-body text-center">
            <p class="card-text"><small>${photo.date}</small></p>
            <img src="${photo.src}" class="card-img-top photo-img mb-2" alt="Plant photo ${i + 1}">
            ${photo.comments ? `<p class="card-text"><strong>Comments:</strong> ${photo.comments}</p>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    console.log('Generated carousel items HTML');

    picDiv.innerHTML = `
      <h3 class="plantheader">Photo Gallery</h3>
      <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          ${carouselItems}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    `;

    console.log('Carousel injected into picDiv');
  } else {
    console.log('Collapsing fullscreen back to default');

    // Collapse back to default layout
    picsAndGraphs.classList.add('flex-column');
    picsAndGraphs.classList.remove('gap-5', 'p-5');
    console.log('picsAndGraphs classes after collapse:', picsAndGraphs.className);

    leftCol.classList.remove('col-12', 'vh-100');
    leftCol.classList.add('col-3');
    console.log('leftCol classes after collapse:', leftCol.className);

    rightCol.classList.remove('d-none');
    console.log('rightCol classes after show:', rightCol.className);

    // Restore latest photo view
    updatePhotoDisplay(currentPlant);
    console.log('Called updatePhotoDisplay to restore latest photo');
  }
}




/**
 * Authentication / Sessions
 */

// csrf Token call
let csrfToken = '';
// fetch token from flask
async function CsrfToken() {
  const get = await fetch('/api/csrf-token', {
    credentials: 'include'
  });
  const data = await get.json();
  csrfToken = data.csrf_token;
}

function loginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const fetch_login = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await fetch_login.json();
      console.log("Storing user profile:", data);

      if (fetch_login.ok) {
        // Store the entire profile including streak
        localStorage.setItem('user_profile', JSON.stringify(data));

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.log('Login error:', err);
      alert('Server error');
    }
  });
}



// Registration form
function signupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;
  
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const pass_confirm = document.getElementById('confirm-password').value;
    
    if (password != pass_confirm) {
      alert('Password does not match');
      return;
    }

    const fetch_signup = await fetch('/api/register', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrfToken},
      credentials: 'include', 
      body: JSON.stringify({username, email, password})
    });
    
    const signup_data = await fetch_signup.json();
    if (fetch_signup.ok) {
      alert('Account created! Please log in.');
      flipForm();
    } else {
      alert(signup_data.error || 'Signup error. Please check details.')
    }
  });
}

// Logout function
async function logout() {
  await fetch('/api/logout', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken},
    credentials: 'include'
  });
  localStorage.removeItem('user_profile');
  window.location.href = 'index.html';
}

window.addEventListener('DOMContentLoaded', async () => {
  await CsrfToken();
  loginForm();
  signupForm();
});


// load user sessions 
async function loadSession() {
  const load = await fetch('/api/session', {
    method: 'GET',
    headers: {
      'X-CSRFToken': csrfToken
    },
    credentials: 'include'
  });
  if (load.ok) {
    const user = await load.json();

    // Preserve streak data from existing profile
    const existingProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const updatedProfile = {
      ...user,
      streak: existingProfile.streak || 0,
      last_login_date: existingProfile.last_login_date
    };

    console.log("📦 session loaded:", updatedProfile.plants.map(p => p.plant_name));
    // Store updatedProfile instead of user
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    return updatedProfile;
  } else {
    console.error('Session fetch failure');
    return null;
  }
}


/**
 * DASHBOARD FUNCTIONALITY
 * Functions to load and handle dashboard content
 */

// Load dashboard content based on user profile
async function loadDashboard() {
  const profile = await loadSession();
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  if (!profile) return;

  const username = profile.username || 'username';
  document.querySelector('.welcome_to').textContent = `Welcome to ${username}'s Garden`;

  const plantTabs = document.getElementById("plantTabs");
  const plantTabsContent = document.getElementById("plantTabsContent");
  

  // Reset plant count when loading dashboard
  myPlantCount = 0;
  // Clear global plants dictionary to rebuild it from profile data
  globalPlants = {};

  profile.plants.forEach(plant => {
    myPlantCount++;
    
    const plantName = plant.plant_name;
    const avatarImageSrc = plant.chosen_image_url;
    const plantCategory = plant.plant_category || 'Unknown';
    const plantType = plant.plant_type || 'Unknown';
    
    // Add plant to global plants dictionary
    globalPlants[plantName] = {
      name: plantName,
      avatarSrc: avatarImageSrc,
      plantCategory: plantCategory,
      plantType: plantType,
      streakCount: 0,
      creationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      photos: [], // Add this line to store plant photos
      waterData: [] // Add this line to store water data
    };

    if (!globalPlants.growthData) globalPlants.growthData = {};
    globalPlants.growthData[plantName] = [];

    // Add to dropdown for growth tracking
    const selector = document.getElementById('plantSelector');
    if (selector) {
      const option = document.createElement('option');
      option.value = plantName;
      option.textContent = plantName;
      selector.appendChild(option);
    }

    const tabId = `plant${myPlantCount}-tab`;
    const contentId = `plant${myPlantCount}`;

    renderPlantTab({
      plantName,
      avatarImageSrc,
      plantCategory,
      plantType,
      tabId,
      contentId
    });
  });
}

/**
 * Plant Management
 */
async function savePlantinDB(plant_name, plant_type, chosen_image_url, plant_category) {
  try {
    const load = await fetch('/api/add-plant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      credentials: 'include', 
      body: JSON.stringify({plant_name, plant_type, chosen_image_url, plant_category})
    });

    const data = await load.json();
    if (load.ok) {
      console.log("Plant saved");
      await loadSession();
    } else {
      console.warn('Plant save failed:', data.error);
    }
  } catch (err) {
    console.error("couldnt save plant:", err);
  }
}



function renderPlantTab ({
  plantName,
  avatarImageSrc,
  plantCategory,
  plantType,
  tabId,
  contentId
}) {
  console.log("[renderPlantTab] Rendering", plantName);
  console.trace();
  // Create new plant tab
  const newTab = document.createElement("li");
  newTab.role = "presentation";
  newTab.className = "nav-item";
  newTab.innerHTML = `
    <button class="nav-link" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${contentId}" data-plant-name="${plantName}" type="button" role="tab"> 
      ${plantName}
    </button>`;

  // Create new plant tab content
  const newTabContent = document.createElement("div");
  newTabContent.className = "tab-pane fade";
  newTabContent.id = contentId;
  newTabContent.role = "tabpanel";
  newTabContent.innerHTML = `
     
    <div class="text-center flower-avatar-container">
      <img src="${avatarImageSrc}" class="img-fluid text-center avatar">
      <div class="input-group input-group-sm justify-content-center">
    <span class="input-group-text mt-2 text-light bg-success">${plantCategory}: ${plantType}</span>
      </div>
    </div>
    <div class="daily-streak text-center">
      <div class="plant-info-buttons">
        <div class="nav-link bi bi-info-circle fs-3" 
          role="button"
          data-bs-toggle="modal"
          data-bs-target="#infoModal"
          data-plant-name="${plantName}">
        </div>
        <div class="nav-link bi bi-plus-circle fs-3" 
          role="button"
          data-bs-toggle="modal"
          data-bs-target="#addInfoModal"
          data-plant-name="${plantName}">
        </div>
        <div class="nav-link bi bi-droplet fs-3"
          role="button"
          data-bs-toggle="modal"
          data-bs-target="#waterModal"
          data-plant-name="${plantName}">
        </div>

      </div>
    </div>`;

  // Insert new plant before "Add Plant" tab
  const addPlantTab = document.getElementById("add-plant-tab")?.parentNode;
  if (addPlantTab) {
    plantTabs.insertBefore(newTab, addPlantTab);
    plantTabsContent.appendChild(newTabContent);
  }

  // Show the new plant tab safely
  const newTabButton = document.getElementById(tabId);
  if (newTabButton && !newTabButton.classList.contains('active')) {
    setTimeout(() => new bootstrap.Tab(newTabButton).show(), 0);
  }
}

let myPlantCount = 0;
let selectedAvatarSrc = null;
let currentPlantName = null;


// Initialise plant management functionality
function initialisePlantManagement() {
  const addPlantForm = document.getElementById("addPlantForm");
  const container = document.getElementById('avatar-container');
  
  if (!container) return;

  // Add click event for avatar selection
  container.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("avatar-choice")) {
      container.querySelectorAll(".avatar-choice").forEach(img => img.classList.remove("selected"));
      e.target.classList.add("selected");
      selectedAvatarSrc = e.target.getAttribute("src");

      container.innerHTML = ` 
        <img src="${selectedAvatarSrc}" alt="${e.target.alt}" class="selected-avatar">
      `;
    }
  });

  // Set up info modal for plant settings
  const infoModal = document.getElementById('infoModal');
  if (infoModal) {
    infoModal.addEventListener('show.bs.modal', function (event) {
      const trigger = event.relatedTarget;
      const plantName = trigger.getAttribute('data-plant-name');
      const plant = globalPlants[plantName];

      if (!plant) {
        console.warn(`Couldn't find "${plantName}" in globalPlants`);
        return;
      }

      currentPlantName = plantName;
      document.getElementById('infoPlantNameDisplay').textContent = plantName;
      document.getElementById('infoPlantCategory').textContent = plant.plantCategory || 'N/A';
      document.getElementById('infoPlantType').textContent = plant.plantType || 'N/A';
      document.getElementById('plantBirthday').textContent = new Date(plant.creationDate).toDateString();
    });
  }


  // Set up delete button functionality
  const deleteButton = document.getElementById('delete-plant-button');
  if (deleteButton) {
    deleteButton.addEventListener("click", function() {
      if (!currentPlantName || !globalPlants[currentPlantName]) return;

      const plant = globalPlants[currentPlantName];
      if (!plant) return;
    
      document.getElementById(plant.tabId)?.remove();
      document.getElementById(plant.contentId)?.remove();
      // Remove plant from global plants dictionary
      delete globalPlants[currentPlantName];
      
      // Also remove plant's growth data if it exists
      if (globalPlants.growthData) {
        delete globalPlants.growthData[currentPlantName];
      }
      
      // Update growth tracking dropdown by removing the plant
      const selector = document.getElementById('plantSelector');
      if (selector) {
        for (let i = 0; i < selector.options.length; i++) {
          if (selector.options[i].value === currentPlantName) {
            selector.remove(i);
            break;
          }
        }
      }

      console.log(`Plant "${currentPlantName}" deleted from global registry`);
      console.log('Current plants:', Object.keys(globalPlants));
  
      
      // No check for remaining tabs length before accessing remainingTabs[1] or [0] could cause error in plant deleteion section
      // so fixed with new implementation 

      // Show another existing tab, if any
      const tabLinks = document.querySelectorAll(".nav-link");
      for (let i = 0; i < tabLinks.length; i++) {
        const tab = tabLinks[i];
        if (!tab.id.includes('add-plant')) {
          new bootstrap.Tab(tab).show();
          break;
        }
      }

      // Delete from backend
      fetch('/api/delete-plant', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({plant_name: currentPlantName})
      })
      .then(load => load.json())
      .then(data => {
        console.log(data.message || 'Deleted from database');
      })
      .catch(err => {
        console.error('Could not delete plant from database', err);
      });
    });
    currentPlantName = null;
    myPlantCount--;
  }

  // Set up add plant form submission
  if (addPlantForm) {
    addPlantForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const plantName = document.getElementById('plantName').value.trim();
      const plantNameInput = document.getElementById('plantName');
      const tabId = `plant${myPlantCount}-tab`;
      const contentId = `plant${myPlantCount}`;
      const avatarImageSrc = selectedAvatarSrc;
      const plantCategory = document.getElementById('plantCategory').value;
      const plantType = document.getElementById('plantType').value;

      // Check if plant name already exists in the global plants dictionary
      if (plantName in globalPlants) {
        document.getElementById('uniqueNameError').classList.remove('d-none');
        plantNameInput.classList.add('is-invalid');

        plantNameInput.addEventListener('input', () => {
          document.getElementById('uniqueNameError').classList.add('d-none');
          plantNameInput.classList.remove('is-invalid');
        });
        return;
      }
      
      myPlantCount++;
      
      
      globalPlants[plantName] = {
        tabId: tabId,
        contentId: contentId,
        name: plantName,
        avatarSrc: avatarImageSrc,
        plantCategory: plantCategory,
        plantType: plantType,
        streakCount: 0,
        creationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        photos: [], // Add this line to store plant photos
        waterData: [] // Add this line to store water data
      };

      await savePlantinDB(plantName, plantType, avatarImageSrc, plantCategory);

      renderPlantTab({
        plantName,
        avatarImageSrc,
        plantCategory,
        plantType,
        tabId,
        contentId
      });

      // Update share column content
      const shareContent = document.getElementById("share-content");
      if (shareContent) {
        shareContent.innerHTML = `
          <h3 class="text-white"> Share Your Plant! </h3>
          <img src="${avatarImageSrc}" class="img-fluid text-center share-avatar">
          <div class="share-controls text-center mt-4">
              <a class="btn btn-success btn-lg" href="shareBoard.html">
                <i class="bi bi-share me-2"></i> Share Plant
              </a>
          </div>
        `;
      }
      
      // Update growth tracking dropdown with new plant
      const plantSelector = document.getElementById('plantSelector');
      if (plantSelector) {
        const option = document.createElement('option');
        option.value = plantName;
        option.textContent = plantName;
        plantSelector.appendChild(option);
      }
      
      // Initialise empty growth data for this plant
      if (!globalPlants.growthData) {
        globalPlants.growthData = {};
      }
      globalPlants.growthData[plantName] = [];
      
      addPlantForm.reset();
      selectedAvatarSrc = null;

      // Reset avatar choices
      container.innerHTML = ` 
        <div id="avatar-choices" class="avatar-grid">
          <img src="assets/Flower_Avatars/bush.jpg" alt="Bush" class="avatar-choice">
          <img src="assets/Flower_Avatars/cactus 3.jpg" alt="Cactus" class="avatar-choice">
          <img src="assets/Flower_Avatars/cactus.jpg" alt="Cactus" class="avatar-choice">
          <img src="assets/Flower_Avatars/cactus2.jpg" alt="Cactus" class="avatar-choice">
          <img src="assets/Flower_Avatars/flower.jpg" alt="Flower" class="avatar-choice">
          <img src="assets/Flower_Avatars/leaves.jpg" alt="Leaves" class="avatar-choice">
          <img src="assets/Flower_Avatars/leaves 2.jpg" alt="leaves" class="avatar-choice">
          <img src="assets/Flower_Avatars/tree.jpg" alt="Tree" class="avatar-choice">
          <img src="assets/Flower_Avatars/sapling.jpg" alt="Sapling" class="avatar-choice">
          <img src="assets/Flower_Avatars/houseplant.jpg" alt="houseplant" class="avatar-choice">
        </div>
      `;
      
      // Reattach avatar selection event listener
      const avatarChoices = document.getElementById("avatar-choices");
      if (avatarChoices) {
        avatarChoices.addEventListener("click", function(e) {
          if (e.target && e.target.classList.contains("avatar-choice")) {
            document.querySelectorAll(".avatar-choice").forEach(img => img.classList.remove("selected"));
            e.target.classList.add("selected");
            selectedAvatarSrc = e.target.getAttribute("src");
          }
        });
      }
    });
  }

  document.addEventListener('shown.bs.tab', function(event) { // Event Listener for Tab Switch
    const activeTab = event.target; // newly activated tab
    const previousTab = event.relatedTarget; // previous active tab
    
        // Only proceed if tab is not "Add Plant" and already active
      if (!activeTab || activeTab.id.includes('add-plant') || !activeTab.classList.contains('active')) return;

      const plantName = activeTab.getAttribute("data-plant-name") || activeTab.textContent.trim();
      const plantData = globalPlants[plantName];

      if (!plantData) return;

      console.log(`✅ Switched to plant tab: ${plantName}`);

      // Update share content
      const shareContent = document.getElementById("share-content");
      if (shareContent && plantData.avatarSrc) {
        shareContent.innerHTML = `
          <h3 class="text-white"> Share Your Plant! </h3>
          <img src="${plantData.avatarSrc}" class="img-fluid text-center share-avatar">
          <div class="share-controls text-center mt-4">
            <a class="btn btn-success btn-lg" href="shareBoard.html">
              <i class="bi bi-share me-2"></i> Share Plant
            </a>
          </div>
        `;
      }

      // Update graph
      const canvas = document.getElementById('plantGrowthGraph');
      const graphHeader = document.getElementById('graphHeader');
      if (canvas && graphHeader) {
        graphHeader.textContent = plantName;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const data = globalPlants.growthData?.[plantName] || [];
        if (data.length > 0) {
          drawGraph(plantName);
        } else {
          ctx.font = "16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`No growth data for ${plantName} yet.`, canvas.width / 2, canvas.height / 2);
        }
      }

      // Update photo display for the selected plant
      updatePhotoDisplay(plantName);
  });
}
/**
 * PHOTO UPLOAD & DISPLAY
 * Functions to handle photo uploads and display in diary
 */

// Initialise photo upload functionality
function initialisePhotoUpload() {
    const photoForm = document.getElementById('photoForm');
    const input = document.getElementById('photoInput');
    const display = document.getElementById('latestPhotoContainer');
    const noPhotoMessage = document.getElementById('noPhotoMessage');

    if (!photoForm || !input || !display) return;

    photoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const file = input.files[0];
        if (!file) return;

        const currentPlant = getCurrentActivePlantName();
        if (!currentPlant || !globalPlants[currentPlant]) {
            alert('Please select a plant first');
            return;
        }

        const comments = document.getElementById('comments')?.value;

        const reader = new FileReader();
        reader.onload = function (event) {
            const imgSrc = event.target.result;
            const date = new Date().toLocaleString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            });

            // Create photo object
            const photoData = {
                src: imgSrc,
                date: date,
                comments: comments || '',
            };

            // Add to plant's photos array
            if (!globalPlants[currentPlant].photos) {
                globalPlants[currentPlant].photos = [];
            }
            globalPlants[currentPlant].photos.push(photoData); // Add new photo at the beginning

            // Update display
            updatePhotoDisplay(currentPlant);

            photoForm.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('pictureModal'));
            modal?.hide();
        };

        reader.readAsDataURL(file);
    });
}

// Add this new function to update photo display
function updatePhotoDisplay(plantName) {
  const display = document.getElementById('latestPhotoContainer');
  const noPhotoMessage = document.getElementById('noPhotoMessage');
  
  if (!display) return;

  const plant = globalPlants[plantName];
  if (!plant || !plant.photos || plant.photos.length === 0) {
      display.innerHTML = '';
      if (noPhotoMessage) {
          noPhotoMessage.style.display = 'block';
      }
      return;
  }

  if (noPhotoMessage) {
      noPhotoMessage.style.display = 'none';
  }

  const latestPhoto = plant.photos[plant.photos.length - 1];

  display.innerHTML = `
      <div class="card photo-card mb-3">
          <div class="card-body">
              <p class="card-text"><small>${latestPhoto.date}</small></p>
              <img src="${latestPhoto.src}" class="card-img-top photo-img mb-2" alt="Plant photo">
              ${latestPhoto.comments ? `<p class="card-text"><strong>Comments:</strong> ${latestPhoto.comments}</p>` : ''}
          </div>
      </div>
  `;
}

/**
 * PLANT GROWTH TRACKING
 * Functions to track plant growth
 */


// Initialise plant growth tracker

function initialisePlantGrowthTracker() {
  const growthForm = document.getElementById('growthDataForm');
  const waterForm = document.getElementById('waterForm');
  const growthDateInput = document.getElementById('growthDate');
  const waterDateInput = document.getElementById('waterDate');

  console.log("Initializing plant growth tracker...");

  if (growthDateInput) {
    growthDateInput.valueAsDate = new Date();
  }
  if (waterDateInput) {
    waterDateInput.valueAsDate = new Date();
  }

  if (growthForm) {
    console.log("Growth form found");
    growthForm.addEventListener('submit', handleGrowthDataSubmit);
  }

  if (waterForm) {
    console.log("Water form found");
    waterForm.addEventListener('submit', handleWaterDataSubmit);
  }

  function setDateTo(offsetDays, buttonId, inputId) {
    console.log(`🔁 setDateTo called with offsetDays=${offsetDays}, buttonId=${buttonId}, inputId=${inputId}`);

    const buttons = document.querySelectorAll('.date-select-button');
    console.log(`🎯 Found ${buttons.length} buttons`);

    // Remove active class from all buttons
    buttons.forEach(btn => {
      btn.classList.remove('active');
      console.log(`✂️ Removed active from button: ${btn.id}`);
    });

    const selectedButton = document.getElementById(buttonId);
    if (selectedButton) {
      selectedButton.classList.add('active');
      console.log(`✅ Added active to button: ${buttonId}`);
    } else {
      console.warn(`❌ Button not found: ${buttonId}`);
    }

    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    console.log(`📅 New date: ${date.toDateString()}`);

    const input = document.getElementById(inputId);
    if (input) {
      input.valueAsDate = date;
      console.log(`📝 Set date for input ${inputId} to ${input.value}`);
    } else {
      console.warn(`❌ Input not found: ${inputId}`);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM fully loaded. Setting initial date values...');
    const today = new Date();

    const growthDateInput = document.getElementById('growthDate');
    const waterDateInput = document.getElementById('waterDate');

    if (growthDateInput) {
      growthDateInput.valueAsDate = today;
      console.log(`📥 Set initial growthDate to ${growthDateInput.value}`);
    } else {
      console.warn('❌ growthDate input not found.');
    }

    if (waterDateInput) {
      waterDateInput.valueAsDate = today;
      console.log(`📥 Set initial waterDate to ${waterDateInput.value}`);
    } else {
      console.warn('❌ waterDate input not found.');
    }
  });

  document.getElementById('todayButton')?.addEventListener('click', () =>
    setDateTo(0, 'todayButton', 'growthDate')
  );

  document.getElementById('yesterdayButton')?.addEventListener('click', () =>
    setDateTo(-1, 'yesterdayButton', 'growthDate')
  );

  document.getElementById('waterTodayButton')?.addEventListener('click', () =>
    setDateTo(0, 'waterTodayButton', 'waterDate')
  );

  document.getElementById('waterYesterdayButton')?.addEventListener('click', () =>
    setDateTo(-1, 'waterYesterdayButton', 'waterDate')
  );




  function handleWaterDataSubmit(e) {
    e.preventDefault();

    console.log("Water data submission triggered.");

    const name = getCurrentActivePlantName();
    const date = document.getElementById('waterDate').value;

    console.log(`Selected plant: ${name}`);
    console.log(`Selected date: ${date}`);

    if (!name || !date) {
        console.warn('Submission failed: Missing plant name or date');
        alert('Please select a date');
        return;
    }
    globalPlants[name].waterData.push(date);
    
    console.log(`waterData for ${name}`, globalPlants[name]?.waterData);

    waterForm.reset();
    waterDateInput.valueAsDate = new Date();
    const modal = bootstrap.Modal.getInstance(document.getElementById('waterModal'));
    if (modal) {
      modal.hide();
    }
  }


  function handleGrowthDataSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    // Check if canvas and context are available
    if (!canvas || !ctx) {
        console.error('Canvas or context not initialized');
        return;
    }

    const name = getCurrentActivePlantName();
    const date = document.getElementById('growthDate').value;
    const height = parseFloat(document.getElementById('growthHeight').value);

    if (!name || !date || isNaN(height)) {
      alert('Please fill in all fields correctly');
      return;
    }

    if (!globalPlants.growthData[name]) {
      globalPlants.growthData[name] = [];
    }
    globalPlants.growthData[name].push({ date, height });
    globalPlants.growthData[name].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (globalPlants[name]) {
      globalPlants[name].lastUpdated = new Date().toISOString();
    }

    // Clear form and close modal
    growthForm.reset();
    growthDateInput.valueAsDate = new Date();
    const modal = bootstrap.Modal.getInstance(document.getElementById('graphModal'));
    if (modal) {
      modal.hide();
    }
    

    // Update graph
    console.log(`Added growth data for ${name}:`, globalPlants.growthData[name]);
    console.log("draw graph called")
    drawGraph(name);
  }

  canvas = document.getElementById('plantGrowthGraph');
  const plantSelector = document.getElementById('plantSelector');
  
  if (!growthForm || !canvas || !plantSelector) return;

  ctx = canvas.getContext('2d');
  
  // Use plant growth data from global plants dictionary
  // This ensures plant data persists across the application
  if (!globalPlants.growthData) {
    globalPlants.growthData = {};
  }

  // Populate dropdown with plants from global dictionary
  function populatePlantDropdown() {
    // Clear existing options first
    while (plantSelector.options.length > 1) {
      plantSelector.remove(1);
    }
    // Add all plants from global dictionary
    Object.keys(globalPlants).forEach(plantName => {
      if (plantName !== 'growthData') { // Skip the special growthData key
        const option = document.createElement('option');
        option.value = plantName;
        option.textContent = plantName;
        plantSelector.appendChild(option);
      }
    });
  }

  // Handle plant selection change
  plantSelector.addEventListener('change', () => {
    const selectedPlant = plantSelector.value;
    if (selectedPlant) {
      console.log("drawgraph called for", selectedPlant);
      drawGraph(selectedPlant);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  // Handle form submission for new growth data
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = getCurrentActivePlantName(); // Get currently active plant name
    const date = document.getElementById('growthDate').value;
    const height = parseFloat(document.getElementById('growthHeight').value);

    if (!name || !date || isNaN(height)) {
      alert('Please fill in all fields correctly');
      return;
    }

    // Initialise growth data for this plant if it doesn't exist
    if (!globalPlants.growthData[name]) {
      globalPlants.growthData[name] = [];
    }

    // Add new growth data point
    globalPlants.growthData[name].push({ date, height });

    // Sort by date
    globalPlants.growthData[name].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Update last updated timestamp for the plant
    if (globalPlants[name]) {
      globalPlants[name].lastUpdated = new Date().toISOString();
    }

    // Clear form
    form.reset();

    // Close the modal using Bootstrap's API
    const modal = bootstrap.Modal.getInstance(document.getElementById('graphModal'));
    modal.hide();
    
    // Update the graph
    console.log("draw graph called")
    drawGraph(name);
  });
  
  // Initial population of dropdown
  populatePlantDropdown();
}

/**
 * SETTINGS & PREFERENCES
 * Functions to handle user settings and preferences
 */

// Initialise settings modal loading
function initialiseSettingsModal() {
  const modal = document.getElementById("User-Settings-Modal");
  if (!modal) return;

  modal.addEventListener("show.bs.modal", () => {
    fetch("User-Settings.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("SettingsModalContent").innerHTML = html;
      })
      .catch(error => {
        document.getElementById("SettingsModalContent").innerHTML = `
          <div class="modal-body text-danger">Failed to load settings content.</div>
        `;
        console.error("Error loading settings:", error);
      });
  });
}

// update daily streak
function updateDailyStreak() {
  const userData = JSON.parse(localStorage.getItem('user_profile'));
  const streakDiv = document.getElementById('dailyStreak');

  if (userData && streakDiv) {
    streakDiv.textContent = `Daily Streak: ${userData.streak} 🔥`;
  } else if (streakDiv) {
    streakDiv.textContent = 'Login streak not available.';
  }
}



const plantOptions = {
  flowers: [
    { value: "lavender", text: "Lavender" },
    { value: "daisy", text: "Daisy" },
    { value: "marigold", text: "Marigold" },
    { value: "petunia", text: "Petunia" },
    { value: "snapdragon", text: "Snapdragon" },
    { value: "geranium", text: "Geranium" },
    { value: "pansy", text: "Pansy" }
  ],
  herbs: [
    { value: "basil", text: "Basil" },
    { value: "parsley", text: "Parsley" },
    { value: "mint", text: "Mint" },
    { value: "oregano", text: "Oregano" },
    { value: "rosemary", text: "Rosemary" },
    { value: "thyme", text: "Thyme" },
    { value: "chives", text: "Chives" },
    { value: "coriander", text: "Coriander (Cilantro)" }
  ],
  succulents: [
    { value: "aloe", text: "Aloe Vera" },
    { value: "jade", text: "Jade Plant" },
    { value: "echeveria", text: "Echeveria" },
    { value: "sedum", text: "Sedum" },
    { value: "haworthia", text: "Haworthia" },
    { value: "crassula", text: "Crassula" },
    { value: "agave", text: "Agave" }
  ],
  trees: [
    { value: "jacaranda", text: "Jacaranda" },
    { value: "paperbark", text: "Paperbark Tree (Melaleuca)" },
    { value: "pine", text: "Pine Tree" },
    { value: "maple", text: "Maple Tree" },
    { value: "oak", text: "Oak Tree" },
    { value: "lemon", text: "Lemon Tree" },
    { value: "fig", text: "Fig Tree" },
    { value: "olive", text: "Olive Tree" }
  ],
  natives: [
    { value: "wattle", text: "Golden Wattle (Acacia pycnantha)" },
    { value: "grevillea", text: "Grevillea" },
    { value: "banksia", text: "Banksia" },
    { value: "kangaroo_paw", text: "Kangaroo Paw" },
    { value: "eucalyptus", text: "Eucalyptus (Gum Tree)" },
    { value: "waratah", text: "Waratah" },
    { value: "lilly_pilly", text: "Lilly Pilly" },
    { value: "callistemon", text: "Callistemon (Bottlebrush)" },
    { value: "melaleuca", text: "Melaleuca (Tea Tree)" }
  ],
  grasses: [
    { value: "kangaroo_grass", text: "Kangaroo Grass (Themeda triandra)" },
    { value: "wallaby_grass", text: "Wallaby Grass (Rytidosperma spp.)" },
    { value: "lomandra", text: "Lomandra" },
    { value: "buffalo", text: "Buffalo Grass" },
    { value: "zoysia", text: "Zoysia Grass" },
    { value: "couch", text: "Couch Grass" },
    { value: "fescue", text: "Tall Fescue" }
  ]
};

document.getElementById("plantCategory").addEventListener("change", function () {
  const category = this.value;
  const plantTypeSelect = document.getElementById("plantType");

  plantTypeSelect.innerHTML = '<option value="">Select Plant Type</option>';

  if (plantOptions[category]) {
    plantOptions[category].forEach(option => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.text;
      plantTypeSelect.appendChild(opt);
    });
    plantTypeSelect.disabled = false;
  } else {
    plantTypeSelect.disabled = true;
  }
});


  /**
 * Main initialisation
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize canvas
    canvas = document.getElementById('plantGrowthGraph');
    if (canvas) {
        ctx = canvas.getContext('2d');
    }

    // Load dashboard - wait for initialisations to render first
    loadDashboard();
    
    // Initialise plant management
    initialisePlantManagement();
    
    // Initialise photo upload functionality
    initialisePhotoUpload();
    
    // Initialise plant growth tracker
    initialisePlantGrowthTracker();
    
    // Initialise settings modal
    initialiseSettingsModal();
    
    // Initialise dimming feature
    initialiseDimming();

    updateDailyStreak();
  
});