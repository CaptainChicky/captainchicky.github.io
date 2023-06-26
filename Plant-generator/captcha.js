// Get the elements
var button = document.querySelector('#l-s-v-b');
var overlay = document.querySelector('.popup-overlay');
var iframe = document.querySelector('.popup-iframe');
var closeButton = document.querySelector('.close-button');

// Function to open the popup
function verify() {
  overlay.style.display = 'flex';
  iframe.src = './captcha/index.html';
}

// Function to close the popup
function closePopup() {
  overlay.style.display = 'none';
  iframe.src = ''; // Reset the iframe source
}

// Add event listener for the close button
// no need to add one to the verify button because its already onclick there
closeButton.addEventListener('click', closePopup);