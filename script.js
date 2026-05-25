// Shared DOM references used by the navigation and footer scripts.
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a[href^='#']");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile navigation: open/close the menu and make Escape/resize behave cleanly.
if (navToggle && navLinks) {
  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

// Active navigation state: highlights the section currently near the top of the page.
const sections = [...document.querySelectorAll("main section[id]")];

const updateActiveLink = () => {
  const currentSection = [...sections].reverse().find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 120;
  });

  navItems.forEach((link) => {
    const isActive = currentSection && link.getAttribute("href") === `#${currentSection.id}`;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if (sections.length > 0) {
  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
}
