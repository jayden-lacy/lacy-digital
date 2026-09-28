"use strict";

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
const categoryFromUrl = () =>
  new URLSearchParams(location.search).get("category") === "existing"
    ? "existing"
    : "new";
const categoryLabel = (category) =>
  category === "existing" ? "Improve my website" : "New website";

// Real links retain their normal browser behavior for modified clicks.
const categoryLinks = [...document.querySelectorAll("[data-category]")];
function renderPricing() {
  const category = categoryFromUrl();
  for (const link of categoryLinks) {
    if (link.dataset.category === category)
      link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
  for (const value of ["new", "existing"]) {
    document.getElementById(`packages-${value}`).hidden = value !== category;
  }
  document.getElementById("category-description").textContent =
    category === "new"
      ? "Start from scratch with a website built around your business."
      : "Refresh one homepage, redesign an existing site, or plan a complete rebuild.";
}
if (categoryLinks.length) {
  renderPricing();
  for (const link of categoryLinks)
    link.addEventListener("click", (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      history.pushState(null, "", link.href);
      renderPricing();
    });
  addEventListener("popstate", renderPricing);
}

const form = document.getElementById("inquiry-form");
if (form) {
  const categorySelect = document.getElementById("category");
  const packageSelect = document.getElementById("package");
  const preview = document.getElementById("email-preview");
  const summary = document.getElementById("inquiry-summary");
  const copyStatus = document.getElementById("copy-status");
  const parameters = new URLSearchParams(location.search);
  const suppliedPackage = PACKAGES.find(
    (item) => item.id === parameters.get("package"),
  );
  categorySelect.value = suppliedPackage?.category || categoryFromUrl();

  function setPackages(selectedId = "custom") {
    const matching = PACKAGES.filter(
      (item) => item.category === categorySelect.value,
    );
    packageSelect.replaceChildren(
      new Option("Not sure / custom scope", "custom"),
    );
    for (const item of matching)
      packageSelect.add(
        new Option(
          `${item.name} — ${item.starting ? "from " : ""}${item.price}`,
          item.id,
        ),
      );
    packageSelect.value = matching.some((item) => item.id === selectedId)
      ? selectedId
      : "custom";
    updateProject();
  }
  function updateProject() {
    const existing = categorySelect.value === "existing";
    for (const id of ["existing-url", "existing-fields", "new-fields"]) {
      const fieldset = document.getElementById(id);
      const active = id === "new-fields" ? !existing : existing;
      fieldset.hidden = !active;
      fieldset.disabled = !active;
    }
    const item = PACKAGES.find((item) => item.id === packageSelect.value);
    document.getElementById("selected-package").textContent = item
      ? item.summary
      : "I’ll help you find a suitable scope.";
    const url = new URL(location.href);
    url.searchParams.set("category", categorySelect.value);
    url.searchParams.set("package", packageSelect.value);
    history.replaceState(null, "", url);
    preview.hidden = true;
  }
  setPackages(suppliedPackage?.id);
  categorySelect.addEventListener("change", () => setPackages());
  packageSelect.addEventListener("change", updateProject);
  form.addEventListener("input", () => {
    preview.hidden = true;
  });
  form.addEventListener("submit", (event) => {
    if (event.submitter?.id === "send-inquiry") {
      // Native POST keeps the provider's CAPTCHA and delivery errors visible.
      // Open separately so a failed delivery never discards the filled form.
      return;
    }
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = (key) => String(data.get(key) || "").trim();
    const item = PACKAGES.find((item) => item.id === value("package"));
    const packageName = item
      ? `${item.name} (${item.starting ? "from " : ""}${item.price})`
      : "Custom scope / advice needed";
    const lines = [
      "Lacy Digital — website inquiry",
      "",
      `Project: ${categoryLabel(value("category"))}`,
      `Package: ${packageName}`,
      "",
    ];
    const fields =
      value("category") === "existing"
        ? [
            ["Current website", "website"],
            ["Name", "name"],
            ["Email", "email"],
            ["Business", "business"],
            ["What the business does", "description"],
            ["Preferred timeline", "timeline"],
            ["What needs improving", "improvements"],
            ["What must stay", "preserve"],
            ["Current platform", "platform"],
          ]
        : [
            ["Name", "name"],
            ["Email", "email"],
            ["Business", "business"],
            ["What the business does", "description"],
            ["Preferred timeline", "timeline"],
            ["Pages or sections", "pages"],
            ["Content readiness", "content"],
            ["Example websites", "examples"],
          ];
    for (const [label, key] of fields)
      if (value(key)) lines.push(`${label}: ${value(key)}`, "");
    summary.value = lines.join("\n");
    document.getElementById("open-email").href =
      `mailto:jaydenlacy308@gmail.com?subject=${encodeURIComponent(`${categoryLabel(value("category"))} inquiry — ${item?.name || "Custom scope"}`)}&body=${encodeURIComponent(summary.value)}`;
    copyStatus.textContent = "";
    preview.hidden = false;
    document.getElementById("email-preview-title").focus();
  });
  document
    .getElementById("copy-inquiry")
    .addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(summary.value);
        copyStatus.textContent =
          "Summary copied. Paste it into your email and send it to Jayden.";
      } catch {
        summary.focus();
        summary.select();
        copyStatus.textContent =
          "Select and copy the summary above, then paste it into your email.";
      }
    });
}
