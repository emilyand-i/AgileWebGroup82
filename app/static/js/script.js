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

function drawGraph(plantName) {
  console.log('🎨 drawGraph called for:', plantName);

  // Debounce redraws to avoid rapid execution
  if (window.drawGraphTimeout) {
      clearTimeout(window.drawGraphTimeout);
  }

  window.drawGraphTimeout = setTimeout(() => {
      const chartCanvas = document.getElementById('plantGrowthGraph');
      if (!chartCanvas) {
          console.error('❌ Canvas element not found');
          return;
      }

      // Destroy existing chart and clear reference
      if (window.growthChart) {
          console.log('🗑️ Destroying existing chart');
          window.growthChart.destroy();
          window.growthChart = null;
      }

      const data = globalPlants.growthData?.[plantName] || [];
      console.log('📊 Growth data array:', data);
      console.log('📊 Number of data points:', data.length);
      console.log('📊 Raw data points:', JSON.stringify(data, null, 2));

      requestAnimationFrame(() => {
          if (!data || data.length < 2) {
              console.log('⚠️ Insufficient data points, showing empty chart');
              window.growthChart = new Chart(chartCanvas, {
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
                              text: 'Add At Least 2 Growth Points',
                              color: 'white',
                              font: {
                                  size: 16
                              }
                          }
                      }
                  }
              });
              return;
          }

          // Process data for chart
          const dates = data.map(d => new Date(d.date).toLocaleDateString());
          const heights = data.map(d => d.height);

          console.log('📅 Processed dates:', dates);
          console.log('📏 Processed heights:', heights);

          // Create new chart instance
          window.growthChart = new Chart(chartCanvas, {
              type: 'line',
              data: {
                  labels: dates,
                  datasets: [{
                      label: 'Plant Growthy',
                      data: heights,
                      borderColor: '#28a745',
                      color: '#28a745',
                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      tension: 0.3,
                      fill: true
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      title: {
                          display: true,
                          text: `${plantName}'s Growth Journey`,
                          color: 'white',
                          font: {
                              size: 16
                          }
                      },
                      legend: {
                          display: false
                      },
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          ticks: { color: 'white' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                      },
                      x: {
                          ticks: { color: 'white' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                      }
                  }
              }
          });
      });

  }, 100); // 100ms delay to debounce frequent redraws
}


