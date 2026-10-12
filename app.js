const products = [
  { id: "SKU 00482", name: "Leche entera", tag: "LÁCTEOS · REFRIGERADO", description: "Leche entera pasteurizada, 1 L. Ideal para desayunos y recetas.", brand: "Alquería", unit: "1 litro", reference: "ALQ-LE-001", emoji: "🥛", category: "Lácteos", subcategory: "Refrigerados" },
  { id: "SKU 00831", name: "Café molido clásico", tag: "DESPENSA · BEBIDAS", description: "Café 100% colombiano, tueste medio, con aroma intenso.", brand: "Águila Roja", unit: "500 g", reference: "AGR-CM-500", emoji: "☕", category: "Despensa", subcategory: "Bebidas" },
  { id: "SKU 00219", name: "Banano premium", tag: "FRUTAS Y VERDURAS · FRESCOS", description: "Banano fresco seleccionado, fuente natural de energía.", brand: "Frescura", unit: "1 kg", reference: "FRU-BA-001", emoji: "🍌", category: "Frutas y verduras", subcategory: "Frutas" },
  { id: "SKU 00674", name: "Detergente líquido", tag: "LIMPIEZA · HOGAR", description: "Limpieza profunda para ropa blanca y de color.", brand: "Ariel", unit: "1.8 litros", reference: "ARI-DL-18", emoji: "🧴", category: "Limpieza", subcategory: "Hogar" },
  { id: "SKU 00902", name: "Galletas de avena", tag: "SNACKS · DESPENSA", description: "Galletas horneadas con avena integral y miel.", brand: "Festival", unit: "12 unidades", reference: "FES-GA-012", emoji: "🍪", category: "Despensa", subcategory: "Snacks" },
  { id: "SKU 00347", name: "Jabón de manos", tag: "CUIDADO PERSONAL · BAÑO", description: "Fórmula suave con aloe vera para uso diario.", brand: "Palmolive", unit: "250 ml", reference: "PAL-JM-250", emoji: "🧼", category: "Cuidado personal", subcategory: "Baño" },
  { id: "SKU 00718", name: "Tomate chonto", tag: "FRUTAS Y VERDURAS · FRESCOS", description: "Tomates maduros, firmes y listos para tus comidas.", brand: "Frescura", unit: "500 g", reference: "FRU-TO-500", emoji: "🍅", category: "Frutas y verduras", subcategory: "Verduras" },
  { id: "SKU 00526", name: "Arroz blanco", tag: "DESPENSA · GRANOS", description: "Arroz blanco de grano largo para acompañar cada receta.", brand: "Diana", unit: "1 kg", reference: "DIA-AR-001", emoji: "🍚", category: "Despensa", subcategory: "Granos" },
  { id: "SKU 00164", name: "Crema dental", tag: "CUIDADO PERSONAL · HIGIENE", description: "Protección anticaries con sensación de frescura duradera.", brand: "Colgate", unit: "75 ml", reference: "COL-CD-075", emoji: "🪥", category: "Cuidado personal", subcategory: "Higiene" },
  { id: "SKU 00876", name: "Agua con gas", tag: "BEBIDAS · REFRIGERADO", description: "Agua mineral con gas, ligera y refrescante.", brand: "Brisa", unit: "600 ml", reference: "BRI-AG-600", emoji: "🫧", category: "Bebidas", subcategory: "Frías" }
];
const categories = [
  { name: "Lácteos", hint: "Fríos y frescos", icon: "🥛" },
  { name: "Despensa", hint: "Secos y bebidas", icon: "◒" },
  { name: "Frutas y verduras", hint: "Frescos", icon: "🍎" },
  { name: "Limpieza", hint: "Hogar", icon: "✦" },
  { name: "Cuidado personal", hint: "Baño y cuerpo", icon: "✧" },
  { name: "Bebidas", hint: "Frías y listas", icon: "◌" }
];
const players = [
  { initials: "LU", name: "Lucía M.", points: 1480, time: "08.42s" },
  { initials: "TM", name: "Tomás R.", points: 1320, time: "09.07s" },
  { initials: "AN", name: "Tú", points: 1240, time: "09.84s", me: true },
  { initials: "SO", name: "Sofía P.", points: 1160, time: "10.21s" }
];
let productIndex = 0;
let score = 0;
let streak = 0;
let correctAnswers = 0;
let seconds = 12;
let timerId;
let locked = false;
let gameOver = false;
const totalRounds = 10;
const $ = (selector) => document.querySelector(selector);
let feedbackAnimationId;

