let products = [
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
  { name: "Lácteos", hint: "Leches y yogures", icon: "🥛" },
  { name: "Despensa", hint: "Secos y bebidas", icon: "◒" },
  { name: "Frutas y verduras", hint: "Frescos", icon: "🍎" },
  { name: "Carnes y embutidos", hint: "Proteínas", icon: "🥩" },
  { name: "Congelados", hint: "Listos para cocinar", icon: "❄️" },
  { name: "Dulces y snacks", hint: "Antojos", icon: "🍬" },
  { name: "Hogar y aseo", hint: "Cuidado del hogar", icon: "🧹" },
  { name: "Bebidas", hint: "Frías y listas", icon: "◌" }
];
function categoriesMatch(selectedCategory, productCategory) {
  if (selectedCategory === productCategory) return true;
  return selectedCategory === "Lácteos" && productCategory === "Lácteos y refrigerados";
}
const defaultAvatar = "🦊";
const getSelectedAvatar = () => document.querySelector('input[name="avatar"]:checked')?.value || defaultAvatar;
const roundGroups = [
  { name: "Mezcla de góndola", hint: "Rondas 01–05", focus: "Categorías variadas" },
  { name: "Canasta surtida", hint: "Rondas 06–10", focus: "Productos de despensa y frío" },
  { name: "Reto multisección", hint: "Rondas 11–15", focus: "Frescos, bebidas y hogar" },
  { name: "Gran final mixta", hint: "Rondas 16–20", focus: "Todo el supermercado" }
];
let productDetails = [
  { conservation: "Refrigerado", productType: "Lácteo", size: "1 litro" },
  { conservation: "Lugar fresco y seco", productType: "Bebida molida", size: "500 g" },
  { conservation: "Temperatura ambiente", productType: "Fruta fresca", size: "1 kg" },
  { conservation: "Lugar fresco y seco", productType: "Producto de limpieza", size: "1.8 litros" },
  { conservation: "Lugar fresco y seco", productType: "Snack horneado", size: "12 unidades" },
  { conservation: "Temperatura ambiente", productType: "Cuidado personal", size: "250 ml" },
  { conservation: "Refrigerado", productType: "Verdura fresca", size: "500 g" },
  { conservation: "Lugar fresco y seco", productType: "Grano seco", size: "1 kg" },
  { conservation: "Temperatura ambiente", productType: "Higiene oral", size: "75 ml" },
  { conservation: "Refrigerado", productType: "Bebida gasificada", size: "600 ml" }
];
const catalog = window.SHELF_CATALOG || { products: [], trivia: [] };
if (catalog.products.length) {
  products = catalog.products.map((product) => ({
    ...product,
    tag: "FICHA DE INVENTARIO"
  }));
  productDetails = catalog.products.map(({ conservation, productType, size, origin }) => ({
    conservation,
    productType,
    size,
    origin
  }));
}
const triviaCards = catalog.trivia || [];
function isTriviaRound() {
  return triviaCards.length > 0 && productIndex % 4 === 3;
}
function getCurrentTriviaCard() {
  return triviaCards[Math.floor(productIndex / 4) % triviaCards.length];
}
function buildBalancedProductOrder(items, rounds) {
  const preferredCategories = [
    "Frutas y verduras",
    "Lácteos y refrigerados",
    "Despensa",
    "Carnes y embutidos",
    "Congelados",
    "Dulces y snacks",
    "Bebidas",
    "Hogar y aseo"
  ];
  const queues = new Map();
  items.forEach((product, index) => {
    if (!queues.has(product.category)) queues.set(product.category, []);
    queues.get(product.category).push(index);
  });
  const categories = [...queues.keys()].sort((a, b) => {
    const aOrder = preferredCategories.indexOf(a);
    const bOrder = preferredCategories.indexOf(b);
    return (aOrder < 0 ? preferredCategories.length : aOrder) -
      (bOrder < 0 ? preferredCategories.length : bOrder);
  });
  const usage = new Map(categories.map((category) => [category, 0]));
  const order = [];
  let lastCategory = null;

  while (order.length < Math.min(rounds, items.length) && categories.some((category) => queues.get(category).length)) {
    const available = categories
      .filter((category) => queues.get(category).length && category !== lastCategory)
      .sort((a, b) => usage.get(a) - usage.get(b) || categories.indexOf(a) - categories.indexOf(b));
    const category = available[0] || categories.find((item) => queues.get(item).length);
    order.push(queues.get(category).shift());
    usage.set(category, usage.get(category) + 1);
    lastCategory = category;
  }
  return order;
}
const productOrder = buildBalancedProductOrder(products, 20);
const players = [
  { initials: "LU", name: "Lucía M.", points: 1480, time: "08.42s" },
  { initials: "TM", name: "Tomás R.", points: 1320, time: "09.07s" },
  { initials: "AN", name: "Tú", points: 1240, time: "09.84s", me: true },
  { initials: "SO", name: "Sofía P.", points: 1160, time: "10.21s" }
];
const initialPlayers = players.map((player) => ({ ...player }));
let productIndex = 0;
let score = 0;
let streak = 0;
let correctAnswers = 0;
const totalRounds = 20;
const roundDurationSeconds = 20;
let seconds = roundDurationSeconds;
let timerId;
let cooldownTimerId;
let cooldownSeconds = 0;
let locked = false;
let gameOver = false;
const $ = (selector) => document.querySelector(selector);
let feedbackAnimationId;
let joinedRoomCode = "MANGO-42";
let currentUser = "Tú";
let remoteRoomId = null;
let remotePlayerId = null;
let remoteRoundStartedAt = null;
let remoteAdvancePending = false;
let playersSubscription = null;
let roomSubscription = null;
let roomPollId = null;
let isRoomHost = false;
let requestedAction = "join";
let leaderboardMode = "points";
const mistakeCounts = {};
let specialIndex = 0;
let specialScore = 0;
let specialCards = [];
let specialCorrectAnswers = 0;

