/* main.js
   - search filter
   - lazy background & media observer
   - preloader hide when critical assets loaded
*/

document.addEventListener("DOMContentLoaded", function () {
  // --- SEARCH FILTER ---
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const q = this.value.trim().toLowerCase();
      document.querySelectorAll(".card").forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").toLowerCase();
        const title = (
          card.querySelector("h3")?.textContent || ""
        ).toLowerCase();
        const match = q === "" || tags.includes(q) || title.includes(q);
        card.style.display = match ? "" : "none";
      });
    });
  }

  // --- LAZY BG (for elements with data-bg) ---
  const lazyBgEls = document.querySelectorAll(".lazy-bg");
  if ("IntersectionObserver" in window && lazyBgEls.length) {
    const bgObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const src = el.getAttribute("data-bg");
          if (src) {
            // set background-image
            el.style.backgroundImage = `url('${src}')`;
            el.removeAttribute("data-bg");
          }
          obs.unobserve(el);
        });
      },
      { rootMargin: "200px" }
    );

    lazyBgEls.forEach((el) => bgObserver.observe(el));
  } else {
    // fallback: immediate load
    lazyBgEls.forEach((el) => {
      const src = el.getAttribute("data-bg");
      if (src) el.style.backgroundImage = `url('${src}')`;
    });
  }

  // --- LAZY MEDIA (videos & heavy things) ---
  const lazyMedia = document.querySelectorAll(
    "video[data-src], audio[data-src]"
  );
  if ("IntersectionObserver" in window && lazyMedia.length) {
    const mediaObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const m = entry.target;
          const src = m.getAttribute("data-src");
          if (src) {
            m.src = src;
            m.removeAttribute("data-src");
            m.load && m.load();
          }
          obs.unobserve(m);
        });
      },
      { rootMargin: "300px" }
    );
    lazyMedia.forEach((m) => mediaObserver.observe(m));
  } else {
    lazyMedia.forEach((m) => {
      const src = m.getAttribute("data-src");
      if (src) {
        m.src = src;
        m.removeAttribute("data-src");
      }
    });
  }

  // --- PRELOADER: hide when hero image is loaded or after timeout ---
  const preloader = document.getElementById("preloader");
  let preloaderTimeout = setTimeout(hidePreloader, 3000); // safety timeout

  // If hero background is already set — wait for image load using an Image object
  const hero = document.querySelector("#hero");
  if (hero) {
    const bg = hero.style.backgroundImage || hero.getAttribute("data-bg");
    // get raw src from format url("path")
    let src;
    if (bg && bg.indexOf("url(") === 0) {
      src = bg.replace(/url\(["']?/, "").replace(/["']?\)/, "");
    } else {
      src = hero.getAttribute("data-bg");
    }

    if (src) {
      const img = new Image();
      img.onload = function () {
        clearTimeout(preloaderTimeout);
        hidePreloader();
      };
      img.onerror = function () {
        clearTimeout(preloaderTimeout);
        hidePreloader();
      };
      img.src = src;
    } else {
      // nothing to wait for
      clearTimeout(preloaderTimeout);
      hidePreloader();
    }
  } else {
    clearTimeout(preloaderTimeout);
    hidePreloader();
  }

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hidden");
    // remove node after CSS transition for cleanliness
    setTimeout(() => preloader.remove(), 600);
  }

  // --- small accessibility: remove outline only for mouse ---
  document.addEventListener("mousedown", () =>
    document.body.classList.add("using-mouse")
  );
  document.addEventListener("keydown", () =>
    document.body.classList.remove("using-mouse")
  );
});