function renderCategories() {
  $("#category-list").innerHTML = categories.map((category) => `<button class="category-button" type="button" data-category="${category.name}"><span class="cat-icon">${category.icon}</span><span><strong>${category.name}</strong><small>${category.hint}</small></span></button>`).join("");
  document.querySelectorAll(".category-button").forEach((button) => button.addEventListener("click", () => answer(button.dataset.category)));
}
function renderLeaderboard() {
  const ranking = [...players].sort((a, b) => b.points - a.points);
  const position = ranking.findIndex((player) => player.me) + 1;
  $("#leaderboard").innerHTML = ranking.map((player, index) => `<div class="leader-row ${player.me ? "me" : ""}" role="listitem" aria-label="${player.name}, posición ${index + 1}, ${player.points.toLocaleString("es-CO")} puntos"><small>${String(index + 1).padStart(2, "0")}</small><span class="leader-avatar" aria-hidden="true">${player.initials}</span><span>${player.name}${player.me ? " (tú)" : ""}</span><b>${player.points.toLocaleString("es-CO")}</b><small>${player.time}</small></div>`).join("");
  $("#your-score").textContent = `${score.toLocaleString("es-CO")} pts`;
  $("#your-position").textContent = position;
}
function renderProduct() {
  const product = products[productIndex % products.length];
  const round = productIndex + 1;
  $("#product-number").textContent = String(round).padStart(2, "0");
  $("#round-label").textContent = `Ronda ${String(round).padStart(2, "0")} / ${totalRounds}`;
  $("#product-id").textContent = product.id;
  $("#product-illustration").querySelector(".product-emoji").textContent = product.emoji;
  $("#product-tag").textContent = product.tag;
  $("#product-name").textContent = product.name;
  $("#product-description").textContent = product.description;
  $("#product-brand").textContent = product.brand;
  $("#product-unit").textContent = product.unit;
  $("#product-reference").textContent = product.reference;
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  $("#product-card").classList.remove("pop");
  void $("#product-card").offsetWidth;
  $("#product-card").classList.add("pop");
  seconds = 12;
  updateTimer();
  locked = false;
}
function updateTimer() { $("#timer").textContent = `00:${String(seconds).padStart(2, "0")}`; }
function showFeedbackAnimation(correct, category) {
  const card = $("#product-card");
  const feedback = $("#feedback");
  const celebration = $("#celebration");
  const selectedButton = [...document.querySelectorAll(".category-button")].find((button) => button.dataset.category === category);
  document.body.classList.remove("answer-correct", "answer-wrong");
  card.classList.remove("answer-correct", "answer-wrong");
  feedback.classList.remove("answer-correct", "answer-wrong");
  document.querySelectorAll(".category-button").forEach((button) => button.classList.remove("selected-correct", "selected-wrong"));
  void card.offsetWidth;
  document.body.classList.add(correct ? "answer-correct" : "answer-wrong");
  card.classList.add(correct ? "answer-correct" : "answer-wrong");
  feedback.classList.add(correct ? "answer-correct" : "answer-wrong");
  if (selectedButton) selectedButton.classList.add(correct ? "selected-correct" : "selected-wrong");
  celebration.classList.toggle("is-visible", correct);
  clearTimeout(feedbackAnimationId);
  feedbackAnimationId = setTimeout(() => {
    document.body.classList.remove("answer-correct", "answer-wrong");
    celebration.classList.remove("is-visible");
  }, 850);
}
function answer(category) {
  if (locked || gameOver) return;
  locked = true;
  const product = products[productIndex % products.length];
  const correct = category === product.category;
  const timeBonus = Math.max(0, seconds * 5);
  const points = correct ? 100 + timeBonus : 0;
  const feedback = $("#feedback");
  if (correct) { score += points; correctAnswers += 1; streak += 1; feedback.textContent = `✓ ¡Correcto! +${points} puntos · ${seconds}s restantes`; feedback.className = "feedback correct"; } else { streak = 0; feedback.textContent = category === "__skipped__" ? `↷ Producto saltado. Era ${product.category}.` : `× Casi. Era ${product.category}. Respira y sigue.`; feedback.className = "feedback wrong"; }
  showFeedbackAnimation(correct, category);
  $("#streak-value").textContent = streak;
  players[2].points = score;
  players[2].time = `${(12 - seconds + 1).toFixed(2)}s`;
  renderLeaderboard();
  productIndex += 1;
  $("#round-progress").textContent = `${String(Math.min(totalRounds, productIndex + 1)).padStart(2, "0")} / ${totalRounds}`;
  $("#round-progress-fill").style.width = `${Math.min(100, ((productIndex + 1) / totalRounds) * 100)}%`;
  clearInterval(timerId);
  if (productIndex + 1 >= totalRounds) {
    setTimeout(endGame, 900);
  } else {
    setTimeout(renderProduct, 900);
    timerId = setInterval(tick, 1000);
  }
}
function tick() { if (locked) return; seconds -= 1; updateTimer(); if (seconds <= 0) answer("__timeout__"); }
function skip() { if (!locked && !gameOver) { answer("__skipped__"); } }
function startTimer() { clearInterval(timerId); timerId = setInterval(tick, 1000); }
function endGame() {
  gameOver = true;
  clearInterval(timerId);
  const ranking = [...players].sort((a, b) => b.points - a.points);
  const position = ranking.findIndex((player) => player.me) + 1;
  const won = position === 1;
  const qualified = position <= 3;
  $("#result-kicker").textContent = won ? "CAMPEÓN DE LA SALA" : qualified ? "TE CLASIFICASTE" : "PARTIDA TERMINADA";
  $("#result-medal").textContent = won ? "🏆" : qualified ? "🎖️" : "💪";
  $("#result-title").textContent = won ? "¡Victoria!" : qualified ? "¡Clasificado!" : "¡Buen intento!";
  $("#result-message").textContent = won ? "Tu velocidad te puso en lo más alto." : qualified ? "Terminaste entre los tres mejores de la sala." : "Practica tu velocidad y vuelve a intentarlo.";
  $("#final-score").textContent = `${score.toLocaleString("es-CO")} pts`;
  $("#final-correct").textContent = `${correctAnswers}/${totalRounds}`;
  $("#final-position").textContent = `#${position}`;
  $("#result-modal").hidden = false;
}
function restartGame() {
  productIndex = 0;
  score = 0;
  streak = 0;
  correctAnswers = 0;
  gameOver = false;
  players[2].points = score;
  players[2].time = "—";
  $("#result-modal").hidden = true;
  $("#streak-value").textContent = streak;
  $("#round-progress").textContent = `01 / ${totalRounds}`;
  $("#round-progress-fill").style.width = "10%";
  renderLeaderboard();
  renderProduct();
  startTimer();
}
function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  $("#theme-toggle").textContent = isDark ? "☀" : "☾";
  $("#theme-toggle").setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
  $("#theme-toggle").setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("shelf-sprint-theme", isDark ? "dark" : "light");
}

renderCategories();
renderLeaderboard();
renderProduct();
startTimer();
$("#skip-button").addEventListener("click", skip);
$("#restart-button").addEventListener("click", restartGame);
$("#theme-toggle").addEventListener("click", () => applyTheme(!document.body.classList.contains("dark-mode")));
$("#copy-room-button").addEventListener("click", async () => {
  const roomCode = "MANGO-42";
  try {
    await navigator.clipboard.writeText(roomCode);
    $("#room-status").textContent = "CÓDIGO COPIADO";
  } catch {
    $("#room-status").textContent = `CÓDIGO ${roomCode}`;
  }
  setTimeout(() => { $("#room-status").textContent = `CÓDIGO ${roomCode}`; }, 1800);
});
applyTheme(localStorage.getItem("shelf-sprint-theme") === "dark");
document.addEventListener("keydown", (event) => { if (event.code === "Space") { event.preventDefault(); skip(); } });
