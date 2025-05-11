/**
 * UTILITY FUNCTIONS
 * Helper functions used across the application
 */

function getCurrentActivePlantName() {
  const activeTab = document.querySelector('#plantTabs .nav-link.active');
  if (!activeTab) return null;

  // Find the tab's label, which matches the plant name
  return activeTab.textContent.trim();
}


/**
 * DOCUMENT READY EVENT HANDLER
 * Main initialization when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize signin button event listener
  const signinBtn = document.querySelector('.signin-btn');
  if (signinBtn) {
    signinBtn.addEventListener('click', flipForm);
  }

  // Initialize login form
  initializeLoginForm();
  
  // Initialize signup form
  initializeSignupForm();
  
  // Load dashboard
  loadDashboard();
  
  // Initialize plant management
  initializePlantManagement();
  
  // Initialize photo upload functionality
  initializePhotoUpload();
  
  // Initialize plant growth tracker
  initializePlantGrowthTracker();
  
  // Initialize settings modal
  initializeSettingsModal();
  
  // Initialize dimming feature
  initializeDimming();
});

/**
 * PAGE NAVIGATION & SCROLLING
 * Functions for page navigation and scroll behavior
 */

// Allow scrolling of main-info from anywhere on the page
document.addEventListener('wheel', function(e) {
  e.preventDefault();
  const scroll_content = document.querySelector('.main-info');
  if (scroll_content) {
    scroll_content.scrollTop += e.deltaY;
  }
}, {passive:false});

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

/**
 * AUTHENTICATION & USER MANAGEMENT
 * Functions for user login, registration and logout
 */

// Initialize login form submission handler
function initializeLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const fetch_login = await fetch('/api/login', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    
    const login_data = await fetch_login.json();
    if (fetch_login.ok) {
      window.location.href = 'dashboard.html';
    } else {
      alert(login_data.error || 'Login failed');
    }
  });
}

// Initialize registration form submission handler
function initializeSignupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;
  
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('signup-user').value;
    const password = document.getElementById('signup-password').value;
    const pass_confirm = document.getElementById('confirm-password').value;
    
    if (password != pass_confirm) {
      alert('Password does not match');
      return;
    }

    const fetch_signup = await fetch('/api/register', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: email, password})
    });
    
    const signup_data = await fetch_signup.json();
    if (fetch_signup.ok) {
      alert('Account created! Please log in.');
      flipForm();
    } else {
      alert(signup_data.error || 'Signup error. Please use valid email.')
    }
  });
}

// Logout function
async function logout() {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include'
  });
  window.location.href = 'index.html';
}

/**
 * DASHBOARD FUNCTIONALITY
 * Functions to load and handle dashboard content
 */

// Load dashboard content based on user profile
function loadDashboard() {
  if (!window.location.pathname.includes('dashboard.html')) return;
  
  const profile = JSON.parse(localStorage.getItem('user_profile'));
  if (!profile) return;

  document.querySelector('.welcome_to').textContent = `${profile.username}'s Garden`;

  const plantTabs = document.getElementById("plantTabs");
  const plantTabsContent = document.getElementById("plantTabsContent");
  
  // Reset plant count when loading dashboard
  myPlantCount = 0;
  
  // Clear global plants dictionary to rebuild it from profile data
  globalPlants = {};

  profile.plants.forEach((plant) => {
    myPlantCount++;
    const tabId = `plant${myPlantCount}`;
    const contentId = tabId;
    
    // Add plant to global plants dictionary
    globalPlants[plant.plant_name] = {
      tabId: tabId,
      contentId: contentId,
      name: plant.plant_name,
      avatarSrc: plant.chosen_image_url,
      streakCount: plant.streak || 0,
      creationDate: plant.creation_date || new Date().toISOString(),
      lastUpdated: plant.last_updated || new Date().toISOString()
    };

    const newTab = document.createElement("li");
    newTab.className = "nav-item";
    newTab.innerHTML = `
      <button class="nav-link" id="${tabId}-tab" data-bs-toggle="tab" data-bs-target="#${contentId}" type="button" role="tab">
        ${plant.plant_name}
      </button>`;

    const newContent = document.createElement("div");
    newContent.className = "tab-pane fade";
    newContent.id = contentId;
    newContent.role = "tabpanel";
    newContent.innerHTML = `
      <div class="text-center flower-avatar-container">
        <img src="${plant.chosen_image_url}" class="img-fluid text-center avatar">
      </div>
      <div class="daily-streak text-center mt-4">
        <h2 class="streak">Daily Streak: ${globalPlants[plant.plant_name].streakCount}🔥</h2>
        <div class="nav-link bi bi-gear fs-3" 
          role="button"
          data-bs-toggle="modal"
          data-bs-target="#settingsModal"
          data-plant-name="${plant.plant_name}">
        </div>
      </div>`;

    const addPlantTab = document.getElementById("add-plant-tab").parentNode;
    plantTabs.insertBefore(newTab, addPlantTab);
    plantTabsContent.appendChild(newContent);
  });
  
  console.log('Loaded plants:', Object.keys(globalPlants));
}

