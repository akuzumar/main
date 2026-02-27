// ---------------------------------------------
// Portfolio app with data-driven sections
// ---------------------------------------------
const translations = window.portfolioTranslations || {};
const detailPageTranslations = window.portfolioDetailPageTranslations || {};

const BASE_LANGUAGE = "id";
const LANGUAGE_STORAGE_KEY = "zumar-language";
const THEME_STORAGE_KEY = "zumar-theme";
const THEME_INIT_STORAGE_KEY = "zumar-theme-initialized";
const MOBILE_MENU_BREAKPOINT = 900;
const PAGE_TRANSITION_DELAY = 980;
const GALLERY_LIGHTBOX_MIN_SCALE = 1;
const GALLERY_LIGHTBOX_MAX_SCALE = 4;
const PROJECT_MODAL_MIN_SCALE = 1;
const PROJECT_MODAL_MAX_SCALE = 4;
const DEFAULT_DETAIL_PAGE_SLUGS = ["keahlian", "kontribusi", "pengabdian", "sertifikat", "galeri", "pengalaman"];

const typingText = document.getElementById("typing-text");
const projectModal = document.getElementById("project-modal");
const projectModalImage = document.getElementById("project-modal-image");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalDescription = document.getElementById("project-modal-description");
const projectModalClose = document.getElementById("project-modal-close");
const projectModalMedia = projectModal ? projectModal.querySelector(".project-modal-media") : null;
let pageTransitionLoader = document.getElementById("page-transition-loader");
let pageTransitionMessage = document.getElementById("page-transition-message");
const contactForm = document.getElementById("contact-form");
const galleryWall = document.getElementById("gallery-wall");

const profileGrid = document.getElementById("profile-grid");
const skillsGrid = document.getElementById("skills-grid");
const projectsGrid = document.getElementById("projects-grid");
const timelineList = document.getElementById("timeline-list");
const certGrid = document.getElementById("cert-grid");
const contactInfoPanel = document.getElementById("contact-info-panel");

const GALLERY_DUMMY_ITEMS = [
  { src: "images/gallery-dummy-1.svg" },
  { src: "images/gallery-dummy-2.svg" },
  { src: "images/gallery-dummy-3.svg" },
  { src: "images/gallery-dummy-4.svg" },
  { src: "images/gallery-dummy-5.svg" },
  { src: "images/gallery-dummy-6.svg" }
];

let currentLanguage = BASE_LANGUAGE;
let typingTimeout;
let typingIndex = 0;
let isDeleting = false;
let isDarkTheme = true;
let activeProjectId = null;
let revealObserver = null;
let pageTransitionTimer;
let galleryLightboxState = null;
let projectModalZoomState = null;
let detailPageSnapshot = null;

const projectCatalog = new Map();
const centeredSocialIds = new Set(["instagram", "threads", "tiktok"]);

