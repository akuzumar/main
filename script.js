// ---------------------------------------------
// Portfolio app with data-driven sections
// ---------------------------------------------
const translations = window.portfolioTranslations || {};

const BASE_LANGUAGE = "id";
const MOBILE_MENU_BREAKPOINT = 900;

const typingText = document.getElementById("typing-text");
const projectModal = document.getElementById("project-modal");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalDescription = document.getElementById("project-modal-description");
const projectModalClose = document.getElementById("project-modal-close");
const contactForm = document.getElementById("contact-form");

const profileGrid = document.getElementById("profile-grid");
const skillsGrid = document.getElementById("skills-grid");
const projectsGrid = document.getElementById("projects-grid");
const timelineList = document.getElementById("timeline-list");
const certGrid = document.getElementById("cert-grid");
const contactInfoPanel = document.getElementById("contact-info-panel");

let currentLanguage = BASE_LANGUAGE;
let typingTimeout;
let typingIndex = 0;
let isDeleting = false;
let isDarkTheme = true;
let activeProjectId = null;
let revealObserver = null;

const projectCatalog = new Map();

const socialIconPaths = {
  linkedin:
    "M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM3 9.75h4v11.5H3ZM9.25 9.75h3.83v1.57h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12v6.12h-4v-5.42c0-1.3-.02-2.97-1.8-2.97-1.81 0-2.09 1.41-2.09 2.87v5.52h-4Z",
  github:
    "M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42a3.2 3.2 0 0 0-1.35-1.77c-1.1-.75.08-.74.08-.74a2.53 2.53 0 0 1 1.84 1.24 2.56 2.56 0 0 0 3.49 1 2.56 2.56 0 0 1 .76-1.6c-2.67-.3-5.48-1.34-5.48-5.95a4.64 4.64 0 0 1 1.23-3.21 4.31 4.31 0 0 1 .12-3.17s1-.33 3.3 1.23a11.4 11.4 0 0 1 6 0c2.28-1.56 3.28-1.23 3.28-1.23a4.3 4.3 0 0 1 .13 3.17 4.63 4.63 0 0 1 1.23 3.21c0 4.62-2.82 5.65-5.5 5.95a2.87 2.87 0 0 1 .82 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z",
  instagram:
    "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.3 1.5h-8.1A4.45 4.45 0 0 0 3.5 7.95v8.1a4.45 4.45 0 0 0 4.45 4.45h8.1a4.45 4.45 0 0 0 4.45-4.45v-8.1a4.45 4.45 0 0 0-4.45-4.45ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.18-2a1.17 1.17 0 1 1 0 2.34 1.17 1.17 0 0 1 0-2.34Z",
  x: "M18.9 2H22l-6.77 7.73L23.2 22h-6.26l-4.9-6.4L6.44 22H3.32l7.23-8.26L.8 2h6.42l4.43 5.85L18.9 2Zm-1.1 18h1.74L6.25 3.9H4.38L17.8 20Z",
  youtube:
    "M23.5 7.1a3 3 0 0 0-2.1-2.1C19.6 4.5 12 4.5 12 4.5s-7.6 0-9.4.5A3 3 0 0 0 .5 7.1 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-4.9ZM9.6 15.5V8.5L15.8 12l-6.2 3.5Z",
  globe:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 9h-3.01a15.4 15.4 0 0 0-1.15-5 8.03 8.03 0 0 1 4.16 5ZM12 4.03c.77.9 1.8 3.04 2.15 6.97H9.85C10.2 7.07 11.23 4.93 12 4.03ZM6.23 6a15.4 15.4 0 0 0-1.15 5H2.07a8.03 8.03 0 0 1 4.16-5ZM4.03 13h3.05c.13 1.87.58 3.71 1.15 5A8.03 8.03 0 0 1 4.03 13ZM12 19.97c-.77-.9-1.8-3.04-2.15-6.97h4.3c-.35 3.93-1.38 6.07-2.15 6.97ZM15.77 18c.57-1.29 1.02-3.13 1.15-5h3.05a8.03 8.03 0 0 1-4.2 5Z"
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

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeText(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function getDictionary(lang = currentLanguage) {
  const base = translations[BASE_LANGUAGE] || {};
  const localized = translations[lang] || {};
  return { ...base, ...localized };
}

function mergeCollections(baseCollection, localizedCollection) {
  const baseItems = safeArray(baseCollection).filter(isPlainObject);
  const localizedItems = safeArray(localizedCollection).filter(isPlainObject);

  const localizedById = new Map(
    localizedItems
      .filter((item) => typeof item.id === "string" && item.id)
      .map((item) => [item.id, item])
  );

  const merged = baseItems.map((baseItem, index) => {
    const id = safeText(baseItem.id, `base-${index + 1}`);
    const localized = localizedById.get(id) || localizedItems[index] || {};
    return { ...baseItem, ...localized, id };
  });

  const mergedIds = new Set(merged.map((item) => item.id));
  localizedItems.forEach((item, index) => {
    const id = safeText(item.id, `extra-${index + 1}`);
    if (mergedIds.has(id)) return;
    merged.push({ ...item, id });
  });

  return merged;
}

function getCollection(key, lang = currentLanguage) {
  const baseDictionary = translations[BASE_LANGUAGE] || {};
  const localizedDictionary = translations[lang] || {};
  return mergeCollections(baseDictionary[key], localizedDictionary[key]);
}

function createSocialIcon(iconKey) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", socialIconPaths[iconKey] || socialIconPaths.globe);
  svg.append(path);

  return svg;
}

function createExternalLink(href, text) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.textContent = text;

  if (/^https?:\/\//i.test(href)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }

  return anchor;
}

function renderProfileItems(items) {
  if (!profileGrid) return;

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "profile-item reveal";

    const heading = document.createElement("h3");
    heading.textContent = safeText(item.label);

    const value = document.createElement("p");
    value.textContent = safeText(item.value);

    article.append(heading, value);
    fragment.append(article);
  });

  profileGrid.replaceChildren(fragment);
}

