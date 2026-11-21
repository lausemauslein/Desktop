

dragElement(document.getElementById("window"));
dragElement(document.getElementById("notes"));

var welcomeScreen = document.querySelector("#window");
var notesScreen = document.querySelector("#notes");
var topBar = document.querySelector("#top");
var biggestIndex = 1;

/* Setup Window Tap Handling & Closable triggers */
addWindowTapHandling(welcomeScreen);
addWindowTapHandling(notesScreen);

makeClosable("close", welcomeScreen);
makeClosable("notesclose", notesScreen);

/* Opening and Closing Triggers */
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

/* Time */
function updateTime(){
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#Right");
  if (timeText) {
    timeText.innerHTML = currentTime;
  }
}
setInterval(updateTime, 1000);

/* App Icon Selection*/
var selectedIcon = undefined;

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

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
  } else {
    selectIcon(element);
    openWindow(notesScreen);
  }
}

const inputBox = document.getElementById("input_box");
const listContainter = document.getElementById("list_containter");

function addTask(){
  if(inputBox.value === ''){
    alert("Please enter a task")
  }else{
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainter.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value - "";
}

listContainter.addEventListener("click", function(e){
  if(e.target.tagName === "LI"){
    e.target.classList.toggle("checked");
  }else if(e.target.tagName === "SPAN"){
    e.target.parentElement.remove();
  }
})
