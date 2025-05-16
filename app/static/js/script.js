/**
 * Global Constants & Utilities
 */
// Global plants dictionary to track all plants
// Structure: { plantName: { tabId, contentId, avatarSrc, streakCount, creationDate, etc. } }
let globalPlants = {};

// At the top of script.js after global constants
let growthChart = null;
let waterChart = null;

// Draw growth graph for selected plant

function drawGraph(namePlant) {
    const chartCanvas = document.getElementById('plantGrowthGraph');
    if (!chartCanvas) {
        console.error('Canvas element not found');
        return;
    }

    const data = globalPlants.growthData[namePlant];
    console.log("Retrieved data:", data);

    // Destroy existing chart if it exists
    if (growthChart) {
        growthChart.destroy();
    }

    // If there's not enough data, show an empty message chart
    if (!data || data.length < 2) {
        growthChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    label: 'Growth Progress'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Add At Least 2 Growth Points`,
                        color: 'white',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        title: {
                            display: true,
                            text: 'Time Spent Growing',
                            color: 'white',
                            font: {
                                size: 14
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        },
                        title: {
                            display: true,
                            text: 'Height Grown',
                            color: 'white',
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
        return;
    }

    // Prepare data for the chart
    const dates = data.map(d => new Date(d.date).toLocaleDateString());
    const heights = data.map(d => d.height);

    // Create the growth chart
    growthChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Plant Growth',
                data: heights,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${namePlant}'s Growth Journey`,
                    color: 'white',
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    bodyColor: 'white',
                    titleColor: 'white',
                    backgroundColor: '#333'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Height Grown',
                        color: 'white',
                        font: {
                            size: 9
                        }
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Time Spent Growing',
                        color: 'white',
                        font: {
                            size: 9
                        }
                    }
                }
            }
        }
    });
}

