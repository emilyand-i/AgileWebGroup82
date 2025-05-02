// allow scroll of main-info from anywhere on the page
document.addEventListener('wheel', function(e) {
  e.preventDefault();
  const scroll_content = document.querySelector('.main-info');
  if (scroll_content) {
    scroll_content.scrollTop += e.deltaY;
  }
}, {passive:false});

function flipForm() {
  document.getElementById("form-wrapper").classList.toggle("flip");
}


function scrollToSignin() {
  const form = document.getElementById('form-wrapper');
  if (form) {
    form.scrollIntoView({behavior: 'smooth'});
  }
}


// Sign in && Register forms
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const fetch_login = await fetch('api/login', {
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
});




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
  const pic_diary = document.getElementById('user_diary');
  const style = window.getComputedStyle(graph_section);

  if (style.display == 'none') {
    graph_section.style.display = 'block';
    pic_diary.style.display = 'none';
  } else {
    graph_section.style.display = 'none'
  }
}

//Picture show Dropdown
function pic_show() {
  const pic_diary = document.getElementById('user_diary');
  const graph_section = document.getElementById('growth_graph');
  const style = window.getComputedStyle(user_diary);

  if (style.display == 'none') {
    pic_diary.style.display = 'block';
    graph_section.style.display = 'none';
  } else {
    pic_diary.style.display = 'none'
  }
}

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




//JAVASCRIPT FOR THE IMAGE HANDLING
//collect references of form, input and the display
document.addEventListener('DOMContentLoaded', function() {
  const photoForm = document.getElementById('photoForm');
  const input = document.getElementById('photoInput');
  const display = document.getElementById('display');

  photoForm.addEventListener('submit', function (e) {
    e.preventDefault(); //USE THIS TO STOP PAGE REFRESHING ON SUBMITS!
    e.stopPropagation();


    const file = input.files[0];
    if (!file) return; //Get the file uploaded by the user

    const plant_name = document.getElementById('plant_name').value
    const comments = document.getElementById('comments').value


    const reader = new FileReader(); // convert image so our site can use it
    reader.onload = function (event) {
      const imgSrc = event.target.result;
      const date = new Date().toLocaleString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }); //Neater display without seconds

      // Create a new card element for the photo
      // all photos will be displayed seperately and uniformly
      const card = document.createElement('div');
      card.className = 'card photo-card';

      cardHTML = `
      <p class="card-text">${date}</p>
      <div class="card-body">
        <img src="${imgSrc}" class="card-img-top photo-img" alt="Uploaded photo">
      `;
        // Only add Plant Name if user wrote it
      if (plant_name) {
        cardHTML += `<p class="card-text"><strong>Plant Name:</strong> ${plant_name}</p>`;
      }

        // Only add Comments if user wrote it
      if (comments) {
        cardHTML += `<p class="card-text"><strong>Comments:</strong> ${comments}</p>`;
      }

      // finalise the body card 
      cardHTML += `</div>`;
      card.innerHTML = cardHTML;

      display.prepend(card); // Newest first
      //to make it start with the oldests first we just need to append it
      //Not sure if we would like to consider option of switch photos apparance later
      // ie) By newest, By oldest toggle for the user to press

      //REMOVE WHEN IMPLEMENTING INTO OTHER FILES/FUNCTIONS
      console.log('image added to diary');
      photoForm.reset();
    };

    reader.readAsDataURL(file);
  });
});


// JavaScript for the Plant Growth Tracker
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('growthForm');
  const canvas = document.getElementById('graphCanvas');
  const ctx = canvas.getContext('2d');
  const plantSelector = document.getElementById('plantSelector');

  function addToDropdown(name) {
    // Make new option for the plant in the dropdown menu
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    plantSelector.appendChild(option);
  }

  plantSelector.addEventListener('change', () => {
    const selectedPlant = plantSelector.value;
    if (selectedPlant) {
      drawGraph(selectedPlant);
    } else {
      // Clear the canvas if no plant is selected
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  const plantData = {}; 
  // Store plant data in an object; Keys are plant names, values are arrays of dates & growth 
  // Example: { Plant42: [{date: ..., height: ...}], Bulbasaur: [...] }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('namePlant').value.trim();
    const date = document.getElementById('plantDate').value;
    const height = parseFloat(document.getElementById('plantHeight').value);

    //Don't add data if any field is empty or invalid
    if (!name || !date || isNaN(height)) return;
    
    // Create a new entry for the plant if it doesn't exist
    if (!plantData[name]) {
      plantData[name] = [];
      addToDropdown(name);
    }

    // Add the new info to plant's data array
    plantData[name].push({ date, height });

    // Sort the data by date
    // Therefore if older data is added, graph will still be correct
    plantData[name].sort((a, b) => new Date(a.date) - new Date(b.date));

    form.reset();
    if (plantSelector.value === name) {
      drawGraph(name); // Redraw if it's currently selected by our user
    }
  });


  function drawGraph(namePlant) {
    const data = plantData[namePlant];

    // we can only draw the graph if we have at least 2 data points
    if (!data || data.length < 2) return;

    // Clear current canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 70;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;

    const dates = data.map(d => new Date(d.date));
    const heights = data.map(d => d.height);


    // scale our graph based on the min and max values of our data
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

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding); //draw y-axis
    ctx.lineTo(canvas.width - padding, canvas.height - padding); //draw x-axis
    ctx.stroke(); //apply these lines to canvas

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

      ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw point
    });
    ctx.stroke();

    // Y-Axis label
    ctx.save(); // Save current state
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.font = "14px sans-serif";
    ctx.fillText("Height Grown", 0, 0);
    ctx.restore(); // Restore back to normal

    // X-Axis label
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Time Spent Growing", canvas.width / 2, canvas.height - 10);

    // Write Title linked to the plant name
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(`${namePlant}'s Growth Journey`, canvas.width / 2, padding - 15);
  }
});
