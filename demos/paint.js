"use strict";
for (const button of document.querySelectorAll("[data-color]")) {
  button.addEventListener("click", () => {
    document.querySelector(".room").style.backgroundColor =
      button.dataset.color;
    for (const swatch of document.querySelectorAll("[data-color]"))
      swatch.setAttribute("aria-pressed", String(swatch === button));
    document.getElementById("color-note").textContent =
      `${button.textContent} wall preview · Digital illustration; actual paint colors vary.`;
  });
}
