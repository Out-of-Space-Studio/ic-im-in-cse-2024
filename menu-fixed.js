// To close the navbar stuff
document.addEventListener('click', function(event) {
    var isClickInside = document.querySelector('.header').contains(event.target);
    var menuBtn = document.getElementById('menu-btn');
    
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

window.addEventListener('scroll', function() {
    var header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});