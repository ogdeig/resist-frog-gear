/* Gift Guide – resilient front-end helpers
   - Safely builds a TOC only if #toc-list exists
   - Ensures each .product-section has a stable id
   - Hardens external links (target+rel)
*/

(function () {
  const onReady = (fn) =>
    (document.readyState === "loading")
      ? document.addEventListener("DOMContentLoaded", fn, { once: true })
      : fn();

  onReady(() => {
    const sections = Array.from(document.querySelectorAll(".product-section"));
    const tocList = document.getElementById("toc-list"); // may not exist (thumb grid version)

    // Give every product section a stable ID
    sections.forEach((sec, i) => {
      if (!sec.id) {
        const base =
          (sec.dataset.title || sec.querySelector(".product-name")?.textContent || `Pick ${i + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        sec.id = base || `pick-${i + 1}`;
      }
    });

    // Build TOC only if #toc-list exists in the HTML
    if (tocList) {
      // Clear any existing children (idempotent)
      while (tocList.firstChild) tocList.removeChild(tocList.firstChild);

      sections.forEach((sec, i) => {
        const title =
          sec.dataset.title ||
          sec.querySelector(".product-name")?.textContent?.trim() ||
          `Pick ${i + 1}`;

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${sec.id}`;
        a.textContent = title;

        // Safe-append (prevents null appendChild errors)
        li.appendChild(a);
        tocList.appendChild(li);
      });
    }

    // Harden external links (Amazon etc.)
    document.querySelectorAll('a[href^="http"]').forEach((a) => {
      try {
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) {
          a.target = "_blank";
          // keep existing rel values and add the required ones without duplicates
          const relSet = new Set(
            (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean)
          );
          ["noopener", "noreferrer"].forEach((v) => relSet.add(v));
          a.setAttribute("rel", Array.from(relSet).join(" "));
        }
      } catch (_) {
        /* ignore invalid URLs */
      }
    });
  });
})();