function drawWaterGraph(namePlant) {
    console.log("💧 DRAW WATER GRAPH CALLED for:", namePlant);
    
    const chartCanvas = document.getElementById('waterTrackingGraph');
    if (!chartCanvas) {
        console.error('❌ Water tracking canvas element not found');
        return;
    }

    const plant = globalPlants[namePlant];
    if (!plant) {
        console.warn("⚠️ No plant object found in globalPlants for:", namePlant);
        return;
    }

    if (!plant.waterData) {
        console.warn("🚫 plant.waterData is missing for:", namePlant);
        return;
    }

    console.log("🌿 plant.waterData:", JSON.stringify(plant.waterData, null, 2));

    // Destroy existing chart if it exists
    if (waterChart) {
        waterChart.destroy();
        console.log("🗑️ Existing water chart destroyed");
    }

    // Prepare data
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const dates = [];
    const waterValues = [];

    for (let d = new Date(sevenDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dStr = d.toLocaleDateString();
        dates.push(dStr);

        const wasWatered = plant.waterData.some(water => {
            const waterDateStr = new Date(water.date).toLocaleDateString();
            const match = waterDateStr === dStr;
            console.log(`📅 Comparing ${waterDateStr} to ${dStr} => ${match}`);
            return match;
        });

        waterValues.push(wasWatered ? 1 : 0);
    }

    console.log("📆 Chart Dates:", dates);
    console.log("💧 Chart Values:", waterValues);

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
                    text: `${namePlant}'s Watering History`,
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
                        callback: value => value === 1 ? '💧' : ''
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

    console.log("✅ WATER CHART RENDERED with", waterValues.filter(v => v === 1).length, "watering days");
}


function deactivateAllTabs() {
  document.querySelectorAll('.nav-link').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active', 'show');
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

function toggleFullscreen() {
  const picsAndGraphs = document.getElementById('picsAndGraphs');
  const leftCol = document.querySelector('.left_col');
  const rightCol = document.querySelector('.right_col');
  const picDiv = document.getElementById('picDiv');
  const currentPlant = getCurrentActivePlantName();

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
    picsAndGraphs.classList.toggle('fullscreen');
    picsAndGraphs.classList.remove('flex-column');
    picsAndGraphs.classList.add('gap-5', 'p-5');
    leftCol.classList.remove('col-3');
    leftCol.classList.add('col-12', 'vh-100');
    rightCol.classList.add('d-none');
    picDiv.classList.add('fullscreen');
  } else {
    // Exit fullscreen
    picsAndGraphs.classList.toggle('fullscreen');
    picsAndGraphs.classList.add('flex-column');
    picsAndGraphs.classList.remove('gap-5', 'p-5');
    leftCol.classList.remove('col-12', 'vh-100');
    leftCol.classList.add('col-3');
    rightCol.classList.remove('d-none');
    picDiv.classList.remove('fullscreen');
    
    // Give DOM time to adjust before redrawing charts
    setTimeout(() => {
      if (currentPlant) {
        // Force chart canvas to reset dimensions
        const growthCanvas = document.getElementById('plantGrowthGraph');
        const waterCanvas = document.getElementById('waterTrackingGraph');
        
        if (growthCanvas) {
          // Force chart redraw with proper dimensions
          if (window.growthChart) {
            window.growthChart.destroy();
          }
          drawGraph(currentPlant);
        }
        
        if (waterCanvas) {
          // Force chart redraw with proper dimensions
          if (waterChart) {
            waterChart.destroy();
          }
          drawWaterGraph(currentPlant);
        }
        
        // Update photo display
        updatePhotoDisplay(currentPlant);
      }
    }, 250); // Delay to let DOM adjust
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
        const slimProfile = { ...data };

        if (slimProfile.photos) {
          slimProfile.photos = slimProfile.photos.map(photo => ({
            photo_id: photo.photo_id,
            image_url: photo.image_url.startsWith('data:image') ? '' : photo.image_url,
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
      // Show success modal instead of alert
      showSuccessModal(username);
    } else {
      alert(signup_data.error || 'Signup error. Please check details.')
    }
  });
}

// Add this new function for showing the success modal
function showSuccessModal(username) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('signupSuccessModal');
  if (!modal) {
    const modalHtml = `
      <div class="modal fade" id="signupSuccessModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header border-0">
              <h5 class="modal-title" id="successModalLabel">Account Created!</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
              </div>
              <h4>Welcome, <span id="welcomeUsername"></span>!</h4>
              <p class="mb-0">Your account has been successfully created.</p>
              <p>You can now log in to start your gardening journey!</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <button type="button" class="btn btn-success px-4" id="goToLoginBtn">Go to Login</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Append modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    modal = document.getElementById('signupSuccessModal');
  }
  
  // Set username in the modal
  document.getElementById('welcomeUsername').textContent = username;
  
  // Initialize modal
  const successModal = new bootstrap.Modal(modal);
  successModal.show();
  
  document.getElementById('goToLoginBtn').addEventListener('click', function() {
    successModal.hide();
    setTimeout(() => {
      flipForm(); // Add small delay to ensure modal is hidden first
    }, 100);
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


// ✅ JavaScript: Final `addFriend` Function
window.addFriendByUsername = async function(username) {
  try {
    console.log("📤 Sending follow request for:", username);
    console.log("🔐 Using CSRF token:", csrfToken);

    const response = await fetch('/api/add-friend', {
      method: 'POST',
      credentials: 'include',  // ✅ include cookies
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken  // ✅ CRUCIAL
      },
      body: JSON.stringify({ username })
    });

    const raw = await response.text();
    console.log("📥 Raw response:", raw);

    let result;
    try {
      result = JSON.parse(raw);
    } catch (e) {
      console.error("❌ Could not parse JSON:", e);
      alert("❌ Invalid response from server.");
      return;
    }

    if (response.ok) {
      alert(`✅ You're now following ${username}`);
      loadFriendsList();  // ✅ Refresh the friends list here
    }

    return result; // ✅ always return result to the caller
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    alert("❌ Could not follow user.");
    return { error: "Fetch failed" };  // return error for caller
  }
};

// 🔁 Used to get search input
function getSearchedUsername() {
  const input = document.getElementById("friendSearch");
  return input ? input.value.trim() : '';
}

// 🔍 Search and render results
function initialiseFriendSearch() {
  const input = document.getElementById("friendSearch");
  const button = document.getElementById("friendSearchButton");
  const results = document.getElementById("searchResults");

  if (!input || !button || !results) return;

  async function search() {
    const username = getSearchedUsername();
    results.innerHTML = '';

    if (!username) {
      results.innerHTML = `<li class="list-group-item text-danger">Please enter a username.</li>`;
      return;
    }

    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (!response.ok || data.results.length === 0) {
        results.innerHTML = `<li class="list-group-item text-muted">No user found.</li>`;
        return;
      }

      const match = data.results.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (!match) {
        results.innerHTML = `<li class="list-group-item text-muted">No exact match found.</li>`;
        return;
      }

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = match.username;

      const followBtn = document.createElement('button');
      followBtn.className = 'btn btn-sm btn-success';
      followBtn.textContent = 'Follow';

      followBtn.addEventListener('click', async () => {
        const result = await window.addFriendByUsername(match.username);

        if (result && !result.error) {
          followBtn.disabled = true;
          followBtn.textContent = '✔ Following';
        } else {
          alert(`❌ Could not follow: ${result.error || result.message || 'Unknown error'}`);
        }
      });

      li.appendChild(nameSpan);
      li.appendChild(followBtn);
      results.appendChild(li);

    } catch (err) {
      console.error("Search failed:", err);
      results.innerHTML = `<li class="list-group-item text-danger">Network error.</li>`;
    }
  }

  button.addEventListener('click', search);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') search();
  });
}

