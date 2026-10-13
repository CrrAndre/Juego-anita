(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motion = {
    restart(element, className) {
      if (!element || reducedMotion) return;
      element.classList.remove(className);
      void element.offsetWidth;
      element.classList.add(className);
    },
    revealProduct() {
      this.restart(document.querySelector("#product-card"), "product-enter");
    },
    answer(correct) {
      const card = document.querySelector("#product-card");
      this.restart(card, correct ? "answer-correct" : "answer-wrong");
      this.restart(document.querySelector("#feedback"), correct ? "feedback-correct" : "feedback-wrong");
    },
    celebrate() {
      const celebration = document.querySelector("#celebration");
      if (!celebration || reducedMotion) return;
      celebration.classList.add("is-visible");
      window.setTimeout(() => celebration.classList.remove("is-visible"), 850);
    }
  };

  document.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".product-card");
    if (!card || reducedMotion || window.innerWidth < 760) return;
    const bounds = card.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2.5;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2.5;
    card.style.setProperty("--tilt-x", `${rotateX}deg`);
    card.style.setProperty("--tilt-y", `${rotateY}deg`);
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest(".product-card")) {
      event.target.closest(".product-card").style.setProperty("--tilt-x", "0deg");
      event.target.closest(".product-card").style.setProperty("--tilt-y", "0deg");
    }
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || reducedMotion) return;
    const ripple = document.createElement("span");
    const bounds = button.getBoundingClientRect();
    ripple.className = "button-ripple";
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    button.append(ripple);
    window.setTimeout(() => ripple.remove(), 550);
  });

  window.ShelfMotion = motion;
})();
