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


// ==========================================================
// LIVE BUSINESS HOURS — JOHANNESBURG
// Mon-Sat 10:00–20:00
// Sun     10:00–18:00
// ==========================================================

const BUSINESS_TIME_ZONE = "Africa/Johannesburg";

const BUSINESS_HOURS = {
  0: { open: "10:00", close: "18:00" }, // Sunday
  1: { open: "10:00", close: "20:00" }, // Monday
  2: { open: "10:00", close: "20:00" }, // Tuesday
  3: { open: "10:00", close: "20:00" }, // Wednesday
  4: { open: "10:00", close: "20:00" }, // Thursday
  5: { open: "10:00", close: "20:00" }, // Friday
  6: { open: "10:00", close: "20:00" }  // Saturday
};

function businessTimeToMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function getJohannesburgBusinessTime() {
  const parts = new Intl.DateTimeFormat("en-ZA", {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());

  const values = {};
  parts.forEach(part => {
    if (part.type !== "literal") values[part.type] = part.value;
  });

  const dayMap = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3,
    Thu: 4, Fri: 5, Sat: 6
  };

  return {
    day: dayMap[values.weekday],
    hour: Number(values.hour),
    minute: Number(values.minute),
    displayTime: `${values.hour}:${values.minute}`
  };
}

function updateLiveBusinessHours() {
  const statusEl = document.getElementById("liveBusinessStatus");
  const timeEl = document.getElementById("businessLocalTime");
  const noteEl = document.getElementById("businessStatusNote");
  const todayHoursEl = document.getElementById("todayBusinessHours");

  if (!statusEl || !timeEl || !noteEl) return;

  const card = statusEl.closest(".live-hours-card");
  const current = getJohannesburgBusinessTime();
  const hours = BUSINESS_HOURS[current.day];

  timeEl.textContent = current.displayTime;

  if (!hours) {
    statusEl.textContent = "Closed now";
    if (todayHoursEl) todayHoursEl.textContent = "Closed";
    noteEl.textContent = "There are no published opening hours for today.";
    card?.classList.remove("is-open");
    card?.classList.add("is-closed");
    return;
  }

  if (todayHoursEl) {
    todayHoursEl.textContent = `${hours.open} – ${hours.close}`;
  }

  const now = current.hour * 60 + current.minute;
  const open = businessTimeToMinutes(hours.open);
  const close = businessTimeToMinutes(hours.close);
  const isOpen = now >= open && now < close;

  card?.classList.toggle("is-open", isOpen);
  card?.classList.toggle("is-closed", !isOpen);

  if (isOpen) {
    statusEl.textContent = "Open now — by appointment";
    noteEl.textContent =
      `Open until ${hours.close}. Please WhatsApp Kylie first to confirm your appointment.`;
  } else {
    statusEl.textContent = "Closed now";

    if (now < open) {
      noteEl.textContent =
        `Today's appointment window opens at ${hours.open}. You can still WhatsApp now to arrange a booking.`;
    } else {
      noteEl.textContent =
        `Today's appointment window closed at ${hours.close}. You can WhatsApp Kylie to arrange the next appointment.`;
    }
  }
}

updateLiveBusinessHours();
setInterval(updateLiveBusinessHours, 30000);
