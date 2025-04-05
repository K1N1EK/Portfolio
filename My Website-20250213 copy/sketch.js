let img1, img2, img3;
let plane1, plane2, plane3; // Store the positions and sizes of the planes
let links = ["./Project-page1.html", "./Project-page4.html", "./Project-page2.html"]; // Link URLs
let rayOrigin, rayDirection; // Ray origin and direction for raycasting

function preload() {
  img1 = loadImage('assets/homepage/gaev.jpg');
  img2 = loadImage('assets/homepage/solace.jpg');
  img3 = loadImage('assets/homepage/iom.jpg');
  img4 = loadImage('assets/homepage/mural.jpg');
  img5 = loadImage('assets/homepage/rat.jpg');
  img6 = loadImage('assets/homepage/naombooks.jpg');
  img7 = loadImage('assets/homepage/iwnat.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Plane positions, sizes, and links (increased size for planes)
  plane1 = { x: 800, y: 300, z: 600, width: 800, height: 0, link: links[0] }; // Larger planes
  plane2 = { x: -250, y: -40, z: 1000, width: 400, height: 0, link: links[1] }; // Larger planes
  plane3 = { x: -1000, y: 400, z: 300, width: 400, height: 0, link: links[2] }; // Larger planes
  
  // Calculate plane height based on aspect ratio of the images
  plane1.height = plane1.width / (img1.width / img1.height);
  plane2.height = plane2.width / (img2.width / img2.height);
  plane3.height = plane3.width / (img3.width / img3.height);
  
  camera(0, 0, 2000, 0, 0, 0, 0, 1, 0);
  
  // Initialize the ray origin and direction
  rayOrigin = createVector(0, 0, 0); // Start ray at the camera (default)
}

function draw() {
  background(255);
  noStroke();
  lights();
  orbitControl(); // To navigate with mouse
  
  // Update the ray based on the mouse position
  updateRay();

  // Draw the planes
  drawPlane(plane1, img1);
  drawPlane(plane2, img2);
  drawPlane(plane3, img3);

  push();
  translate(-1600, -200, 80);
  texture(img4);
  plane(1000, 668);
  pop();

  push();
  translate(1000, -500, -1000);
  texture(img5);
  plane(1500, 900);
  pop();

  push();
  translate(100, 800, -300);
  texture(img6);
  plane(707, 707);
  pop();

  push();
  translate(-900, -700, -400);
  texture(img7);
  plane(568, 297);
  pop();

  push();
  translate(-900, -700, -400);
  texture(img7);
  plane(568, 297);
  pop();
}

// Function to draw a plane with texture
function drawPlane(planeObj, img) {
  let aspectRatio = width / height; // Calculate the aspect ratio of the image
  let planeWidth = planeObj.width;
  let planeHeight = planeObj.height;
  
  push();
  translate(planeObj.x, planeObj.y, planeObj.z); // Move the plane to its position
  texture(img);
  plane(planeWidth, planeHeight); // Draw the plane with the correct size
  pop();
}

// Update the ray direction based on mouse position
function updateRay() {
  let mouse3D = createVector(mouseX - width / 2, mouseY - height / 2, 0); // 2D mouse position to 3D ray direction
  rayDirection = mouse3D.sub(rayOrigin).normalize(); // Normalize to get direction
}

// Check if the ray intersects any of the planes
function mousePressed() {
  if (rayIntersectsPlane(rayOrigin, rayDirection, plane1)) {
    window.location.href = plane1.link; // Redirects current window to the link of plane1
  }
  if (rayIntersectsPlane(rayOrigin, rayDirection, plane2)) {
    window.location.href = plane2.link; // Redirects current window to the link of plane2
  }
  if (rayIntersectsPlane(rayOrigin, rayDirection, plane3)) {
    window.location.href = plane3.link; // Redirects current window to the link of plane3
  }
}

// Ray-Plane intersection check (Basic method)
function rayIntersectsPlane(rayOrigin, rayDirection, planeObj) {
  let planeNormal = createVector(0, 1, 0); // Assuming planes are parallel to the XZ plane
  let planePoint = createVector(planeObj.x, planeObj.y, planeObj.z);
  
  // Ray equation: origin + direction * t
  // Plane equation: normal . (point - origin) = 0
  let denominator = rayDirection.dot(planeNormal);
  
  if (denominator == 0) return false; // Parallel to the plane (no intersection)
  
  let t = planePoint.sub(rayOrigin).dot(planeNormal) / denominator; // Distance to the plane
  
  if (t > 0) { // Ensure the ray is pointing towards the plane
    let intersection = rayOrigin.copy().add(rayDirection.copy().mult(t)); // Calculate intersection point
    return isMouseOverPlane(planeObj, intersection); // Check if the intersection point is within the plane's bounds
  }
  return false;
}

// Check if the intersection point is within the bounds of the plane
function isMouseOverPlane(planeObj, intersection) {
  let planeBounds = {
    minX: planeObj.x - planeObj.width / 2,
    maxX: planeObj.x + planeObj.width / 2,
    minY: planeObj.y - planeObj.height / 2,
    maxY: planeObj.y + planeObj.height / 2
  };

  // Convert 3D intersection point to 2D screen space
  let screenPos = createVector(map(intersection.x, -width / 2, width / 2, 0, width),
                               map(intersection.y, -height / 2, height / 2, 0, height));
  
  let minX = map(planeBounds.minX, -width / 2, width / 2, 0, width);
  let maxX = map(planeBounds.maxX, -width / 2, width / 2, 0, width);
  let minY = map(planeBounds.minY, -height / 2, height / 2, 0, height);
  let maxY = map(planeBounds.maxY, -height / 2, height / 2, 0, height);

  return screenPos.x > minX && screenPos.x < maxX && screenPos.y > minY && screenPos.y < maxY;
}

// Function to handle cursor change when hovering over a clickable area
function mouseMoved() {
  let isOverClickableArea = false;

  // Check if ray intersects with any plane and update the cursor
  if (rayIntersectsPlane(rayOrigin, rayDirection, plane1) ||
      rayIntersectsPlane(rayOrigin, rayDirection, plane2) ||
      rayIntersectsPlane(rayOrigin, rayDirection, plane3)) {
    isOverClickableArea = true;
  }

  // Change the cursor style based on whether we are hovering over a clickable area
  if (isOverClickableArea) {
    document.body.style.cursor = 'pointer'; // Change cursor to pointer when over a plane
  } else {
    document.body.style.cursor = 'default'; // Default cursor otherwise
  }
}