function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function showWaitingRoom() {
  $("#waiting-room").hidden = false;
  $("#waiting-room-code").textContent = joinedRoomCode;
  $(".hero-grid").hidden = true;
  $(".game-section").hidden = true;
  $(".how-section").hidden = true;
  $("#host-live-podium").hidden = true;
}

function showGame() {
  $("#waiting-room").hidden = true;
  $("#host-dashboard").hidden = true;
  $(".hero-grid").hidden = false;
  $(".game-section").hidden = false;
  $(".how-section").hidden = false;
  $("#host-live-podium").hidden = !isRoomHost;
  renderCategories();
  renderProduct();
  if (isRoomHost) renderLivePodium();
  startTimer();
}

function syncRemoteRoom(room) {
  if (!room || room.status !== "playing" || !room.round_started_at) return;
  const nextProductIndex = Math.max(0, Math.min(totalRounds - 1, room.current_round - 1));
  const roundChanged = productIndex !== nextProductIndex;
  remoteRoundStartedAt = room.round_started_at;
  if (roundChanged) {
    productIndex = nextProductIndex;
    locked = false;
    renderProduct();
  }
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - Date.parse(remoteRoundStartedAt)) / 1000));
  seconds = Math.max(0, roundDurationSeconds - elapsedSeconds);
  updateTimer();
  if (seconds <= 0) advanceRemoteRound();
  else startTimer();
}

async function advanceRemoteRound() {
  if (!remoteRoomId || remoteAdvancePending || gameOver) return;
  remoteAdvancePending = true;
  try {
    const room = await ShelfBackend.advanceRoomRound(remoteRoomId);
    if (room?.status === "finished") {
      endGame();
    } else if (room) {
      syncRemoteRoom(room);
    }
  } catch (advanceError) {
    console.error("No se pudo sincronizar la siguiente ronda:", advanceError);
  } finally {
    remoteAdvancePending = false;
  }
}

async function handleRoomUpdate(payload) {
  if (gameOver) return;
  if (payload.new?.status === "playing") {
    if (!isRoomHost && !$("#waiting-room").hidden) showGame();
    syncRemoteRoom(payload.new);
  } else if (payload.new?.status === "finished") {
    endGame();
  }
}

