// ---------------------------------------------
// Portfolio i18n dictionary loaded from dedicated language files
// bahasaindonesia.js (ID), bahasainggris.js (EN), bahasaarab.js (AR)
// ---------------------------------------------
const translations = window.portfolioTranslations || {};

const MOBILE_MENU_BREAKPOINT = 900;

// Ganti path file di object ini setelah upload gambar proyek.
const projectImageSources = {
  project1: "images/vanes.png",
  project2: "images/experience-proof-2.svg",
  project3: "images/experience-proof-3.svg"
};

// Ganti path file di object ini setelah upload gambar sertifikat.
const certificateImageSources = {
  cert1: "images/vanes.png",
  cert2: "images/experience-proof-2.svg",
  cert3: "images/experience-proof-3.svg"
};

const typingText = document.getElementById("typing-text");
const projectModal = document.getElementById("project-modal");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalDescription = document.getElementById("project-modal-description");
const projectModalClose = document.getElementById("project-modal-close");
const contactForm = document.getElementById("contact-form");

let currentLanguage = "id";
let typingTimeout;
let typingIndex = 0;
let isDeleting = false;
let isDarkTheme = false;
let activeProjectKey = null;

const projectDetailMap = {
  project1: { title: "project1Title", description: "project1Detail" },
  project2: { title: "project2Title", description: "project2Detail" },
  project3: { title: "project3Title", description: "project3Detail" }
};

function getNavbarElements() {
  return {
    languageButtons: document.querySelectorAll(".lang-btn, .mobile-lang-btn"),
    menuToggle: document.getElementById("menu-toggle"),
    navLinks: document.getElementById("nav-links"),
    themeToggle: document.getElementById("theme-toggle"),
    mobileLang: document.getElementById("mobile-lang"),
    mobileLangToggle: document.getElementById("mobile-lang-toggle"),
    mobileLangCurrent: document.getElementById("mobile-lang-current")
  };
}

function applyMediaSources() {
  Object.entries(projectImageSources).forEach(([key, source]) => {
    const imageElement = document.querySelector(`[data-project-image="${key}"]`);
    if (imageElement instanceof HTMLImageElement) {
      imageElement.src = source;
    }
  });

  Object.entries(certificateImageSources).forEach(([key, source]) => {
    const imageElement = document.querySelector(`[data-cert-image="${key}"]`);
    if (imageElement instanceof HTMLImageElement) {
      imageElement.src = source;
    }
  });
}

// ---------------------------------------------
// Apply all language-dependent content
// ---------------------------------------------
function applyLanguage(lang) {
  const dictionary = translations[lang];
  if (!dictionary) return;

  currentLanguage = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key] !== undefined) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (dictionary[key] !== undefined) {
      element.placeholder = dictionary[key];
    }
  });

  document.title = dictionary.siteTitle;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", lang === "ar");

  getNavbarElements().languageButtons.forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const { mobileLangCurrent } = getNavbarElements();
  if (mobileLangCurrent) {
    mobileLangCurrent.textContent = lang.toUpperCase();
  }

  restartTyping();
  updateThemeToggleLabel();
  refreshOpenProjectModal();
}

// ---------------------------------------------
// Typing animation logic for hero tagline
// ---------------------------------------------
function typeEffectLoop() {
  if (!typingText) return;

  const fullText = (translations[currentLanguage] && translations[currentLanguage].heroTagline) || "";

  if (!fullText) {
    typingText.textContent = "";
    return;
  }

  if (!isDeleting) {
    typingIndex += 1;
    typingText.textContent = fullText.slice(0, typingIndex);

    if (typingIndex >= fullText.length) {
      isDeleting = true;
      typingTimeout = setTimeout(typeEffectLoop, 1300);
      return;
    }
  } else {
    typingIndex -= 1;
    typingText.textContent = fullText.slice(0, typingIndex);

    if (typingIndex <= 0) {
      isDeleting = false;
      typingTimeout = setTimeout(typeEffectLoop, 350);
      return;
    }
  }

  typingTimeout = setTimeout(typeEffectLoop, isDeleting ? 45 : 85);
}