function renderSkillItems(items) {
  if (!skillsGrid) return;

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card reveal";

    const heading = document.createElement("h3");
    heading.textContent = safeText(item.title);

    const text = document.createElement("p");
    text.textContent = safeText(item.text);

    article.append(heading, text);
    fragment.append(article);
  });

  skillsGrid.replaceChildren(fragment);
}

function renderProjectItems(items, dictionary) {
  if (!projectsGrid) return;

  projectCatalog.clear();

  const fragment = document.createDocumentFragment();
  const detailButtonLabel = safeText(dictionary.projectBtn, "Detail");
  const imagePlaceholderAlt = safeText(dictionary.projectImagePlaceholder, "Project image");

  items.forEach((item, index) => {
    const projectId = safeText(item.id, `project-${index + 1}`);
    const article = document.createElement("article");
    article.className = "project-card reveal";

    const figure = document.createElement("figure");
    figure.className = "project-image";

    const image = document.createElement("img");
    image.loading = "lazy";
    image.src = safeText(item.image, "images/experience-proof-1.svg");
    image.alt = safeText(item.alt, imagePlaceholderAlt);
    figure.append(image);

    const heading = document.createElement("h3");
    heading.textContent = safeText(item.title);

    const text = document.createElement("p");
    text.textContent = safeText(item.text);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-small project-detail-btn";
    button.dataset.projectId = projectId;
    button.textContent = detailButtonLabel;

    article.append(figure, heading, text, button);
    fragment.append(article);

    projectCatalog.set(projectId, {
      ...item,
      id: projectId,
      title: safeText(item.title),
      detail: safeText(item.detail),
      text: safeText(item.text)
    });
  });

  projectsGrid.replaceChildren(fragment);
}