/**
 * PLANT VISUALIZATION TOGGLES
 * Functions to toggle between different plant visualizations
 */

// Show/hide growth graph
function graph_show() {
  const graph_section = document.getElementById('growth_graph');
  const pic_diary = document.getElementById('user_diary');
  const style = window.getComputedStyle(graph_section);

  if (style.display == 'none') {
    graph_section.style.display = 'block';
    pic_diary.style.display = 'none';
  } else {
    graph_section.style.display = 'none';
  }
}

// Show/hide picture diary
function pic_show() {
  const pic_diary = document.getElementById('user_diary');
  const graph_section = document.getElementById('growth_graph');
  const style = window.getComputedStyle(user_diary);

  if (style.display == 'none') {
    pic_diary.style.display = 'block';
    graph_section.style.display = 'none';
  } else {
    pic_diary.style.display = 'none';
  }
}

/**
 * GLOBAL VARIABLES
 * Global variables used across different functions
 */

// Global plants dictionary to track all plants
// Structure: { plantName: { tabId, contentId, avatarSrc, streakCount, creationDate, etc. } }
let globalPlants = {};

/**
 * PLANT MANAGEMENT
 * Functions to add, remove, and manage plants
 */

let myPlantCount = 0;
let selectedAvatarSrc = null;
let currentPlantName = null;

