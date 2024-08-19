window.addEventListener("load", function () {
    var table = document.querySelector("table");
    var container = document.querySelector(".calendar-container");
    var scale = Math.min(
        (container.clientWidth - 100) / (table.offsetWidth - 100), // Subtract date column width
        container.clientHeight / table.offsetHeight
    );
    table.style.transform = "scale(" + scale + ")";
});