async function joinRoom(event) {
  event.preventDefault();
  const usernameInput = $("#username");
  const roomInput = $("#room-code");
  const error = $("#join-error");
  const username = usernameInput.value.trim();
  const action = event.submitter?.dataset.action || requestedAction;
  const roomCode = roomInput.value.trim().toUpperCase();

  if (username.length < 2 || username.length > 18) {
    error.textContent = "Escribe un usuario entre 2 y 18 caracteres.";
    usernameInput.focus();
    return;
  }
  if (action === "join" && !/^[A-Z0-9-]{4,12}$/.test(roomCode)) {
    error.textContent = "Usa un código válido, por ejemplo MANGO-42.";
    roomInput.focus();
    return;
  }

  const submitButtons = [...document.querySelectorAll(".room-action-button")];
  submitButtons.forEach((button) => { button.disabled = true; });
  error.textContent = action === "create" && ShelfBackend.isConfigured ? "Creando la sala..." :
    action === "join" && ShelfBackend.isConfigured ? "Verificando la sala..." : "";
  let membership;
  try {
    membership = action === "create"
      ? await ShelfBackend.createRoom(username, getSelectedAvatar())
      : await ShelfBackend.joinRoom(roomCode, username, getSelectedAvatar());
    currentUser = username;
    isRoomHost = action === "create";
    joinedRoomCode = membership.room_code || roomCode;
    remoteRoomId = membership.room_id || null;
    remotePlayerId = membership.player_id || null;
    let room = null;
    if (membership.mode === "remote") {
      const remotePlayers = await ShelfBackend.loadPlayers(remoteRoomId);
      room = await ShelfBackend.loadRoom(remoteRoomId);
      updatePlayersFromRemote(remotePlayers);
      playersSubscription?.unsubscribe();
      playersSubscription = ShelfBackend.subscribePlayers(remoteRoomId, async () => {
        updatePlayersFromRemote(await ShelfBackend.loadPlayers(remoteRoomId));
        if (isRoomHost) renderHostDashboard();
      });
      roomSubscription?.unsubscribe();
      roomSubscription = ShelfBackend.subscribeRoom(remoteRoomId, handleRoomUpdate);
      clearInterval(roomPollId);
      roomPollId = setInterval(async () => {
        if (gameOver || !remoteRoomId) return;
        try {
          const currentRoom = await ShelfBackend.loadRoom(remoteRoomId);
          if (currentRoom.status === "playing") {
            if (!isRoomHost && !$("#waiting-room").hidden) showGame();
            syncRemoteRoom(currentRoom);
          }
          else if (currentRoom.status === "finished") endGame();
        } catch (roomError) {
          console.error("No se pudo consultar el estado de la sala:", roomError);
        }
      }, 2000);
      if (!isRoomHost && room.status === "playing") syncRemoteRoom(room);
    }
  } catch (joinError) {
    error.textContent = joinError.message || "No fue posible entrar a la sala.";
    submitButtons.forEach((button) => { button.disabled = false; });
    return;
  }
  submitButtons.forEach((button) => { button.disabled = false; });
  if (membership.mode === "local") {
    players.forEach((player) => { player.me = false; });
    const localPlayer = players.find((player) => player.name === "Tú");
    if (localPlayer) {
      Object.assign(localPlayer, { initials: getSelectedAvatar(), name: username, points: 0, time: "—", me: true });
    } else {
      players.push({ initials: getSelectedAvatar(), name: username, points: 0, time: "—", me: true });
    }
  }
  if (isRoomHost) renderHostDashboard();
  $("#room-status").textContent = `CÓDIGO ${joinedRoomCode}`;
  $("#copy-room-button").setAttribute("aria-label", `Copiar código de partida ${joinedRoomCode}`);
  $(".avatar").textContent = getSelectedAvatar();
  $(".avatar").setAttribute("aria-label", `Perfil de ${username}`);
  $("#profile-emoji").textContent = getSelectedAvatar();
  $("#profile-name").textContent = username;
  $("#profile-room").textContent = `Sala ${joinedRoomCode}`;
  $("#join-screen").hidden = true;
  document.body.classList.remove("joining");
  $("#top").hidden = false;
  error.textContent = "";
  if (isRoomHost) {
    $("#host-dashboard").hidden = false;
    $(".hero-grid").hidden = true;
    $(".game-section").hidden = true;
    $(".how-section").hidden = true;
    renderHostDashboard();
  } else if (membership.mode === "remote" && room?.status === "playing") {
    showGame();
  } else {
    showWaitingRoom();
  }
  renderCategories();
  renderLeaderboard();
  renderProduct();
  if (!isRoomHost && !document.querySelector("#waiting-room:not([hidden])")) startTimer();
  if (membership.mode === "remote" && room?.status === "playing") syncRemoteRoom(room);
}