// Initialize plant management functionality
function initializePlantManagement() {
  const addPlantForm = document.getElementById("addPlantForm");
  const plantTabs = document.getElementById("plantTabs");
  const plantTabsContent = document.getElementById('plantTabsContent');
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
      currentPlantName = plantName;
      if (plantName) {
        document.getElementById('username').placeholder = plantName;
      }
    });
  }

  // Set up delete button functionality
  const deleteButton = document.getElementById('delete-plant-button');
  if (deleteButton) {
    deleteButton.addEventListener("click", function() {
      const plant = globalPlants[currentPlantName];
      if (!plant) return;
    
      const tab = document.getElementById(plant.tabId);
      const tabContent = document.getElementById(plant.contentId);
    
      tab.remove();
      tabContent.remove();
    
      // Remove plant from global plants dictionary
      delete globalPlants[currentPlantName];
      
      // Also remove plant's growth data if it exists
      if (globalPlants.growthData && globalPlants.growthData[currentPlantName]) {
        delete globalPlants.growthData[currentPlantName];
      }
      
      console.log(`Plant "${currentPlantName}" deleted from global registry`);
      console.log('Current plants:', Object.keys(globalPlants));
      
      // Update growth tracking dropdown by removing the plant
      const plantSelector = document.getElementById('plantSelector');
      if (plantSelector) {
        for (let i = 0; i < plantSelector.options.length; i++) {
          if (plantSelector.options[i].value === currentPlantName) {
            plantSelector.remove(i);
            break;
          }
        }
      }
      
      currentPlantName = null;
      myPlantCount--;

      if (myPlantCount > 0) {
        const remainingTabs = document.querySelectorAll(".nav-link");
        const firstTab = remainingTabs[1];
        const bootstrapTab = new bootstrap.Tab(firstTab);
        bootstrapTab.show();
      }
      else {
        const remainingTabs = document.querySelectorAll(".nav-link");
        const firstTab = remainingTabs[0];
        const bootstrapTab = new bootstrap.Tab(firstTab);
        bootstrapTab.show();
      }
    });
  }

  // Set up add plant form submission
  if (addPlantForm) {
    addPlantForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const plantName = document.getElementById('plantName').value.trim();
      const plantNameInput = document.getElementById('plantName');
      const tabId = `plant${myPlantCount}-tab`;
      const contentId = `plant${myPlantCount}`;
      const avatarImageSrc = selectedAvatarSrc;

      // Check if plant name already exists in the global plants dictionary
      if (plantName in globalPlants) {
        document.getElementById('uniqueNameError').classList.remove('d-none');
        plantNameInput.classList.add('is-invalid');

        plantNameInput.addEventListener('input', function() {
          document.getElementById('uniqueNameError').classList.add('d-none');
          plantNameInput.classList.remove('is-invalid');
        });
        return;
      }
      
      myPlantCount++;
      
      // Add plant to global plants dictionary with all relevant details
      globalPlants[plantName] = {
        tabId: tabId,
        contentId: contentId,
        name: plantName,
        avatarSrc: avatarImageSrc,
        streakCount: 0,
        creationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      // Create new plant tab
      const newTab = document.createElement("li");
      newTab.role = "presentation";
      newTab.className = "nav-item";
      newTab.innerHTML = `
        <button class="nav-link" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${contentId}" type="button" role="tab"> 
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
        </div>
        <div class="daily-streak text-center mt-4">
          <h2 class="streak">Daily Streak: 0🔥</h2>
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
          </div>
        </div>`;

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

      // Insert new plant before "Add Plant" tab
      const addPlantTab = document.getElementById("add-plant-tab").parentNode;
      plantTabs.insertBefore(newTab, addPlantTab);
      plantTabsContent.appendChild(newTabContent);
      
      // Update growth tracking dropdown with new plant
      const plantSelector = document.getElementById('plantSelector');
      if (plantSelector) {
        const option = document.createElement('option');
        option.value = plantName;
        option.textContent = plantName;
        plantSelector.appendChild(option);
      }
      
      // Initialize empty growth data for this plant
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

      // Show the new plant tab
      const newTabButton = document.getElementById(tabId);
      const tab = new bootstrap.Tab(newTabButton);
      tab.show();
    });
  }

  document.addEventListener('shown.bs.tab', function(event) { // Event Listener for Tab Switch
    const activeTab = event.target; // newly activated tab
    const previousTab = event.relatedTarget; // previous active tab
    
    if (activeTab && !activeTab.id.includes('add-plant')) { // checks if tab is not add-plant tab
      const plantName = activeTab.textContent.trim();
      const plantData = globalPlants[plantName];
      
      if (plantData) {
        // Update any UI elements that depend on the current plant
        console.log(`Switched to plant: ${plantName}`);
        
        // Update share content if it exists
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

        // Update growth graph for the current plant
        const canvas = document.getElementById('plantGrowthGraph');
        const graphHeader = document.getElementById('graphHeader');
        if (canvas && graphHeader) {
          // Update the graph header with the current plant name
          graphHeader.textContent = plantName;

          // Clear and redraw the graph with current plant's data
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the graph if growth data exists
          if (globalPlants.growthData && globalPlants.growthData[plantName]) {
            drawGraph(plantName);
          } else {
            // Show placeholder text if no data
            ctx.font = "16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`No growth data for ${plantName} yet.`, canvas.width/2, canvas.height/2);
          }
        }
      }
    }
  });
}

/**
 * PHOTO UPLOAD & DISPLAY
 * Functions to handle photo uploads and display in diary
 */

// Initialize photo upload functionality
function initializePhotoUpload() {
  const photoForm = document.getElementById('photoForm');
  const input = document.getElementById('photoInput');
  const display = document.getElementById('display');
  
  if (!photoForm || !input || !display) return;

  photoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const file = input.files[0];
    if (!file) return;

    const plant_name = document.getElementById('plant_name').value;
    const comments = document.getElementById('comments').value;

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

      // Create a new card for the photo
      const card = document.createElement('div');
      card.className = 'card photo-card';

      let cardHTML = `
      <p class="card-text">${date}</p>
      <div class="card-body">
        <img src="${imgSrc}" class="card-img-top photo-img" alt="Uploaded photo">
      `;
      
      // Add plant name if provided
      if (plant_name) {
        cardHTML += `<p class="card-text"><strong>Plant Name:</strong> ${plant_name}</p>`;
      }

      // Add comments if provided
      if (comments) {
        cardHTML += `<p class="card-text"><strong>Comments:</strong> ${comments}</p>`;
      }

      cardHTML += `</div>`;
      card.innerHTML = cardHTML;

      // Add newest photo to the beginning
      display.prepend(card);
      
      photoForm.reset();
    };

    reader.readAsDataURL(file);
  });
}