function renderExperienceItems(items) {
  if (!timelineList) return;

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "timeline-item reveal";

    const date = document.createElement("span");
    date.className = "timeline-year";
    date.textContent = safeText(item.date);

    const heading = document.createElement("h3");
    heading.textContent = safeText(item.title);

    const text = document.createElement("p");
    text.textContent = safeText(item.text);

    const figure = document.createElement("figure");
    figure.className = "experience-proof";

    const media = document.createElement("div");
    media.className = "experience-proof-media";

    const image = document.createElement("img");
    image.loading = "lazy";
    image.width = 640;
    image.height = 360;
    image.src = safeText(item.image, "images/experience-proof-1.svg");
    image.alt = safeText(item.imageAlt, safeText(item.title));

    const caption = document.createElement("figcaption");
    caption.textContent = safeText(item.proof);

    media.append(image);
    figure.append(media, caption);

    article.append(date, heading, text, figure);
    fragment.append(article);
  });

  timelineList.replaceChildren(fragment);
}

function renderCertificateItems(items, dictionary) {
  if (!certGrid) return;

  const fragment = document.createDocumentFragment();
  const imagePlaceholderAlt = safeText(dictionary.projectImagePlaceholder, "Certificate image");

  items.forEach((item) => {
    const figure = document.createElement("figure");
    figure.className = "cert-card reveal";

    const imageWrap = document.createElement("div");
    imageWrap.className = "cert-image";

    const image = document.createElement("img");
    image.loading = "lazy";
    image.src = safeText(item.image, "images/experience-proof-2.svg");
    image.alt = safeText(item.alt, imagePlaceholderAlt);

    const caption = document.createElement("figcaption");
    caption.textContent = safeText(item.caption);

    imageWrap.append(image);
    figure.append(imageWrap, caption);
    fragment.append(figure);
  });

  certGrid.replaceChildren(fragment);
}

function renderContactPanel(infoItems, socialItems, dictionary) {
  if (!contactInfoPanel) return;

  const fragment = document.createDocumentFragment();

  infoItems.forEach((item) => {
    const row = document.createElement("p");

    const label = document.createElement("strong");
    label.textContent = safeText(item.label);

    row.append(label, document.createTextNode(" "));

    if (safeText(item.href)) {
      row.append(createExternalLink(safeText(item.href), safeText(item.value)));
    } else {
      row.append(document.createTextNode(safeText(item.value)));
    }

    fragment.append(row);
  });

  const socialTitle = document.createElement("p");
  socialTitle.className = "contact-social-title";

  const socialStrong = document.createElement("strong");
  socialStrong.textContent = safeText(dictionary.contactSocialLabel, "Jaringan:");
  socialTitle.append(socialStrong);

  const socialGrid = document.createElement("div");
  socialGrid.className = "social-links";
  socialGrid.setAttribute("aria-label", safeText(dictionary.socialAriaLabel, "Social media links"));

  socialItems.forEach((item) => {
    const label = safeText(item.label);
    const href = safeText(item.url, "#");
    const iconKey = safeText(item.icon, safeText(item.id, "globe")).toLowerCase();

    const link = createExternalLink(href, "");
    link.className = "social-link";
    link.setAttribute("aria-label", label);

    const icon = createSocialIcon(iconKey);
    const text = document.createElement("span");
    text.textContent = label;

    link.append(icon, text);
    socialGrid.append(link);
  });

  fragment.append(socialTitle, socialGrid);
  contactInfoPanel.replaceChildren(fragment);
}

function renderDynamicSections(lang, dictionary) {
  renderProfileItems(getCollection("profileItems", lang));
  renderSkillItems(getCollection("skillItems", lang));
  renderProjectItems(getCollection("projectItems", lang), dictionary);
  renderExperienceItems(getCollection("experienceItems", lang));
  renderCertificateItems(getCollection("certificateItems", lang), dictionary);
  renderContactPanel(getCollection("contactInfoItems", lang), getCollection("socialLinks", lang), dictionary);
}