const socialIconPaths = {
  linkedin:
    "M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM3 9.75h4v11.5H3ZM9.25 9.75h3.83v1.57h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12v6.12h-4v-5.42c0-1.3-.02-2.97-1.8-2.97-1.81 0-2.09 1.41-2.09 2.87v5.52h-4Z",
  threads:
    "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm0-2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm4-10a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-2 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0z",
  instagram:
    "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm8.3 1.5h-8.1A4.45 4.45 0 0 0 3.5 7.95v8.1a4.45 4.45 0 0 0 4.45 4.45h8.1a4.45 4.45 0 0 0 4.45-4.45v-8.1a4.45 4.45 0 0 0-4.45-4.45ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.18-2a1.17 1.17 0 1 1 0 2.34 1.17 1.17 0 0 1 0-2.34Z",
  x: "M18.9 2H22l-6.77 7.73L23.2 22h-6.26l-4.9-6.4L6.44 22H3.32l7.23-8.26L.8 2h6.42l4.43 5.85L18.9 2Zm-1.1 18h1.74L6.25 3.9H4.38L17.8 20Z",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.9-.23-2.74.28-.73.44-1.28 1.16-1.53 1.97-.28.81-.27 1.69.01 2.48.33.95 1.05 1.77 1.95 2.22.81.43 1.75.54 2.66.39 1.05-.15 2.01-.73 2.65-1.6.38-.51.59-1.11.67-1.74.05-2.08.02-4.16.03-6.24.01-4.05.01-8.11.01-12.16z",
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

function normalizeInlineText(value) {
  return safeText(value).replace(/\s+/g, " ").trim();
}

function isGenericMediaText(value) {
  const normalizedValue = normalizeInlineText(value).toLowerCase();
  if (!normalizedValue) return true;
  if (normalizedValue === "belum") return true;
  if (/^dummy(?:\s*\d+)?$/i.test(normalizedValue)) return true;
  if (/^(foto|photo|galeri|gallery)\s*#?\s*\d+$/i.test(normalizedValue)) return true;
  return false;
}

function buildMediaDescription(primaryText, secondaryText, dictionary = getDictionary()) {
  const primary = normalizeInlineText(primaryText);
  const secondary = normalizeInlineText(secondaryText);
  const fallbackDescription = safeText(
    dictionary.mediaDetailFallback,
    "Dokumentasi visual ini ditampilkan sebagai penunjang cerita dan fokus pembahasan."
  );

  if (primary && !isGenericMediaText(primary)) {
    return primary;
  }

  if (secondary && !isGenericMediaText(secondary)) {
    return secondary;
  }

  return fallbackDescription;
}

function buildMediaTitle(primaryText, secondaryText, dictionary = getDictionary()) {
  const primary = normalizeInlineText(primaryText);
  const secondary = normalizeInlineText(secondaryText);
  const fallbackTitle = safeText(dictionary.mediaDetailTitleFallback, "Detail Foto");

  if (primary && !isGenericMediaText(primary)) {
    return primary;
  }

  if (secondary && !isGenericMediaText(secondary)) {
    return secondary;
  }

  return fallbackTitle;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function collectKnownDetailPageSlugs() {
  const slugs = new Set(DEFAULT_DETAIL_PAGE_SLUGS);

  Object.values(detailPageTranslations).forEach((languagePack) => {
    if (!isPlainObject(languagePack)) return;

    Object.keys(languagePack).forEach((slug) => {
      const normalizedSlug = safeText(slug).toLowerCase();
      if (normalizedSlug) {
        slugs.add(normalizedSlug);
      }
    });
  });

  return slugs;
}

const knownDetailPageSlugs = collectKnownDetailPageSlugs();

function ensurePageTransitionLoader() {
  if (pageTransitionLoader && pageTransitionMessage) {
    return;
  }

  const loader = document.createElement("div");
  loader.className = "page-transition-loader";
  loader.id = "page-transition-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = `
    <div class="page-transition-orbs" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="page-transition-panel" role="status" aria-live="polite">
      <div class="page-transition-core" aria-hidden="true">
        <span class="core-ring ring-a"></span>
        <span class="core-ring ring-b"></span>
        <span class="core-ring ring-c"></span>
        <span class="core-pulse"></span>
      </div>
      <p class="page-transition-message" id="page-transition-message">Anda akan memasuki halaman lanjutan...</p>
      <div class="page-transition-progress" aria-hidden="true">
        <span></span>
      </div>
    </div>
  `;

  document.body.append(loader);
  pageTransitionLoader = loader;
  pageTransitionMessage = loader.querySelector("#page-transition-message");
}

function readStoredLanguagePreference() {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }
  } catch {
    // Ignore storage limitations.
  }

  return BASE_LANGUAGE;
}

function persistLanguagePreference(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage limitations.
  }
}

currentLanguage = readStoredLanguagePreference();

function getStageViewportCenter(stage) {
  if (!(stage instanceof HTMLElement)) {
    return { clientX: 0, clientY: 0 };
  }

  const rect = stage.getBoundingClientRect();
  return {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2
  };
}

function getPointersDistance(firstPointer, secondPointer) {
  if (!firstPointer || !secondPointer) return 0;
  return Math.hypot(firstPointer.clientX - secondPointer.clientX, firstPointer.clientY - secondPointer.clientY);
}

function getPointersMidpoint(firstPointer, secondPointer) {
  if (!firstPointer || !secondPointer) {
    return { clientX: 0, clientY: 0 };
  }

  return {
    clientX: (firstPointer.clientX + secondPointer.clientX) / 2,
    clientY: (firstPointer.clientY + secondPointer.clientY) / 2
  };
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

function getPageSlugFromPathname(pathname) {
  const cleanPath = safeText(pathname).split("?")[0].split("#")[0].replace(/\/+$/, "");
  if (!cleanPath) return "index";

  const segments = cleanPath.split("/").filter(Boolean);
  if (!segments.length) return "index";

  const lastSegment = safeText(segments[segments.length - 1]).toLowerCase();
  if (lastSegment === "index.html") {
    return safeText(segments[segments.length - 2], "index").toLowerCase() || "index";
  }

  return lastSegment;
}

function getCurrentPageSlug() {
  return getPageSlugFromPathname(window.location.pathname);
}

function isMainDetailTransition(destinationUrl) {
  if (!(destinationUrl instanceof URL)) return false;

  const currentSlug = getPageSlugFromPathname(window.location.pathname);
  const destinationSlug = getPageSlugFromPathname(destinationUrl.pathname);
  const currentIsDetail = knownDetailPageSlugs.has(currentSlug);
  const destinationIsDetail = knownDetailPageSlugs.has(destinationSlug);

  return currentIsDetail !== destinationIsDetail;
}

function getDetailPageLanguageMap(language, pageSlug) {
  const languagePack = detailPageTranslations[language];
  if (!isPlainObject(languagePack)) return null;

  const pagePack = languagePack[pageSlug];
  if (!isPlainObject(pagePack)) return null;

  return pagePack;
}

function getAllDetailMapsForPage(pageSlug) {
  return Object.keys(detailPageTranslations)
    .map((language) => getDetailPageLanguageMap(language, pageSlug))
    .filter(Boolean);
}

function collectDetailSelectors(pageMaps, key) {
  const selectors = new Set();

  pageMaps.forEach((pageMap) => {
    const collection = pageMap[key];
    if (!isPlainObject(collection)) return;
    Object.keys(collection).forEach((selector) => selectors.add(selector));
  });

  return Array.from(selectors);
}

function createDetailPageSnapshot(pageSlug, pageMaps) {
  if (!pageMaps.length) return null;

  const textSelectors = collectDetailSelectors(pageMaps, "text");
  const listTextSelectors = collectDetailSelectors(pageMaps, "listText");
  const listHtmlSelectors = collectDetailSelectors(pageMaps, "listHtml");

  const snapshot = {
    pageSlug,
    pageTitle: document.title,
    text: {},
    listText: {},
    listHtml: {}
  };

  textSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (!element) return;
    snapshot.text[selector] = safeText(element.textContent);
  });

  listTextSelectors.forEach((selector) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    snapshot.listText[selector] = nodes.map((node) => safeText(node.textContent));
  });

  listHtmlSelectors.forEach((selector) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    snapshot.listHtml[selector] = nodes.map((node) => safeText(node.innerHTML));
  });

  return snapshot;
}

function applyTextMap(map) {
  if (!isPlainObject(map)) return;

  Object.entries(map).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.textContent = safeText(value);
  });
}

function applyListTextMap(map) {
  if (!isPlainObject(map)) return;

  Object.entries(map).forEach(([selector, values]) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    const listValues = safeArray(values);
    nodes.forEach((node, index) => {
      if (listValues[index] === undefined) return;
      node.textContent = safeText(listValues[index]);
    });
  });
}

function applyListHtmlMap(map) {
  if (!isPlainObject(map)) return;

  Object.entries(map).forEach(([selector, values]) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    const listValues = safeArray(values);
    nodes.forEach((node, index) => {
      if (listValues[index] === undefined) return;
      node.innerHTML = safeText(listValues[index]);
    });
  });
}

function restoreDetailPageSnapshot(snapshot) {
  if (!snapshot) return;
  applyTextMap(snapshot.text);
  applyListTextMap(snapshot.listText);
  applyListHtmlMap(snapshot.listHtml);
  document.title = safeText(snapshot.pageTitle, document.title);
}

function applyDetailPageTranslations(language) {
  const detailMain = document.querySelector(".detail-main");
  if (!detailMain) return null;

  const pageSlug = getCurrentPageSlug();
  if (!pageSlug || pageSlug === "index") return null;

  const allPageMaps = getAllDetailMapsForPage(pageSlug);
  if (!allPageMaps.length) return null;

  if (!detailPageSnapshot || detailPageSnapshot.pageSlug !== pageSlug) {
    detailPageSnapshot = createDetailPageSnapshot(pageSlug, allPageMaps);
  }

  if (!detailPageSnapshot) return null;

  restoreDetailPageSnapshot(detailPageSnapshot);

  const activeMap = getDetailPageLanguageMap(language, pageSlug);
  if (!activeMap) {
    return safeText(detailPageSnapshot.pageTitle, "");
  }

  applyTextMap(activeMap.text);
  applyListTextMap(activeMap.listText);
  applyListHtmlMap(activeMap.listHtml);

  if (safeText(activeMap.pageTitle)) {
    document.title = safeText(activeMap.pageTitle);
    return safeText(activeMap.pageTitle);
  }

  return safeText(detailPageSnapshot.pageTitle, "");
}

function renderProfileItems(items) {
  if (!profileGrid) return;

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "profile-item reveal";

    const heading = document.createElement("h3");
    heading.textContent = safeText(item.label);

    const values = Array.isArray(item.value) ? item.value : null;

    if (values && values.length > 0) {
      const list = document.createElement("ul");
      list.className = "profile-item-list";

      values.forEach((entry) => {
        const listItem = document.createElement("li");
        listItem.textContent = safeText(entry);
        list.append(listItem);
      });

      article.append(heading, list);
    } else {
      const value = document.createElement("p");
      value.textContent = safeText(item.value);
      article.append(heading, value);
    }

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
      image: safeText(item.image, "images/experience-proof-1.svg"),
      alt: safeText(item.alt, safeText(item.title)),
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
    const socialId = safeText(item.id).toLowerCase();

    const link = createExternalLink(href, "");
    link.className = "social-link";
    if (centeredSocialIds.has(socialId)) {
      link.classList.add("social-link-centered");
    }
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
  persistLanguagePreference(currentLanguage);

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
  updatePageTransitionMessage(dictionary);
  renderGalleryItems();
  updateGalleryLightboxLabels(dictionary);
  const detailPageTitle = applyDetailPageTranslations(currentLanguage);

  document.title = safeText(detailPageTitle, safeText(dictionary.siteTitle, "Portfolio"));
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
  document.documentElement.classList.toggle("theme-dark", isDarkTheme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme ? "dark" : "light");
    localStorage.setItem(THEME_INIT_STORAGE_KEY, "1");
  } catch {
    // Ignore storage issues
  }

  updateThemeToggleLabel();
}

function readStoredThemePreference() {
  try {
    const hasInitializedTheme = localStorage.getItem(THEME_INIT_STORAGE_KEY);

    if (!hasInitializedTheme) {
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
      localStorage.setItem(THEME_INIT_STORAGE_KEY, "1");
      return true;
    }

    return localStorage.getItem(THEME_STORAGE_KEY) !== "light";
  } catch {
    return true;
  }
}

function initThemeToggle() {
  isDarkTheme = readStoredThemePreference();

  document.body.classList.toggle("theme-dark", isDarkTheme);
  document.documentElement.classList.toggle("theme-dark", isDarkTheme);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const themeButton = target.closest("#theme-toggle");
    if (!themeButton) return;

    setTheme(!isDarkTheme);
  });

  updateThemeToggleLabel();
}

function clampProjectModalTranslation(scale, translateX, translateY) {
  if (!projectModalZoomState || !projectModalZoomState.media || !projectModalZoomState.image) {
    return { x: translateX, y: translateY };
  }

  const stageWidth = projectModalZoomState.media.clientWidth;
  const stageHeight = projectModalZoomState.media.clientHeight;
  const imageBaseWidth = projectModalZoomState.image.offsetWidth;
  const imageBaseHeight = projectModalZoomState.image.offsetHeight;

  if (!stageWidth || !stageHeight || !imageBaseWidth || !imageBaseHeight) {
    return { x: translateX, y: translateY };
  }

  const scaledWidth = imageBaseWidth * scale;
  const scaledHeight = imageBaseHeight * scale;
  const maxTranslateX = Math.max(0, (scaledWidth - stageWidth) / 2);
  const maxTranslateY = Math.max(0, (scaledHeight - stageHeight) / 2);

  return {
    x: clampNumber(translateX, -maxTranslateX, maxTranslateX),
    y: clampNumber(translateY, -maxTranslateY, maxTranslateY)
  };
}

function applyProjectModalTransform(scale, translateX = 0, translateY = 0) {
  if (!projectModalZoomState || !projectModalZoomState.image) return;

  const nextScale = clampNumber(Number(scale) || PROJECT_MODAL_MIN_SCALE, PROJECT_MODAL_MIN_SCALE, PROJECT_MODAL_MAX_SCALE);
  let nextTranslateX = Number.isFinite(translateX) ? translateX : 0;
  let nextTranslateY = Number.isFinite(translateY) ? translateY : 0;

  if (nextScale <= PROJECT_MODAL_MIN_SCALE + 0.001) {
    nextTranslateX = 0;
    nextTranslateY = 0;
  }

  const clampedTranslation = clampProjectModalTranslation(nextScale, nextTranslateX, nextTranslateY);

  projectModalZoomState.zoomScale = nextScale;
  projectModalZoomState.translateX = clampedTranslation.x;
  projectModalZoomState.translateY = clampedTranslation.y;

  projectModalZoomState.image.style.transformOrigin = "50% 50%";
  projectModalZoomState.image.style.transform = `translate3d(${clampedTranslation.x}px, ${clampedTranslation.y}px, 0) scale(${nextScale})`;
  projectModalZoomState.image.classList.toggle("is-zoomed", nextScale > PROJECT_MODAL_MIN_SCALE + 0.001);

  if (nextScale <= PROJECT_MODAL_MIN_SCALE + 0.001) {
    projectModalZoomState.image.classList.remove("is-dragging");
  }
}

function resetProjectModalTransform() {
  applyProjectModalTransform(PROJECT_MODAL_MIN_SCALE, 0, 0);
}

function resetProjectModalPinchState() {
  if (!projectModalZoomState) return;

  if (projectModalZoomState.activePointers) {
    projectModalZoomState.activePointers.clear();
  }

  projectModalZoomState.pinchStartDistance = 0;
  projectModalZoomState.pinchStartScale = projectModalZoomState.zoomScale || PROJECT_MODAL_MIN_SCALE;
  projectModalZoomState.pinchAnchorLocalX = 0;
  projectModalZoomState.pinchAnchorLocalY = 0;
  projectModalZoomState.lastPinchDistance = 0;
  projectModalZoomState.panPointerId = null;
  projectModalZoomState.panStartClientX = 0;
  projectModalZoomState.panStartClientY = 0;
  projectModalZoomState.panStartTranslateX = projectModalZoomState.translateX || 0;
  projectModalZoomState.panStartTranslateY = projectModalZoomState.translateY || 0;

  if (projectModalZoomState.image) {
    projectModalZoomState.image.classList.remove("is-dragging");
  }
}

function ensureProjectModalZoom() {
  if (projectModalZoomState) {
    return projectModalZoomState;
  }

  if (!projectModalMedia || !projectModalImage) {
    return null;
  }

  const media = projectModalMedia;
  const image = projectModalImage;
  image.draggable = false;

  const preventBrowserGesture = (event) => {
    if (!(projectModal && projectModal.classList.contains("open"))) return;
    event.preventDefault();
  };

  media.addEventListener("gesturestart", preventBrowserGesture, { passive: false });
  media.addEventListener("gesturechange", preventBrowserGesture, { passive: false });
  media.addEventListener("gestureend", preventBrowserGesture, { passive: false });

  image.addEventListener("load", () => {
    if (!projectModalZoomState) return;
    applyProjectModalTransform(
      projectModalZoomState.zoomScale,
      projectModalZoomState.translateX,
      projectModalZoomState.translateY
    );
  });

  const onTouchPointerDown = (event) => {
    if (!(projectModal && projectModal.classList.contains("open"))) return;
    if (event.pointerType !== "touch") return;
    if (!projectModalZoomState) return;

    if (typeof media.setPointerCapture === "function") {
      try {
        media.setPointerCapture(event.pointerId);
      } catch {
        // Ignore unsupported pointer capture environments.
      }
    }

    projectModalZoomState.activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });

    if (projectModalZoomState.activePointers.size === 1 && projectModalZoomState.zoomScale > PROJECT_MODAL_MIN_SCALE + 0.001) {
      projectModalZoomState.panPointerId = event.pointerId;
      projectModalZoomState.panStartClientX = event.clientX;
      projectModalZoomState.panStartClientY = event.clientY;
      projectModalZoomState.panStartTranslateX = projectModalZoomState.translateX;
      projectModalZoomState.panStartTranslateY = projectModalZoomState.translateY;
      image.classList.add("is-dragging");
    }

    if (projectModalZoomState.activePointers.size < 2) return;

    image.classList.remove("is-dragging");
    projectModalZoomState.panPointerId = null;
    const activePointers = Array.from(projectModalZoomState.activePointers.values());
    const firstPointer = activePointers[0];
    const secondPointer = activePointers[1];

    projectModalZoomState.pinchStartDistance = Math.max(getPointersDistance(firstPointer, secondPointer), 1);
    projectModalZoomState.pinchStartScale = projectModalZoomState.zoomScale || PROJECT_MODAL_MIN_SCALE;
    const midpoint = getPointersMidpoint(firstPointer, secondPointer);
    const stageCenter = getStageViewportCenter(media);
    const activeScale = projectModalZoomState.pinchStartScale || PROJECT_MODAL_MIN_SCALE;

    projectModalZoomState.pinchAnchorLocalX = (midpoint.clientX - stageCenter.clientX - projectModalZoomState.translateX) / activeScale;
    projectModalZoomState.pinchAnchorLocalY = (midpoint.clientY - stageCenter.clientY - projectModalZoomState.translateY) / activeScale;
    projectModalZoomState.lastPinchDistance = projectModalZoomState.pinchStartDistance;
  };

  const onTouchPointerMove = (event) => {
    if (!(projectModal && projectModal.classList.contains("open"))) return;
    if (event.pointerType !== "touch") return;
    if (!projectModalZoomState) return;
    if (!projectModalZoomState.activePointers.has(event.pointerId)) return;

    projectModalZoomState.activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });

    if (projectModalZoomState.activePointers.size >= 2) {
      event.preventDefault();
      const activePointers = Array.from(projectModalZoomState.activePointers.values());
      const firstPointer = activePointers[0];
      const secondPointer = activePointers[1];

      const currentDistance = Math.max(getPointersDistance(firstPointer, secondPointer), 1);
      if (!projectModalZoomState.lastPinchDistance) {
        projectModalZoomState.lastPinchDistance = currentDistance;
        return;
      }

      const currentScale = projectModalZoomState.zoomScale || PROJECT_MODAL_MIN_SCALE;
      const midpoint = getPointersMidpoint(firstPointer, secondPointer);
      const stageCenter = getStageViewportCenter(media);
      const anchorLocalX = (midpoint.clientX - stageCenter.clientX - projectModalZoomState.translateX) / currentScale;
      const anchorLocalY = (midpoint.clientY - stageCenter.clientY - projectModalZoomState.translateY) / currentScale;

      const distanceRatio = currentDistance / projectModalZoomState.lastPinchDistance;
      const nextScale = currentScale * distanceRatio;
      const nextTranslateX = midpoint.clientX - stageCenter.clientX - anchorLocalX * nextScale;
      const nextTranslateY = midpoint.clientY - stageCenter.clientY - anchorLocalY * nextScale;

      applyProjectModalTransform(nextScale, nextTranslateX, nextTranslateY);
      projectModalZoomState.lastPinchDistance = currentDistance;
      return;
    }

    if (projectModalZoomState.panPointerId !== event.pointerId) return;
    if (projectModalZoomState.zoomScale <= PROJECT_MODAL_MIN_SCALE + 0.001) return;

    event.preventDefault();
    const deltaX = event.clientX - projectModalZoomState.panStartClientX;
    const deltaY = event.clientY - projectModalZoomState.panStartClientY;
    applyProjectModalTransform(
      projectModalZoomState.zoomScale,
      projectModalZoomState.panStartTranslateX + deltaX,
      projectModalZoomState.panStartTranslateY + deltaY
    );
    image.classList.add("is-dragging");
  };

  const onTouchPointerEnd = (event) => {
    if (event.pointerType !== "touch") return;
    if (!projectModalZoomState || !projectModalZoomState.activePointers) return;

    projectModalZoomState.activePointers.delete(event.pointerId);

    if (typeof media.releasePointerCapture === "function") {
      try {
        media.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore unsupported pointer capture environments.
      }
    }

    if (projectModalZoomState.panPointerId === event.pointerId) {
      projectModalZoomState.panPointerId = null;
      image.classList.remove("is-dragging");
    }

    if (projectModalZoomState.activePointers.size >= 2) {
      const activePointers = Array.from(projectModalZoomState.activePointers.values());
      const firstPointer = activePointers[0];
      const secondPointer = activePointers[1];
      projectModalZoomState.pinchStartDistance = Math.max(getPointersDistance(firstPointer, secondPointer), 1);
      projectModalZoomState.pinchStartScale = projectModalZoomState.zoomScale || PROJECT_MODAL_MIN_SCALE;
      const midpoint = getPointersMidpoint(firstPointer, secondPointer);
      const stageCenter = getStageViewportCenter(media);
      const activeScale = projectModalZoomState.pinchStartScale || PROJECT_MODAL_MIN_SCALE;

      projectModalZoomState.pinchAnchorLocalX = (midpoint.clientX - stageCenter.clientX - projectModalZoomState.translateX) / activeScale;
      projectModalZoomState.pinchAnchorLocalY = (midpoint.clientY - stageCenter.clientY - projectModalZoomState.translateY) / activeScale;
      projectModalZoomState.lastPinchDistance = projectModalZoomState.pinchStartDistance;
      return;
    }

    projectModalZoomState.pinchStartDistance = 0;
    projectModalZoomState.pinchStartScale = projectModalZoomState.zoomScale || PROJECT_MODAL_MIN_SCALE;
    projectModalZoomState.pinchAnchorLocalX = 0;
    projectModalZoomState.pinchAnchorLocalY = 0;
    projectModalZoomState.lastPinchDistance = 0;

    if (projectModalZoomState.activePointers.size === 1 && projectModalZoomState.zoomScale > PROJECT_MODAL_MIN_SCALE + 0.001) {
      const remainingEntry = Array.from(projectModalZoomState.activePointers.entries())[0];
      if (remainingEntry) {
        const [remainingPointerId, remainingPointer] = remainingEntry;
        projectModalZoomState.panPointerId = remainingPointerId;
        projectModalZoomState.panStartClientX = remainingPointer.clientX;
        projectModalZoomState.panStartClientY = remainingPointer.clientY;
        projectModalZoomState.panStartTranslateX = projectModalZoomState.translateX;
        projectModalZoomState.panStartTranslateY = projectModalZoomState.translateY;
        image.classList.add("is-dragging");
      }
      return;
    }

    image.classList.remove("is-dragging");
  };

  media.addEventListener("pointerdown", onTouchPointerDown);
  media.addEventListener("pointermove", onTouchPointerMove);
  media.addEventListener("pointerup", onTouchPointerEnd);
  media.addEventListener("pointercancel", onTouchPointerEnd);

  projectModalZoomState = {
    media,
    image,
    zoomScale: PROJECT_MODAL_MIN_SCALE,
    translateX: 0,
    translateY: 0,
    activePointers: new Map(),
    pinchStartDistance: 0,
    pinchStartScale: PROJECT_MODAL_MIN_SCALE,
    pinchAnchorLocalX: 0,
    pinchAnchorLocalY: 0,
    lastPinchDistance: 0,
    panPointerId: null,
    panStartClientX: 0,
    panStartClientY: 0,
    panStartTranslateX: 0,
    panStartTranslateY: 0
  };

  resetProjectModalTransform();
  resetProjectModalPinchState();

  return projectModalZoomState;
}

function refreshOpenProjectModal() {
  if (!activeProjectId || !projectModal || !projectModal.classList.contains("open")) return;

  const project = projectCatalog.get(activeProjectId);
  if (!project) {
    closeProjectModal();
    return;
  }

  const dictionary = getDictionary();
  projectModalTitle.textContent = safeText(project.title);
  projectModalDescription.textContent = buildMediaDescription(
    safeText(project.detail),
    safeText(project.text),
    dictionary
  );
  if (projectModalImage) {
    projectModalImage.src = safeText(project.image, "images/experience-proof-1.svg");
    projectModalImage.alt = buildMediaTitle(
      safeText(project.alt),
      safeText(project.title),
      dictionary
    );
  }
  ensureProjectModalZoom();
  resetProjectModalTransform();
  resetProjectModalPinchState();
}

function openProjectModal(projectId) {
  const project = projectCatalog.get(projectId);
  if (!project || !projectModal) return;

  activeProjectId = projectId;

  const dictionary = getDictionary();
  projectModalTitle.textContent = safeText(project.title);
  projectModalDescription.textContent = buildMediaDescription(
    safeText(project.detail),
    safeText(project.text),
    dictionary
  );
  if (projectModalImage) {
    projectModalImage.src = safeText(project.image, "images/experience-proof-1.svg");
    projectModalImage.alt = buildMediaTitle(
      safeText(project.alt),
      safeText(project.title),
      dictionary
    );
  }

  ensureProjectModalZoom();
  resetProjectModalTransform();
  resetProjectModalPinchState();

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  if (!projectModal) return;

  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  resetProjectModalTransform();
  resetProjectModalPinchState();
  if (projectModalImage) {
    projectModalImage.src = "";
    projectModalImage.alt = "";
  }
  if (!(galleryLightboxState && galleryLightboxState.overlay && galleryLightboxState.overlay.classList.contains("open"))) {
    document.body.style.overflow = "";
  }
}

function updatePageTransitionMessage(dictionary) {
  ensurePageTransitionLoader();
  if (!pageTransitionMessage) return;
  pageTransitionMessage.textContent = safeText(dictionary.pageLoaderMessage, "Anda akan memasuki halaman lanjutan...");
}

function resetPageTransitionLoader() {
  if (pageTransitionTimer) {
    clearTimeout(pageTransitionTimer);
    pageTransitionTimer = undefined;
  }

  if (!pageTransitionLoader) return;

  pageTransitionLoader.classList.remove("is-active");
  pageTransitionLoader.setAttribute("aria-hidden", "true");
  document.body.classList.remove("page-transition-active");
}

function showPageTransitionLoader(destinationUrl) {
  if (!destinationUrl) return;
  ensurePageTransitionLoader();

  if (!pageTransitionLoader) {
    window.location.assign(destinationUrl);
    return;
  }

  if (pageTransitionTimer) {
    clearTimeout(pageTransitionTimer);
  }

  pageTransitionLoader.classList.add("is-active");
  pageTransitionLoader.setAttribute("aria-hidden", "false");
  document.body.classList.add("page-transition-active");

  pageTransitionTimer = window.setTimeout(() => {
    window.location.assign(destinationUrl);
  }, PAGE_TRANSITION_DELAY);
}

function initPageTransitionLinks() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("a");
    if (!(link instanceof HTMLAnchorElement)) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    if (link.download) return;
    if (link.dataset.pageLoader === "false") return;

    const rawHref = safeText(link.getAttribute("href")).trim();
    if (!rawHref || rawHref.startsWith("#")) return;
    if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return;

    let destinationUrl;
    try {
      destinationUrl = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (destinationUrl.origin !== window.location.origin) return;

    const sameDocument =
      destinationUrl.pathname === window.location.pathname && destinationUrl.search === window.location.search;
    if (sameDocument && destinationUrl.hash) return;
    if (!isMainDetailTransition(destinationUrl)) return;

    event.preventDefault();
    showPageTransitionLoader(destinationUrl.href);
  });

  window.addEventListener("pageshow", () => {
    resetPageTransitionLoader();
  });
}

function resolveGallerySourcePath(source) {
  const rawSource = safeText(source).trim();
  if (!rawSource) return "";

  if (/^(https?:\/\/|data:|blob:)/i.test(rawSource)) return rawSource;
  if (rawSource.startsWith("/") || rawSource.startsWith("./") || rawSource.startsWith("../")) return rawSource;

  return `../${rawSource.replace(/^\/+/, "")}`;
}

function normalizeConfiguredGalleryItem(entry, index, dictionary) {
  const normalizedEntry = isPlainObject(entry) ? entry : {};
  const source = typeof entry === "string" ? entry : safeText(normalizedEntry.src);
  const resolvedSource = resolveGallerySourcePath(source);
  if (!resolvedSource) return null;

  const photoPrefix = safeText(dictionary.galleryPhotoPrefix, "Foto");
  const fallbackCaption = `${photoPrefix} ${index + 1}`;
  const caption = safeText(normalizedEntry.caption, fallbackCaption);
  const alt = safeText(normalizedEntry.alt, caption);
  const width = Number(normalizedEntry.width);
  const height = Number(normalizedEntry.height);

  return {
    src: resolvedSource,
    caption,
    alt,
    width: Number.isFinite(width) && width > 0 ? String(Math.round(width)) : "",
    height: Number.isFinite(height) && height > 0 ? String(Math.round(height)) : ""
  };
}

function buildGalleryItems(dictionary) {
  const configuredItems = safeArray(window.portfolioGalleryItems);
  const normalizedConfigured = configuredItems
    .map((entry, index) => normalizeConfiguredGalleryItem(entry, index, dictionary))
    .filter(Boolean);

  if (normalizedConfigured.length) {
    return normalizedConfigured;
  }

  const dummyCaptionPrefix = safeText(dictionary.galleryDummyCaptionPrefix, "Dummy");
  const dummyAltPrefix = safeText(dictionary.galleryDummyAltPrefix, "Dummy galeri");

  return GALLERY_DUMMY_ITEMS.map((item, index) => ({
    src: resolveGallerySourcePath(item.src),
    caption: `${dummyCaptionPrefix} ${String(index + 1).padStart(2, "0")}`,
    alt: `${dummyAltPrefix} ${index + 1}`
  }));
}

function createGalleryTile(source, dictionary) {
  const figure = document.createElement("figure");
  figure.className = "gallery-tile";

  const image = document.createElement("img");
  image.className = "gallery-tile-image";
  image.loading = "lazy";
  image.decoding = "async";
  image.src = safeText(source.src);
  image.alt = safeText(source.alt, safeText(source.caption));
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute(
    "aria-label",
    `${safeText(dictionary.galleryOpenPhotoAriaPrefix, "Buka foto")}: ${safeText(source.caption)}`
  );
  if (safeText(source.width)) image.setAttribute("width", safeText(source.width));
  if (safeText(source.height)) image.setAttribute("height", safeText(source.height));

  const caption = document.createElement("figcaption");
  caption.textContent = safeText(source.caption);

  figure.append(image, caption);
  return figure;
}

function renderGalleryItems() {
  if (!galleryWall) return;

  const dictionary = getDictionary();
  const galleryItems = buildGalleryItems(dictionary);
  const fragment = document.createDocumentFragment();

  galleryItems.forEach((item) => {
    fragment.append(createGalleryTile(item, dictionary));
  });

  galleryWall.replaceChildren(fragment);
}

function closeGalleryLightbox() {
  if (!galleryLightboxState || !galleryLightboxState.overlay) return;
  if (!galleryLightboxState.overlay.classList.contains("open")) return;

  galleryLightboxState.overlay.classList.remove("open");
  galleryLightboxState.overlay.setAttribute("aria-hidden", "true");
  if (galleryLightboxState.image) {
    galleryLightboxState.image.src = "";
    galleryLightboxState.image.style.transform = "";
    galleryLightboxState.image.style.transformOrigin = "";
    galleryLightboxState.image.classList.remove("is-zoomed");
    galleryLightboxState.image.classList.remove("is-dragging");
  }
  if (galleryLightboxState.caption) {
    galleryLightboxState.caption.textContent = "";
  }
  if (galleryLightboxState.description) {
    galleryLightboxState.description.textContent = "";
  }
  if (galleryLightboxState.stage) {
    galleryLightboxState.stage.scrollLeft = 0;
    galleryLightboxState.stage.scrollTop = 0;
  }
  if (galleryLightboxState.activePointers) {
    galleryLightboxState.activePointers.clear();
  }
  galleryLightboxState.zoomScale = GALLERY_LIGHTBOX_MIN_SCALE;
  galleryLightboxState.translateX = 0;
  galleryLightboxState.translateY = 0;
  galleryLightboxState.pinchStartDistance = 0;
  galleryLightboxState.pinchStartScale = GALLERY_LIGHTBOX_MIN_SCALE;
  galleryLightboxState.pinchAnchorLocalX = 0;
  galleryLightboxState.pinchAnchorLocalY = 0;
  galleryLightboxState.panPointerId = null;
  galleryLightboxState.panStartClientX = 0;
  galleryLightboxState.panStartClientY = 0;
  galleryLightboxState.panStartTranslateX = 0;
  galleryLightboxState.panStartTranslateY = 0;

  if (!(projectModal && projectModal.classList.contains("open"))) {
    document.body.style.overflow = "";
  }
}

function clampGalleryLightboxTranslation(scale, translateX, translateY) {
  if (!galleryLightboxState || !galleryLightboxState.stage || !galleryLightboxState.image) {
    return { x: translateX, y: translateY };
  }

  const stageWidth = galleryLightboxState.stage.clientWidth;
  const stageHeight = galleryLightboxState.stage.clientHeight;
  const imageBaseWidth = galleryLightboxState.image.offsetWidth;
  const imageBaseHeight = galleryLightboxState.image.offsetHeight;

  if (!stageWidth || !stageHeight || !imageBaseWidth || !imageBaseHeight) {
    return { x: translateX, y: translateY };
  }

  const scaledWidth = imageBaseWidth * scale;
  const scaledHeight = imageBaseHeight * scale;
  const maxTranslateX = Math.max(0, (scaledWidth - stageWidth) / 2);
  const maxTranslateY = Math.max(0, (scaledHeight - stageHeight) / 2);

  return {
    x: clampNumber(translateX, -maxTranslateX, maxTranslateX),
    y: clampNumber(translateY, -maxTranslateY, maxTranslateY)
  };
}

function applyGalleryLightboxTransform(scale, translateX = 0, translateY = 0) {
  if (!galleryLightboxState || !galleryLightboxState.image) return;

  const nextScale = clampNumber(Number(scale) || GALLERY_LIGHTBOX_MIN_SCALE, GALLERY_LIGHTBOX_MIN_SCALE, GALLERY_LIGHTBOX_MAX_SCALE);
  let nextTranslateX = Number.isFinite(translateX) ? translateX : 0;
  let nextTranslateY = Number.isFinite(translateY) ? translateY : 0;

  if (nextScale <= GALLERY_LIGHTBOX_MIN_SCALE + 0.001) {
    nextTranslateX = 0;
    nextTranslateY = 0;
  }

  const clampedTranslation = clampGalleryLightboxTranslation(nextScale, nextTranslateX, nextTranslateY);

  galleryLightboxState.zoomScale = nextScale;
  galleryLightboxState.translateX = clampedTranslation.x;
  galleryLightboxState.translateY = clampedTranslation.y;

  galleryLightboxState.image.style.transformOrigin = "50% 50%";
  galleryLightboxState.image.style.transform = `translate3d(${clampedTranslation.x}px, ${clampedTranslation.y}px, 0) scale(${nextScale})`;
  galleryLightboxState.image.classList.toggle("is-zoomed", nextScale > GALLERY_LIGHTBOX_MIN_SCALE + 0.001);

  if (nextScale <= GALLERY_LIGHTBOX_MIN_SCALE + 0.001) {
    galleryLightboxState.image.classList.remove("is-dragging");
  }
}

function resetGalleryLightboxTransform() {
  applyGalleryLightboxTransform(GALLERY_LIGHTBOX_MIN_SCALE, 0, 0);
}

function resetGalleryPinchState() {
  if (!galleryLightboxState) return;
  if (galleryLightboxState.activePointers) {
    galleryLightboxState.activePointers.clear();
  }
  galleryLightboxState.pinchStartDistance = 0;
  galleryLightboxState.pinchStartScale = galleryLightboxState.zoomScale || GALLERY_LIGHTBOX_MIN_SCALE;
  galleryLightboxState.pinchAnchorLocalX = 0;
  galleryLightboxState.pinchAnchorLocalY = 0;
  galleryLightboxState.panPointerId = null;
  galleryLightboxState.panStartClientX = 0;
  galleryLightboxState.panStartClientY = 0;
  galleryLightboxState.panStartTranslateX = galleryLightboxState.translateX || 0;
  galleryLightboxState.panStartTranslateY = galleryLightboxState.translateY || 0;
  if (galleryLightboxState.image) {
    galleryLightboxState.image.classList.remove("is-dragging");
  }
}

function createGalleryLightboxButton(text, ariaLabel) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gallery-lightbox-btn";
  button.setAttribute("aria-label", ariaLabel);
  button.textContent = text;
  return button;
}

function updateGalleryLightboxLabels(dictionary) {
  if (!galleryLightboxState || !galleryLightboxState.overlay) return;
  const closeButton = galleryLightboxState.overlay.querySelector("[data-lightbox-close='true']");
  if (!(closeButton instanceof HTMLButtonElement)) return;
  closeButton.setAttribute("aria-label", safeText(dictionary.galleryClosePhotoAriaLabel, "Tutup foto"));
}

function ensureGalleryLightbox() {
  if (galleryLightboxState) {
    return galleryLightboxState;
  }

  const overlay = document.createElement("div");
  overlay.className = "gallery-lightbox";
  overlay.id = "gallery-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-labelledby", "gallery-lightbox-caption");

  const panel = document.createElement("div");
  panel.className = "gallery-lightbox-panel";

  const toolbar = document.createElement("div");
  toolbar.className = "gallery-lightbox-toolbar";

  const caption = document.createElement("h3");
  caption.className = "gallery-lightbox-caption";
  caption.id = "gallery-lightbox-caption";

  const controls = document.createElement("div");
  controls.className = "gallery-lightbox-controls";

  const close = createGalleryLightboxButton(
    "\u00d7",
    safeText(getDictionary().galleryClosePhotoAriaLabel, "Tutup foto")
  );
  close.setAttribute("data-lightbox-close", "true");
  close.classList.add("gallery-lightbox-close");

  controls.append(close);
  toolbar.append(controls);

  const content = document.createElement("div");
  content.className = "gallery-lightbox-content";

  const stage = document.createElement("div");
  stage.className = "gallery-lightbox-stage";

  const image = document.createElement("img");
  image.className = "gallery-lightbox-image";
  image.loading = "eager";
  image.decoding = "async";
  image.alt = "";

  const detailPanel = document.createElement("div");
  detailPanel.className = "gallery-lightbox-detail";

  const description = document.createElement("p");
  description.className = "gallery-lightbox-description";

  stage.append(image);
  detailPanel.append(caption, description);
  content.append(stage, detailPanel);
  panel.append(toolbar, content);
  overlay.append(panel);
  document.body.append(overlay);

  panel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const closeButton = target.closest("[data-lightbox-close='true']");
    if (closeButton) {
      closeGalleryLightbox();
    }
  });

  overlay.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target === overlay) {
      closeGalleryLightbox();
    }
  });

  const preventBrowserGesture = (event) => {
    if (!overlay.classList.contains("open")) return;
    event.preventDefault();
  };

  overlay.addEventListener("gesturestart", preventBrowserGesture, { passive: false });
  overlay.addEventListener("gesturechange", preventBrowserGesture, { passive: false });
  overlay.addEventListener("gestureend", preventBrowserGesture, { passive: false });

  image.addEventListener("load", () => {
    if (!galleryLightboxState) return;
    applyGalleryLightboxTransform(galleryLightboxState.zoomScale, galleryLightboxState.translateX, galleryLightboxState.translateY);
  });

  const onTouchPointerDown = (event) => {
    if (!overlay.classList.contains("open")) return;
    if (event.pointerType !== "touch") return;
    if (!galleryLightboxState) return;

    if (typeof stage.setPointerCapture === "function") {
      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        // Ignore unsupported pointer capture environments.
      }
    }

    galleryLightboxState.activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });

    if (galleryLightboxState.activePointers.size === 1 && galleryLightboxState.zoomScale > GALLERY_LIGHTBOX_MIN_SCALE + 0.001) {
      galleryLightboxState.panPointerId = event.pointerId;
      galleryLightboxState.panStartClientX = event.clientX;
      galleryLightboxState.panStartClientY = event.clientY;
      galleryLightboxState.panStartTranslateX = galleryLightboxState.translateX;
      galleryLightboxState.panStartTranslateY = galleryLightboxState.translateY;
      image.classList.add("is-dragging");
    }

    if (galleryLightboxState.activePointers.size < 2) return;

    image.classList.remove("is-dragging");
    galleryLightboxState.panPointerId = null;
    const activePointers = Array.from(galleryLightboxState.activePointers.values());
    const firstPointer = activePointers[0];
    const secondPointer = activePointers[1];

    galleryLightboxState.pinchStartDistance = Math.max(getPointersDistance(firstPointer, secondPointer), 1);
    galleryLightboxState.pinchStartScale = galleryLightboxState.zoomScale || GALLERY_LIGHTBOX_MIN_SCALE;
    const midpoint = getPointersMidpoint(firstPointer, secondPointer);
    const stageCenter = getStageViewportCenter(stage);
    const activeScale = galleryLightboxState.pinchStartScale || GALLERY_LIGHTBOX_MIN_SCALE;

    galleryLightboxState.pinchAnchorLocalX = (midpoint.clientX - stageCenter.clientX - galleryLightboxState.translateX) / activeScale;
    galleryLightboxState.pinchAnchorLocalY = (midpoint.clientY - stageCenter.clientY - galleryLightboxState.translateY) / activeScale;
  };

  const onTouchPointerMove = (event) => {
    if (!overlay.classList.contains("open")) return;
    if (event.pointerType !== "touch") return;
    if (!galleryLightboxState) return;
    if (!galleryLightboxState.activePointers.has(event.pointerId)) return;

    galleryLightboxState.activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });

    if (galleryLightboxState.activePointers.size >= 2) {
      event.preventDefault();
      const activePointers = Array.from(galleryLightboxState.activePointers.values());
      const firstPointer = activePointers[0];
      const secondPointer = activePointers[1];

      if (!galleryLightboxState.pinchStartDistance) {
        galleryLightboxState.pinchStartDistance = Math.max(getPointersDistance(firstPointer, secondPointer), 1);
        galleryLightboxState.pinchStartScale = galleryLightboxState.zoomScale || GALLERY_LIGHTBOX_MIN_SCALE;

        const midpoint = getPointersMidpoint(firstPointer, secondPointer);
        const stageCenter = getStageViewportCenter(stage);
        const activeScale = galleryLightboxState.pinchStartScale || GALLERY_LIGHTBOX_MIN_SCALE;
        galleryLightboxState.pinchAnchorLocalX = (midpoint.clientX - stageCenter.clientX - galleryLightboxState.translateX) / activeScale;
        galleryLightboxState.pinchAnchorLocalY = (midpoint.clientY - stageCenter.clientY - galleryLightboxState.translateY) / activeScale;
      }

      const currentDistance = Math.max(getPointersDistance(firstPointer, secondPointer), 1);
      const distanceRatio = currentDistance / galleryLightboxState.pinchStartDistance;
      const nextScale = (galleryLightboxState.pinchStartScale || GALLERY_LIGHTBOX_MIN_SCALE) * distanceRatio;
      const midpoint = getPointersMidpoint(firstPointer, secondPointer);
      const stageCenter = getStageViewportCenter(stage);
      const anchorLocalX = Number.isFinite(galleryLightboxState.pinchAnchorLocalX) ? galleryLightboxState.pinchAnchorLocalX : 0;
      const anchorLocalY = Number.isFinite(galleryLightboxState.pinchAnchorLocalY) ? galleryLightboxState.pinchAnchorLocalY : 0;

      const nextTranslateX = midpoint.clientX - stageCenter.clientX - anchorLocalX * nextScale;
      const nextTranslateY = midpoint.clientY - stageCenter.clientY - anchorLocalY * nextScale;

      applyGalleryLightboxTransform(nextScale, nextTranslateX, nextTranslateY);
      return;
    }

    if (galleryLightboxState.panPointerId !== event.pointerId) return;
    if (galleryLightboxState.zoomScale <= GALLERY_LIGHTBOX_MIN_SCALE + 0.001) return;

    event.preventDefault();
    const deltaX = event.clientX - galleryLightboxState.panStartClientX;
    const deltaY = event.clientY - galleryLightboxState.panStartClientY;
    applyGalleryLightboxTransform(
      galleryLightboxState.zoomScale,
      galleryLightboxState.panStartTranslateX + deltaX,
      galleryLightboxState.panStartTranslateY + deltaY
    );
    image.classList.add("is-dragging");
  };

  const onTouchPointerEnd = (event) => {
    if (event.pointerType !== "touch") return;
    if (!galleryLightboxState || !galleryLightboxState.activePointers) return;

    galleryLightboxState.activePointers.delete(event.pointerId);

    if (typeof stage.releasePointerCapture === "function") {
      try {
        stage.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore unsupported pointer capture environments.
      }
    }

    if (galleryLightboxState.panPointerId === event.pointerId) {
      galleryLightboxState.panPointerId = null;
      image.classList.remove("is-dragging");
    }

    if (galleryLightboxState.activePointers.size >= 2) {
      const activePointers = Array.from(galleryLightboxState.activePointers.values());
      const firstPointer = activePointers[0];
      const secondPointer = activePointers[1];
      galleryLightboxState.pinchStartDistance = Math.max(getPointersDistance(firstPointer, secondPointer), 1);
      galleryLightboxState.pinchStartScale = galleryLightboxState.zoomScale || GALLERY_LIGHTBOX_MIN_SCALE;
      const midpoint = getPointersMidpoint(firstPointer, secondPointer);
      const stageCenter = getStageViewportCenter(stage);
      const activeScale = galleryLightboxState.pinchStartScale || GALLERY_LIGHTBOX_MIN_SCALE;

      galleryLightboxState.pinchAnchorLocalX = (midpoint.clientX - stageCenter.clientX - galleryLightboxState.translateX) / activeScale;
      galleryLightboxState.pinchAnchorLocalY = (midpoint.clientY - stageCenter.clientY - galleryLightboxState.translateY) / activeScale;
      return;
    }

    galleryLightboxState.pinchStartDistance = 0;
    galleryLightboxState.pinchStartScale = galleryLightboxState.zoomScale || GALLERY_LIGHTBOX_MIN_SCALE;
    galleryLightboxState.pinchAnchorLocalX = 0;
    galleryLightboxState.pinchAnchorLocalY = 0;

    if (galleryLightboxState.activePointers.size === 1 && galleryLightboxState.zoomScale > GALLERY_LIGHTBOX_MIN_SCALE + 0.001) {
      const remainingEntry = Array.from(galleryLightboxState.activePointers.entries())[0];
      if (remainingEntry) {
        const [remainingPointerId, remainingPointer] = remainingEntry;
        galleryLightboxState.panPointerId = remainingPointerId;
        galleryLightboxState.panStartClientX = remainingPointer.clientX;
        galleryLightboxState.panStartClientY = remainingPointer.clientY;
        galleryLightboxState.panStartTranslateX = galleryLightboxState.translateX;
        galleryLightboxState.panStartTranslateY = galleryLightboxState.translateY;
        image.classList.add("is-dragging");
      }
      return;
    }

    image.classList.remove("is-dragging");
  };

  stage.addEventListener("pointerdown", onTouchPointerDown);
  stage.addEventListener("pointermove", onTouchPointerMove);
  stage.addEventListener("pointerup", onTouchPointerEnd);
  stage.addEventListener("pointercancel", onTouchPointerEnd);

  galleryLightboxState = {
    overlay,
    panel,
    stage,
    image,
    caption,
    description,
    zoomScale: GALLERY_LIGHTBOX_MIN_SCALE,
    translateX: 0,
    translateY: 0,
    activePointers: new Map(),
    pinchStartDistance: 0,
    pinchStartScale: GALLERY_LIGHTBOX_MIN_SCALE,
    pinchAnchorLocalX: 0,
    pinchAnchorLocalY: 0,
    panPointerId: null,
    panStartClientX: 0,
    panStartClientY: 0,
    panStartTranslateX: 0,
    panStartTranslateY: 0
  };

  resetGalleryLightboxTransform();
  resetGalleryPinchState();

  return galleryLightboxState;
}

function openGalleryLightbox(source, altText, captionText, descriptionText = "") {
  const imageSource = safeText(source);
  if (!imageSource) return;

  const lightbox = ensureGalleryLightbox();
  if (!lightbox) return;

  const dictionary = getDictionary();
  const resolvedTitle = buildMediaTitle(captionText, altText, dictionary);
  const resolvedDescription = buildMediaDescription(descriptionText, captionText || altText, dictionary);

  lightbox.image.src = imageSource;
  lightbox.image.alt = safeText(altText, resolvedTitle);
  lightbox.caption.textContent = resolvedTitle;
  if (lightbox.description) {
    lightbox.description.textContent = resolvedDescription;
  }
  lightbox.overlay.classList.add("open");
  lightbox.overlay.setAttribute("aria-hidden", "false");
  resetGalleryLightboxTransform();
  resetGalleryPinchState();
  lightbox.stage.scrollLeft = 0;
  lightbox.stage.scrollTop = 0;
  document.body.style.overflow = "hidden";
}

function initGalleryLightbox() {
  const detailFigureImages = document.querySelectorAll(".detail-figure img");
  if (!galleryWall && !detailFigureImages.length) return;

  ensureGalleryLightbox();

  if (galleryWall) {
    galleryWall.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const image = target.closest(".gallery-tile-image");
      if (!(image instanceof HTMLImageElement)) return;

      const figure = image.closest(".gallery-tile");
      const captionElement = figure ? figure.querySelector("figcaption") : null;
      const captionText = captionElement ? safeText(captionElement.textContent) : "";

      openGalleryLightbox(image.currentSrc || image.src, image.alt, captionText, captionText);
    });

    galleryWall.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains("gallery-tile-image")) return;

      event.preventDefault();
      const figure = target.closest(".gallery-tile");
      const captionElement = figure ? figure.querySelector("figcaption") : null;
      const captionText = captionElement ? safeText(captionElement.textContent) : "";

      openGalleryLightbox(target.currentSrc || target.src, target.alt, captionText, captionText);
    });
  }

  if (detailFigureImages.length) {
    detailFigureImages.forEach((image) => {
      if (!(image instanceof HTMLImageElement)) return;
      image.classList.add("detail-figure-image");
      image.setAttribute("tabindex", "0");
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const image = target.closest(".detail-figure-image");
      if (!(image instanceof HTMLImageElement)) return;

      const figure = image.closest(".detail-figure");
      const captionElement = figure ? figure.querySelector("figcaption") : null;
      const captionText = captionElement ? safeText(captionElement.textContent) : "";

      openGalleryLightbox(image.currentSrc || image.src, image.alt, image.alt, captionText);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains("detail-figure-image")) return;

      event.preventDefault();
      const figure = target.closest(".detail-figure");
      const captionElement = figure ? figure.querySelector("figcaption") : null;
      const captionText = captionElement ? safeText(captionElement.textContent) : "";

      openGalleryLightbox(target.currentSrc || target.src, target.alt, target.alt, captionText);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!galleryLightboxState || !galleryLightboxState.overlay) return;
    if (!galleryLightboxState.overlay.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeGalleryLightbox();
    }
  });
}

function initProjectDetails() {
  ensureProjectModalZoom();

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

  if (projectModalClose) {
    projectModalClose.addEventListener("click", closeProjectModal);
  }
}

function initScrollReveal() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  const revealElements = document.querySelectorAll(".reveal");
  if (typeof IntersectionObserver !== "function") {
    revealElements.forEach((element) => {
      element.classList.add("visible");
      element.style.transitionDelay = "0s";
    });
    return;
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
      threshold: 0.01
    }
  );

  revealElements.forEach((element, index) => {
    element.classList.remove("visible");
    element.style.transitionDelay = `${Math.min(index * 0.05, 0.35)}s`;
    revealObserver.observe(element);
  });
}

function normalizeHashId(rawHash) {
  return safeText(rawHash).replace(/^#/, "").trim();
}

function getNavbarAnchorOffset() {
  const navbar = document.querySelector(".navbar");
  if (!(navbar instanceof HTMLElement)) return 10;

  const navbarHeight = navbar.getBoundingClientRect().height;
  const extraGap = window.innerWidth <= 680 ? 8 : 10;
  return Math.max(10, Math.ceil(navbarHeight + extraGap));
}

function findHashScrollTargetById(targetId) {
  const target = document.getElementById(targetId);
  if (!(target instanceof HTMLElement)) return null;

  if (target.classList.contains("section")) {
    const sectionTitle = target.querySelector(".section-title");
    if (sectionTitle instanceof HTMLElement) {
      return sectionTitle;
    }
  }

  return target;
}

function scrollToHashTarget(rawHash, behavior = "smooth") {
  const targetId = normalizeHashId(rawHash);
  if (!targetId) return false;

  const target = findHashScrollTargetById(targetId);
  if (!(target instanceof HTMLElement)) return false;

  const targetTop = window.scrollY + target.getBoundingClientRect().top - getNavbarAnchorOffset();
  window.scrollTo({
    top: Math.max(0, Math.round(targetTop)),
    behavior
  });

  return true;
}

function initInPageHashNavigation() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("a[href^='#']");
    if (!(link instanceof HTMLAnchorElement)) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const hashId = normalizeHashId(link.getAttribute("href"));
    if (!hashId) return;

    if (!findHashScrollTargetById(hashId)) return;

    event.preventDefault();
    scrollToHashTarget(hashId, "smooth");

    const nextHash = `#${hashId}`;
    if (window.location.hash !== nextHash) {
      history.pushState(null, "", nextHash);
    }
  });

  window.addEventListener("hashchange", () => {
    if (!window.location.hash) return;
    scrollToHashTarget(window.location.hash, "smooth");
  });

  window.addEventListener("load", () => {
    if (!window.location.hash) return;
    window.requestAnimationFrame(() => {
      scrollToHashTarget(window.location.hash, "auto");
    });
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
      const isOpen = !(navLinks && navLinks.classList.contains("open"));
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
      if (projectModal && projectModal.classList.contains("open")) {
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
      const isOpen = !(mobileLang && mobileLang.classList.contains("open"));
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
  ensurePageTransitionLoader();
  initThemeToggle();
  initLanguageSwitcher();
  initInPageHashNavigation();
  initMobileMenu();
  initProjectDetails();
  initGalleryLightbox();
  initPageTransitionLinks();
  initContactForm();
  applyLanguage(currentLanguage);
}

bootstrap();