function loadFriendsList() {
  const friendsList = document.getElementById('friends-list');
  
  if (!friendsList) {
    console.error("❌ Element with ID 'friends-list' not found");
    return;
  }
  
  // Clear existing list
  friendsList.innerHTML = '';
  
  // Add loading indicator
  const loadingItem = document.createElement('li');
  loadingItem.className = 'list-group-item bg-dark text-white text-center';
  loadingItem.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Loading friends...';
  friendsList.appendChild(loadingItem);
  
  // Fetch friends from API
  fetch('/api/friends', { 
    credentials: 'include' 
  })
    .then(response => response.json())
    .then(data => {
      // Clear the loading indicator
      friendsList.innerHTML = '';
      
      // Check if we have friends
      if (!data.friends || data.friends.length === 0) {
        const noFriendsItem = document.createElement('li');
        noFriendsItem.className = 'list-group-item bg-dark text-white text-center';
        noFriendsItem.innerHTML = 'No friends added yet <i class="bi bi-emoji-smile ms-2"></i>';
        friendsList.appendChild(noFriendsItem);
        return;
      }
      
      // Add each friend to the list
      data.friends.forEach(friend => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item bg-dark text-white d-flex justify-content-between align-items-center';
        
        // Create the friend name/info element
        const nameElement = document.createElement('div');
        nameElement.className = 'd-flex align-items-center';
        nameElement.innerHTML = `
          <i class="bi bi-person-circle me-2"></i>
          <span>${friend.friend_username || friend}</span>
        `;
        
        // Create action buttons container
        const actionButtons = document.createElement('div');
        
        // Share button (was View profile button)
        const shareButton = document.createElement('button');
        shareButton.className = 'btn btn-sm btn-outline-success me-2';
        shareButton.innerHTML = '<i class="bi bi-share"></i>';
        shareButton.title = 'Share';
        shareButton.addEventListener('click', () => {
          // Create share functionality
          const friendName = friend.friend_username || friend;
          shareFriendProfile(friendName);
        });
        
        // Add buttons to container
        actionButtons.appendChild(shareButton);
        
        // Add elements to list item
        listItem.appendChild(nameElement);
        listItem.appendChild(actionButtons);
        
        // Add list item to friends list
        friendsList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('❌ Error loading friends:', error);
      friendsList.innerHTML = '';
      
      const errorItem = document.createElement('li');
      errorItem.className = 'list-group-item bg-dark text-white text-center';
      errorItem.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2 text-warning"></i>Error loading friends';
      friendsList.appendChild(errorItem);
    });
    
  // Add event listener for modal open if not already added
  const friendsModal = document.getElementById('friendsModal');
  if (friendsModal) {
    // Use once: false to ensure it's called every time the modal is shown
    friendsModal.removeEventListener('show.bs.modal', loadFriendsList);
    friendsModal.addEventListener('show.bs.modal', loadFriendsList);
  }
}

// Add this function to handle sharing a friend's profile
function shareFriendProfile(friendName) {
  // You can customize this modal or implement your preferred sharing method
  alert(`Share ${friendName}'s profile with others`);
  
  // For a more sophisticated approach, you could open a modal with sharing options
  // or implement actual sharing functionality based on your application's requirements
}

// Make sure the function is called when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Set up event listener for the friends modal
  const friendsModal = document.getElementById('friendsModal');
  if (friendsModal) {
    friendsModal.addEventListener('show.bs.modal', loadFriendsList);
  }
});

