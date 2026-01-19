document.addEventListener("DOMContentLoaded", function(event) {

    const video = document.querySelector('#promo');
    const button = document.querySelector('.audio-button img')
    video.muted = true;
    button.addEventListener('click', function() {
    if (video.muted === true) {
        video.muted = false;
      }
      else if (video.muted === false) {
        video.muted = true;
      }
    });

    video.play();
});