function drawWaterGraph(namePlant) {
    const chartCanvas = document.getElementById('waterTrackingGraph');
    if (!chartCanvas) {
        console.error('Water tracking canvas element not found');
        return;
    }

    const plant = globalPlants[namePlant];
    if (!plant || !plant.waterData) {
        console.log("No water data available");
        return;
    }

    // Destroy existing chart if it exists
    if (waterChart) {
        waterChart.destroy();
    }

    // Prepare data
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    // Create array of last 30 days
    const dates = [];
    const waterValues = [];
    
    for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        dates.push(d.toLocaleDateString());
        // Check if plant was watered on this date
        const wasWatered = plant.waterData.some(water => 
            new Date(water.date).toLocaleDateString() === d.toLocaleDateString()
        );
        waterValues.push(wasWatered ? 1 : 0);
    }

    // Create the water tracking chart
    waterChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Watering Days',
                data: waterValues,
                backgroundColor: 'rgba(0, 156, 255, 0.5)',
                borderColor: 'rgba(0, 156, 255, 1)',
                borderWidth: 1,
                barThickness: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: ``,
                    color: 'white',
                    font: {
                        size: 10,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        stepSize: 1,
                        color: 'white',
                        callback: function(value) {
                            return value === 1 ? '💧' : '';
                        }
                    }
                },
                x: {
                    ticks: {
                        color: 'white',
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function getCurrentActivePlantName() {
  const activeTab = document.querySelector('#plantTabs .nav-link.active');
  if (!activeTab) return null;

  // Find the tab's label, which matches the plant name
  return activeTab.textContent.trim();
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
  const picsAndGraphs = document.getElementById('picsAndGraphs');
  const leftCol = document.querySelector('.left_col');
  const rightCol = document.querySelector('.right_col');
  const picDiv = document.getElementById('picDiv');
  const currentPlant = getCurrentActivePlantName();

  picsAndGraphs.classList.toggle('fullscreen');

  if (window.plantGrowthGraph) {
        window.plantGrowthGraph.resize();
    }
    if (window.waterTrackingGraph) {
        window.waterTrackingGraph.resize();
    }

  if (!leftCol || !rightCol || !picsAndGraphs || !picDiv) {
    console.warn('Missing required elements');
    return;
  }

  const isExpanded = leftCol.classList.contains('col-12');

  if (!isExpanded) {
    if (!currentPlant || !globalPlants[currentPlant]) {
      alert("Please select a plant before entering fullscreen mode.");
      return;
    }

    // Enter fullscreen
    picsAndGraphs.classList.remove('flex-column');
    picsAndGraphs.classList.add('gap-5', 'p-5');
    leftCol.classList.remove('col-3');
    leftCol.classList.add('col-12', 'vh-100');
    rightCol.classList.add('d-none');

    picDiv.classList.add('fullscreen');  // <-- Add class
  } else {
    // Exit fullscreen
    picsAndGraphs.classList.add('flex-column');
    picsAndGraphs.classList.remove('gap-5', 'p-5');
    leftCol.classList.remove('col-12', 'vh-100');
    leftCol.classList.add('col-3');
    rightCol.classList.remove('d-none');

    picDiv.classList.remove('fullscreen');  // <-- Remove class
  }

  updatePhotoDisplay(currentPlant);
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
        const slimProfile = { ...data };

        if (slimProfile.photos) {
          slimProfile.photos = slimProfile.photos.map(photo => ({
            photo_id: photo.photo_id,
            plant_id: photo.plant_id,
            image_url: (photo.image_url && typeof photo.image_url === 'string' && photo.image_url.startsWith('data:image'))? '': photo.image_url,
            caption: photo.caption,
            datetime_uploaded: photo.datetime_uploaded
          }));
        }

        localStorage.setItem('user_profile', JSON.stringify(slimProfile));


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
async function loadNotifications() {
  try {
    const response = await fetch('/api/notifications', {
      credentials: 'include'
    });
    if (!response.ok) throw new Error("Failed to fetch notifications");

    const data = await response.json();
    console.log("🔔 Notifications received:", data.notifications);

    renderNotifications(data.notifications);
  } catch (err) {
    console.error("Notification load error:", err);
  }
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
    if (updatedProfile.photos) {
      updatedProfile.photos = updatedProfile.photos.map(p => ({
        photo_id: p.photo_id,
        plant_id: p.plant_id,
        image_url: p.image_url,
        caption: p.caption,
        datetime_uploaded: p.datetime_uploaded
      }));
    }
    const slimProfile = { ...updatedProfile };

    // Strip base64 photos to reduce localStorage size
    if (slimProfile.photos) {
      slimProfile.photos = slimProfile.photos.map(photo => ({
        photo_id: photo.photo_id,
        plant_id: photo.plant_id,
        image_url: (photo.image_url && typeof photo.image_url === 'string' && photo.image_url.startsWith('data:image'))? '': photo.image_url,
        caption: photo.caption,
        datetime_uploaded: photo.datetime_uploaded
      }));
    }

    localStorage.setItem('user_profile', JSON.stringify(slimProfile));
    return updatedProfile;
  } else {
    console.error('Session fetch failure');
    return null;
  }
}

async function addFriend(friendId, username) {
  const load = await fetch('/api/add-friend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ friend_id: friendId})
  });
  const result = await load.json();

  if (load.ok) {
    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${username}
        <button class="btn btn-sm btn-danger" onclick="removeFriend(${friendId}, '${username}', this)">Remove</button>
      </li>
    `;
    //clear the search
    document.getElementById("friendSearch").value = '';
    document.getElementById("searchResults").innerHTML = '';

    // Update localStorage
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    profile.friends = profile.friends || [];
    profile.friends.push({ friend_id: friendId, friend_username: username });
    localStorage.setItem('user_profile', JSON.stringify(profile));

    alert(`Added ${username} as a friend`);
  } else {
    alert(`${result.error || 'Failed to add friend'}`)
  }
}

async function removeFriend(friendId, username, btn) {
  const load = await fetch('/api/remove-friend', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ friend_id: friendId })
  });

  const result = await load.json();

  if (load.ok) {
    // remove from dom
    btn.closest('li').remove();

    // update loacal storage
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    profile.friends = (profile.friends || []).filter(f => f.friend_id !== friendId);
    localStorage.setItem('user_profile', JSON.stringify(profile));


    alert(`Removed ${username} from your friends 🗑️`);
    // Optional: remove friend from DOM or reload
  } else {
    alert(`${result.error || 'Failed to remove friend'}`);
  }
}

function renderFriendSearchResults(users) {
  const resultsContainer = document.getElementById('searchResults');

  if (!resultsContainer) return;

  if (users.length === 0) {
    resultsContainer.innerHTML = `<li class="list-group-item text-muted">No users found.</li>`;
    return;
  }

  resultsContainer.innerHTML = users.map(user => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${user.username}
      <button class="btn btn-sm btn-success"
              onclick="addFriend(${user.user_id}, '${user.username}')">
        Add
      </button>
    </li>
  `).join('');
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
  fetch('/api/notifications')
  .then(response => response.json())
  .then(data => {
    // Display notifications to the user
    console.log(data.notifications);
  });
  const friendsList = document.getElementById("friendsList");
  if (profile.friends && friendsList) {
    friendsList.innerHTML = profile.friends.map(friend => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${friend.friend_username}
        <button class="btn btn-sm btn-danger" onclick="removeFriend(${friend.friend_id}, '${friend.friend_username}', this)">Remove</button>
      </li>
    `).join('');
  }

  
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
      id: plant.id,
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

    // Restore photos into globalPlants
    if (profile.photos && profile.photos.length > 0) {
      profile.photos.forEach(photo => {
        const plant = Object.values(globalPlants).find(p => p.id === photo.plant_id);
        if (plant) {
          if (!plant.photos) plant.photos = [];

          plant.photos.push({
            src: photo.image_url,
            date: new Date(photo.datetime_uploaded).toLocaleString(),
            comments: photo.caption || ''
          });
        }
      });
    }

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

      drawWaterGraph(plantName); // Add this line
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
  if (!photoForm || !input || !display) return;

  photoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const file = input.files[0];
    if (!file) return;

    const currentPlant = getCurrentActivePlantName();
    if (!currentPlant || !globalPlants[currentPlant]) {
      alert('Please select a plant first');
      console.warn("🌱 No plant selected or plant missing from global state");
      return;
    }

    const comments = document.getElementById('comments')?.value;
    console.log("📤 Upload started for plant:", currentPlant);
    console.log("📝 Comments:", comments);

    const reader = new FileReader();
    reader.onload = async function (event) {
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

      console.log("✅ Photo added to globalPlants:", photoData);
      console.log("📸 Total photos now:", globalPlants[currentPlant].photos.length);
      console.log("📦 Uploading to backend:", {
        plant_id: globalPlants[currentPlant].id,
        image_url: imgSrc,
        caption: comments || ''
      });

      try {
        const response = await fetch('/api/add-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
          },
          credentials: 'include',
          body: JSON.stringify({
            plant_id: globalPlants[currentPlant].id,
            image_url: imgSrc,
            caption: comments || ''
          })
        });
    
        const result = await response.json();
        if (response.ok) {
          console.log("✅ Photo saved to backend:", result);
        } else {
          console.error("❌ Upload failed:", result);
        }
      } catch (err) {
        console.error("⚠️ Error uploading photo:", err);
      }

      // Update display
      updatePhotoDisplay(currentPlant);

      photoForm.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('pictureModal'));
      document.activeElement?.blur();
      modal?.hide();
    };
    reader.readAsDataURL(file);
  });
}

function updatePhotoDisplay(currentPlant) {
  const picDiv = document.getElementById('picDiv');
  if (!currentPlant || !globalPlants[currentPlant]) {
    picDiv.innerHTML = `<p class="text-white">Select a plant to view its photos.</p>`;
    console.warn("🌿 No plant selected for photo display.");
    return;
  }

  const photos = globalPlants[currentPlant].photos;
  if (!photos || photos.length === 0) {
    picDiv.innerHTML = `<p class="text-white">No photos available.</p>`;
    console.info("📷 No photos to display for:", currentPlant);
    return;
  }

  console.log(`🖼️ Displaying ${photos.length} photos for ${currentPlant}`);

  // Reverse the array so the latest photo appears first
  const carouselItems = photos.slice().reverse().map((photo, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}">
      <div class="card photo-card mb-3 bg-light text-dark">
        <div class="card-body text-center">
          <p class="card-text"><small>${photo.date}</small></p>
          <img src="${photo.src}" class="card-img-top photo-img mb-2" alt="Plant photo ${photos.length - i}">
          ${photo.comments ? `<p class="card-text"><strong>Comments:</strong> ${photo.comments}</p>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  picDiv.innerHTML = `
    <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        ${carouselItems}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  `;
}

/**
 * 
 * Notifications Center render
 */

function renderNotifications(notifications) {
  const container = document.getElementById('notification-container');
  if (!container) return;

  container.innerHTML = ''; // Clear container first

  if (!notifications || notifications.length === 0) {
    container.innerHTML = `
      <li class="list-group-item bg-dark text-white text-center">
        <strong>No new notifications</strong>
      </li>
    `;
    return;
  }

  notifications.forEach(notif => {
    console.log(`📨 Notification: ${notif.sender} -> ${notif.message}`);
    const item = document.createElement('li');
    item.className = 'list-group-item bg-dark text-white d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <div>
        <strong>${notif.sender}</strong>: ${notif.message}<br>
        <small class="text-muted">${notif.timestamp}</small>
      </div>
      <button class="btn btn-sm btn-outline-light">Dismiss</button>
    `;

    // Add remove notification option
    item.querySelector('button').addEventListener('click', () => {
      item.remove();
      if (container.children.length === 0) {
        container.innerHTML = `
          <li class="list-group-item bg-dark text-white text-center">
            <strong>No new notifications</strong>
          </li>
        `;
      }
    });
    container.appendChild(item);
  });
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
      document.activeElement?.blur();
      modal?.hide();
    }

    // Redraw the water tracking graph
    drawWaterGraph(name);
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
      document.activeElement?.blur();
      modal?.hide();
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
    document.activeElement?.blur();
    modal?.hide();
    
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
        document.getElementById("accountModalContent").innerHTML = html;
        initialiseSettingsForm();
      })
      .catch(error => {
        document.getElementById("accountModalContent").innerHTML = `
          <div class="modal_main_section text-danger">Failed to load settings content.</div>
        `;
        console.error("Error loading settings:", error);
      });
  });
}
function initialiseSettingsForm() {
  const form = document.getElementById("userSettingsForm");
  let saveBtn = document.getElementById("saveUserSettings");

  if (!form || !saveBtn) return;

  const profile = JSON.parse(localStorage.getItem('user_profile'));
  if (profile?.settings) {
    const profilePublicCheckbox = document.getElementById("profilePublic");
    const allowFriendRequestsCheckbox = document.getElementById("allowFriendRequests");
    if (profilePublicCheckbox) {
      profilePublicCheckbox.checked = profile.settings.is_profile_public;
    }
    if (allowFriendRequestsCheckbox) {
      allowFriendRequestsCheckbox.checked = profile.settings.allow_friend_requests;
    }
  }

  saveBtn.replaceWith(saveBtn.cloneNode(true));
  saveBtn = document.getElementById("saveUserSettings");

  saveBtn.addEventListener("click", async () => {
    const data = {
      is_profile_public: form.publicProfile.checked,
      allow_friend_requests: form.allowFriendRequests.checked
    };

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updated = await response.json();
        alert("✅ Settings saved.");
        localStorage.setItem('user_profile', JSON.stringify({
          ...profile,
          settings: updated.settings
        }));
      } else {
        alert("❌ Could not save settings.");
      }
    } catch (err) {
      console.error("Settings update failed:", err);
    }
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
  
  const notifModal = document.getElementById('notificationsModal');
  if (notifModal) {
    notifModal.addEventListener('show.bs.modal', () => {
      console.log("📬 Notification modal opened");
      loadNotifications();
    });
  }
});

document.getElementById('waterForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const plantName = getCurrentActivePlantName();
  if (!plantName) return;

  const waterDate = document.getElementById('waterDate').value;
  
  // Initialize water data array if it doesn't exist
  if (!globalPlants[plantName].waterData) {
      globalPlants[plantName].waterData = [];
  }
  
  // Add water data
  globalPlants[plantName].waterData.push({
      date: waterDate,
      watered: true
  });

  // Redraw the water tracking graph
  drawWaterGraph(plantName);
  
  // Close the modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('waterModal'));
  modal.hide();
});