//remove freind
function removeFriend(friendId) {
  if (!friendId) {
    alert("❌ Friend ID is missing.");
    return;
  }

  if (!confirm("Are you sure you want to remove this friend?")) return;

  console.log("🧪 Sending friend ID:", friendId);

  fetch("/api/remove-friend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken  // ✅ Add this
    },
    credentials: "include",
    body: JSON.stringify({ friend_id: friendId })
  })
  .then(async (response) => {
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error("Expected JSON but got:\n" + text.slice(0, 200));
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown error occurred");
    }

    alert("✅ Friend removed successfully.");
    loadFriendsList(); // Refresh the UI
  })
  .catch((error) => {
    console.error("❌ Error removing friend:", error);
    alert("❌ Could not remove friend:\n" + error.message);
  });
}

async function loadAllUsers() {
  try {
    const response = await fetch('/api/users', {
      credentials: 'include'
    });
    if (!response.ok) throw new Error("Failed to fetch users");

    const data = await response.json();
    const searchResults = document.getElementById('searchResults');
    const noResultsMessage = document.getElementById('noSearchResultsMessage');
    searchResults.innerHTML = '';

    if (data.users.length === 0) {
      noResultsMessage.style.display = 'block';
      return;
    } else {
      noResultsMessage.style.display = 'none';
    }

    data.users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      listItem.innerHTML = `
        ${user.username}
        <button class="btn btn-sm btn-success" onclick="addFriend(${user.user_id}, '${user.username}')">Add</button>
      `;
      searchResults.appendChild(listItem);
    });
  } catch (err) {
    console.error("Error loading users:", err);
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

    console.log("🧪 Raw user data from /api/session:", user);
    console.log("🌱 user.plants:", user.plants?.length);
    console.log("📸 user.photos:", user.photos?.length);


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

    globalPlants = {};  // reset in case of reload

    // Add each plant to globalPlants
    updatedProfile.plants.forEach(plant => {
      globalPlants[plant.plant_name] = {
        id: plant.id,
        name: plant.plant_name,
        avatarSrc: plant.chosen_image_url,
        plantCategory: plant.plant_category,
        plantType: plant.plant_type,
        streakCount: plant.streak_count || 0,
        creationDate: plant.creation_date || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        photos: [],
        waterData: []
      };
    });

    // Assign photos to their plants
    updatedProfile.photos?.forEach(photo => {
      const plantEntry = Object.values(globalPlants).find(p => p.id === photo.plant_id);
      if (plantEntry) {
        plantEntry.photos = plantEntry.photos || [];
        plantEntry.photos.push({
          src: photo.image_url,
          date: new Date(photo.datetime_uploaded).toLocaleString(),
          comments: photo.caption || ''
        });
      } else {
        console.warn(`⚠️ Could not assign photo ${photo.photo_id} — plant not found`);
      }
    });

    console.log("✅ globalPlants populated in loadSession:", JSON.parse(JSON.stringify(globalPlants)));


    console.log("📦 Final globalPlants after loadSession:", JSON.parse(JSON.stringify(globalPlants)));

    Object.entries(globalPlants).forEach(([name, plant]) => {
      console.log(`🌿 Plant: ${name}, Photos count: ${plant.photos?.length || 0}`);
      if (plant.photos?.length > 0) {
        console.table(plant.photos.map((p, i) => ({
          Index: i,
          Date: p.date,
          SrcType: p.src?.slice(0, 30),
          Comment: p.comments
        })));
      }
    });

    


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



/**
 * DASHBOARD FUNCTIONALITY
 * Functions to load and handle dashboard content
 */

// Load dashboard content based on user profile
async function loadDashboard() {
  const profile = await loadSession();
  if (!window.location.pathname.includes('dashboard.html')) return;
  

  const username = profile.username || 'username';
  document.querySelector('.welcome_to').textContent = `Welcome to ${username}'s Garden`;
  

  loadNotifications();
  loadFriendsList();
  // Reset plant count when loading dashboard
  myPlantCount = 0;
  // Clear global plants dictionary to rebuild it from profile data
  // globalPlants = {};

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

  // Initialize growth data structure
  globalPlants.growthData = {};

  // Process growth entries from profile
  if (profile.growth_entries) {
      profile.growth_entries.forEach(entry => {
          if (!globalPlants.growthData[entry.plant_name]) {
              globalPlants.growthData[entry.plant_name] = [];
          }
          globalPlants.growthData[entry.plant_name].push({
              date: entry.date_recorded,
              height: entry.cm_grown
          });
      });

      // Sort growth data for each plant
      Object.keys(globalPlants.growthData).forEach(plantName => {
          globalPlants.growthData[plantName].sort((a, b) => 
              new Date(a.date) - new Date(b.date)
          );
      });
  }
  console.log("💧 profile.watering_entries:", profile.watering_entries);

  if (profile.watering_entries) {
    profile.watering_entries.forEach(entry => {
      const plant = globalPlants[entry.plant_name];
      if (plant) {
        if (!plant.waterData) plant.waterData = [];
        plant.waterData.push({ date: entry.date_watered });
      }
    });

    // Optional: sort dates per plant
    Object.values(globalPlants).forEach(plant => {
      if (plant.waterData) {
        plant.waterData.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    });
  }
  requestAnimationFrame(() => {
    const activeTab = document.querySelector('#plantTabs .nav-link.active');
    if (activeTab) {
        const plantName = activeTab.getAttribute('data-plant-name') || activeTab.textContent.trim();
        console.log('📊 Drawing graphs for active tab:', plantName);
        drawGraph(plantName);
        drawWaterGraph(plantName);
    } else if (profile.plants && profile.plants.length > 0) {
        // Fallback to first plant if no active tab
        const firstPlant = profile.plants[0].plant_name;
        drawGraph(firstPlant);
        drawWaterGraph(firstPlant);
    }
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
  const plantTabs = document.getElementById('plantTabs');
  const plantTabsContent = document.getElementById('plantTabsContent');

  if (!plantTabs || !plantTabsContent) {
    console.error("❌ Missing tab containers");
    return;
  }

  // 🧼 Deactivate all tabs
  document.querySelectorAll('#plantTabs .nav-link').forEach(tab => tab.classList.remove('active'));
  // 🧼 Deactivate all tab content panes
  document.querySelectorAll('#plantTabsContent .tab-pane').forEach(pane => {
    pane.classList.remove('active', 'show');
  });

  // 🧠 Store tabId and contentId into globalPlants
  if (globalPlants[plantName]) {
    globalPlants[plantName].tabId = tabId;
    globalPlants[plantName].contentId = contentId;
  }

  // Create the new tab button
  const newTab = document.createElement("li");
  newTab.role = "presentation";
  newTab.className = "nav-item";
  newTab.innerHTML = `
    <button class="nav-link active" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${contentId}" data-plant-name="${plantName}" type="button" role="tab"> 
      ${plantName}
    </button>`;

  // Create the new tab content
  const newTabContent = document.createElement("div");
  newTabContent.className = "tab-pane fade show active";
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

  // Insert before "Add Plant" tab
  const addPlantTab = document.getElementById("add-plant-tab")?.parentNode;
  if (addPlantTab) {
    plantTabs.insertBefore(newTab, addPlantTab);
    plantTabsContent.appendChild(newTabContent);

    // Bootstrap auto-shows active tab since we added `active show` above
    const tab = new bootstrap.Tab(newTab.querySelector('button'));
    tab.show();
  }

  updatePhotoDisplay(plantName);
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

      // Find the tab button element
      const tabButton = document.querySelector(`button[data-plant-name="${currentPlantName}"]`);
      if (!tabButton) {
        console.warn(`Could not find tab button for ${currentPlantName}`);
        return;
      }

      // Get the tab pane/content element
      const tabContentId = tabButton.getAttribute('data-bs-target')?.replace('#', '');
      const tabContent = document.getElementById(tabContentId);
      
      // Remove the tab and content elements
      tabButton.parentElement?.remove(); // Remove the li element containing the button
      tabContent?.remove();

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

      // Show another existing tab, if any
      const remainingTabs = document.querySelectorAll('#plantTabs .nav-link:not(#add-plant-tab)');
      if (remainingTabs.length > 0) {
        new bootstrap.Tab(remainingTabs[0]).show();
      }

      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('infoModal'));
      if (modal) {
        modal.hide();
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

      currentPlantName = null;
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
      const safeId = plantName.replace(/\s+/g, '_').toLowerCase();
      const tabId = `tab-${safeId}`;
      const contentId = `content-${safeId}`;
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

      window.location.reload();

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
    
    // Only proceed if tab is not "Add Plant" and already active
    if (!activeTab || activeTab.id.includes('add-plant') || !activeTab.classList.contains('active')) return;

    const plantName = activeTab.getAttribute("data-plant-name") || activeTab.textContent.trim();
    const plantData = globalPlants[plantName];

    if (!plantData) return;

    document.querySelectorAll('.plant-tab-content').forEach(tab => {
      tab.style.display = 'none';
    });

    // Show the selected one
    const tab = document.getElementById(`plant-tab-${plantName}`);
    if (tab) {
      tab.style.display = 'block';
    }

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

    // Ensure clean graph update
    if (growthChart) {
        growthChart.destroy();
        growthChart = null;
    }

    // Draw new graph
    requestAnimationFrame(() => {
        drawGraph(plantName);
    });

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
        plant_name: currentPlant,
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
            plant_name: currentPlant,
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
      modal.hide();
      document.activeElement?.blur(); 
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
    e.stopPropagation();

    console.log('💧 Water data submission triggered');

    const name = getCurrentActivePlantName();
    const date = document.getElementById('waterDate').value;

    console.log('📝 Submission details:', { name, date });
    console.log('🗃️ Current globalPlants[name].waterData state:',
        JSON.stringify(globalPlants[name]?.waterData || [], null, 2));

    if (!name || !date) {
      console.warn('❌ Submission failed: Missing plant name or date');
      alert('Please select a date');
      return;
    }

    // Submit to backend first
    submitWaterData(name, [date])
      .then(result => {
        console.log('✅ Backend save successful:', result);

        // Only update local data after successful backend save
        if (!globalPlants[name].waterData) {
          console.log('📦 Initializing water data array for:', name);
          globalPlants[name].waterData = [];
        }

        console.log('➕ Adding new watering date:', date);
        globalPlants[name].waterData.push(date);

        // Sort by date
        globalPlants[name].waterData.sort((a, b) => 
          new Date(a) - new Date(b)
        );

        globalPlants[name].lastUpdated = new Date().toISOString();

        // Clear form and close modal
        waterForm.reset();
        waterDateInput.valueAsDate = new Date();
        const modal = bootstrap.Modal.getInstance(document.getElementById('waterModal'));
        document.activeElement?.blur();
        modal?.hide();

        // Redraw the graph
        console.log('📈 Calling drawWaterGraph with updated data:',
          JSON.stringify(globalPlants[name].waterData, null, 2));
        drawWaterGraph(name);
      })
      .catch(error => {
        console.error('❌ Error submitting water data:', error);
        alert(error.message || 'Failed to save water data. Please try again.');
      });
  }



  function handleGrowthDataSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🌱 Growth data submission triggered');

    const name = getCurrentActivePlantName();
    const date = document.getElementById('growthDate').value;
    const height = parseFloat(document.getElementById('growthHeight').value);

    console.log('📝 Submission details:', { name, date, height });
    console.log('🗃️ Current globalPlants.growthData state:', 
        JSON.stringify(globalPlants.growthData, null, 2));

    if (!name || !date || isNaN(height)) {
        console.error('❌ Invalid form data');
        alert('Please fill in all fields correctly');
        return;
    }

    // Submit to backend first
    submitGrowthData(name, date, height)
        .then(result => {
            console.log('✅ Backend save successful:', result);

            // Only update local data after successful backend save
            if (!globalPlants.growthData[name]) {
                console.log('📦 Initializing growth data array for:', name);
                globalPlants.growthData[name] = [];
            }

            console.log('➕ Adding new data point:', { date, height });
            console.log('📊 Growth data before push:', 
                JSON.stringify(globalPlants.growthData[name], null, 2));

            // Add new data point
            globalPlants.growthData[name].push({
                date: date,
                height: height
            });

            console.log('📊 Growth data after push:', 
                JSON.stringify(globalPlants.growthData[name], null, 2));

            // Sort data by date
            globalPlants.growthData[name].sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );

            if (globalPlants[name]) {
                globalPlants[name].lastUpdated = new Date().toISOString();
            }

            // Clear form and close modal
            growthForm.reset();
            growthDateInput.valueAsDate = new Date();
            const modal = bootstrap.Modal.getInstance(document.getElementById('graphModal'));
            modal?.hide();
            document.activeElement?.blur();

            // Update graph
            console.log('📈 Calling drawGraph with final data:', 
                JSON.stringify(globalPlants.growthData[name], null, 2));
            drawGraph(name);
        })
        .catch(error => {
            console.error('❌ Error submitting growth data:', error);
            alert(error.message || 'Failed to save growth data. Please try again.');
        });
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
  
  // Initial population of dropdown
  populatePlantDropdown();
}

// Add these functions to script.js

// Update the submitGrowthData function with better error handling
function submitGrowthData(plantName, date, height) {
  console.log('Submitting growth data:', { plantName, date, height });
  
  return fetch('/api/add-growth', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
      },
      credentials: 'include',
      body: JSON.stringify({
          plant_name: plantName,
          date: date,
          height: height
      })
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(data => {
              throw new Error(data.error || 'Failed to save growth data');
          });
      }
      return response.json();
  });
}
function submitWaterData(plantName, wateringDates) {
  console.log('Submitting water data:', { plantName, wateringDates });

  return fetch('/api/add-watering', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken  // include your CSRF token here
    },
    credentials: 'include', // important if your backend uses sessions/cookies for auth
    body: JSON.stringify({
      plant_name: plantName,
      watering_dates: wateringDates
    })
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error || 'Failed to save watering data');
      });
    }
    return response.json();
  });
}





