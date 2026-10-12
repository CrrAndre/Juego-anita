const products = [
  { id: "SKU 00482", name: "Leche entera", tag: "LÁCTEOS · REFRIGERADO", description: "Leche entera pasteurizada, 1 L. Ideal para desayunos y recetas.", brand: "Alquería", unit: "1 litro", reference: "ALQ-LE-001", emoji: "🥛", category: "Lácteos", subcategory: "Refrigerados" },
  { id: "SKU 00831", name: "Café molido clásico", tag: "DESPENSA · BEBIDAS", description: "Café 100% colombiano, tueste medio, con aroma intenso.", brand: "Águila Roja", unit: "500 g", reference: "AGR-CM-500", emoji: "☕", category: "Despensa", subcategory: "Bebidas" },
  { id: "SKU 00219", name: "Banano premium", tag: "FRUTAS Y VERDURAS · FRESCOS", description: "Banano fresco seleccionado, fuente natural de energía.", brand: "Frescura", unit: "1 kg", reference: "FRU-BA-001", emoji: "🍌", category: "Frutas y verduras", subcategory: "Frutas" },
  { id: "SKU 00674", name: "Detergente líquido", tag: "LIMPIEZA · HOGAR", description: "Limpieza profunda para ropa blanca y de color.", brand: "Ariel", unit: "1.8 litros", reference: "ARI-DL-18", emoji: "🧴", category: "Limpieza", subcategory: "Hogar" },
  { id: "SKU 00902", name: "Galletas de avena", tag: "SNACKS · DESPENSA", description: "Galletas horneadas con avena integral y miel.", brand: "Festival", unit: "12 unidades", reference: "FES-GA-012", emoji: "🍪", category: "Despensa", subcategory: "Snacks" },
  { id: "SKU 00347", name: "Jabón de manos", tag: "CUIDADO PERSONAL · BAÑO", description: "Fórmula suave con aloe vera para uso diario.", brand: "Palmolive", unit: "250 ml", reference: "PAL-JM-250", emoji: "🧼", category: "Cuidado personal", subcategory: "Baño" }
];
const categories = [
  { name: "Lácteos", hint: "Fríos y frescos", icon: "🥛" },
  { name: "Despensa", hint: "Secos y bebidas", icon: "◒" },
  { name: "Frutas y verduras", hint: "Frescos", icon: "🍎" },
  { name: "Limpieza", hint: "Hogar", icon: "✦" },
  { name: "Cuidado personal", hint: "Baño y cuerpo", icon: "✧" }
];
const players = [
  { initials: "LU", name: "Lucía M.", points: 1480, time: "08.42s" },
  { initials: "TM", name: "Tomás R.", points: 1320, time: "09.07s" },
  { initials: "AN", name: "Tú", points: 1240, time: "09.84s", me: true },
  { initials: "SO", name: "Sofía P.", points: 1160, time: "10.21s" }
];
let productIndex = 0;
let score = 1240;
let streak = 4;
let seconds = 12;
let timerId;
let locked = false;
const $ = (selector) => document.querySelector(selector);

function renderCategories() {
  $("#category-list").innerHTML = categories.map((category) => `<button class="category-button" type="button" data-category="${category.name}"><span class="cat-icon">${category.icon}</span><span><strong>${category.name}</strong><small>${category.hint}</small></span></button>`).join("");
  document.querySelectorAll(".category-button").forEach((button) => button.addEventListener("click", () => answer(button.dataset.category)));
}
function renderLeaderboard() {
  $("#leaderboard").innerHTML = players.map((player, index) => `<div class="leader-row ${player.me ? "me" : ""}"><small>${String(index + 1).padStart(2, "0")}</small><span class="leader-avatar">${player.initials}</span><span>${player.name}</span><b>${player.points.toLocaleString("es-CO")}</b><small>${player.time}</small></div>`).join("");
  $("#your-score").textContent = `${score.toLocaleString("es-CO")} pts`;
}
function renderProduct() {
  const product = products[productIndex % products.length];
  $("#product-number").textContent = String(productIndex + 4).padStart(2, "0");
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
function answer(category) {
  if (locked) return;
  locked = true;
  const product = products[productIndex % products.length];
  const correct = category === product.category;
  const timeBonus = Math.max(0, seconds * 5);
  const points = correct ? 100 + timeBonus : 0;
  const feedback = $("#feedback");
  if (correct) { score += points; streak += 1; feedback.textContent = `✓ ¡Correcto! +${points} puntos · ${seconds}s restantes`; feedback.className = "feedback correct"; } else { streak = 0; feedback.textContent = `× Casi. Era ${product.category}. Respira y sigue.`; feedback.className = "feedback wrong"; }
  $("#streak-value").textContent = streak;
  players[2].points = score;
  players[2].time = `${(12 - seconds + 1).toFixed(2)}s`;
  renderLeaderboard();
  productIndex += 1;
  $("#round-progress").textContent = `${String(Math.min(10, productIndex + 4)).padStart(2, "0")} / 10`;
  $("#round-progress-fill").style.width = `${Math.min(100, ((productIndex + 4) / 10) * 100)}%`;
  clearInterval(timerId);
  setTimeout(renderProduct, 900);
  timerId = setInterval(tick, 1000);
}
function tick() { if (locked) return; seconds -= 1; updateTimer(); if (seconds <= 0) answer("__timeout__"); }
function skip() { if (!locked) { locked = true; $("#feedback").textContent = "Producto saltado. La velocidad también cuenta."; $("#feedback").className = "feedback wrong"; productIndex += 1; clearInterval(timerId); setTimeout(renderProduct, 500); timerId = setInterval(tick, 1000); } }
function startTimer() { clearInterval(timerId); timerId = setInterval(tick, 1000); }

renderCategories();
renderLeaderboard();
renderProduct();
startTimer();
$("#skip-button").addEventListener("click", skip);
$("#sound-toggle").addEventListener("click", (event) => { event.currentTarget.textContent = event.currentTarget.textContent === "◖" ? "◌" : "◖"; });
document.addEventListener("keydown", (event) => { if (event.code === "Space") { event.preventDefault(); skip(); } });
