(function detailPageBootstrap() {
  const THEME_STORAGE_KEY = "zumar-theme";
  const THEME_INIT_STORAGE_KEY = "zumar-theme-initialized";
  const rootBody = document.body;
  const rootHtml = document.documentElement;
  const themeToggleButton = document.querySelector("[data-detail-theme-toggle]");

  function readThemePreference() {
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

  function applyTheme(isDark) {
    rootBody.classList.toggle("theme-dark", isDark);
    rootHtml.classList.toggle("theme-dark", isDark);

    if (themeToggleButton) {
      themeToggleButton.textContent = isDark ? "Mode Terang" : "Mode Gelap";
      themeToggleButton.setAttribute("aria-pressed", isDark ? "true" : "false");
    }
  }

  function persistTheme(isDark) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
      localStorage.setItem(THEME_INIT_STORAGE_KEY, "1");
    } catch {
      // Ignore storage limitations
    }
  }

  let isDarkTheme = readThemePreference();
  applyTheme(isDarkTheme);

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      isDarkTheme = !isDarkTheme;
      applyTheme(isDarkTheme);
      persistTheme(isDarkTheme);
    });
  }
})();