function renderHostDashboard() {
  $("#host-room-code").textContent = joinedRoomCode;
  $("#dashboard-player-count").textContent = players.length;
  $("#host-players").innerHTML = players
    .sort((a, b) => b.points - a.points)
    .map((player) => `<div class="host-player-row" role="listitem"><span class="leader-avatar">${player.initials}</span><span>${player.name}${player.me ? " <small>(anfitrión)</small>" : ""}</span><b>${player.points.toLocaleString("es-CO")} pts</b></div>`)
    .join("");
  const podium = getPodiumPlayers();
  $("#podium-list").innerHTML = podium.map((player, index) => `<div class="podium-row podium-place-${index + 1}"><div class="podium-medal">${["🥇", "🥈", "🥉"][index]}</div><span class="podium-avatar">${player.initials}</span><span class="podium-player"><strong>${player.name}</strong><small>${player.correctAnswers || 0} aciertos</small></span><b>${player.points.toLocaleString("es-CO")} pts</b></div>`).join("");
  renderLivePodium();
  const mistakes = Object.entries(mistakeCounts).sort(([, a], [, b]) => b - a);
  const totalAnswers = Object.values(mistakeCounts).reduce((sum, count) => sum + count, 0) + correctAnswers;
  $("#dashboard-answers").textContent = totalAnswers;
  $("#dashboard-correct").textContent = totalAnswers ? `${Math.round((correctAnswers / totalAnswers) * 100)}%` : "0%";
  $("#dashboard-wrong").textContent = mistakes.reduce((sum, [, count]) => sum + count, 0);
  $("#mistake-list").innerHTML = mistakes.length
    ? mistakes.map(([category, count]) => `<div class="mistake-row"><span>${category}</span><b>${count} error${count === 1 ? "" : "es"}</b></div>`).join("")
    : "<p class=\"dashboard-empty\">Todavía no hay errores registrados.</p>";
}

function getPodiumPlayers() {
  return [...players]
    .sort((a, b) => b.points - a.points || (b.correctAnswers || 0) - (a.correctAnswers || 0))
    .slice(0, 3);
}

function renderLivePodium() {
  const list = $("#live-podium-list");
  if (!list || !isRoomHost) return;
  const podium = getPodiumPlayers();
  list.innerHTML = podium.length
    ? podium.map((player, index) => `<article class="live-podium-place place-${index + 1}" role="listitem"><div class="live-podium-rank">${["🥇", "🥈", "🥉"][index]}</div><div class="live-podium-avatar">${player.initials}</div><strong>${player.name}</strong><span>${player.points.toLocaleString("es-CO")} pts</span><small>${player.correctAnswers || 0} aciertos</small></article>`).join("")
    : "<p class=\"dashboard-empty\">Esperando jugadores...</p>";
}

async function startHostGame() {
  const button = $("#start-game-button");
  if (button.disabled) return;
  button.disabled = true;
  button.innerHTML = "Iniciando…";
  try {
    if (remoteRoomId) {
      const startedRoom = await ShelfBackend.startRoom(remoteRoomId);
      syncRemoteRoom(startedRoom);
    } else {
      showGame();
    }
    if (remoteRoomId) {
      showGame();
      syncRemoteRoom(await ShelfBackend.loadRoom(remoteRoomId));
    }
  } catch (startError) {
    button.disabled = false;
    button.innerHTML = "Iniciar partida <span>↗</span>";
    $("#join-error").textContent = startError.message || "No se pudo iniciar la partida.";
  }
}

function updatePlayersFromRemote(remotePlayers) {
  const activePlayer = remotePlayers.find((player) => player.id === remotePlayerId);
  players.length = 0;
  remotePlayers.forEach((player) => players.push({
    initials: player.avatar_initials,
    name: player.display_name,
    points: player.total_points,
    correctAnswers: player.correct_answers || 0,
    time: player.average_response_ms ? `${(player.average_response_ms / 1000).toFixed(2)}s` : "—",
    me: player.id === remotePlayerId
  }));
  if (!activePlayer) {
    players.push({ initials: getSelectedAvatar(), name: currentUser, points: score, time: "—", me: true });
  }
  renderLeaderboard();
}

