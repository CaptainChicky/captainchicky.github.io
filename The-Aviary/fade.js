// does fade stuff when clicking on buttons that have the loadPage trigger
function loadPage(event) {
    event.preventDefault();
    var targetUrl = event.target.href;

    // Fade out current content
    var content = document.getElementById("fadeContent");
    content.style.opacity = "0";
    content.style.transition = "opacity 0.8s";

    setTimeout(function () {
        // Fetch the new page
        fetch(targetUrl)
            .then(response => response.text())
            .then(html => {
                // Parse the HTML
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Extract and update content
                var newContent = doc.getElementById("fadeContent");
                if (newContent) {
                    content.innerHTML = newContent.innerHTML;
                }

                // Update title
                var newTitle = doc.querySelector('title');
                if (newTitle) {
                    document.title = newTitle.textContent;
                }

                // Update header
                var newHeader = doc.getElementById("header");
                var currentHeader = document.getElementById("header");
                if (newHeader && currentHeader) {
                    currentHeader.innerHTML = newHeader.innerHTML;
                }

                // Update the URL (remove .html extension)
                var cleanUrl = targetUrl.replace(/\.html$/, '');

                // Special case: if it's index, use root path
                if (cleanUrl.endsWith('/index')) {
                    cleanUrl = cleanUrl.replace(/\/index$/, '/');
                } else if (cleanUrl === 'index') {
                    cleanUrl = './';
                }

                history.pushState(null, '', targetUrl);

                // Fade in new content
                content.style.opacity = "0";
                requestAnimationFrame(function () {
                    content.style.transition = "opacity 0.8s";
                    content.style.opacity = "1";
                });
            })
            .catch(error => {
                // If fetch fails, just navigate normally
                console.error('Fetch error:', error);
                window.location = targetUrl;
            });
    }, 300);
}

// Handle back/forward buttons for the fading thing
window.addEventListener('popstate', function (event) {
    var content = document.getElementById("fadeContent");
    content.style.opacity = "0";
    content.style.transition = "opacity 0.8s";

    setTimeout(function () {
        // Get current URL and add .html back for fetching
        var fetchUrl = window.location.pathname;

        // If it's root or ends with /, fetch index.html
        if (fetchUrl === '/' || fetchUrl.endsWith('/')) {
            fetchUrl += 'index.html';
        } else if (!fetchUrl.endsWith('.html')) {
            fetchUrl += '.html';
        }

        fetch(fetchUrl)
            .then(response => response.text())
            .then(html => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Update content
                var newContent = doc.getElementById("fadeContent");
                if (newContent) {
                    content.innerHTML = newContent.innerHTML;
                }

                // Update title
                var newTitle = doc.querySelector('title');
                if (newTitle) {
                    document.title = newTitle.textContent;
                }

                // Update header
                var newHeader = doc.getElementById("header");
                var currentHeader = document.getElementById("header");
                if (newHeader && currentHeader) {
                    currentHeader.innerHTML = newHeader.innerHTML;
                }

                // Fade in
                content.style.opacity = "0";
                requestAnimationFrame(function () {
                    content.style.transition = "opacity 0.8s";
                    content.style.opacity = "1";
                });
            })
            .catch(error => {
                // Reload the page if fetch fails
                window.location.reload();
            });
    }, 300);
});


// Globally conserved back to top button code, cubic tween
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'back2TopBtn') {
        e.preventDefault();
        smoothScrollTo(0, 1100);
    }
});

function smoothScrollTo(targetPosition, duration) {
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime = null;

    function scrollAnimation(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }
        var elapsedTime = currentTime - startTime;
        var scrollProgress = easeInOutCubic(elapsedTime, startPosition, distance, duration);
        window.scrollTo(0, scrollProgress);
        if (elapsedTime < duration) {
            requestAnimationFrame(scrollAnimation);
        }
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t + b;
        } else {
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }
    }

    requestAnimationFrame(scrollAnimation);
}


// globally conserved header script as well lol
document.addEventListener('DOMContentLoaded', function () {

    // scroll direction
    let ScrollDir = false; // false = down, true = up
    var GlobalScrollDownPos = window.pageYOffset || document.documentElement.scrollTop;
    let lastScrollTop = 0;

    function detectScrollDirection() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            ScrollDir = false;
            GlobalScrollDownPos = currentScrollTop;
        } else {
            // Scrolling up
            ScrollDir = true;
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For mobile or negative scrolling
    }

    // Attach the function to the scroll event
    window.addEventListener('scroll', detectScrollDirection);

    // if the user scrolls up from anywhere on the page more than 400px, show the header
    window.addEventListener('scroll', function () {
        var currentScrollPos = window.pageYOffset;
        var scrollUpMaxDist = 250;

        // note that global scroll pos should be greater than current if scrolling up
        // since the more you scroll down, the more the yoffset increases
        if (ScrollDir && (GlobalScrollDownPos - currentScrollPos) > scrollUpMaxDist) {
            header.classList.remove('hidden');
        }
    });

    // hide header on scroll down, show on scroll up at set distances
    var header = document.getElementById('header');

    window.addEventListener('scroll', function () {
        var currentScrollPos = window.pageYOffset;
        var scrollDownDistance = 400; // these values are in pixels
        var scrollUpDistance = 150;

        if (!ScrollDir && currentScrollPos > scrollDownDistance) {
            header.classList.add('hidden');
        } else if (ScrollDir && currentScrollPos < scrollUpDistance) {
            header.classList.remove('hidden');
        }
    });
});

// globally conserved function to scroll to top when navving different page btns
document.addEventListener("click", function(e) {
    // Check if clicked element is any of the page navigation buttons
    if (e.target && (e.target.id === "WelcomePageBtn" || e.target.id === "PhotosPageBtn" || e.target.id === "BackWelcomePageBtn")) {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }
});