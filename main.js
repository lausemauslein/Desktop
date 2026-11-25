
var topBar = document.querySelector("#top");
var biggestIndex = 1;
var selectedIcon = undefined;


function initializeIcon(name) {
  var icon = document.querySelector("#" + name + "Icon");
  var screen = document.querySelector("#" + name);
  if (icon && screen) {
    icon.addEventListener("click", function() {
      handleIconTap(icon, screen);
    });
  }
}

function initializeWindow(name) {
  var screen = document.querySelector("#" + name);
  if (screen) {
    dragElement(screen);
    addWindowTapHandling(screen);
    makeClosable(name + "close", screen);
    initializeIcon(name);
  }
}

initializeWindow("notes");
initializeWindow("weather");
initializeWindow("calculator")
initializeWindow("map")

var welcomeScreen = document.querySelector("#window");
if (welcomeScreen) {
  dragElement(welcomeScreen);
  addWindowTapHandling(welcomeScreen);
  makeClosable("close", welcomeScreen);
}

var screenyOpen = document.querySelector("#open");
if (screenyOpen) {
  screenyOpen.addEventListener("click", function() {
    openWindow(welcomeScreen);
  });
}


/* Drag Element */
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var header = elmnt.querySelector(".windowheader");
  
  if (header) {
    header.onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    handleWindowTap(elmnt);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


/* Window Open/Close Functions */
function closeWindow(element) {
  element.style.display = "none";
}

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) topBar.style.zIndex = biggestIndex + 1;
}

function makeClosable(closeButtonId, targetScreen) {
  var closeBtn = document.querySelector("#" + closeButtonId);
  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      closeWindow(targetScreen);
    });
  }
}

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) topBar.style.zIndex = biggestIndex + 1;
  if (selectedIcon) deselectIcon(selectedIcon);
}


/* App Icon Selection */
function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
  }
  selectedIcon = undefined;
}

function handleIconTap(iconElement, windowElement) {
  if (iconElement.classList.contains("selected")) {
    deselectIcon(iconElement);
    openWindow(windowElement);
  } else {
    if (selectedIcon) deselectIcon(selectedIcon);
    selectIcon(iconElement);
    openWindow(windowElement);
  }
}


/* Time */
function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#Right");
  if (timeText) {
    timeText.innerHTML = currentTime;
  }
}
updateTime();
setInterval(updateTime, 1000);


/* To-Do List  */
const inputBox = document.getElementById("input_box");
const listContainter = document.getElementById("list_containter");

function addTask() {
  if (inputBox.value === '') {
    alert("Please enter a task");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainter.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
}

listContainter.addEventListener("click", function(e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
  }
});

/* Weather */
const apiKey = "15fd7c65f68584631e7eaa9d60d6f872";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input")
const searchBtn = document.querySelector(".search button")
const weatherIcon = document.querySelector(".weather_icon")
const inputLocation = document.getElementById("location");

async function checkWeather(city){
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if(response.status == 404){
    document.querySelector(".error").style.display = "flex";
    document.querySelector(".weather_display").style.display = "none";
  }else{
    var data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity_text").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind_text").innerHTML = data.wind.speed + " km/h";

    if(data.weather[0].main == "Clouds"){
      weatherIcon.src = "cloudy.png";
    } else if(data.weather[0].main == "Clear"){
      weatherIcon.src = "clear.png";
    } else if(data.weather[0].main == "Rain"){
      weatherIcon.src = "rain.png";
    } else if(data.weather[0].main == "Drizzle"){
      weatherIcon.src = "rain.png";
    } else if(data.weather[0].main == "Mist"){
      weatherIcon.src = "misty.png";
    } else if(data.weather[0].main == "Snow"){
      weatherIcon.src = "snow.png"
    } else{
      weatherIcon = data.weather[0].main
    }

    document.querySelector(".weather_display").style.display = "flex";
    document.querySelector(".error").style.display = "none";
  }

  inputLocation.value = "";

}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});

/* Map */