function renderCategories() {
  const shuffledCategories = [...categories];
  for (let index = shuffledCategories.length - 1; index > 0; index -= 1) {
    const swapIndex = (productIndex * 3 + index * 7) % (index + 1);
    [shuffledCategories[index], shuffledCategories[swapIndex]] = [shuffledCategories[swapIndex], shuffledCategories[index]];
  }
  const list = $("#category-list");
  const difficultyLabel = productIndex >= 10 ? "Modo caos +" : productIndex >= 5 ? "Modo caos" : "Posiciones cambiantes";
  $(".category-heading small").textContent = difficultyLabel;
  list.classList.remove("category-reflow");
  void list.offsetWidth;
  list.innerHTML = shuffledCategories.map((category, index) => `<button class="category-button" style="--category-order:${index}" type="button" data-category="${category.name}"><span class="cat-icon">${category.icon}</span><span><strong>${category.name}</strong><small>${category.hint}</small></span></button>`).join("");
  list.classList.add("category-reflow");
  document.querySelectorAll(".category-button").forEach((button) => button.addEventListener("click", () => answer(button.dataset.category)));
}
function renderLeaderboard() {
  const ranking = [...players].sort((a, b) => leaderboardMode === "correct"
    ? (b.correctAnswers || 0) - (a.correctAnswers || 0) || b.points - a.points
    : b.points - a.points || (b.correctAnswers || 0) - (a.correctAnswers || 0));
  const position = ranking.findIndex((player) => player.me) + 1;
  $("#leaderboard").innerHTML = ranking.map((player, index) => {
    const primary = leaderboardMode === "correct" ? `${player.correctAnswers || 0} aciertos` : `${player.points.toLocaleString("es-CO")} pts`;
    const secondary = leaderboardMode === "correct" ? `${player.points.toLocaleString("es-CO")} pts` : `${player.correctAnswers || 0} aciertos`;
    return `<div class="leader-row ${player.me ? "me" : ""}" role="listitem" aria-label="${player.name}, posición ${index + 1}, ${primary}"><small class="leader-rank">${String(index + 1).padStart(2, "0")}</small><span class="leader-avatar" aria-hidden="true">${player.initials}</span><span class="leader-name">${player.name}${player.me ? " (tú)" : ""}</span><b>${primary}</b><small>${secondary}</small></div>`;
  }).join("");
  $("#your-score").textContent = `${score.toLocaleString("es-CO")} pts`;
  $("#your-position").textContent = position;
}
function renderProduct() {
  const blockIndex = Math.floor(productIndex / 5);
  const productIndexForRound = productOrder[productIndex];
  const product = products[productIndexForRound];
  const round = productIndex + 1;
  const group = roundGroups[blockIndex];
  const details = productDetails[productIndexForRound];
  const triviaRound = isTriviaRound();
  const triviaCard = triviaRound ? getCurrentTriviaCard() : null;
  $("#product-number").textContent = String(round).padStart(2, "0");
  $("#round-label").textContent = `Ronda ${String(round).padStart(2, "0")} / ${totalRounds}`;
  $("#round-group").textContent = `${group.name} · ${group.focus}`;
  $("#product-id").textContent = product.id;
  $("#product-illustration").querySelector(".product-emoji").textContent = product.emoji;
  $("#product-tag").textContent = "FICHA DE INVENTARIO";
  $("#product-name").textContent = product.name;
  $("#product-description").textContent = product.description;
  $("#product-brand").textContent = product.brand;
  $("#product-unit").textContent = product.unit;
  $("#product-reference").textContent = product.reference;
  $("#product-clues").open = false;
  $("#product-conservation").textContent = details.conservation;
  $("#product-type").textContent = details.productType;
  $("#product-size").textContent = details.size;
  $("#product-origin").textContent = details.origin || "Documento de referencia";
  $("#inline-trivia").hidden = !triviaRound;
  $(".game-layout").hidden = triviaRound;
  $("#feedback").hidden = triviaRound;
  $(".round-note").hidden = triviaRound;
  if (triviaCard) {
    $("#inline-trivia-difficulty").textContent = `NIVEL ${triviaCard.difficulty.toUpperCase()} · ${triviaCard.topic.toUpperCase()}`;
    $("#inline-trivia-statement").textContent = triviaCard.statement;
    $("#inline-trivia-source").textContent = `Fuente: ${triviaCard.source} · ${triviaCard.product}`;
    $("#inline-trivia-feedback").textContent = "";
    $("#inline-trivia-feedback").className = "feedback";
    document.querySelectorAll(".inline-truth-button").forEach((button) => {
      button.disabled = false;
      button.classList.remove("selected-correct", "selected-wrong");
    });
  }
  const card = $("#product-card");
  card.style.setProperty("--enter-x", `${productIndex % 2 ? 28 : -28}px`);
  card.style.setProperty("--enter-rotate", `${productIndex % 2 ? 2 : -2}deg`);
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  card.classList.remove("pop");
  void card.offsetWidth;
  renderCategories();
  ShelfMotion.revealProduct();
  seconds = roundDurationSeconds;
  updateTimer();
  locked = false;
  document.querySelectorAll(".category-button, #skip-button, .inline-truth-button").forEach((button) => { button.disabled = false; });
}
function getCurrentProduct() {
  return products[productOrder[productIndex]];
}
function renderTriviaCard() {
  const card = specialCards[specialIndex];
  if (!card) return;
  $("#special-progress").textContent = `${specialIndex + 1} / ${specialCards.length}`;
  $("#special-difficulty").textContent = `NIVEL ${card.difficulty.toUpperCase()} · ${card.topic.toUpperCase()}`;
  $("#special-statement").textContent = card.statement;
  $("#special-source").textContent = `Fuente: ${card.source} · ${card.product}`;
  $("#special-feedback").textContent = "";
  $("#special-feedback").className = "feedback";
  document.querySelectorAll(".truth-button").forEach((button) => { button.disabled = false; button.classList.remove("selected-correct", "selected-wrong"); });
}
function startTriviaLevel() {
  if (!triviaCards.length) return;
  specialCards = [...triviaCards].sort(() => Math.random() - 0.5).slice(0, 5);
  specialIndex = 0;
  specialScore = 0;
  specialCorrectAnswers = 0;
  $("#result-modal").hidden = true;
  $(".hero-grid").hidden = true;
  $(".game-section").hidden = true;
  $(".how-section").hidden = true;
  $("#special-level").hidden = false;
  renderTriviaCard();
}
function answerTrivia(value) {
  const card = specialCards[specialIndex];
  if (!card) return;
  const buttons = document.querySelectorAll(".truth-button");
  buttons.forEach((button) => { button.disabled = true; });
  const correct = value === card.answer;
  const feedback = $("#special-feedback");
  feedback.textContent = correct ? `✓ Correcto. +${card.points} puntos. ${card.explanation}` : `× Incorrecto. ${card.explanation}`;
  feedback.className = `feedback ${correct ? "correct" : "wrong"}`;
  const selected = [...buttons].find((button) => button.dataset.answer === String(value));
  if (selected) selected.classList.add(correct ? "selected-correct" : "selected-wrong");
  if (correct) {
    specialScore += card.points;
    specialCorrectAnswers += 1;
  }
  setTimeout(() => {
    specialIndex += 1;
    if (specialIndex >= specialCards.length) {
      $("#special-level").hidden = true;
      $("#result-kicker").textContent = "NIVEL ESPECIAL COMPLETADO";
      $("#result-medal").textContent = "🧠";
      $("#result-title").textContent = "Trivia verificada";
      $("#result-message").textContent = `Obtuviste ${specialScore} puntos en las afirmaciones del documento.`;
      $("#final-score").textContent = `${(score + specialScore).toLocaleString("es-CO")} pts`;
      $("#final-correct").textContent = `${specialCorrectAnswers}/${specialCards.length}`;
      $("#result-modal").hidden = false;
    } else {
      renderTriviaCard();
    }
  }, 1800);
}
function updateTimer() { $("#timer").textContent = `00:${String(seconds).padStart(2, "0")}`; }
function showFeedbackAnimation(correct, category) {
  if (isTriviaRound()) {
    const triviaCard = $("#inline-trivia");
    const triviaFeedback = $("#inline-trivia-feedback");
    triviaCard.classList.remove("answer-correct", "answer-wrong");
    triviaFeedback.classList.remove("answer-correct", "answer-wrong");
    void triviaCard.offsetWidth;
    triviaCard.classList.add(correct ? "answer-correct" : "answer-wrong");
    triviaFeedback.classList.add(correct ? "answer-correct" : "answer-wrong");
    ShelfMotion.answer(correct);
    if (correct) ShelfMotion.celebrate();
    clearTimeout(feedbackAnimationId);
    feedbackAnimationId = setTimeout(() => {
      triviaCard.classList.remove("answer-correct", "answer-wrong");
    }, 850);
    return;
  }
  const card = $("#product-card");
  const feedback = $("#feedback");
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
  ShelfMotion.answer(correct);
  if (correct) ShelfMotion.celebrate();
  clearTimeout(feedbackAnimationId);
  feedbackAnimationId = setTimeout(() => {
    document.body.classList.remove("answer-correct", "answer-wrong");
  }, 850);
}
function answer(category) {
  if (locked || gameOver) return;
  locked = true;
  document.querySelectorAll(".category-button, #skip-button, .inline-truth-button").forEach((button) => { button.disabled = true; });
  const triviaRound = isTriviaRound();
  const triviaCard = triviaRound ? getCurrentTriviaCard() : null;
  const product = triviaRound ? null : getCurrentProduct();
  const correct = triviaRound
    ? category === String(triviaCard.answer)
    : categoriesMatch(category, product.category);
  const points = correct ? 100 + (seconds * 10) : 0;
  const feedback = $("#feedback");
  if (correct) {
    score += points;
    correctAnswers += 1;
    streak += 1;
    feedback.textContent = `✓ ¡Correcto! +${points} puntos · ${seconds}s restantes`;
    feedback.className = "feedback correct";
  } else {
    streak = 0;
    if (!triviaRound) mistakeCounts[product.category] = (mistakeCounts[product.category] || 0) + 1;
    feedback.textContent = triviaRound
      ? `× Incorrecto. La respuesta era ${triviaCard.answer ? "Verdadero" : "Falso"}.`
      : category === "__skipped__"
        ? `↷ Producto saltado. Era ${product.category}.`
        : `× Casi. Era ${product.category}. Respira y sigue.`;
    feedback.className = "feedback wrong";
  }
  if (triviaRound) {
    const triviaFeedback = $("#inline-trivia-feedback");
    triviaFeedback.textContent = correct ? `✓ Correcto. ${triviaCard.explanation}` : `× Incorrecto. ${triviaCard.explanation}`;
    triviaFeedback.className = `feedback ${correct ? "correct" : "wrong"}`;
    const selected = [...document.querySelectorAll(".inline-truth-button")].find((button) => button.dataset.inlineAnswer === category);
    if (selected) selected.classList.add(correct ? "selected-correct" : "selected-wrong");
  }
  showFeedbackAnimation(correct, category);
  $("#streak-value").textContent = streak;
  const currentPlayer = players.find((player) => player.me);
  if (currentPlayer) {
    currentPlayer.points = score;
    currentPlayer.correctAnswers = correctAnswers;
    currentPlayer.time = `${(roundDurationSeconds - seconds + 1).toFixed(2)}s`;
  }
  if (remotePlayerId) {
    const responseMs = (roundDurationSeconds - seconds) * 1000;
    ShelfBackend.recordPlayerResult(remotePlayerId, responseMs, correct)
      .catch((resultError) => { console.error("No se pudo actualizar el resultado remoto:", resultError); });
  }
  renderLeaderboard();
  if (isRoomHost) renderHostDashboard();
  if (remoteRoomId) {
    return;
  }
  productIndex += 1;
  $("#round-progress").textContent = `${String(Math.min(totalRounds, productIndex + 1)).padStart(2, "0")} / ${totalRounds}`;
  $("#round-progress-fill").style.width = `${Math.min(100, ((productIndex + 1) / totalRounds) * 100)}%`;
  clearInterval(timerId);
  if (productIndex + 1 >= totalRounds) {
    setTimeout(endGame, 900);
  } else {
    setTimeout(startCooldown, 900);
  }
}
function startCooldown() {
  clearInterval(cooldownTimerId);
  cooldownSeconds = 10;
  $("#timer").textContent = `SIGUIENTE 00:${String(cooldownSeconds).padStart(2, "0")}`;
  cooldownTimerId = setInterval(() => {
    cooldownSeconds -= 1;
    $("#timer").textContent = `SIGUIENTE 00:${String(cooldownSeconds).padStart(2, "0")}`;
    if (cooldownSeconds <= 0) {
      clearInterval(cooldownTimerId);
      renderProduct();
      startTimer();
    }
  }, 1000);
}
function tick() {
  if (remoteRoomId) {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - Date.parse(remoteRoundStartedAt)) / 1000));
    seconds = Math.max(0, roundDurationSeconds - elapsedSeconds);
    updateTimer();
    if (seconds <= 0) advanceRemoteRound();
    return;
  }
  if (locked) return;
  seconds -= 1;
  updateTimer();
  if (seconds <= 0) answer("__timeout__");
}
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
  clearInterval(cooldownTimerId);
  productIndex = 0;
  score = 0;
  streak = 0;
  correctAnswers = 0;
  Object.keys(mistakeCounts).forEach((category) => { delete mistakeCounts[category]; });
  gameOver = false;
  const currentPlayer = players.find((player) => player.me);
  if (currentPlayer) {
    currentPlayer.points = score;
    currentPlayer.correctAnswers = 0;
    currentPlayer.time = "—";
  }
  $("#result-modal").hidden = true;
  $("#streak-value").textContent = streak;
  $("#round-progress").textContent = `01 / ${totalRounds}`;
  $("#round-progress-fill").style.width = `${100 / totalRounds}%`;
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

