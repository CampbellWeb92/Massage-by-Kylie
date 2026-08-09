// Massage by Kylie — simple static-site interactions

const ageGate = document.getElementById("ageGate");
const enterSite = document.getElementById("enterSite");
const leaveSite = document.getElementById("leaveSite");

function unlockSite() {
  // Only hide the disclaimer after the visitor deliberately confirms 18+.
  // Nothing is stored in localStorage, so it cannot disappear automatically.
  ageGate.classList.add("hidden");
  document.body.classList.remove("age-locked");
}

function leaveWebsite() {
  // If the visitor chooses Exit, send them away from the adult website.
  if (window.history.length > 1) {
    history.back();
  } else {
    window.location.href = "https://www.google.com/";
  }
}

// IMPORTANT:
// The age gate is intentionally shown on EVERY page load.
// It stays visible indefinitely until one of the buttons below is clicked.
document.body.classList.add("age-locked");
ageGate.classList.remove("hidden");

enterSite.addEventListener("click", unlockSite);
leaveSite.addEventListener("click", leaveWebsite);


// Home/logo navigation
// Explicitly scroll to the real hero section so the sticky header never becomes the target.
document.querySelectorAll('a[href="#home"]').forEach(link => {
  link.addEventListener("click", (event) => {
    const homeSection = document.getElementById("home");
    if (!homeSection) return;

    event.preventDefault();
    homeSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    if (history.replaceState) {
      history.replaceState(null, "", "#home");
    }
  });
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Active navigation while scrolling
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id], header[id]")];

function setActiveLink() {
  const scrollPosition = window.scrollY + 140;
  let current = "home";

  sections.forEach(section => {
    if (section.offsetTop <= scrollPosition) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

// Gallery slider
const galleryTrack = document.getElementById("galleryTrack");
const galleryItems = [...document.querySelectorAll(".gallery-item")];
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

let galleryIndex = 0;

function visibleGalleryItems() {
  if (window.innerWidth <= 760) return 1;
  return 3;
}

function updateGallery() {
  const visible = visibleGalleryItems();
  const maxIndex = Math.max(0, galleryItems.length - visible);
  galleryIndex = Math.min(galleryIndex, maxIndex);

  const item = galleryItems[0];
  if (!item) return;

  const gap = 18;
  const itemWidth = item.getBoundingClientRect().width;
  galleryTrack.style.transform = `translateX(-${galleryIndex * (itemWidth + gap)}px)`;
}

galleryNext.addEventListener("click", () => {
  const maxIndex = Math.max(0, galleryItems.length - visibleGalleryItems());
  galleryIndex = galleryIndex >= maxIndex ? 0 : galleryIndex + 1;
  updateGallery();
});

galleryPrev.addEventListener("click", () => {
  const maxIndex = Math.max(0, galleryItems.length - visibleGalleryItems());
  galleryIndex = galleryIndex <= 0 ? maxIndex : galleryIndex - 1;
  updateGallery();
});

window.addEventListener("resize", updateGallery);

// Reveal on scroll
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("visible"));
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();


// Scroll-to-top control
const scrollTopButton = document.getElementById("scrollTop");

if (scrollTopButton) {
  const updateScrollTopButton = () => {
    scrollTopButton.classList.toggle("visible", window.scrollY > 650);
  };

  window.addEventListener("scroll", updateScrollTopButton, { passive: true });
  updateScrollTopButton();

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