/**
 * SETTINGS & PREFERENCES
 * Functions to handle user settings and preferences
 */

// Initialise settings modal loading
function initialiseSettingsModal() {
  const modal = document.getElementById("user-settings-modal");
  if (!modal) return;

  modal.addEventListener("show.bs.modal", () => {
    fetch("User-Settings.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("accountModalContent").innerHTML = html;
        initialiseSettingsForm();
        initialiseFriendSearch();
        loadFriendsList();
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

  const friendsTabButton = document.getElementById('friends-tab');
  if (!friendsTabButton) {
    console.warn("⚠️ Element with ID 'friends-tab' not found.");
    return;
  }

  friendsTabButton.addEventListener('shown.bs.tab', () => {
    console.log("🔄 'Add Friend' tab activated");
    fetchAndDisplayUsers();
  });
  
  const notifModal = document.getElementById('notificationsModal');
  if (notifModal) {
    notifModal.addEventListener('show.bs.modal', () => {
      console.log("📬 Notification modal opened");
      loadNotifications();
    });
  }

  const friendModal = document.getElementById('friendsModal');
  if (friendModal) {
    friendModal.addEventListener('show.bs.modal', () => {
      console.log("Friend model opened");
      loadFriendsList();
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
  if (!globalPlants[plantName].waterData) {
    globalPlants[plantName].waterData = [];
  }
  globalPlants[plantName].waterData.push({ date: waterDate });


  // Redraw the water tracking graph
  drawWaterGraph(plantName);
  
  // Close the modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('waterModal'));
  modal.hide();
  document.activeElement?.blur();
});

function getCurrentSeason() {
    const date = new Date();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    
    // Southern Hemisphere seasons
    if (month >= 3 && month <= 5) return 'autumn';
    if (month >= 6 && month <= 8) return 'winter';
    if (month >= 9 && month <= 11) return 'spring';
    return 'summer'; // December to February
}

function updateSeasonDisplay() {
    const season = getCurrentSeason();
    const seasonPicture = document.getElementById('season-picture');
    const seasonSection = document.querySelector('.coming-soon-section');

    // Common style properties
    const commonStyles = `
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        border-radius: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 0.7;
        transition: all 0.3s ease;
        filter: brightness(0.9) saturate(1.1);
    `;

    if (season === 'autumn') {
        seasonPicture.innerHTML = `
            <img 
            src="assets/Seasons/autumn.jpeg" 
            alt="Autumn Season" 
            style="${commonStyles}">
        `;
        seasonSection.textContent = "Autumn Season";
    } else if (season === 'summer') {
        seasonPicture.innerHTML = `
            <img 
            src="assets/Seasons/summer.png" 
            alt="Summer Season" 
            style="${commonStyles}">
        `;
        seasonSection.textContent = "Summer Season";
    } else if (season === 'winter') {
        seasonPicture.innerHTML = `
            <img 
            src="assets/Seasons/winter.jpeg" 
            alt="Winter Season" 
            style="${commonStyles}">
        `;
        seasonSection.textContent = "Winter Season";
    } else if (season === 'spring') {
        seasonPicture.innerHTML = `
            <img 
            src="assets/Seasons/spring.jpeg" 
            alt="Spring Season" 
            style="${commonStyles}">
        `;
        seasonSection.textContent = "Spring Season";
    }

    // Add hover effect to the image
    const img = seasonPicture.querySelector('img');
    if (img) {
        img.addEventListener('mouseenter', () => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1.02)';
        });
        img.addEventListener('mouseleave', () => {
            img.style.opacity = '0.85';
            img.style.transform = 'scale(1)';
        });
    }
}
// Call when DOM is loaded
document.addEventListener('DOMContentLoaded', updateSeasonDisplay);