function closeProfileMenu() {
  $("#profile-dropdown").hidden = true;
  $("#profile-button").setAttribute("aria-expanded", "false");
}

async function leaveRoom() {
  const leaveButton = $("#leave-room-button");
  leaveButton.disabled = true;
  leaveButton.textContent = "Saliendo…";
  try {
    await ShelfBackend.leaveRoom(remoteRoomId, remotePlayerId);
  } catch (leaveError) {
    console.error("No se pudo salir de la sala remota:", leaveError);
  }
  clearInterval(timerId);
  clearInterval(cooldownTimerId);
  clearInterval(roomPollId);
  playersSubscription?.unsubscribe();
  roomSubscription?.unsubscribe();
  playersSubscription = null;
  roomSubscription = null;
  roomPollId = null;
  remoteRoomId = null;
  remotePlayerId = null;
  remoteRoundStartedAt = null;
  remoteAdvancePending = false;
  isRoomHost = false;
  players.splice(0, players.length, ...initialPlayers.map((player) => ({ ...player })));
  productIndex = 0;
  score = 0;
  streak = 0;
  correctAnswers = 0;
  Object.keys(mistakeCounts).forEach((category) => { delete mistakeCounts[category]; });
  joinedRoomCode = "MANGO-42";
  currentUser = "Tú";
  gameOver = false;
  locked = false;
  closeProfileMenu();
  $("#profile-name").textContent = "Jugador";
  $("#profile-room").textContent = "Sin sala";
  $("#join-screen").hidden = false;
  $("#top").hidden = true;
  $("#host-live-podium").hidden = true;
  document.body.classList.add("joining");
  leaveButton.disabled = false;
  leaveButton.innerHTML = 'Salir de la sala <span>↗</span>';
  $("#join-error").textContent = "";
  document.querySelectorAll(".room-action-button").forEach((button) => { button.disabled = false; });
  $("#username").focus();
}

