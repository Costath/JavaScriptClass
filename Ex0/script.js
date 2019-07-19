/*  JavaScript 6th Edition
    Chapter 10
    Chapter case

    Oak Top House
    Author: 
    Date:   

    Filename: script.js
*/

"use strict";

//GLOBAL VARIABLES
var zIndezCounter;
var pos = [];
var origin;
var waitForUser;

// perform setup tasks when page first loads
function setUpPage() {
   document.querySelector("nav ul li:first-of-type").addEventListener("click", loadSetup, false);
   document.querySelector("nav ul li:last-of-type").addEventListener("click", loadDirections, false);

   var moveableItems = document.querySelectorAll("#room div");
   zIndezCounter = moveableItems.length + 1;
   for (var i = 0; i < moveableItems.length; i++) {

      //disables IE10+ interface gestures (supports only mouse events with the ms prefix)
      moveableItems[i].style.msTouchAction = "none";
      moveableItems[i].style.touchAction = "none";

      moveableItems[i].addEventListener("msponterdown", startDrag, false);
      moveableItems[i].addEventListener("ponterdown", startDrag, false);
      
      if (moveableItems[i].addEventListener) {
         moveableItems[i].addEventListener("mousedown", startDrag, false);
         moveableItems[i].addEventListener("touchstart", startDrag, false);
      }else if (moveableItems[i].attachEvent) {
         moveableItems[i].attachEvent("onmousedown", startDrag);
      }
   }
}

// configure page to display Setup content
function loadSetup() {
   document.querySelector("nav ul li:first-of-type").className = "current";
   document.querySelector("nav ul li:last-of-type").className = "";
   document.getElementById("setup").style.display = "block";
   document.getElementById("location").style.display = "none";
   location.search = "";
}

// configure page to display Directions content
function loadDirections(string) {
   document.querySelector("nav ul li:first-of-type").className = "";
   document.querySelector("nav ul li:last-of-type").className = "current";
   document.getElementById("setup").style.display = "none";
   document.getElementById("location").style.display = "block";
   // geoTest();
   // To minimize data use, download map only if needed and not already downloaded
   if (typeof google !== 'object') {  //  has google been referenced? Is it an object?
      var script = document.createElement("script");
      script.scr = "https://maps.googleapis.com/maps/api/js?key=[KEY]]&callback=geoTest";
      document.body.appendChild(script);
   }
}

function geoTest() {
   waitForUser = setTimeout(fail, 10000); // 10000 ms = 10 seconds
   if (navigator.geolocation) { // Is geolocation available?
      navigator.geolocation.getCurrentPosition(createDirections, fail, {timeout: 10000}); //if successful, call createDirections(), if not, call fail(). After {timeout: n}, the browser stop looking for the location and keep going with script
   }else{
      fail();
   }
}

function createDirections(position) {
   clearTimeout(waitForUser);
   //console.log("Longitude: " + position.coords.longitude);
   //console.log("Latitude: " + position.coords.latitude);
   var currPosLat = position.coords.latitude;
   var currPosLng = position.coords.longitude;
   var mapOptions = {
      center: new google.maps.LatLng(currPosLat, currPosLng),
      zoom: 12
   };
   var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function fail() {
   //console.log("Geolocation information not available or not authorized");
   document.getElementById("map").innerHTML = "Unable to access your current location";
}

function startDrag(evt) {
   // set z-index to move selected element on the top of the others
   this.style.zIndex = zIndezCounter;
   // increment our z-index counter so the next selected element will be on top
   zIndezCounter++;

   if (evt.type !== "mousedown") {
      // ignore event specific to your device from firing
      evt.preventDefault();
      // TOUCH/MOVE MOVE EVENTS
      // touch events
      this.addEventListener("touchmove", moveDrag, false);
      //
      this.addEventListener("mspointermove", moveDrag, false);
      this.addEventListener("pointermove", moveDrag, false);
      //
      // TOUCH END EVENTS
      this.addEventListener("touchend", removeTouchListener, false);
      //
      this.addEventListener("mspointerup", moveDrag, false);
      this.addEventListener("pointerup", moveDrag, false);
   } else {
      this.addEventListener("mousemove", moveDrag, false);
      this.addEventListener("mouseup", removeDragListener, false);
   }

   pos = [this.offsetLeft, this.offsetTop];
   origin = getCoords(evt); // Get coordinates of mouse click and stores it in origin.
}

function moveDrag(evt) {
   var currentPos = getCoords(evt);
   var deltaX = currentPos[0] - origin[0]; // difference in X position from origin to current
   var deltaY = currentPos[1] - origin[1]; // difference in Y position from origin to current
   this.style.left = (pos[0] + deltaX) + "px"; // assings posX + deltaY + "px" to the left property
   this.style.top = (pos[1] + deltaY) + "px"; // assings posY + deltaY + "px" to the top property
}
// combines mouseX and mouseY coordinates into a single object
function getCoords(evt) {
   var coords = [];
   if (evt.targetTouches && evt.targetTouches.lenght) { // its says we are using touch
      var thisTouch = evt.targetTouches[0]; // gets position of first touch on the div
      coords[0] = thisTouch.clientX;
      coords[1] = thisTouch.clientY;
   }else {
      coords[0] = evt.clientX; // mouse X position
      coords[1] = evt.clientY; // mouse Y position
   }
   return coords;
}

function removeDragListener() {
   this.removeEventListener("mousemove", moveDrag, false);
   this.removeEventListener("mouseup", removeDragListener, false);
}

function removeTouchListener() {
   this.removeEventListener("touchmove", moveDrag, false);
   this.removeEventListener("mspointermove", moveDrag, false);
   this.removeEventListener("pointermove", removeTouchListener, false);

   this.removeEventListener("touchend", removeTouchListener, false);
   this.removeEventListener("mspointerup", removeTouchListener, false);
   this.removeEventListener("pointerup", removeTouchListener, false);
}

// run setUpPage() function when page finishes loading
window.addEventListener("load", setUpPage, false);