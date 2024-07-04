// BTT btn
document.addEventListener("DOMContentLoaded", function () {
    const backToTopButton = document.getElementById("back-to-top");

    if (!backToTopButton) {
        console.error("Back to top button not found in the DOM");
        return;
    }

    // Function to check scroll position and show/hide button
    function toggleBackToTopButton() {
        if (window.scrollY > 300 || window.pageYOffSet > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }

    // Function to scroll to top
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // Throttle function to limit how often a function can fire
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // Add scroll event listener with throttling
    window.addEventListener("scroll", throttle(toggleBackToTopButton, 100));

    // Add click event listener to the button
    backToTopButton.addEventListener("click", scrollToTop);

    // Initial check to see if button should be displayed
    toggleBackToTopButton();

    console.log("Back to top button functionality initialized");
});

// to close the navbar stuff
document.addEventListener("click", function (event) {
    const isClickInside = document
        .querySelector(".header")
        .contains(event.target);
    const menuBtn = document.getElementById("menu-btn");

    if (!isClickInside && menuBtn.checked) {
        menuBtn.checked = false;
    }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});