document.querySelectorAll(".room-action-button").forEach((button) => {
  button.addEventListener("click", () => { requestedAction = button.dataset.action; });
});
$("#join-form").addEventListener("submit", joinRoom);
$("#start-game-button").addEventListener("click", startHostGame);
$("#special-level-button").addEventListener("click", startTriviaLevel);
document.querySelectorAll(".truth-button").forEach((button) => {
  button.addEventListener("click", () => answerTrivia(button.dataset.answer === "true"));
});
document.querySelectorAll(".inline-truth-button").forEach((button) => {
  button.addEventListener("click", () => answer(button.dataset.inlineAnswer));
});
document.querySelectorAll(".leaderboard-tab").forEach((button) => {
  button.addEventListener("click", () => {
    leaderboardMode = button.dataset.ranking;
    document.querySelectorAll(".leaderboard-tab").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    renderLeaderboard();
  });
});
$("#skip-button").addEventListener("click", skip);
$("#restart-button").addEventListener("click", restartGame);
$("#theme-toggle").addEventListener("click", () => applyTheme(!document.body.classList.contains("dark-mode")));
$("#profile-button").addEventListener("click", () => {
  const dropdown = $("#profile-dropdown");
  const isOpen = !dropdown.hidden;
  dropdown.hidden = isOpen;
  $("#profile-button").setAttribute("aria-expanded", String(!isOpen));
});
$("#leave-room-button").addEventListener("click", leaveRoom);
document.addEventListener("click", (event) => {
  if (!event.target.closest(".profile-menu")) closeProfileMenu();
});
$("#copy-room-button").addEventListener("click", async () => {
  const roomCode = joinedRoomCode;
  try {
    await navigator.clipboard.writeText(roomCode);
    $("#room-status").textContent = "CÓDIGO COPIADO";
  } catch {
    $("#room-status").textContent = `CÓDIGO ${roomCode}`;
  }
  setTimeout(() => { $("#room-status").textContent = `CÓDIGO ${roomCode}`; }, 1800);
});
$("#copy-dashboard-code").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(joinedRoomCode);
    $("#copy-dashboard-code").textContent = "Código copiado";
  } catch {
    $("#copy-dashboard-code").textContent = joinedRoomCode;
  }
  setTimeout(() => { $("#copy-dashboard-code").textContent = "Copiar código"; }, 1800);
});
applyTheme(localStorage.getItem("shelf-sprint-theme") === "dark");
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProfileMenu();
  if (event.code === "Space") { event.preventDefault(); skip(); }
});
