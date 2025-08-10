/* theme-toggle.js
   - toggles .light on :root to switch theme
   - persists to localStorage
*/
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const STORAGE_KEY = "harmoniza_theme"; // 'light' or 'dark'

  const apply = (mode) => {
    if (mode === "light") root.classList.add("light");
    else root.classList.remove("light");
    // update icon
    if (toggle) {
      toggle.innerHTML =
        mode === "light"
          ? '<i class="fa-solid fa-sun"></i>'
          : '<i class="fa-solid fa-moon"></i>';
    }
  };

  // read saved
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) apply(saved);
  else {
    // optional: default to system preference
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    apply(prefersLight ? "light" : "dark");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const isLight = root.classList.contains("light");
      const next = isLight ? "dark" : "light";
      apply(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }
})();
