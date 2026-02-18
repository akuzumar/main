(function detailPageBootstrap() {
  const THEME_STORAGE_KEY = "zumar-theme";
  const rootBody = document.body;
  const themeToggleButton = document.querySelector("[data-detail-theme-toggle]");

  function readThemePreference() {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return storedTheme !== "light";
    } catch {
      return true;
    }
  }

  function applyTheme(isDark) {
    rootBody.classList.toggle("theme-dark", isDark);

    if (themeToggleButton) {
      themeToggleButton.textContent = isDark ? "Mode Terang" : "Mode Gelap";
      themeToggleButton.setAttribute("aria-pressed", isDark ? "true" : "false");
    }
  }

  function persistTheme(isDark) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
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
