// ---- Clinic settings: update these with the real details ----
const CLINIC = {
  // WhatsApp / phone number in international format, digits only (e.g. "919876543210")
  phone: "918129485585",
  // How the number is shown on the page
  phoneDisplay: "+91 81294 85585",
};
// --------------------------------------------------------------

const waBase = `https://wa.me/${CLINIC.phone}`;

// Phone and WhatsApp links
document.querySelectorAll("[data-phone-link]").forEach((a) => {
  a.href = `tel:+${CLINIC.phone}`;
  a.textContent = CLINIC.phoneDisplay;
});
document.querySelectorAll("[data-phone-href]").forEach((a) => (a.href = `tel:+${CLINIC.phone}`));
document.querySelectorAll("[data-phone-text]").forEach((el) => (el.textContent = CLINIC.phoneDisplay));
document.querySelectorAll("[data-wa-link]").forEach((a) => {
  a.href = `${waBase}?text=${encodeURIComponent("Hello Asian Medical Center, I have an enquiry.")}`;
  a.target = "_blank";
  a.rel = "noopener";
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Header shadow on scroll
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Appointment form -> WhatsApp
const form = document.getElementById("apptForm");
const error = document.getElementById("formError");
const dateInput = form.elements.date;
dateInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = form.elements;
  const missing = ["name", "phone", "dept", "date"].filter((k) => !f[k].value.trim());
  if (missing.length) {
    error.textContent = "Please fill in your name, phone, department and date.";
    f[missing[0]].focus();
    return;
  }
  error.textContent = "";
  const lines = [
    "Hello Asian Medical Center, I would like to book an appointment.",
    "",
    `Name: ${f.name.value.trim()}`,
    `Phone: ${f.phone.value.trim()}`,
    `Department: ${f.dept.value}`,
    `Preferred date: ${f.date.value}`,
  ];
  if (f.msg.value.trim()) lines.push(`Message: ${f.msg.value.trim()}`);
  window.open(`${waBase}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});

// "Book appointment" on a doctor card pre-fills the form
document.querySelectorAll("[data-book-dept]").forEach((a) =>
  a.addEventListener("click", () => {
    form.elements.dept.value = a.dataset.bookDept;
    form.elements.msg.value = `I would like to see ${a.dataset.bookDoctor}.`;
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), 600);
  })
);

// Reveal on scroll
const revealEls = document.querySelectorAll(".card, .doctor, .gallery__item, .section__head, .about__visual, .about__text, .chip, .contact__info, .contact__map");
if ("IntersectionObserver" in window) {
  revealEls.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-visible");
        io.unobserve(en.target);
      }
    }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
}

// Photo lightbox (lab + camps)
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCap = lightbox.querySelector(".lightbox__cap");
const closeLightbox = () => { lightbox.hidden = true; document.body.style.overflow = ""; };
document.querySelectorAll(".zoomable").forEach((fig) =>
  fig.addEventListener("click", () => {
    const img = fig.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector("figcaption").textContent;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  })
);
lightbox.addEventListener("click", (e) => { if (e.target !== lbImg) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

// Call Us dropdown
const callBtn = document.getElementById("callusBtn");
const callMenu = document.getElementById("callusMenu");
const setCallMenu = (open) => {
  callMenu.hidden = !open;
  callBtn.setAttribute("aria-expanded", open);
};
callBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setCallMenu(callMenu.hidden);
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
});
document.addEventListener("click", (e) => { if (!callMenu.hidden && !callMenu.contains(e.target)) setCallMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setCallMenu(false); });
toggle.addEventListener("click", () => setCallMenu(false));