function restartTyping() {
  if (!typingText) return;

  clearTimeout(typingTimeout);
  typingIndex = 0;
  isDeleting = false;
  typingText.textContent = "";
  typeEffectLoop();
}

// ---------------------------------------------
// Theme toggle (icon button in navbar)
// ---------------------------------------------
function updateThemeToggleLabel() {
  const { themeToggle } = getNavbarElements();
  if (!themeToggle) return;

  const key = isDarkTheme ? "themeToggleDark" : "themeToggleLight";
  const dictionary = translations[currentLanguage] || translations.id || {};
  const label = dictionary[key] || "Toggle theme";

  themeToggle.setAttribute("aria-label", label);
  themeToggle.setAttribute("title", label);
  themeToggle.setAttribute("aria-pressed", isDarkTheme ? "true" : "false");
}

function setTheme(nextThemeState) {
  isDarkTheme = nextThemeState;
  document.body.classList.toggle("theme-dark", isDarkTheme);

  try {
    localStorage.setItem("zumar-theme", isDarkTheme ? "dark" : "light");
  } catch {
    // Ignore storage issues (private browsing, strict browser settings)
  }

  updateThemeToggleLabel();
}

function initThemeToggle() {
  try {
    const savedTheme = localStorage.getItem("zumar-theme");
    isDarkTheme = savedTheme === "dark";
  } catch {
    isDarkTheme = false;
  }

  document.body.classList.toggle("theme-dark", isDarkTheme);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const themeButton = target.closest("#theme-toggle");
    if (!themeButton) return;

    setTheme(!isDarkTheme);
  });

  updateThemeToggleLabel();
}

// ---------------------------------------------
// Project "More Detail" modal
// ---------------------------------------------
function refreshOpenProjectModal() {
  if (!activeProjectKey || !projectModal || !projectModal.classList.contains("open")) return;

  const detailConfig = projectDetailMap[activeProjectKey];
  if (!detailConfig) return;

  const dictionary = translations[currentLanguage] || translations.id || {};
  projectModalTitle.textContent = dictionary[detailConfig.title] || "";
  projectModalDescription.textContent = dictionary[detailConfig.description] || "";
}

