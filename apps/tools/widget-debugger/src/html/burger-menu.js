// The javascript script we're running to make the burger button with navigation works on mobile
document.addEventListener("DOMContentLoaded", function () {
  const burgerMenu = document.querySelector(".burger-menu");
  const navbarNav = document.querySelector(".navbar-nav");

  if (!burgerMenu || !navbarNav) {
    return;
  }

  burgerMenu.addEventListener("click", function () {
    burgerMenu.classList.toggle("active");
    navbarNav.classList.toggle("active");
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      burgerMenu.classList.remove("active");
      navbarNav.classList.remove("active");
    });
  });

  document.addEventListener("click", function (event) {
    const isClickInsideNav =
      navbarNav.contains(event.target) || burgerMenu.contains(event.target);
    if (!isClickInsideNav && navbarNav.classList.contains("active")) {
      burgerMenu.classList.remove("active");
      navbarNav.classList.remove("active");
    }
  });
});