function applyLanguage(lang) {
  const dictionary = getDictionary(lang);
  currentLanguage = translations[lang] ? lang : BASE_LANGUAGE;

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

  renderDynamicSections(currentLanguage, dictionary);

  document.title = safeText(dictionary.siteTitle, "Portfolio");
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", currentLanguage === "ar");

  getNavbarElements().languageButtons.forEach((button) => {
    const active = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const { mobileLangCurrent } = getNavbarElements();
  if (mobileLangCurrent) {
    mobileLangCurrent.textContent = currentLanguage.toUpperCase();
  }

  restartTyping();
  updateThemeToggleLabel();
  refreshOpenProjectModal();
  initScrollReveal();
}

function typeEffectLoop() {
  if (!typingText) return;

  const fullText = safeText(getDictionary().heroTagline);
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

function updateThemeToggleLabel() {
  const { themeToggle } = getNavbarElements();
  if (!themeToggle) return;

  const key = isDarkTheme ? "themeToggleDark" : "themeToggleLight";
  const dictionary = getDictionary();
  const label = safeText(dictionary[key], "Toggle theme");

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
    // Ignore storage issues
  }

  updateThemeToggleLabel();
}

function initThemeToggle() {
  try {
    const savedTheme = localStorage.getItem("zumar-theme");
    isDarkTheme = savedTheme !== "light";
  } catch {
    isDarkTheme = true;
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

function refreshOpenProjectModal() {
  if (!activeProjectId || !projectModal || !projectModal.classList.contains("open")) return;

  const project = projectCatalog.get(activeProjectId);
  if (!project) {
    closeProjectModal();
    return;
  }

  projectModalTitle.textContent = safeText(project.title);
  projectModalDescription.textContent = safeText(project.detail, safeText(project.text));
}

function openProjectModal(projectId) {
  const project = projectCatalog.get(projectId);
  if (!project || !projectModal) return;

  activeProjectId = projectId;

  projectModalTitle.textContent = safeText(project.title);
  projectModalDescription.textContent = safeText(project.detail, safeText(project.text));

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
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const detailButton = target.closest(".project-detail-btn");
    if (detailButton) {
      const projectId = detailButton.getAttribute("data-project-id") || "";
      openProjectModal(projectId);
      return;
    }

    if (projectModal && target === projectModal) {
      closeProjectModal();
    }
  });

  projectModalClose?.addEventListener("click", closeProjectModal);
}

function initScrollReveal() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((element, index) => {
    element.classList.remove("visible");
    element.style.transitionDelay = `${Math.min(index * 0.05, 0.35)}s`;
    revealObserver.observe(element);
  });
}

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

function createMailTemplate(name, email, message) {
  if (currentLanguage === "en") {
    return {
      subject: `Scholarship Support Inquiry - ${name}`,
      body: [
        "Dear Fairuz Zumar,",
        "",
        `My name is ${name}.`,
        "",
        "Support Message:",
        message,
        "",
        "Thank you for your time. I would be glad to support your study journey.",
        "",
        "Sincerely,",
        name,
        `Email: ${email}`
      ].join("\n")
    };
  }

  if (currentLanguage === "ar") {
    return {
      subject: `طلب دعم دراسي - ${name}`,
      body: [
        "الأستاذ فيروز زومار المحترم،",
        "",
        `أنا ${name}.`,
        "",
        "رسالة الدعم:",
        message,
        "",
        "شكرًا لوقتكم، ويسعدني دعم رحلتكم الدراسية.",
        "",
        "مع خالص التحية،",
        name,
        `Email: ${email}`
      ].join("\n")
    };
  }

  return {
    subject: `Permohonan Dukungan Studi - ${name}`,
    body: [
      "Yth. Fairuz Zumar,",
      "",
      `Perkenalkan, saya ${name}.`,
      "",
      "Pesan Dukungan:",
      message,
      "",
      "Terima kasih atas waktunya. Saya berharap dapat mendukung perjalanan studi Anda.",
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
  initProjectDetails();
  initContactForm();
  applyLanguage(currentLanguage);
}

bootstrap();