function openProjectModal(projectKey) {
  const detailConfig = projectDetailMap[projectKey];
  if (!detailConfig || !projectModal) return;

  activeProjectKey = projectKey;

  const dictionary = translations[currentLanguage] || translations.id || {};
  projectModalTitle.textContent = dictionary[detailConfig.title] || "";
  projectModalDescription.textContent = dictionary[detailConfig.description] || "";

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initProjectDetails() {
  document.querySelectorAll(".project-detail-btn").forEach((button) => {
    button.addEventListener("click", () => {
      openProjectModal(button.dataset.project);
    });
  });

  projectModalClose?.addEventListener("click", closeProjectModal);

  projectModal?.addEventListener("click", (event) => {
    if (event.target === projectModal) {
      closeProjectModal();
    }
  });
}

// ---------------------------------------------
// Reveal-on-scroll animation with IntersectionObserver
// ---------------------------------------------
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 0.05, 0.35)}s`;
    observer.observe(element);
  });
}

// ---------------------------------------------
// Mobile menu interactions
// ---------------------------------------------
function setMobileMenuState(isOpen) {
  const { menuToggle, navLinks } = getNavbarElements();
  if (!menuToggle || !navLinks) return;

  navLinks.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  menuToggle.classList.toggle("open", isOpen);
}

function setMobileLanguageMenuState(isOpen) {
  const { mobileLang, mobileLangToggle } = getNavbarElements();
  if (!mobileLang || !mobileLangToggle) return;

  mobileLang.classList.toggle("open", isOpen);
  mobileLangToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function initMobileMenu() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const menuButton = target.closest("#menu-toggle");
    if (menuButton) {
      const { navLinks } = getNavbarElements();
      const isOpen = !navLinks?.classList.contains("open");
      setMobileMenuState(Boolean(isOpen));
      setMobileLanguageMenuState(false);
      return;
    }

    if (target.closest("#nav-links a")) {
      setMobileMenuState(false);
      return;
    }

    if (window.innerWidth > MOBILE_MENU_BREAKPOINT) return;

    const { navLinks } = getNavbarElements();
    if (!navLinks || !navLinks.classList.contains("open")) return;

    if (!target.closest("#nav-links")) {
      setMobileMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuState(false);
      setMobileLanguageMenuState(false);
      if (projectModal?.classList.contains("open")) {
        closeProjectModal();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_MENU_BREAKPOINT) {
      setMobileMenuState(false);
    }
  });
}

// ---------------------------------------------
// Contact form -> opens mail client in a new tab with a formal template
// ---------------------------------------------
function createMailTemplate(name, email, message) {
  if (currentLanguage === "en") {
    return {
      subject: `Collaboration Inquiry - ${name}`,
      body: [
        "Dear Zumar,",
        "",
        `My name is ${name}.`,
        "",
        "Message:",
        message,
        "",
        "Thank you for your time. I look forward to your reply.",
        "",
        "Sincerely,",
        name,
        `Email: ${email}`
      ].join("\n")
    };
  }

  if (currentLanguage === "ar") {
    return {
      subject: `طلب تعاون - ${name}`,
      body: [
        "الأستاذ زومار المحترم،",
        "",
        `أنا ${name}.`,
        "",
        "الرسالة:",
        message,
        "",
        "شكرًا لوقتكم، وأتطلع لردكم الكريم.",
        "",
        "مع خالص التحية،",
        name,
        `Email: ${email}`
      ].join("\n")
    };
  }

  return {
    subject: `Permintaan Kolaborasi - ${name}`,
    body: [
      "Yth. Zumar,",
      "",
      `Perkenalkan, saya ${name}.`,
      "",
      "Pesan:",
      message,
      "",
      "Terima kasih atas waktunya. Saya menunggu balasan Anda.",
      "",
      "Hormat saya,",
      name,
      `Email: ${email}`
    ].join("\n")
  };
}

function initContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = contactForm.elements.namedItem("name");
    const emailInput = contactForm.elements.namedItem("email");
    const messageInput = contactForm.elements.namedItem("message");

    if (!(nameInput instanceof HTMLInputElement)) return;
    if (!(emailInput instanceof HTMLInputElement)) return;
    if (!(messageInput instanceof HTMLTextAreaElement)) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) return;

    const emailTemplate = createMailTemplate(name, email, message);
    const mailtoUrl = `mailto:presidentpondok@gmail.com?subject=${encodeURIComponent(emailTemplate.subject)}&body=${encodeURIComponent(
      emailTemplate.body
    )}`;

    const opened = window.open(mailtoUrl, "_blank", "noopener,noreferrer");

    if (!opened) {
      window.location.href = mailtoUrl;
    }
  });
}

function initLanguageSwitcher() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const mobileLangToggle = target.closest("#mobile-lang-toggle");
    if (mobileLangToggle) {
      const { mobileLang } = getNavbarElements();
      const isOpen = !mobileLang?.classList.contains("open");
      setMobileLanguageMenuState(Boolean(isOpen));
      setMobileMenuState(false);
      return;
    }

    const langButton = target.closest(".lang-btn, .mobile-lang-btn");
    if (!langButton) return;

    const language = langButton.getAttribute("data-lang");
    if (!language) return;

    applyLanguage(language);
    setMobileLanguageMenuState(false);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (window.innerWidth > MOBILE_MENU_BREAKPOINT) return;

    const { mobileLang } = getNavbarElements();
    if (!mobileLang || !mobileLang.classList.contains("open")) return;
    if (!target.closest("#mobile-lang")) {
      setMobileLanguageMenuState(false);
    }
  });
}

function bootstrap() {
  initThemeToggle();
  initLanguageSwitcher();
  initMobileMenu();

  applyMediaSources();
  initScrollReveal();
  initProjectDetails();
  initContactForm();
  applyLanguage(currentLanguage);
}

bootstrap();