/**
 * PLANT GROWTH TRACKING
 * Functions to track and visualize plant growth
 */

// Initialize plant growth tracker
function initializePlantGrowthTracker() {
  const form = document.getElementById('growthForm');
  const canvas = document.getElementById('graphCanvas');
  const plantSelector = document.getElementById('plantSelector');
  
  if (!form || !canvas || !plantSelector) return;
  
  const ctx = canvas.getContext('2d');
  
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

  // Add single plant to dropdown menu
  function addToDropdown(name) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    plantSelector.appendChild(option);
  }

  // Handle plant selection change
  plantSelector.addEventListener('change', () => {
    const selectedPlant = plantSelector.value;
    if (selectedPlant) {
      drawGraph(selectedPlant);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  // Handle form submission for new growth data
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('namePlant').value.trim();
    const date = document.getElementById('plantDate').value;
    const height = parseFloat(document.getElementById('plantHeight').value);

    if (!name || !date || isNaN(height)) return;
    
    // Check if this is an existing plant in our global dictionary
    if (!(name in globalPlants) && name !== 'growthData') {
      alert('Please enter the name of an existing plant or add this plant first.');
      return;
    }
    
    // Initialize growth data for this plant if it doesn't exist
    if (!globalPlants.growthData[name]) {
      globalPlants.growthData[name] = [];
      
      // If not in dropdown already, add it
      if (Array.from(plantSelector.options).findIndex(option => option.value === name) === -1) {
        addToDropdown(name);
      }
    }

    // Add new growth data point
    globalPlants.growthData[name].push({ date, height });
    
    // Sort by date
    globalPlants.growthData[name].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Update last updated timestamp for the plant
    if (globalPlants[name]) {
      globalPlants[name].lastUpdated = new Date().toISOString();
    }

    form.reset();
    if (plantSelector.value === name) {
      drawGraph(name);
    }
  });
  
  // Initial population of dropdown
  populatePlantDropdown();

  // Draw growth graph for selected plant
  function drawGraph(namePlant) {
    const data = globalPlants.growthData[namePlant];

    if (!data || data.length < 2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Not enough data for ${namePlant} yet. Add at least 2 growth points.`, canvas.width/2, canvas.height/2);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 70;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;

    const dates = data.map(d => new Date(d.date));
    const heights = data.map(d => d.height);

    const minDate = Math.min(...dates.map(d => d.getTime()));
    const maxDate = Math.max(...dates.map(d => d.getTime()));
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);

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

    // Y-Axis label
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.font = "14px sans-serif";
    ctx.fillText("Height Grown", 0, 0);
    ctx.restore();

    // X-Axis label
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Time Spent Growing", canvas.width / 2, canvas.height - 10);

    // Graph title
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(`${namePlant}'s Growth Journey`, canvas.width / 2, padding - 15);
  }
}

/**
 * SETTINGS & PREFERENCES
 * Functions to handle user settings and preferences
 */

// Initialize settings modal loading
function initializeSettingsModal() {
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

// Initialize dimming from localStorage
function initializeDimming() {
  const overlay = document.getElementById("dark-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

/**
 * UI LAYOUT CONTROLS
 * Functions to control UI layout
 */

// Toggle fullscreen mode
function toggleFullscreen() {
  const leftCol = document.querySelector('.left_col');
  const rightCol = document.querySelector('.right_col');
  
  if (!leftCol || !rightCol) return;

  const isExpanded = leftCol.classList.contains('col-12');

  if (!isExpanded) {
    leftCol.classList.remove('col-3');
    leftCol.classList.add('col-12', 'vh-100');
    rightCol.classList.add('d-none');
  } else {
    leftCol.classList.remove('col-12', 'vh-100');
    leftCol.classList.add('col-3');
    rightCol.classList.remove('d-none');
  }
}