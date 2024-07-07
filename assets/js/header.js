document.addEventListener('DOMContentLoaded', function() {
    // to close the navbar stuff
    document.addEventListener("click", function (event) {
        var header = document.querySelector(".header");
        var isClickInside = header.contains(event.target);
        var menuBtn = document.getElementById("menu-btn");
        var menu = document.querySelector('.menu');

        if (!isClickInside && menuBtn.checked) {
            menuBtn.checked = false;
            menu.style.display = 'none';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                });
                // Close menu after clicking a link (for mobile)
                var menuBtn = document.getElementById("menu-btn");
                if (menuBtn.checked) {
                    menuBtn.checked = false;
                    document.querySelector('.menu').style.display = 'none';
                }
            }
        });
    });

    // Header scroll effect
    var header = document.querySelector(".header");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Toggle menu visibility when checkbox is changed
    var menuBtn = document.getElementById("menu-btn");
    var menu = document.querySelector('.menu');
    menuBtn.addEventListener('change', function() {
        menu.style.display = this.checked ? 'block' : 'none';
    });

    console.log('Header script loaded and running');
});