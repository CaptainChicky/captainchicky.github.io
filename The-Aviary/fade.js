function loadPage(event) {
    event.preventDefault(); // Prevent the default behavior of the hyperlink

    // Fade out the current page content
    var content = document.getElementById("fadeContent");
    content.style.opacity = "0"; // we're fading to 0 and not to 0.2 bec we're skipping the 500ms animation
    content.style.transition = "opacity 0.8s";

    // After a short delay, load the new page and fade it in
    setTimeout(function () {
        window.location = event.target.href;
    }, 300); // 0.3 seconds delay, skipping 500ms animation to make it more smooth
}
