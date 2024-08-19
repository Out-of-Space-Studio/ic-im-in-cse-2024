window.addEventListener("load", function () {
    var table = document.querySelector("table");
    var container = document.querySelector(".calendar-container");
    var scale = Math.min(
        container.clientWidth / table.offsetWidth,
        container.clientHeight / table.offsetHeight
    );
    table.style.transform = "scale(" + scale + ")";
});
