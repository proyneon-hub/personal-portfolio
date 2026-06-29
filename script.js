// Shared DOM references used by the navigation and footer scripts.
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a[href^='#']");
const themeToggles = document.querySelectorAll(".theme-toggle");
const themeColor = document.querySelector("meta[name='theme-color']");
const year = document.querySelector("#year");
const themeStorageKey = "portfolio-theme";
const darkThemeColor = "#101112";
const lightThemeColor = "#172033";

if (year) {
  year.textContent = new Date().getFullYear();
}

const getStoredTheme = () => {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme persistence is optional; the visual toggle still works without it.
  }
};

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  const resolvedTheme = isDark ? "dark" : "light";
  document.documentElement.dataset.theme = resolvedTheme;

  themeToggles.forEach((themeToggle) => {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  });

  if (themeColor) {
    themeColor.setAttribute("content", isDark ? darkThemeColor : lightThemeColor);
  }
};

applyTheme(getPreferredTheme());

themeToggles.forEach((themeToggle) => {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });
});

// Mobile navigation: open/close the menu and make Escape/resize behave cleanly.
const closeMenu = () => {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
  document.body.classList.remove("nav-open");
};

if (navToggle && navLinks) {
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

// Resume dropdown in nav: click to open/close on desktop; always expanded on mobile via CSS.
const resumeWrapper = document.querySelector(".nav-resume-wrapper");
const resumeBtn = document.querySelector(".nav-resume-btn");

if (resumeWrapper && resumeBtn) {
  const closeDropdown = () => {
    resumeWrapper.removeAttribute("data-open");
    resumeBtn.setAttribute("aria-expanded", "false");
  };

  resumeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = resumeWrapper.hasAttribute("data-open");
    if (isOpen) {
      closeDropdown();
    } else {
      resumeWrapper.dataset.open = "";
      resumeBtn.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", closeDropdown);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });

  document.querySelectorAll(".nav-resume-dropdown a").forEach((link) => {
    link.addEventListener("click", () => {
      closeDropdown();
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeDropdown();
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
