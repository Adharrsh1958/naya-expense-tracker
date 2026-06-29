const baseCategories = ["Food", "Transport", "Shopping", "Bills", "Groceries", "Travel", "Health", "Entertainment", "Income", "Other"];
const defaultBudget = 0;

// Keyword → [Category, Display Merchant]. Longer/more specific keys should be
// listed so multi-word matches win over generic ones (we sort by key length
// at lookup time, see findMerchantMatch()).
const merchantRules = {
  // ── Food & dining ────────────────────────────────────────────────────────
  swiggy: ["Food", "Swiggy"], zomato: ["Food", "Zomato"], "swiggy genie": ["Food", "Swiggy"],
  dosa: ["Food", "Dosa Corner"], idli: ["Food", "South Cafe"], vada: ["Food", "South Cafe"],
  chai: ["Food", "Tea Stall"], tea: ["Food", "Tea Stall"], coffee: ["Food", "Cafe"],
  cafe: ["Food", "Cafe"], starbucks: ["Food", "Starbucks"], "ccd": ["Food", "Cafe Coffee Day"],
  pizza: ["Food", "Pizza"], dominos: ["Food", "Domino's"], "pizza hut": ["Food", "Pizza Hut"],
  burger: ["Food", "Burger Joint"], "mcdonald": ["Food", "McDonald's"], kfc: ["Food", "KFC"],
  biryani: ["Food", "Biryani Spot"], thali: ["Food", "Thali"], lunch: ["Food", "Lunch"],
  dinner: ["Food", "Dinner"], breakfast: ["Food", "Breakfast"], snack: ["Food", "Snacks"],
  snacks: ["Food", "Snacks"], restaurant: ["Food", "Restaurant"], dine: ["Food", "Restaurant"],
  juice: ["Food", "Juice Stall"], "ice cream": ["Food", "Ice Cream"], dessert: ["Food", "Dessert"],
  bakery: ["Food", "Bakery"], cake: ["Food", "Bakery"], sandwich: ["Food", "Sandwich"],
  momos: ["Food", "Momos"], chinese: ["Food", "Restaurant"], "street food": ["Food", "Street Food"],
  paratha: ["Food", "Food Stall"], samosa: ["Food", "Food Stall"], food: ["Food", "Food"],
  eating: ["Food", "Food"], "eat out": ["Food", "Restaurant"], canteen: ["Food", "Canteen"],
  mess: ["Food", "Mess"], tiffin: ["Food", "Tiffin"],

  // ── Transport ────────────────────────────────────────────────────────────
  uber: ["Transport", "Uber"], ola: ["Transport", "Ola"], rapido: ["Transport", "Rapido"],
  petrol: ["Transport", "Fuel Station"], diesel: ["Transport", "Fuel Station"],
  fuel: ["Transport", "Fuel Station"], "gas station": ["Transport", "Fuel Station"],
  metro: ["Transport", "Metro"], bus: ["Transport", "Bus"], "bus ticket": ["Transport", "Bus"],
  train: ["Transport", "Train"], irctc: ["Transport", "IRCTC"], railway: ["Transport", "Railway"],
  taxi: ["Transport", "Taxi"], cab: ["Transport", "Cab"], rickshaw: ["Transport", "Auto Rickshaw"],
  auto: ["Transport", "Auto Rickshaw"], parking: ["Transport", "Parking"],
  toll: ["Transport", "Toll"], fastag: ["Transport", "FASTag"], flight: ["Transport", "Flight"],
  airfare: ["Transport", "Flight"], indigo: ["Transport", "IndiGo"], spicejet: ["Transport", "SpiceJet"],
  "air india": ["Transport", "Air India"], service: ["Transport", "Vehicle Service"],
  "bike service": ["Transport", "Vehicle Service"], "car service": ["Transport", "Vehicle Service"],
  ferry: ["Transport", "Ferry"], boat: ["Transport", "Ferry"],

  // ── Shopping ─────────────────────────────────────────────────────────────
  amazon: ["Shopping", "Amazon"], myntra: ["Shopping", "Myntra"], flipkart: ["Shopping", "Flipkart"],
  ajio: ["Shopping", "Ajio"], nykaa: ["Shopping", "Nykaa"], meesho: ["Shopping", "Meesho"],
  "shopping mall": ["Shopping", "Mall"], mall: ["Shopping", "Mall"], clothes: ["Shopping", "Clothing"],
  clothing: ["Shopping", "Clothing"], shirt: ["Shopping", "Clothing"], shoes: ["Shopping", "Footwear"],
  footwear: ["Shopping", "Footwear"], jeans: ["Shopping", "Clothing"], dress: ["Shopping", "Clothing"],
  electronics: ["Shopping", "Electronics"], mobile: ["Shopping", "Electronics"],
  laptop: ["Shopping", "Electronics"], phone: ["Shopping", "Electronics"],
  headphones: ["Shopping", "Electronics"], gadget: ["Shopping", "Electronics"],
  gift: ["Shopping", "Gift"], jewellery: ["Shopping", "Jewellery"], jewelry: ["Shopping", "Jewellery"],
  cosmetics: ["Shopping", "Cosmetics"], makeup: ["Shopping", "Cosmetics"], decor: ["Shopping", "Home Decor"],
  furniture: ["Shopping", "Furniture"], stationery: ["Shopping", "Stationery"],
  books: ["Shopping", "Books"], book: ["Shopping", "Books"],

  // ── Bills & utilities ────────────────────────────────────────────────────
  rent: ["Bills", "Rent"], electricity: ["Bills", "Electricity"], "electricity bill": ["Bills", "Electricity"],
  water: ["Bills", "Water Bill"], "water bill": ["Bills", "Water Bill"], gas: ["Bills", "Gas Cylinder"],
  cylinder: ["Bills", "Gas Cylinder"], internet: ["Bills", "Internet"], wifi: ["Bills", "Internet"],
  broadband: ["Bills", "Internet"], maintenance: ["Bills", "Maintenance"], emi: ["Bills", "EMI"],
  loan: ["Bills", "Loan"], insurance: ["Bills", "Insurance"], premium: ["Bills", "Insurance"],
  mobile_bill: ["Bills", "Mobile Recharge"], recharge: ["Bills", "Mobile Recharge"],
  dth: ["Bills", "DTH/Cable"], cable: ["Bills", "DTH/Cable"], tax: ["Bills", "Tax"],
  fee: ["Bills", "Fee"], fees: ["Bills", "Fee"], fine: ["Bills", "Fine/Penalty"],
  penalty: ["Bills", "Fine/Penalty"],

  // ── Groceries ────────────────────────────────────────────────────────────
  milk: ["Groceries", "Grocery Store"], grocery: ["Groceries", "Grocery Store"],
  groceries: ["Groceries", "Grocery Store"], vegetables: ["Groceries", "Vegetables"],
  veggies: ["Groceries", "Vegetables"], fruits: ["Groceries", "Fruits"],
  supermarket: ["Groceries", "Supermarket"], bigbasket: ["Groceries", "BigBasket"],
  blinkit: ["Groceries", "Blinkit"], zepto: ["Groceries", "Zepto"], instamart: ["Groceries", "Swiggy Instamart"],
  dmart: ["Groceries", "DMart"], "more supermarket": ["Groceries", "More"], kirana: ["Groceries", "Kirana Store"],
  ration: ["Groceries", "Ration"], eggs: ["Groceries", "Grocery Store"], bread: ["Groceries", "Grocery Store"],

  // ── Travel ───────────────────────────────────────────────────────────────
  hotel: ["Travel", "Hotel"], resort: ["Travel", "Resort"], airbnb: ["Travel", "Airbnb"],
  oyo: ["Travel", "OYO"], makemytrip: ["Travel", "MakeMyTrip"], goibibo: ["Travel", "Goibibo"],
  trip: ["Travel", "Trip Expense"], vacation: ["Travel", "Vacation"], holiday: ["Travel", "Holiday"],
  sightseeing: ["Travel", "Sightseeing"], visa: ["Travel", "Visa"], passport: ["Travel", "Passport"],
  luggage: ["Travel", "Luggage"], "travel insurance": ["Travel", "Travel Insurance"],

  // ── Health ───────────────────────────────────────────────────────────────
  pharmacy: ["Health", "Pharmacy"], medicine: ["Health", "Medicine"], medicines: ["Health", "Medicine"],
  doctor: ["Health", "Doctor Visit"], hospital: ["Health", "Hospital"], clinic: ["Health", "Clinic"],
  dentist: ["Health", "Dentist"], "lab test": ["Health", "Lab Test"], "blood test": ["Health", "Lab Test"],
  scan: ["Health", "Medical Scan"], gym: ["Health", "Gym"], fitness: ["Health", "Fitness"],
  yoga: ["Health", "Yoga"], physio: ["Health", "Physiotherapy"], "1mg": ["Health", "1mg"],
  pharmeasy: ["Health", "PharmEasy"], apollo: ["Health", "Apollo Pharmacy"],

  // ── Entertainment & subscriptions ───────────────────────────────────────
  netflix: ["Entertainment", "Netflix"], spotify: ["Entertainment", "Spotify"],
  "prime video": ["Entertainment", "Prime Video"], hotstar: ["Entertainment", "Hotstar"],
  "disney+": ["Entertainment", "Disney+"], "youtube premium": ["Entertainment", "YouTube Premium"],
  movie: ["Entertainment", "Movie"], cinema: ["Entertainment", "Cinema"], pvr: ["Entertainment", "PVR"],
  inox: ["Entertainment", "INOX"], concert: ["Entertainment", "Concert"], game: ["Entertainment", "Gaming"],
  gaming: ["Entertainment", "Gaming"], steam: ["Entertainment", "Steam"], bookmyshow: ["Entertainment", "BookMyShow"],
  party: ["Entertainment", "Party"], club: ["Entertainment", "Club"], bar: ["Entertainment", "Bar"],
  alcohol: ["Entertainment", "Alcohol"], beer: ["Entertainment", "Alcohol"],

  // ── Income (so quick-add can log salary/refunds too) ────────────────────
  salary: ["Income", "Salary"], refund: ["Income", "Refund"], cashback: ["Income", "Cashback"],
  bonus: ["Income", "Bonus"], interest: ["Income", "Interest"], dividend: ["Income", "Dividend"],
};

// Sort keys longest-first once, so "swiggy genie" matches before "swiggy".
const merchantRuleKeys = Object.keys(merchantRules).sort((a, b) => b.length - a.length);

function findMerchantMatch(clean) {
  for (const key of merchantRuleKeys) {
    if (clean.includes(key)) return merchantRules[key];
  }
  return null;
}

const ADD_CATEGORY_VALUE = "__add_new__";

function getAllCategories() {
  const custom = state.settings.customCategories || [];
  return [...baseCategories, ...custom.filter((c) => !baseCategories.includes(c))];
}

function promptAddCategory(targetSelect) {
  const name = prompt("New category name:");
  const clean = (name || "").trim();
  if (!clean) { if (targetSelect) targetSelect.value = targetSelect.dataset.lastValue || baseCategories[0]; return; }
  if (!state.settings.customCategories) state.settings.customCategories = [];
  if (!getAllCategories().some((c) => c.toLowerCase() === clean.toLowerCase())) {
    state.settings.customCategories.push(clean);
    persist();
  }
  populateCategorySelects();
  if (targetSelect) targetSelect.value = clean;
  toast(`Added category "${clean}".`);
}

function populateCategorySelects() {
  const cats = getAllCategories();
  const optionsHtml = (excludeIncome) =>
    cats.filter((c) => !excludeIncome || c !== "Income")
      .map((cat) => `<option value="${cat}">${cat}</option>`).join("") +
    `<option value="${ADD_CATEGORY_VALUE}">+ Add new category…</option>`;

  if (els.categoryInput) {
    const prev = els.categoryInput.value;
    els.categoryInput.innerHTML = optionsHtml(false);
    if (cats.includes(prev)) els.categoryInput.value = prev;
    els.categoryInput.dataset.lastValue = els.categoryInput.value;
  }
  if (els.splitCategory) {
    const prev = els.splitCategory.value;
    els.splitCategory.innerHTML = optionsHtml(true);
    if (cats.includes(prev)) els.splitCategory.value = prev;
    els.splitCategory.dataset.lastValue = els.splitCategory.value;
  }
  renderCustomCategoryList();
}

function renderCustomCategoryList() {
  const el = document.getElementById("customCategoryList");
  if (!el) return;
  const custom = state.settings.customCategories || [];
  if (!custom.length) {
    el.innerHTML = '<p class="empty">No custom categories yet.</p>';
    return;
  }
  el.innerHTML = custom.map((cat) => `
    <div class="custom-category-row">
      <span class="pill">${cat}</span>
      <button class="mini-text" data-action="delete-category" data-cat="${cat}">✕</button>
    </div>`).join("");
}

function deleteCustomCategory(cat) {
  const inUse = state.expenses.some((e) => e.category === cat);
  if (inUse && !confirm(`"${cat}" is used by some expenses. Remove it from the list anyway? Existing expenses keep the label.`)) return;
  state.settings.customCategories = (state.settings.customCategories || []).filter((c) => c !== cat);
  delete state.settings.categoryBudgets?.[cat];
  persist();
  populateCategorySelects();
  renderCategoryBudgetInputs();
  toast(`Removed category "${cat}".`);
}

const searchAliases = {
  coffee: ["coffee", "cafe"],
  cab: ["uber", "ola", "transport"],
  taxi: ["uber", "ola", "transport"],
  petrol: ["petrol", "fuel"],
  grocery: ["grocery", "groceries", "supermarket", "milk"],
  groceries: ["grocery", "groceries", "supermarket", "milk"],
  subscription: ["netflix", "spotify", "internet", "subscription", "entertainment"],
  subscriptions: ["netflix", "spotify", "internet", "subscription", "entertainment"],
};

const storageKey = "naya-expense-state-clean-v2";

const initialState = {
  expenses: [],
  learnedRules: {},
  subscriptions: [],
  trips: [
    { id: "no-trip", name: "No trip", active: true, budget: 0, people: [], details: "" },
  ],
  splits: [],
  goals: [],
  wallets: [
    { id: "cash", name: "Cash",        icon: "💵" },
    { id: "upi",  name: "UPI",         icon: "📱" },
    { id: "card", name: "Credit Card", icon: "💳" },
    { id: "bank", name: "Bank",        icon: "🏦" },
  ],
  settings: {
    userName: "",
    monthlyBudget: 0,
    selectedTripId: "",
    darkMode: false,
    categoryBudgets: {},
    customCategories: [],
    tutorialSeen: false,
  },
  timelineMode: "daily",
};

if (new URLSearchParams(location.search).has("reset")) {
  localStorage.removeItem(storageKey);
  history.replaceState(null, "", location.pathname);
}

const state = loadState();
const els = {};

document.addEventListener("DOMContentLoaded", () => {
  mapElements();
  hydrateControls();
  bindEvents();
  applyDarkMode(state.settings.darkMode);   // apply before first paint
  render();
  els.smartInput.focus();
  maybeAutoStartTutorial();
});

function mapElements() {
  [
    "smartInput", "amountInput", "categoryInput", "merchantInput", "tripInput", "expenseForm",
    "suggestionRow", "monthSpent", "monthInsight", "budgetLeft", "budgetStatus", "upcomingTotal",
    "upcomingText", "categoryList", "coachList", "heatmap", "streakText", "subscriptionList",
    "searchInput", "searchResults", "timelineList", "calendarGrid", "calendarMonth", "tripList",
    "tripDetail",
    "splitForm", "splitMode", "splitAmount", "splitPaidBy", "splitPeople", "splitTrip", "splitCategory",
    "splitNote", "splitResults", "ledgerList", "ledgerCount", "personLedgerList", "savedSplitList", "toast", "sideRhythm",
    "rangeSelect", "voiceBtn", "exportBtn", "receiptInput", "addSubBtn", "newTripBtn",
    "receivedTotal", "givenTotal", "settingsForm", "userNameInput", "monthlyBudgetInput", "resetDataBtn"
  ].forEach((id) => els[id] = document.getElementById(id));
}

function hydrateControls() {
  populateCategorySelects();
  syncTripOptions();
}

function bindEvents() {
  els.smartInput.addEventListener("input", () => {
    const parsed = parseEntry(els.smartInput.value);
    fillDraft(parsed);
    renderSuggestion(parsed);
  });

  els.categoryInput.addEventListener("change", () => {
    if (els.categoryInput.value === ADD_CATEGORY_VALUE) { promptAddCategory(els.categoryInput); return; }
    els.categoryInput.dataset.lastValue = els.categoryInput.value;
    learnFromCorrection();
  });
  els.merchantInput.addEventListener("change", learnFromCorrection);
  els.splitCategory?.addEventListener("change", () => {
    if (els.splitCategory.value === ADD_CATEGORY_VALUE) { promptAddCategory(els.splitCategory); return; }
    els.splitCategory.dataset.lastValue = els.splitCategory.value;
  });

  els.expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveExpense();
  });

  document.querySelectorAll(".ghost-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      els.smartInput.value = btn.dataset.example;
      els.smartInput.dispatchEvent(new Event("input"));
      els.smartInput.focus();
    });
  });

  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.view === "__more__") { openMoreMenu(); return; }
      switchView(btn.dataset.view);
    });
  });

  document.querySelectorAll(".more-item[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchView(btn.dataset.view);
      closeMoreMenu();
    });
  });

  document.getElementById("moreOverlay")?.addEventListener("click", (e) => {
    if (e.target.id === "moreOverlay") closeMoreMenu();
  });

  document.getElementById("moreTutorialBtn")?.addEventListener("click", () => {
    closeMoreMenu();
    startTutorial();
  });

  document.getElementById("tutorialNextBtn")?.addEventListener("click", tutorialNext);
  document.getElementById("tutorialBackBtn")?.addEventListener("click", tutorialBack);
  document.getElementById("tutorialSkipBtn")?.addEventListener("click", finishTutorial);
  document.getElementById("tutorialQuickBtn")?.addEventListener("click", () => selectTutorial("quick"));
  document.getElementById("tutorialExtendedBtn")?.addEventListener("click", () => selectTutorial("extended"));

  document.querySelectorAll(".mode").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.timelineMode = btn.dataset.mode;
      document.querySelectorAll(".mode").forEach((b) => b.classList.toggle("active", b === btn));
      renderTimeline();
      persist();
    });
  });

  els.rangeSelect.addEventListener("change", renderCategories);
  els.searchInput.addEventListener("input", renderSearch);
  els.splitForm.addEventListener("submit", calculateSplit);
  els.settingsForm.addEventListener("submit", saveSettings);
  els.resetDataBtn.addEventListener("click", resetAllData);
  els.addSubBtn.addEventListener("click", addSubscription);
  els.newTripBtn.addEventListener("click", addTrip);
  els.exportBtn.addEventListener("click", exportData);
  els.receiptInput.addEventListener("change", handleReceipt);
  document.getElementById("receiptPhotoInput")?.addEventListener("change", handleReceipt);
  document.getElementById("removeReceiptBtn")?.addEventListener("click", removeReceipt);
  els.voiceBtn.addEventListener("click", startVoice);
  els.splitTrip.addEventListener("change", applyTripPeopleToSplit);
  els.splitMode.addEventListener("change", () => { applySplitModeDefaults(); renderPercentInputs(); });
  document.querySelectorAll(".split-mode-card").forEach((card) => {
    card.addEventListener("click", () => {
      els.splitMode.value = card.dataset.mode;
      document.querySelectorAll(".split-mode-card").forEach((c) => c.classList.toggle("active", c === card));
      els.splitMode.dispatchEvent(new Event("change"));
    });
  });
  els.splitPeople.addEventListener("input", renderPercentInputs);
  els.splitPaidBy.addEventListener("input", renderPercentInputs);
  document.getElementById("splitPeopleSelect")?.addEventListener("change", renderPercentInputs);
  document.getElementById("splitPaidBySelect")?.addEventListener("change", renderPercentInputs);
  document.addEventListener("click", handleRecordActions);

  document.getElementById("chartView")?.addEventListener("change", renderHomeGraph);
  document.getElementById("targetPersonal")?.addEventListener("click", () => setExpenseTarget("personal"));
  document.getElementById("targetTrip")?.addEventListener("click", () => {
    const active = state.trips.find((t) => t.active && t.name !== "No trip");
    if (active) setExpenseTarget(active.name);
    else toast("No active trip. Create one in Trips first.");
  });

  // Dark mode
  document.getElementById("darkModeBtn")?.addEventListener("click", toggleDarkMode);

  // Import / Export (both topbar and settings copies)
  document.getElementById("importBtn")?.addEventListener("click", importData);
  document.getElementById("exportBtnSettings")?.addEventListener("click", exportData);
  document.getElementById("importBtnSettings")?.addEventListener("click", importData);

  // Receipt photo
  document.getElementById("receiptPhotoInput")?.addEventListener("change", handleReceipt);
  document.getElementById("removeReceiptBtn")?.addEventListener("click", removeReceipt);

  // Reports nav
  document.getElementById("reportPrevBtn")?.addEventListener("click", () => {
    reportMonth--; if (reportMonth < 0) { reportMonth = 11; reportYear--; }
    renderReports();
  });
  document.getElementById("reportNextBtn")?.addEventListener("click", () => {
    reportMonth++; if (reportMonth > 11) { reportMonth = 0; reportYear++; }
    renderReports();
  });

  // Goals
  document.getElementById("addGoalBtn")?.addEventListener("click", () => showGoalForm());
  document.getElementById("goalForm")?.addEventListener("submit", handleGoalForm);
  document.getElementById("cancelGoalBtn")?.addEventListener("click", hideGoalForm);

  // Wallets
  document.getElementById("addWalletBtn")?.addEventListener("click", () => showWalletForm());
  document.getElementById("addCategoryBtn")?.addEventListener("click", () => promptAddCategory(null));
  document.getElementById("walletForm")?.addEventListener("submit", handleWalletForm);
  document.getElementById("cancelWalletBtn")?.addEventListener("click", hideWalletForm);
}

function setExpenseTarget(target) {
  const isPersonal = target === "personal";
  document.getElementById("targetPersonal")?.classList.toggle("active", isPersonal);
  document.getElementById("targetTrip")?.classList.toggle("active", !isPersonal);
  const active = state.trips.find((t) => t.active && t.name !== "No trip");
  if (isPersonal) {
    els.tripInput.value = "No trip";
    document.getElementById("targetTrip").textContent = active ? `Trip: ${active.name}` : "Active trip";
  } else {
    els.tripInput.value = target;
    document.getElementById("targetTrip").textContent = `Trip: ${target}`;
  }
}

function syncBudgetTargetButton() {
  const active = state.trips.find((t) => t.active && t.name !== "No trip");
  const btn = document.getElementById("targetTrip");
  if (btn) btn.textContent = active ? `Trip: ${active.name}` : "Active trip";
  if (!active) {
    document.getElementById("targetPersonal")?.classList.add("active");
    document.getElementById("targetTrip")?.classList.remove("active");
  }
}

function expense(amount, category, merchant, daysAgo, trip = "No trip") {
  const date = new Date();
  date.setDate(date.getDate() + daysAgo);
  return { id: crypto.randomUUID(), amount, category, merchant, trip, date: iso(date), note: "" };
}

function splitRecord(mode, amount, payer, people, trip, category, note, daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysAgo);
  const rows = buildSplitRows(mode, amount, payer, people);
  return { id: crypto.randomUUID(), mode, amount, payer, people, trip, category, note, date: iso(date), rows };
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    const loaded = raw ? JSON.parse(raw) : structuredClone(initialState);
    return migrateState(loaded);
  } catch {
    return structuredClone(initialState);
  }
}

function migrateState(loaded) {
  return {
    ...structuredClone(initialState),
    ...loaded,
    learnedRules: loaded.learnedRules || {},
    subscriptions: loaded.subscriptions || structuredClone(initialState.subscriptions),
    trips: normalizeTrips(loaded.trips || structuredClone(initialState.trips)),
    splits: loaded.splits || [],
    goals: loaded.goals || [],
    wallets: loaded.wallets || structuredClone(initialState.wallets),
    settings: { ...initialState.settings, ...(loaded.settings || {}) },
  };
}

function normalizeTrips(trips) {
  const normalized = trips.map((trip) => ({
    id: trip.id || crypto.randomUUID(),
    name: trip.name || "Unnamed Trip",
    active: !!trip.active,
    budget: Number(trip.budget || 0),
    people: Array.isArray(trip.people) ? trip.people : [],
    details: trip.details || "",
  }));
  return normalized.some((trip) => trip.name === "No trip")
    ? normalized
    : [{ id: "no-trip", name: "No trip", active: true, budget: 0, people: [], details: "" }, ...normalized];
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (err) {
    console.error("Save failed:", err);
    // Don\u2019t rethrow: the in-memory state (and thus the UI) should still
    // update even if this particular save to disk failed, so the app never
    // looks "stuck" \u2014 it just couldn\u2019t write to localStorage that time.
    toast("\u26a0 Storage is full \u2014 this entry may not survive a refresh. Export a backup from Settings, then free up space (e.g. remove old receipt photos).");
  }
}

function parseEntry(text) {
  const clean = text.trim().toLowerCase();
  const moneyCommand = parseMoneyCommand(text);
  if (moneyCommand) return moneyCommand;
  const amountMatch = clean.match(/(?:₹|rs\.?\s*)?(\d+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? Number(amountMatch[1]) : "";
  const words = clean.replace(/(?:₹|rs\.?\s*)?\d+(?:\.\d{1,2})?/i, "").trim();

  // 1. User-taught rules win first (longest key first so specific phrases beat generic words)
  const learnedKeys = Object.keys(state.learnedRules).sort((a, b) => b.length - a.length);
  const learnedKey = learnedKeys.find((key) => clean.includes(key));
  let match = learnedKey ? state.learnedRules[learnedKey] : null;

  // 2. Built-in merchant keyword dictionary (also longest-key-first)
  if (!match) {
    const found = findMerchantMatch(clean);
    match = found ? { category: found[0], merchant: found[1] } : null;
  }

  const merchant = match?.merchant || titleCase(words || "Manual Expense");
  const category = match?.category || inferCategory(amount, words, clean);
  return { amount, category, merchant, trip: inferTrip(words), confidence: match ? "High" : "Draft" };
}

// Secondary, broader keyword buckets used only when no exact merchant/learned
// match was found above. Each bucket is checked as a substring of the full
// typed text, so multi-word phrases like "paid emi" or "gym membership" work.
const categoryFallbackKeywords = {
  Bills:        ["bill", "rent", "emi", "loan", "insurance", "premium", "due", "subscription fee", "maintenance", "society", "tax", "fine", "penalty", "recharge", "wifi", "broadband"],
  Travel:       ["trip", "hotel", "flight", "vacation", "holiday", "resort", "tour", "visa", "passport", "booking"],
  Transport:    ["cab", "taxi", "ride", "fare", "drive", "commute", "fuel", "parking", "toll"],
  Shopping:     ["shopping", "buy", "bought", "purchase", "order", "store", "mall", "online order"],
  Health:       ["health", "medical", "doctor", "hospital", "clinic", "checkup", "medicine", "treatment"],
  Entertainment:["movie", "watch", "stream", "concert", "show", "fun", "outing", "party", "drinks"],
  Groceries:    ["grocery", "groceries", "vegetable", "fruit", "supermarket", "kirana"],
  Food:         ["food", "eat", "lunch", "dinner", "breakfast", "snack", "restaurant", "meal", "order food"],
  Income:       ["salary", "income", "refund", "cashback", "received payment", "got paid"],
};

function inferCategory(amount, words, fullText) {
  const text = fullText || words;
  for (const [cat, keys] of Object.entries(categoryFallbackKeywords)) {
    if (keys.some((k) => text.includes(k))) return cat;
  }
  // Heuristic: very large one-off amounts are usually bills/rent rather than casual spends
  if (amount >= 10000) return "Bills";
  return "Other";
}

function inferTrip(words) {
  const active = state.trips.find((trip) => trip.active);
  const matchingTrip = state.trips.find((trip) => trip.name !== "No trip" && words.includes(trip.name.toLowerCase()));
  if (matchingTrip) return matchingTrip.name;
  return active ? active.name : "No trip";
}

function parseMoneyCommand(text) {
  const clean = text.trim().toLowerCase();
  const amountMatch = clean.match(/(?:₹|rs\.?\s*)?(\d+(?:\.\d{1,2})?)/i);
  if (!amountMatch) return null;
  const amount = Number(amountMatch[1]);
  const original = text.trim();
  const trip = inferTrip(clean);

  const received = clean.match(/(?:received|got|paid back|settled)\s+(?:₹|rs\.?\s*)?\d+(?:\.\d{1,2})?\s+from\s+([a-z ]+)/i);
  if (received) {
    const person = cleanPersonName(received[1]);
    return moneyCommand("paymentReceived", amount, person, currentUserName(), trip, `Received ${rupee(amount)} from ${person}`, original);
  }

  const owesMe = clean.match(/([a-z ]+)\s+(?:owes|has to pay|yet to pay)\s+(?:me|you)?\s*(?:₹|rs\.?\s*)?\d+(?:\.\d{1,2})?/i);
  if (owesMe) {
    const person = cleanPersonName(owesMe[1]);
    if (!isCurrentUser(person)) return moneyCommand("receivable", amount, person, currentUserName(), trip, `${person} is yet to pay`, original);
  }

  const iOwe = clean.match(/(?:i|me)\s+(?:owe|have to pay)\s+([a-z ]+)\s+(?:₹|rs\.?\s*)?\d+(?:\.\d{1,2})?/i);
  if (iOwe) {
    const person = cleanPersonName(iOwe[1]);
    return moneyCommand("payable", amount, currentUserName(), person, trip, `You owe ${person}`, original);
  }

  const paidMe = clean.match(/([a-z ]+)\s+paid\s+(?:me|you)\s+(?:₹|rs\.?\s*)?\d+(?:\.\d{1,2})?/i);
  if (paidMe) {
    const person = cleanPersonName(paidMe[1]);
    return moneyCommand("paymentReceived", amount, person, currentUserName(), trip, `${person} paid you`, original);
  }

  return null;
}

function moneyCommand(mode, amount, from, to, trip, note, original) {
  return {
    type: "settlement",
    mode,
    amount,
    from,
    to,
    trip,
    category: "Other",
    merchant: note,
    note: original,
    confidence: "Money command",
  };
}

function saveMoneyCommand(command) {
  const offsetRows = command.mode === "paymentReceived"
    ? [settlement(command.to, command.from, command.amount)]
    : [settlement(command.from, command.to, command.amount)];
  const record = {
    id: crypto.randomUUID(),
    mode: command.mode,
    amount: command.amount,
    payer: command.mode === "paymentReceived" ? command.from : command.to,
    people: [command.from, command.to].filter((person, index, arr) => arr.findIndex((item) => personKey(item) === personKey(person)) === index),
    trip: command.trip,
    category: command.category,
    note: command.merchant,
    originalText: command.note,
    date: iso(new Date()),
    rows: offsetRows,
  };
  state.splits.unshift(record);
  persist();
  clearEntry();
  render();
  renderSplitPreview(record);
  toast(`${command.merchant} saved.`);
}

function fillDraft(parsed) {
  els.amountInput.value = parsed.amount || "";
  els.categoryInput.value = parsed.category;
  els.merchantInput.value = parsed.merchant;
  els.tripInput.value = parsed.trip;
}

function renderSuggestion(parsed) {
  if (!els.smartInput.value.trim()) {
    els.suggestionRow.innerHTML = "";
    return;
  }
  els.suggestionRow.innerHTML = [
    ["Amount", parsed.amount ? rupee(parsed.amount) : "Needed"],
    ["Category", parsed.category],
    ["Merchant", parsed.merchant],
    ["Confidence", parsed.confidence],
  ].map(([label, value]) => `<span class="suggestion">${label}: <strong>${value}</strong></span>`).join("");
}

function saveExpense() {
  const parsed = parseEntry(els.smartInput.value);
  if (parsed.type === "settlement") {
    saveMoneyCommand(parsed);
    return;
  }
  const amount = Number(els.amountInput.value);
  if (!amount) {
    toast("Add an amount first.");
    return;
  }
  const walletEl = document.getElementById("walletInput");
  const item = {
    id: crypto.randomUUID(),
    amount,
    category: els.categoryInput.value || "Other",
    merchant: els.merchantInput.value.trim() || "Manual Expense",
    trip: els.tripInput.value || "No trip",
    wallet: walletEl ? walletEl.value : "",
    date: iso(new Date()),
    note: els.smartInput.value.trim(),
    photo: pendingReceiptBase64 || null,
  };
  state.expenses.unshift(item);
  learnFromCorrection();
  persist();
  clearEntry();
  removeReceipt();
  render();
  toast(`${rupee(amount)} saved to ${item.category}.`);
}

function clearEntry() {
  els.smartInput.value = "";
  els.amountInput.value = "";
  els.merchantInput.value = "";
  els.categoryInput.value = "Food";
  els.suggestionRow.innerHTML = "";
}

function learnFromCorrection() {
  const merchant = els.merchantInput.value.trim().toLowerCase();
  if (merchant && merchant !== "manual expense") {
    merchant.split(/\s+/).forEach((word) => {
      if (word.length > 2) state.learnedRules[word] = { category: els.categoryInput.value, merchant: els.merchantInput.value.trim() };
    });
    persist();
  }
}

function render() {
  renderDashboard();
  renderBudgetAlerts();
  renderHomeGraph();
  renderCategories();
  renderCoach();
  renderHeatmap();
  renderSubscriptions();
  renderSearch();
  renderTimeline();
  renderCalendar();
  renderTrips();
  renderSplitBook();
  renderSettings();
  renderIdentityBanner();
  syncBudgetTargetButton();
  renderGoals();
  renderWallets();
  renderReports();
  renderCategoryBudgetInputs();
  populateWalletSelect();
  applyDarkMode(state.settings.darkMode);
}

function renderIdentityBanner() {
  const banner = document.getElementById("identityBanner");
  if (!banner) return;
  const hasName = !!(state.settings.userName?.trim());
  banner.style.display = hasName ? "none" : "block";
}

function renderDashboard() {
  const monthItems = state.expenses.filter(isThisMonth);
  const budget = Number(state.settings.monthlyBudget || defaultBudget);
  const spent = sum(monthItems);
  const left = Math.max(budget - spent, 0);
  const daysRemaining = daysLeftInMonth();
  const usedPct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const flow = monthlyFlow();
  els.monthSpent.textContent = rupee(spent);
  els.budgetLeft.textContent = budget ? rupee(left) : "Not set";
  els.receivedTotal.textContent = `+${rupee(flow.received)}`;
  els.givenTotal.textContent = `-${rupee(flow.given)}`;
  els.budgetStatus.textContent = budget
    ? `Used ${usedPct}%. ${daysRemaining} days remaining. ${usedPct < 82 ? "On track." : "Slow and steady now."}`
    : "Set your budget in User.";
  els.sideRhythm.textContent = budget ? (usedPct < 82 ? "On track" : "Watch pace") : "Set budget";
  const prev = sum(state.expenses.filter(isPreviousMonth));
  const delta = prev ? Math.round(((spent - prev) / prev) * 100) : 18;
  const food = sum(monthItems.filter((x) => x.category === "Food"));
  els.monthInsight.textContent = monthItems.length
    ? `Food spending is ${delta >= 0 ? "up" : "down"} ${Math.abs(delta)}% vs last month. ${rupee(food)} could cover about ${Math.max(1, Math.round(food / 700))} grocery days.`
    : "Add your first expense to unlock insights.";
}

function monthlyFlow() {
  const monthSplits = state.splits.filter(isThisMonth);
  const paymentReceived = monthSplits
    .filter((split) => split.mode === "paymentReceived")
    .reduce((total, split) => total + Number(split.amount || 0), 0);
  const splitRows = monthSplits
    .filter((split) => split.mode !== "paymentReceived")
    .flatMap((split) => split.rows || []);
  const received = splitRows.filter((row) => isCurrentUser(row.to)).reduce((total, row) => total + Number(row.amount || 0), 0);
  const owed = splitRows.filter((row) => isCurrentUser(row.from)).reduce((total, row) => total + Number(row.amount || 0), 0);
  return {
    received: received + paymentReceived,
    given: sum(state.expenses.filter(isThisMonth)) + owed,
  };
}

function renderCategories() {
  const items = filterByRange(state.expenses, els.rangeSelect.value);
  const grouped = groupSum(items, "category").sort((a, b) => b.total - a.total);
  const max = grouped[0]?.total || 1;
  els.categoryList.innerHTML = grouped.length ? grouped.slice(0, 6).map((row) => `
    <div class="category-row">
      <strong>${row.key}</strong>
      <div class="bar"><span style="width:${Math.max(8, (row.total / max) * 100)}%"></span></div>
      <span class="amount">${rupee(row.total)}</span>
    </div>
  `).join("") : `<p class="empty">No expenses in this range.</p>`;
}

function renderCoach() {
  const monthItems = state.expenses.filter(isThisMonth);
  const food = sum(monthItems.filter((x) => x.category === "Food"));
  const transport = sum(monthItems.filter((x) => x.category === "Transport"));
  const weeklyFood = Math.round(food / Math.max(1, new Date().getDate() / 7));
  const budget = Number(state.settings.monthlyBudget || defaultBudget);
  const suggestions = [
    {
      title: "Budget without guilt",
      body: budget ? `${Math.round((sum(monthItems) / budget) * 100)}% used. You still have ${rupee(Math.max(budget - sum(monthItems), 0))} left this month.` : "Set a monthly budget when you are ready. Until then, just track honestly.",
    },
    {
      title: "Food pace",
      body: `You usually spend around ${rupee(weeklyFood || 1500)}/week on eating out. This week is ${food > 5000 ? "running warm" : "calm so far"}.`,
    },
    {
      title: "Travel signal",
      body: transport > 2000 ? "Transport is higher than usual. Fuel and rides are the main reason." : "Transport is comfortably under control.",
    },
  ];
  els.coachList.innerHTML = suggestions.map((item) => `<article class="coach-card"><strong>${item.title}</strong><p>${item.body}</p></article>`).join("");
}

function renderHeatmap() {
  const byDay = new Map();
  state.expenses.filter(isThisMonth).forEach((x) => byDay.set(dayOfMonth(x.date), (byDay.get(dayOfMonth(x.date)) || 0) + x.amount));
  const days = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const max = Math.max(...byDay.values(), 1);
  els.heatmap.innerHTML = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const total = byDay.get(day) || 0;
    const level = total === 0 ? 0 : Math.min(4, Math.ceil((total / max) * 4));
    return `<div class="heat-cell heat-${level}" title="${day}: ${rupee(total)}"></div>`;
  }).join("");
  els.streakText.textContent = `${noSpendStreak()} day no-spend streak`;
}

const CAT_COLORS = {
  Food:"#107c5c", Transport:"#2662d9", Shopping:"#8b5cf6", Bills:"#bb7a0b",
  Groceries:"#059669", Entertainment:"#d946ef", Health:"#e11d48",
  Travel:"#0891b2", Income:"#16a34a", Other:"#64748b",
};

function renderHomeGraph() {
  const container = document.getElementById("spendingChart");
  if (!container) return;
  const view = document.getElementById("chartView")?.value || "daily";
  if (view === "daily") {
    const n = 14, today = new Date();
    const data = Array.from({ length: n }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (n - 1 - i));
      const total = sum(state.expenses.filter((x) => x.date === iso(d)));
      return { label: d.toLocaleDateString("en-IN", { day:"numeric", month:"short" }), dayNum: d.getDate(), total, isToday: i === n - 1 };
    });
    container.innerHTML = buildBarChartSVG(data);
  } else {
    const grouped = groupSum(state.expenses.filter(isThisMonth), "category");
    const data = grouped.slice(0, 8).map((x) => ({ label: x.key, total: x.total }));
    container.innerHTML = buildBarChartSVG(data);
  }
}

function buildBarChartSVG(data) {
  if (!data.length || data.every((d) => !d.total)) return `<p class="empty">No spending data yet for this period.</p>`;
  const W = 680, H = 175, pad = { t: 26, b: 34, l: 6, r: 6 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const n = data.length;
  const gap = iW * 0.18 / (n + 1);
  const bW = (iW - gap * (n + 1)) / n;
  const max = Math.max(...data.map((d) => d.total));
  const bars = data.map((d, i) => {
    const x = pad.l + gap + i * (bW + gap);
    const bH = d.total ? Math.max(4, (d.total / max) * iH) : 0;
    const y = pad.t + iH - bH;
    const color = d.isToday ? "#107c5c" : (CAT_COLORS[d.label] || (d.total > max * 0.72 ? "#b43b48" : "#28a96d"));
    const short = d.dayNum != null ? `${d.dayNum}` : (d.label.length > 6 ? d.label.slice(0, 6) : d.label);
    const amt = d.total >= 1000 ? `${(d.total/1000).toFixed(1)}k` : (d.total ? `${Math.round(d.total)}` : "");
    return [
      bH > 0
        ? `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bW.toFixed(1)}" height="${bH.toFixed(1)}" rx="3" fill="${color}" opacity="${d.isToday?1:0.78}"/>`
        : `<rect x="${x.toFixed(1)}" y="${(pad.t+iH-2).toFixed(1)}" width="${bW.toFixed(1)}" height="2" rx="1" fill="var(--line, #ece7df)"/>`,
      amt ? `<text x="${(x+bW/2).toFixed(1)}" y="${(y-4).toFixed(1)}" text-anchor="middle" font-size="9" font-family="Inter,system-ui,sans-serif" fill="var(--ink, #1f2328)">${amt}</text>` : "",
      `<text x="${(x+bW/2).toFixed(1)}" y="${(pad.t+iH+16).toFixed(1)}" text-anchor="middle" font-size="${bW>22?10:9}" font-family="Inter,system-ui,sans-serif" fill="${d.isToday?"var(--green, #107c5c)":"var(--muted, #667085)"}" font-weight="${d.isToday?"800":"400"}">${short}</text>`,
    ].join("");
  }).join("");
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:${H}px" role="img"><title>Spending chart</title>${bars}</svg>`;
}

function renderSubscriptions() {
  const monthly = sum(state.subscriptions);
  const annual = monthly * 12;
  els.subscriptionList.innerHTML = `
    <div class="coach-card"><strong>${state.subscriptions.length} active subscriptions</strong><p>${rupee(monthly)}/month · ${rupee(annual)}/year</p></div>
    ${state.subscriptions.length ? state.subscriptions.map((sub) => `<div class="sub-row"><div><strong>${sub.name}</strong><div class="expense-meta">Renews on day ${sub.day} · ${sub.category}</div></div><span class="amount">${rupee(sub.amount)}</span><div class="row-actions"><button class="mini-text edit-subscription" data-id="${sub.id || sub.name}">Edit</button><button class="mini-text delete-subscription" data-id="${sub.id || sub.name}">Delete</button></div></div>`).join("") : `<p class="empty">Add subscriptions as you discover them.</p>`}
  `;
  const upcoming = state.subscriptions.filter((sub) => daysUntilDay(sub.day) <= 7);
  els.upcomingTotal.textContent = rupee(sum(upcoming));
  els.upcomingText.textContent = upcoming.length ? upcoming.map((sub) => `${sub.name} in ${daysUntilDay(sub.day)} days`).join(" · ") : "Nothing due this week.";
}

function renderSearch() {
  const query = els.searchInput.value.trim().toLowerCase();
  let results = state.expenses.slice(0, 5);
  if (query) {
    const terms = searchAliases[query] || [query];
    results = state.expenses.filter((x) => {
      const hay = `${x.merchant} ${x.category} ${x.note} ${x.trip}`.toLowerCase();
      if (query.includes("jan") && query.includes("march")) {
        const month = new Date(x.date).getMonth();
        return month >= 0 && month <= 2;
      }
      return terms.some((term) => hay.includes(term));
    });
  }
  els.searchResults.innerHTML = results.length ? results.slice(0, 8).map(renderExpenseRow).join("") : `<p class="empty">No matching expenses.</p>`;
}

function renderTimeline() {
  const groups = groupByPeriod(state.expenses, state.timelineMode);
  els.timelineList.innerHTML = groups.length ? groups.map((group) => `
    <section class="timeline-day">
      <h3>${group.label} · ${rupee(sum(group.items))}</h3>
      ${group.items.slice(0, 6).map(renderExpenseRow).join("")}
    </section>
  `).join("") : `<p class="empty">Nothing tracked yet.</p>`;
}

function renderCalendar() {
  const now = new Date();
  els.calendarMonth.textContent = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthItems = state.expenses.filter(isThisMonth);
  els.calendarGrid.innerHTML = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const total = sum(monthItems.filter((x) => dayOfMonth(x.date) === day));
    return `<div class="calendar-cell"><strong>${day}</strong><span>${total ? rupee(total) : ""}</span></div>`;
  }).join("");
}

function renderTrips() {
  const trips = state.trips.filter((trip) => trip.name !== "No trip");
  if (!trips.length) {
    els.tripList.innerHTML = `<p class="empty">Create a trip to group travel expenses and splits.</p>`;
    els.tripDetail.innerHTML = "";
    return;
  }
  els.tripList.innerHTML = trips.map((trip) => {
    const stats = tripStats(trip);
    const cats = groupSum(stats.expenses, "category").slice(0, 4);
    const usedPct = trip.budget ? Math.min(100, Math.round((stats.total / trip.budget) * 100)) : 0;
    return `<article class="trip-card">
      <div class="trip-card-head"><div><strong>${trip.name}</strong><div class="expense-meta">${stats.expenses.length} expenses · ${stats.splits.length} splits · ${trip.people.length} people</div></div><span class="amount">${rupee(stats.total)}</span></div>
      <div class="expense-meta">${trip.budget ? `${usedPct}% of ${rupee(trip.budget)} trip budget used` : "Trip budget not set"}</div>
      <div class="trip-cats">${cats.map((cat) => `<div>${cat.key}<br><strong>${rupee(cat.total)}</strong></div>`).join("") || "<div>No trip expenses yet</div>"}</div>
      ${stats.splits.length ? `<div class="trip-splits">${stats.splits.slice(0, 3).map((split) => `<span>${split.note || "Split"} · ${rupee(split.amount)}</span>`).join("")}</div>` : ""}
      <div class="row-actions trip-actions">
        <button class="mini-text open-trip" data-id="${trip.id}">Open</button>
        <button class="mini-text edit-trip" data-id="${trip.id}">Edit</button>
        <button class="mini-text delete-trip" data-id="${trip.id}">Delete</button>
      </div>
    </article>`;
  }).join("");
  const selected = state.trips.find((trip) => trip.id === state.settings.selectedTripId) || trips[0];
  renderTripDetail(selected);
}

function renderTripDetail(trip) {
  if (!trip || trip.name === "No trip") {
    els.tripDetail.innerHTML = "";
    return;
  }
  const stats = tripStats(trip);
  const tripLedger = simplifyLedger(stats.splits.flatMap((split) => split.rows || []));
  const personTotals = summarizePeople(stats.splits.flatMap((split) => split.rows || []));
  const remaining = Math.max(Number(trip.budget || 0) - stats.total, 0);
  els.tripDetail.innerHTML = `
    <section class="trip-detail-panel">
      <div class="panel-head">
        <div>
          <h2>${trip.name}</h2>
          <p class="expense-meta">${trip.details || "No trip details added."}</p>
        </div>
        <span class="amount">${rupee(stats.total)}</span>
      </div>
      <div class="trip-detail-grid">
        <div><span>Trip Budget</span><strong>${trip.budget ? rupee(trip.budget) : "Not set"}</strong></div>
        <div><span>Budget Left</span><strong>${trip.budget ? rupee(remaining) : "Not set"}</strong></div>
        <div><span>Expenses</span><strong>${rupee(stats.expenseTotal)}</strong></div>
        <div><span>Splits</span><strong>${rupee(stats.splitTotal)}</strong></div>
      </div>
      <div class="trip-people">${trip.people.length ? trip.people.map((person) => `<span>${person}</span>`).join("") : `<span>No people added</span>`}</div>
      <div class="split-ledger-grid">
        <section>
          <h2>Trip Ledger</h2>
          <div class="split-results">${tripLedger.length ? tripLedger.map((row) => renderSettlementRow(row)).join("") : `<p class="empty">No trip balances yet.</p>`}</div>
        </section>
        <section>
          <h2>Final By Person</h2>
          <div class="split-results">${personTotals.length ? personTotals.map(renderPersonTotal).join("") : `<p class="empty">No person totals yet.</p>`}</div>
        </section>
      </div>
      <div class="trip-detail-list">
        <h2>Who Spent What</h2>
        ${stats.splits.length ? stats.splits.map(renderTripSplitStory).join("") : `<p class="empty">No split bills saved for this trip.</p>`}
      </div>
      <div class="trip-detail-list">
        <h2>Trip Expenses</h2>
        ${stats.expenses.length ? stats.expenses.slice(0, 8).map(renderExpenseRow).join("") : `<p class="empty">No expenses saved for this trip.</p>`}
      </div>
    </section>
  `;
}

function renderTripSplitStory(split) {
  const people = (split.people || []).map(cleanPersonName).join(", ") || "No people listed";
  const rows = (split.rows || []).map((row) => row.label).join(" · ");
  const payer = cleanPersonName(split.payer || "Unknown");
  return `
    <article class="trip-story">
      <div>
        <strong>${split.note || "Split bill"}</strong>
        <div class="expense-meta">${formatDate(split.date)} · Paid by ${isCurrentUser(payer) ? "you" : payer} · ${people}</div>
        ${rows ? `<p>${rows}</p>` : `<p>${split.originalText || "Payment recorded."}</p>`}
      </div>
      <span class="amount">${rupee(split.amount)}</span>
    </article>
  `;
}

function tripStats(trip) {
  const expenses = state.expenses.filter((x) => x.trip === trip.name);
  const splits = state.splits.filter((x) => x.trip === trip.name);
  const expenseTotal = sum(expenses);
  const splitTotal = sum(splits);
  return { expenses, splits, expenseTotal, splitTotal, total: expenseTotal + splitTotal };
}

function renderExpenseRow(item) {
  const wallet  = item.wallet ? state.wallets.find(w => w.id === item.wallet) : null;
  const walletTag = wallet ? `<span class="pill" style="font-size:0.72rem">${wallet.icon} ${wallet.name}</span>` : "";
  const receipt = item.photo
    ? `<img src="${item.photo}" class="expense-receipt-thumb" alt="Receipt" title="View receipt" onclick="this.requestFullscreen&&this.requestFullscreen()" />`
    : "";
  return `<div class="expense-row">
    ${receipt}
    <div style="flex:1;min-width:0">
      <strong>${item.merchant}</strong>
      <div class="expense-meta">${formatDate(item.date)} · ${item.category} · ${item.trip} ${walletTag}</div>
    </div>
    <span class="amount">${rupee(item.amount)}</span>
    <div class="row-actions">
      <button class="mini-text edit-expense" data-id="${item.id}">Edit</button>
      <button class="mini-text delete-expense" data-id="${item.id}">Delete</button>
    </div>
  </div>`;
}

const MORE_MENU_VIEWS = ["calendar", "reports", "goals", "wallets", "settings"];

function switchView(view) {
  const isMoreView = MORE_MENU_VIEWS.includes(view);
  document.querySelectorAll(".nav-tab").forEach((btn) => {
    const isMoreBtn = btn.dataset.view === "__more__";
    btn.classList.toggle("active", isMoreBtn ? isMoreView : btn.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => section.classList.toggle("active-view", section.id === view));
  if (view === "split")   applyTripPeopleToSplit();
  if (view === "reports") renderReports();
  if (view === "goals")   renderGoals();
  if (view === "wallets") { renderWallets(); renderCategoryBudgetInputs(); }
}

function openMoreMenu() {
  const overlay = document.getElementById("moreOverlay");
  const sheet = overlay?.querySelector(".more-sheet");
  if (!overlay || !sheet) return;
  overlay.hidden = false;

  // On desktop, anchor the dropdown right next to the "More" nav button.
  if (window.innerWidth > 920) {
    const btn = document.getElementById("moreNavBtn");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      sheet.style.top = `${rect.top}px`;
      sheet.style.left = `${rect.right + 12}px`;
    }
  } else {
    sheet.style.top = "";
    sheet.style.left = "";
  }
}

function closeMoreMenu() {
  const overlay = document.getElementById("moreOverlay");
  if (overlay) overlay.hidden = true;
}

function calculateSplit(event) {
  event.preventDefault();
  const mode = els.splitMode.value;
  const amount = Number(els.splitAmount.value);
  const trip = els.splitTrip.value || "No trip";
  const category = els.splitCategory.value || "Other";
  const note = els.splitNote.value.trim() || "Split expense";

  if (!amount) { toast("Add an amount first."); return; }

  // Self-expense: save as a regular expense, not a split
  if (mode === "selfExpenseTrip") {
    const item = {
      id: crypto.randomUUID(),
      amount,
      category,
      merchant: note,
      trip,
      date: iso(new Date()),
      note,
    };
    state.expenses.unshift(item);
    persist();
    render();
    els.splitResults.innerHTML = `<div class="split-summary"><span>Saved to ${trip === "No trip" ? "personal budget" : trip}</span><strong>${rupee(amount)}</strong></div><div class="split-result"><span>Added as your personal expense — no split created</span><strong>✓</strong></div>`;
    toast(`${rupee(amount)} saved as personal expense.`);
    return;
  }

  // Someone else's own expense — auto: the "received by" is the same person
  // as "paid by", since there's nothing to split. Logged for trip totals only.
  if (mode === "otherPaidSelf") {
    const person = cleanPersonName(getSplitPaidBy() || "Unknown");
    const record = splitRecord(mode, amount, person, [person], trip, category, note);
    state.splits.unshift(record);
    persist();
    renderSplitBook();
    renderTrips();
    els.splitResults.innerHTML = `<div class="split-summary"><span>${person}'s own expense \u2014 logged under ${trip === "No trip" ? "no trip" : trip}</span><strong>${rupee(amount)}</strong></div><div class="split-result"><span>No one owes anyone for this \u2014 it's just a trip record.</span><strong>\u2713</strong></div>`;
    toast(`${rupee(amount)} logged as ${person}'s own expense.`);
    return;
  }

  // Settlement modes (these involve "You" on one side)
  if (mode === "settlement" || mode === "iSettled") {
    const person = cleanPersonName(getSplitPaidBy() || getSplitPeopleList()[0] || "Unknown");
    const people = [person];
    const payer = mode === "settlement" ? person : currentUserName();
    const record = splitRecord(mode, amount, payer, people, trip, category, note);
    state.splits.unshift(record);
    persist();
    renderSettlementPreview(mode, amount, person);
    renderSplitBook();
    toast(`Settlement of ${rupee(amount)} recorded.`);
    return;
  }

  // Settlement between two OTHER people \u2014 doesn't touch your own balance
  if (mode === "thirdPartySettlement") {
    const from = cleanPersonName(getSplitPaidBy() || "Unknown");
    const to = cleanPersonName(getSplitPeopleList()[0] || "Unknown");
    if (personKey(from) === personKey(to)) { toast("Pick two different people."); return; }
    const record = splitRecord(mode, amount, from, [to], trip, category, note);
    state.splits.unshift(record);
    persist();
    renderSplitBook();
    els.splitResults.innerHTML = `<div class="split-summary settlement-summary"><span>${from} paid ${to} back ${rupee(amount)}</span><strong>\u2713 Settled</strong></div><div class="split-result"><span>This doesn't affect your own balance \u2014 it's just recorded for the group.</span></div>`;
    toast(`Recorded: ${from} paid ${to} back ${rupee(amount)}.`);
    return;
  }

  const payer = (mode === "youPaidGroup" || mode === "youPaidOne")
    ? currentUserName()
    : cleanPersonName(getSplitPaidBy() || "You");
  const people = getSplitPeopleList();
  if (!people.length) { toast("Add at least one person, or select \u2018You\u2019 too if you took part."); return; }

  const record = splitRecord(mode, amount, payer, people, trip, category, note);
  state.splits.unshift(record);
  persist();
  renderSplitPreview(record);
  renderSplitBook();
  renderTrips();
  toast(`Saved split under ${record.trip}.`);
}

function renderSettlementPreview(mode, amount, person) {
  const msg = mode === "settlement"
    ? `${person} paid you back ${rupee(amount)}`
    : `You paid ${person} ${rupee(amount)}`;
  const sub = mode === "settlement"
    ? `Their debt to you has been reduced by ${rupee(amount)}.`
    : `Your debt to ${person} has been reduced by ${rupee(amount)}.`;
  els.splitResults.innerHTML = `
    <div class="split-summary settlement-summary">
      <span>${msg}</span><strong>✓ Settled</strong>
    </div>
    <div class="split-result"><span>${sub}</span></div>
  `;
}

function buildSplitRows(mode, amount, payer, people) {
  const percents = readSplitPercentages();
  const payerKey = personKey(payer);
  // Universal rule: the payer never owes themselves, no matter how the
  // person/people list was assembled (typed text, multi-select, or "You").
  const owers = people.filter((p) => personKey(p) !== payerKey);

  if (mode === "youPaidGroup" || mode === "friendPaidGroup") {
    // Total headcount = everyone who owes + the payer themselves
    const totalHeads = owers.length + 1;
    if (percents) {
      return owers.map((p) => settlement(p, payer, amount * (percents.get(personKey(p)) || 0) / 100));
    }
    const share = amount / totalHeads;
    return owers.map((p) => settlement(p, payer, share));
  }

  if (mode === "friendPaidYou") {
    return [settlement(currentUserName(), payer, amount)];
  }

  if (mode === "youPaidOne" || mode === "friendPaidOne") {
    // Each selected person owes the FULL amount to whoever paid (the payer
    // isn't necessarily "You" for friendPaidOne \u2014 e.g. "Rahul paid for Priya").
    if (percents) {
      return owers.map((p) => settlement(p, payer, amount * (percents.get(personKey(p)) || 0) / 100));
    }
    return owers.map((p) => settlement(p, payer, amount));
  }

  if (mode === "settlement") {
    // They paid the user back — creates an offsetting row that cancels their debt
    const s = settlement(currentUserName(), payer, amount);
    return [{ ...s, label: `${payer} paid you back ${rupee(amount)} \u2713` }];
  }

  if (mode === "iSettled") {
    // User paid them back — offsets user's debt
    const creditor = cleanPersonName(people[0] || payer);
    const s = settlement(creditor, currentUserName(), amount);
    return [{ ...s, label: `You paid ${creditor} ${rupee(amount)} \u2713` }];
  }

  if (mode === "selfExpenseTrip" || mode === "otherPaidSelf") {
    // No debt either way — selfExpenseTrip is your own spend, otherPaidSelf
    // is someone else's own spend. Both are logged purely for trip totals.
    return [];
  }

  if (mode === "thirdPartySettlement") {
    // A settlement between two people, neither of whom needs to be "You".
    // "payer" is whoever paid the money back; people[0] is whoever received
    // it. "X paid Y back" implies X owed Y, so the offsetting row must run
    // in the OPPOSITE direction (Y \u2192 X) to cancel that original debt out
    // when the two rows are summed \u2014 same trick used by settlement/iSettled.
    const to = people[0];
    const s = settlement(to, payer, amount);
    return [{ ...s, label: `${payer} paid ${to} back ${rupee(amount)} \u2713` }];
  }

  return owers.map((person) => settlement(person, payer, amount));
}

function readSplitPercentages() {
  const section = document.getElementById("advancedSplitSection");
  if (!section || !section.open) return null;
  const inputs = section.querySelectorAll(".pct-input");
  if (!inputs.length) return null;
  const map = new Map();
  let total = 0;
  inputs.forEach((input) => {
    const pct = parseFloat(input.value) || 0;
    map.set(input.dataset.personkey, pct);
    total += pct;
  });
  return Math.abs(total - 100) <= 1 ? map : null;
}

function renderPercentInputs() {
  const section = document.getElementById("advancedSplitSection");
  const container = document.getElementById("percentInputs");
  const totalEl = document.getElementById("percentTotal");
  if (!section || !container) return;
  const mode = els.splitMode.value;
  if (["settlement", "iSettled", "thirdPartySettlement", "selfExpenseTrip", "otherPaidSelf", "youPaidOne", "friendPaidOne"].includes(mode)) {
    section.style.display = "none";
    return;
  }
  section.style.display = "";
  const people = getSplitPeopleList();
  if (!people.length) {
    container.innerHTML = `<p class="empty">Select at least one person to set custom splits.</p>`;
    return;
  }
  // Mirror buildSplitRows(): whoever is selected, minus the payer (who never owes themselves).
  const payerName = (mode === "youPaidGroup" || mode === "youPaidOne" || mode === "selfExpenseTrip")
    ? currentUserName()
    : (getSplitPaidBy() || "You");
  const payerKey = personKey(payerName);
  const allPeople = people.filter((p) => personKey(p) !== payerKey);
  if (!allPeople.length) { container.innerHTML = `<p class="empty">No one else to split with — everyone selected is the payer.</p>`; return; }
  const base = +(100 / allPeople.length).toFixed(1);
  const last = +(100 - base * (allPeople.length - 1)).toFixed(1);
  container.innerHTML = allPeople.map((person, i) => {
    const key = personKey(person);
    const isYou = isCurrentUser(person);
    const def = i === allPeople.length - 1 ? last : base;
    return `<div class="pct-row"><span class="pct-name">${isYou ? "You" : person}</span><input class="pct-input" type="number" min="0" max="100" step="1" value="${def}" data-personkey="${key}"/><span class="pct-sym">%</span></div>`;
  }).join("");
  updatePercentTotal();
  container.querySelectorAll(".pct-input").forEach((inp) => inp.addEventListener("input", updatePercentTotal));
}

function updatePercentTotal() {
  const totalEl = document.getElementById("percentTotal");
  if (!totalEl) return;
  let total = 0;
  document.querySelectorAll(".pct-input").forEach((inp) => { total += parseFloat(inp.value) || 0; });
  const rounded = Math.round(total * 10) / 10;
  const ok = Math.abs(rounded - 100) <= 0.5;
  totalEl.textContent = `Total: ${rounded}% ${ok ? "✓" : "— must equal 100"}`;
  totalEl.className = `percent-total ${ok ? "ok" : "warn"}`;
}

function settlement(from, to, amount) {
  const cleanFrom = cleanPersonName(from);
  const cleanTo = cleanPersonName(to);
  const fromYou = isCurrentUser(cleanFrom);
  const toYou = isCurrentUser(cleanTo);
  return {
    from: cleanFrom,
    to: cleanTo,
    amount,
    label: `${fromYou ? "You" : cleanFrom} owe${fromYou ? "" : "s"} ${toYou ? "you" : cleanTo}`,
    netForYou: toYou ? amount : fromYou ? -amount : 0,
  };
}

function renderSplitPreview(record) {
  const net = record.rows.reduce((total, row) => total + row.netForYou, 0);
  const peopleCount = record.rows.length;
  const share = peopleCount ? rupee(Math.round(record.amount / (peopleCount + 1))) : "";
  const shareNote = peopleCount
    ? `<span class="split-share-note">${peopleCount + 1} people · ${share} each</span>`
    : "";
  els.splitResults.innerHTML = `
    <div class="split-summary">
      <span>${net >= 0 ? "You should receive" : "You owe"}</span>
      <strong>${rupee(Math.abs(net))}</strong>
    </div>
    ${shareNote}
    ${record.rows.map((row) => renderSettlementRow(row, record)).join("")}
  `;
}

function renderSplitBook() {
  renderLedger();
  renderPersonLedger();
  renderSavedSplits();
}

function renderLedger() {
  const rows = simplifyLedger(state.splits.flatMap((split) => split.rows || []));
  els.ledgerCount.textContent = `${rows.length} open`;
  els.ledgerList.innerHTML = rows.length
    ? rows.map((row) => renderSettlementRow(row)).join("")
    : `<p class="empty">No open balances yet.</p>`;
}

function renderPersonLedger() {
  const rows = summarizePeople(state.splits.flatMap((split) => split.rows || []));
  els.personLedgerList.innerHTML = rows.length
    ? rows.map(renderPersonTotal).join("")
    : `<p class="empty">No person totals yet.</p>`;
}

function renderSavedSplits() {
  els.savedSplitList.innerHTML = state.splits.length
    ? state.splits.slice(0, 10).map((split) => `
      <article class="saved-split">
        <div><strong>${split.note || "Split expense"}</strong><div class="expense-meta">${formatDate(split.date)} · ${split.trip} · ${split.category}</div></div>
        <span class="amount">${rupee(split.amount)}</span>
        <div class="row-actions"><button class="mini-text edit-split" data-id="${split.id}">Edit</button><button class="mini-text delete-split" data-id="${split.id}">Delete</button></div>
      </article>
    `).join("")
    : `<p class="empty">Saved split expenses will appear here.</p>`;
}

function renderSettings() {
  els.userNameInput.value = state.settings.userName || "";
  els.monthlyBudgetInput.value = state.settings.monthlyBudget || "";
  const name = state.settings.userName?.trim();
  document.querySelector("h1").textContent = name ? `${name}'s expense tracker` : "Spend less time tracking. Know more sooner.";
  if (name && els.splitPaidBy && (els.splitPaidBy.value === "You" || !els.splitPaidBy.value)) {
    els.splitPaidBy.value = name;
  }
  renderCategoryBudgetInputs();
}

function renderSettlementRow(row, record) {
  const meta = record ? `<div class="expense-meta">${record.trip} · ${record.category}</div>` : "";
  return `<div class="split-result"><span>${row.label}${meta}</span><strong>${rupee(row.amount)}</strong></div>`;
}

function simplifyLedger(rows) {
  const balances = new Map();
  rows.forEach((row) => {
    if (!row.from || !row.to || row.from === row.to) return;
    const from = cleanPersonName(row.from);
    const to = cleanPersonName(row.to);
    const keyParts = [personKey(from), personKey(to)].sort();
    const key = keyParts.join("→");
    const current = balances.get(key) || { a: from, b: to, aKey: personKey(from), bKey: personKey(to), net: 0 };
    const direction = personKey(from) === current.aKey && personKey(to) === current.bKey ? 1 : -1;
    current.net += direction * row.amount;
    balances.set(key, current);
  });
  return [...balances.values()]
    .filter((item) => Math.abs(item.net) >= 1)
    .map((item) => item.net > 0 ? settlement(item.a, item.b, item.net) : settlement(item.b, item.a, Math.abs(item.net)))
    .sort((a, b) => b.amount - a.amount);
}

function summarizePeople(rows) {
  const totals = new Map();
  const labels = new Map();
  rows.forEach((row) => {
    if (!row.from || !row.to) return;
    const from = cleanPersonName(row.from);
    const to = cleanPersonName(row.to);
    const fromKey = personKey(from);
    const toKey = personKey(to);
    labels.set(fromKey, from);
    labels.set(toKey, to);
    totals.set(fromKey, (totals.get(fromKey) || 0) - Number(row.amount || 0));
    totals.set(toKey, (totals.get(toKey) || 0) + Number(row.amount || 0));
  });
  return [...totals.entries()]
    .filter(([, total]) => Math.abs(total) >= 1)
    .map(([key, total]) => ({ person: labels.get(key) || key, total }))
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
}

function renderPersonTotal(row) {
  return `<div class="split-result"><span>${row.person}</span><strong>${row.total >= 0 ? "+" : "-"}${rupee(Math.abs(row.total))}</strong></div>`;
}

function currentUserName() {
  return cleanPersonName(state.settings.userName || "You");
}

function cleanPersonName(name) {
  const value = String(name || "").trim();
  if (!value) return "Unknown";
  if (value.toLowerCase() === "me" || value.toLowerCase() === "myself") return currentUserName();
  if (value.toLowerCase() === "you") return state.settings.userName?.trim() || "You";
  return titleCase(value);
}

function personKey(name) {
  return cleanPersonName(name).toLowerCase();
}

function isCurrentUser(name) {
  const key = personKey(name);
  return key === "you" || key === personKey(state.settings.userName || "You");
}

function addSubscription() {
  openSubscriptionModal(null);
}

function openSubscriptionModal(sub) {
  const isEdit = !!sub;
  const catOptions = getAllCategories().map((c) =>
    `<option value="${c}" ${sub && c === sub.category ? "selected" : (!sub && c === "Bills" ? "selected" : "")}>${c}</option>`).join("");

  const body = `
    ${modalField("Subscription name", `<input id="mSubName" placeholder="e.g. Netflix" value="${sub ? escapeAttr(sub.name) : ""}" required />`)}
    <div class="modal-field-row">
      ${modalField("Monthly amount", `<input id="mSubAmount" type="number" min="0" value="${sub?.amount || "499"}" required />`)}
      ${modalField("Renews on (day)", `<input id="mSubDay" type="number" min="1" max="31" value="${sub?.day || new Date().getDate()}" />`)}
    </div>
    ${modalField("Category", `<select id="mSubCategory">${catOptions}</select>`)}
  `;

  openModal({
    title: isEdit ? `Edit ${sub.name}` : "New Subscription",
    bodyHtml: body,
    saveLabel: isEdit ? "Save Changes" : "Add Subscription",
    danger: isEdit ? { label: "Delete subscription", onClick: () => {
      state.subscriptions = state.subscriptions.filter((s) => (s.id || s.name) !== (sub.id || sub.name));
      persist(); renderSubscriptions(); toast("Subscription deleted.");
    } } : null,
    onSave: (panel) => {
      const name = panel.querySelector("#mSubName").value.trim();
      const amount = Number(panel.querySelector("#mSubAmount").value);
      if (!name || !amount) { toast("Enter a name and amount."); return false; }
      const day = Number(panel.querySelector("#mSubDay").value) || new Date().getDate();
      const category = panel.querySelector("#mSubCategory").value;
      if (isEdit) {
        Object.assign(sub, { id: sub.id || crypto.randomUUID(), name, amount, day, category });
        toast("Subscription updated.");
      } else {
        state.subscriptions.push({ id: crypto.randomUUID(), name, amount, day, category });
        toast(`${name} added.`);
      }
      persist();
      renderSubscriptions();
    },
  });
}

function addTrip() {
  openTripModal(null);
}

function openTripModal(trip) {
  const isEdit = !!trip;
  const body = `
    ${modalField("Trip name", `<input id="mTripName" placeholder="e.g. Goa 2026" value="${trip?.name ? escapeAttr(trip.name) : ""}" required />`)}
    ${modalField("Trip budget (optional)", `<input id="mTripBudget" type="number" min="0" placeholder="0" value="${trip?.budget || ""}" />`)}
    ${modalField("People involved", `<input id="mTripPeople" placeholder="e.g. Rahul, Arjun" value="${trip ? escapeAttr(trip.people.join(", ")) : ""}" />`, "Comma-separated. You\u2019re always included automatically.")}
    ${modalField("Notes (optional)", `<textarea id="mTripDetails" rows="2" placeholder="Dates, itinerary, anything worth remembering">${trip?.details ? escapeAttr(trip.details) : ""}</textarea>`)}
  `;

  openModal({
    title: isEdit ? `Edit ${trip.name}` : "New Trip",
    bodyHtml: body,
    saveLabel: isEdit ? "Save Changes" : "Create Trip",
    danger: isEdit ? { label: "Delete trip", onClick: () => deleteTripConfirmed(trip.id) } : null,
    onSave: (panel) => {
      const name = panel.querySelector("#mTripName").value.trim();
      if (!name) { toast("Give the trip a name."); return false; }
      const budget = Number(panel.querySelector("#mTripBudget").value) || 0;
      const peopleText = panel.querySelector("#mTripPeople").value.trim();
      const people = peopleText.split(",").map((p) => p.trim()).filter(Boolean);
      const details = panel.querySelector("#mTripDetails").value.trim();

      if (isEdit) {
        const oldName = trip.name;
        Object.assign(trip, { name, budget, people, details });
        state.expenses.forEach((e) => { if (e.trip === oldName) e.trip = name; });
        state.splits.forEach((s) => { if (s.trip === oldName) s.trip = name; });
        toast(`${name} updated.`);
      } else {
        state.trips.forEach((t) => t.active = false);
        const newTrip = { id: crypto.randomUUID(), name, active: true, budget, people, details };
        state.trips.push(newTrip);
        state.settings.selectedTripId = newTrip.id;
        toast(`${name} is now the active trip.`);
      }
      syncTripOptions();
      persist();
      render();
    },
  });
}

function deleteTripConfirmed(id) {
  const trip = state.trips.find((t) => t.id === id);
  if (!trip || trip.name === "No trip") return false;
  if (!confirm(`Delete "${trip.name}"? Expenses and splits tagged to it will move to "No trip".`)) return false;
  state.expenses.forEach((e) => { if (e.trip === trip.name) e.trip = "No trip"; });
  state.splits.forEach((s) => { if (s.trip === trip.name) s.trip = "No trip"; });
  state.trips = state.trips.filter((t) => t.id !== id);
  syncTripOptions();
  persist();
  render();
  toast(`"${trip.name}" deleted.`);
}

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function setSplitPeoplePlaceholder(text) {
  if (els.splitPeople) els.splitPeople.placeholder = text;
}

// Builds the "You" + trip-member option list shared by both the payer
// dropdown and the people multi-select, so every name is consistent.
function tripMemberOptions(trip) {
  const others = (trip?.people || []).filter((p) => !isCurrentUser(p));
  return [{ value: currentUserName(), label: "You" }, ...others.map((p) => ({ value: p, label: p }))];
}

function applyTripPeopleToSplit() {
  const tripVal = els.splitTrip.value;
  const trip = state.trips.find((t) => t.name === tripVal || t.id === tripVal);
  const hasPeople = !!(trip && trip.people && trip.people.length > 0 && trip.name !== "No trip");

  const peopleSel  = document.getElementById("splitPeopleSelect");
  const peopleTxt  = els.splitPeople;
  const peopleHint = document.getElementById("splitPeopleHint");
  const paidBySel  = document.getElementById("splitPaidBySelect");
  const paidByTxt  = els.splitPaidBy;

  const options = hasPeople ? tripMemberOptions(trip) : [];

  // ── Multi-select: who is included in the split ──────────────────────────
  if (peopleSel && peopleTxt) {
    if (hasPeople) {
      peopleSel.innerHTML = options
        .map((o) => `<option value="${o.value}" selected>${o.label}</option>`)
        .join("");
      peopleSel.style.display = "block";
      peopleTxt.style.display = "none";
      if (peopleHint) {
        peopleHint.textContent = `${trip.name} · ${options.length} member${options.length !== 1 ? "s" : ""} — hold Ctrl/Cmd to multi-select`;
        peopleHint.style.display = "block";
      }
    } else {
      peopleSel.innerHTML = "";
      peopleSel.style.display = "none";
      peopleTxt.style.display = "block";
      if (peopleHint) peopleHint.style.display = "none";
    }
  }

  // ── Dropdown: who paid ───────────────────────────────────────────────────
  if (paidBySel && paidByTxt) {
    if (hasPeople) {
      paidBySel.innerHTML = options.map((o) => `<option value="${o.value}">${o.label}</option>`).join("");
      paidBySel.style.display = "block";
      paidByTxt.style.display = "none";
    } else {
      paidBySel.innerHTML = "";
      paidBySel.style.display = "none";
      paidByTxt.style.display = "block";
    }
  }

  applySplitModeDefaults();
  renderPercentInputs();
}

// Returns an array of person names from whichever people input is active
function getSplitPeopleList() {
  const sel = document.getElementById("splitPeopleSelect");
  if (sel && sel.style.display !== "none" && sel.options.length > 0) {
    return Array.from(sel.selectedOptions).map((o) => o.value.trim()).filter(Boolean);
  }
  const raw = els.splitPeople ? els.splitPeople.value : "";
  return raw.split(",").map((x) => x.trim()).filter(Boolean);
}

// Returns the single "who paid" name from whichever payer input is active
function getSplitPaidBy() {
  const sel = document.getElementById("splitPaidBySelect");
  if (sel && sel.style.display !== "none" && sel.value) return sel.value.trim();
  return els.splitPaidBy ? els.splitPaidBy.value.trim() : "";
}

function setSplitPaidBy(name, { lock } = {}) {
  const sel = document.getElementById("splitPaidBySelect");
  const txt = els.splitPaidBy;
  if (sel && sel.style.display !== "none" && [...sel.options].some((o) => o.value === name)) {
    sel.value = name;
    sel.disabled = !!lock;
  } else if (txt) {
    txt.value = name;
    txt.disabled = !!lock;
  }
}

function applySplitModeDefaults() {
  const mode = els.splitMode.value;
  const paidBySel = document.getElementById("splitPaidBySelect");
  const paidByTxt = els.splitPaidBy;
  const paidByLabel = document.getElementById("splitPaidByLabel");
  const paidByField = document.getElementById("splitPaidByField");
  const peopleField = document.getElementById("splitPeopleField");
  const peopleLabel = document.getElementById("splitPeopleLabel");

  // Keep the visual mode-card grid in sync, in case the mode changed via
  // something other than a direct card click (e.g. programmatic reset).
  document.querySelectorAll(".split-mode-card").forEach((c) => c.classList.toggle("active", c.dataset.mode === mode));

  if (paidBySel) paidBySel.disabled = false;
  if (paidByTxt) paidByTxt.disabled = false;
  if (paidByField) paidByField.style.display = "";
  if (paidByLabel) paidByLabel.textContent = "Paid by";
  if (peopleField) peopleField.style.display = "";
  if (peopleLabel) peopleLabel.firstChild.textContent = "Who's included ";

  if (mode === "youPaidGroup" || mode === "youPaidOne") {
    setSplitPaidBy(currentUserName(), { lock: true });
    if (paidByField) paidByField.style.display = "none"; // it's always "You" \u2014 no need to show the field
  } else if (mode === "selfExpenseTrip") {
    setSplitPaidBy(currentUserName(), { lock: true });
    if (paidByField) paidByField.style.display = "none";
    if (peopleField) peopleField.style.display = "none"; // no one else involved
  } else if (mode === "iSettled") {
    setSplitPaidBy(currentUserName(), { lock: true });
    if (paidByField) paidByField.style.display = "none";
    setSplitPeoplePlaceholder("Who you paid back");
  } else if (mode === "settlement") {
    if (paidByTxt) paidByTxt.placeholder = "Person who paid you back";
    setSplitPeoplePlaceholder("Same person (auto-used)");
  } else if (mode === "friendPaidYou") {
    if (paidByTxt) paidByTxt.placeholder = "Who paid for you";
  } else if (mode === "thirdPartySettlement") {
    if (paidByLabel) paidByLabel.textContent = "Who paid back";
    if (paidByTxt) paidByTxt.placeholder = "e.g. Rahul";
    if (peopleLabel) peopleLabel.firstChild.textContent = "Who they paid back ";
    setSplitPeoplePlaceholder("e.g. Arjun \u2014 pick one person");
  } else if (mode === "otherPaidSelf") {
    if (paidByLabel) paidByLabel.textContent = "Whose expense is this?";
    if (paidByTxt) paidByTxt.placeholder = "e.g. Rahul";
    if (peopleField) peopleField.style.display = "none"; // auto = the same person, no one owes anything
  } else if (mode === "friendPaidOne") {
    if (paidByLabel) paidByLabel.textContent = "Who paid";
    if (paidByTxt) paidByTxt.placeholder = "e.g. Rahul";
    if (peopleLabel) peopleLabel.firstChild.textContent = "Who they paid for ";
    setSplitPeoplePlaceholder("e.g. Priya, Sarah \u2014 each owes the full amount");
  } else {
    if (paidByTxt) paidByTxt.placeholder = "Paid by";
    setSplitPeoplePlaceholder("People, comma separated");
  }
  renderPercentInputs();
}

function syncTripOptions() {
  els.tripInput.innerHTML = state.trips.map((trip) => `<option>${trip.name}</option>`).join("");
  els.splitTrip.innerHTML = state.trips.map((trip) => `<option>${trip.name}</option>`).join("");
}

function exportData() {
  const filename = `naya-backup-${iso(new Date())}.json`;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast(`Exported to ${filename}`);
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.expenses && !data.splits && !data.trips) {
          toast("Invalid backup file — no recognisable data found."); return;
        }
        const mode = confirm("Replace ALL existing data with this backup?\nPress Cancel to merge instead.");
        if (mode) {
          Object.assign(state, migrateState(data));
        } else {
          // Merge: add unique items by id
          const merge = (arr, src) => {
            const ids = new Set(arr.map((x) => x.id));
            return [...arr, ...(src || []).filter((x) => !ids.has(x.id))];
          };
          state.expenses = merge(state.expenses, data.expenses);
          state.splits   = merge(state.splits, data.splits);
          state.trips    = merge(state.trips.filter(t=>t.id!=="no-trip"), (data.trips||[]).filter(t=>t.id!=="no-trip"));
          if (!state.trips.find(t=>t.id==="no-trip")) state.trips.unshift({ id:"no-trip", name:"No trip", active:true, budget:0, people:[], details:"" });
          state.goals   = merge(state.goals, data.goals);
          if (data.settings) state.settings = { ...state.settings, ...data.settings };
        }
        persist();
        render();
        toast(`Import complete — ${state.expenses.length} expenses loaded.`);
      } catch (err) {
        toast("Could not parse file. Make sure it is a Naya JSON backup.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

let pendingReceiptBase64 = null;

function handleReceipt(event) {
  const file = event.target.files[0];
  if (!file) return;
  // Try to parse expense from filename
  const parsed = parseEntry(file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
  if (parsed.amount) {
    fillDraft(parsed);
    els.smartInput.value = `${els.amountInput.value} ${els.merchantInput.value}`;
    renderSuggestion(parseEntry(els.smartInput.value));
  }
  // Downscale + recompress before storing — raw phone camera photos (often
  // 3\u20138MB each) would otherwise blow through localStorage's ~5\u201310MB
  // quota after just a handful of receipts, silently breaking future saves.
  compressImageFile(file, 900, 0.72).then((dataUrl) => {
    pendingReceiptBase64 = dataUrl;
    const thumb = document.getElementById("receiptThumb");
    const removeBtn = document.getElementById("removeReceiptBtn");
    if (thumb) { thumb.src = pendingReceiptBase64; thumb.style.display = "inline-block"; }
    if (removeBtn) removeBtn.style.display = "inline-block";
    toast("Receipt photo attached.");
  }).catch(() => toast("Couldn't read that image — try a different file."));
}

// Resizes an image file to at most `maxWidth` px wide and re-encodes it as a
// JPEG at the given quality, returning a data: URL. Keeps receipt photos
// small enough that dozens of them won't exhaust localStorage.
function compressImageFile(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function handleReceiptPhoto(event) {
  handleReceipt(event);
}

function removeReceipt() {
  pendingReceiptBase64 = null;
  const thumb = document.getElementById("receiptThumb");
  const removeBtn = document.getElementById("removeReceiptBtn");
  const photoInput = document.getElementById("receiptPhotoInput");
  if (thumb) { thumb.src = ""; thumb.style.display = "none"; }
  if (removeBtn) removeBtn.style.display = "none";
  if (photoInput) photoInput.value = "";
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    toast("Voice entry is not supported in this browser yet.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.onresult = (event) => {
    els.smartInput.value = event.results[0][0].transcript;
    els.smartInput.dispatchEvent(new Event("input"));
    toast("Voice captured. Check the draft and save.");
  };
  recognition.start();
}

function saveSettings(event) {
  event.preventDefault();
  state.settings.userName = els.userNameInput.value.trim();
  state.settings.monthlyBudget = Number(els.monthlyBudgetInput.value || 0);
  persist();
  render();
  toast("User settings saved.");
}

function resetAllData() {
  if (!confirm("Clear all local data for this app?")) return;
  localStorage.removeItem(storageKey);
  Object.assign(state, structuredClone(initialState));
  hydrateControls();
  render();
  toast("All local data cleared.");
}

function handleRecordActions(event) {
  const button = event.target.closest("button[data-action],button[data-id]");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;

  // Goals
  if (action === "edit-goal") { showGoalForm(state.goals.find(g => g.id === id)); return; }
  if (action === "delete-goal") {
    if (!confirm("Delete this goal?")) return;
    state.goals = state.goals.filter(g => g.id !== id);
    persist(); renderGoals(); return;
  }
  if (action === "add-to-goal") {
    const goal = state.goals.find(g => g.id === id);
    if (!goal) return;
    openModal({
      title: `Add savings to "${goal.name}"`,
      bodyHtml: modalField("Amount to add", `<input id="mGoalAdd" type="number" min="1" placeholder="0" autofocus />`, `Currently ${rupee(goal.saved)} of ${rupee(goal.target)} saved.`),
      saveLabel: "Add",
      onSave: (panel) => {
        const amt = Number(panel.querySelector("#mGoalAdd").value);
        if (!(amt > 0)) { toast("Enter an amount greater than 0."); return false; }
        goal.saved = Math.min(goal.target, goal.saved + amt);
        persist();
        renderGoals();
        toast(`${rupee(amt)} added to "${goal.name}".`);
      },
    });
    return;
  }

  // Wallets
  if (action === "delete-wallet") {
    if (!confirm("Delete this wallet? Existing expenses keep their wallet tag.")) return;
    state.wallets = state.wallets.filter(w => w.id !== id);
    persist(); renderWallets(); return;
  }

  // Custom categories
  if (action === "delete-category") {
    deleteCustomCategory(button.dataset.cat);
    return;
  }

  if (button.classList.contains("edit-expense")) editExpense(id);
  if (button.classList.contains("delete-expense")) deleteExpense(id);
  if (button.classList.contains("edit-split")) editSplit(id);
  if (button.classList.contains("delete-split")) deleteSplit(id);
  if (button.classList.contains("edit-subscription")) editSubscription(id);
  if (button.classList.contains("delete-subscription")) deleteSubscription(id);
  if (button.classList.contains("open-trip")) openTrip(id);
  if (button.classList.contains("edit-trip")) editTrip(id);
  if (button.classList.contains("delete-trip")) deleteTrip(id);
}

function editExpense(id) {
  const item = state.expenses.find((expenseItem) => expenseItem.id === id);
  if (!item) return;

  const catOptions = getAllCategories().map((c) =>
    `<option value="${c}" ${c === item.category ? "selected" : ""}>${c}</option>`).join("");
  const tripOptions = state.trips.map((t) =>
    `<option value="${t.name}" ${t.name === item.trip ? "selected" : ""}>${t.name}</option>`).join("");
  const walletOptions = `<option value="">\u2014 None \u2014</option>` + state.wallets.map((w) =>
    `<option value="${w.id}" ${w.id === item.wallet ? "selected" : ""}>${w.icon} ${w.name}</option>`).join("");

  const body = `
    ${modalField("Amount", `<input id="mExpAmount" type="number" min="0" step="1" value="${item.amount}" required />`)}
    <div class="modal-field-row">
      ${modalField("Category", `<select id="mExpCategory">${catOptions}</select>`)}
      ${modalField("Trip", `<select id="mExpTrip">${tripOptions}</select>`)}
    </div>
    ${modalField("Merchant", `<input id="mExpMerchant" value="${escapeAttr(item.merchant)}" />`)}
    <div class="modal-field-row">
      ${modalField("Wallet", `<select id="mExpWallet">${walletOptions}</select>`)}
      ${modalField("Date", `<input id="mExpDate" type="date" value="${item.date}" />`)}
    </div>
    ${modalField("Note", `<input id="mExpNote" value="${escapeAttr(item.note || "")}" />`)}
  `;

  openModal({
    title: "Edit Expense",
    bodyHtml: body,
    saveLabel: "Save Changes",
    danger: { label: "Delete this expense", onClick: () => { state.expenses = state.expenses.filter((e) => e.id !== id); persist(); render(); toast("Expense deleted."); } },
    onSave: (panel) => {
      const amount = Number(panel.querySelector("#mExpAmount").value);
      if (!amount) { toast("Enter an amount."); return false; }
      Object.assign(item, {
        amount,
        category: panel.querySelector("#mExpCategory").value,
        trip: panel.querySelector("#mExpTrip").value,
        merchant: panel.querySelector("#mExpMerchant").value.trim() || item.merchant,
        wallet: panel.querySelector("#mExpWallet").value,
        date: panel.querySelector("#mExpDate").value || item.date,
        note: panel.querySelector("#mExpNote").value.trim(),
      });
      persist();
      render();
      toast("Expense updated.");
    },
  });
}

function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;
  state.expenses = state.expenses.filter((expenseItem) => expenseItem.id !== id);
  persist();
  render();
  toast("Expense deleted.");
}

const SPLIT_MODE_LABELS = {
  youPaidGroup: "I paid for a group",
  friendPaidYou: "Someone paid for me",
  friendPaidGroup: "Someone paid for a group",
  youPaidOne: "I paid for someone",
  friendPaidOne: "Someone paid for one or more people",
  settlement: "They paid me back (settle)",
  iSettled: "I paid them back (settle)",
  thirdPartySettlement: "Someone else paid someone else back",
  selfExpenseTrip: "My own expense",
  otherPaidSelf: "Someone's own expense (no split)",
};

function editSplit(id) {
  const split = state.splits.find((splitItem) => splitItem.id === id);
  if (!split) return;

  const modeOptions = Object.entries(SPLIT_MODE_LABELS).map(([val, label]) =>
    `<option value="${val}" ${val === split.mode ? "selected" : ""}>${label}</option>`).join("");
  const tripOptions = state.trips.map((t) =>
    `<option value="${t.name}" ${t.name === split.trip ? "selected" : ""}>${t.name}</option>`).join("");
  const catOptions = getAllCategories().filter((c) => c !== "Income").map((c) =>
    `<option value="${c}" ${c === split.category ? "selected" : ""}>${c}</option>`).join("");

  const body = `
    ${modalField("Split type", `<select id="mSplitMode">${modeOptions}</select>`)}
    <div class="modal-field-row">
      ${modalField("Amount", `<input id="mSplitAmount" type="number" min="0" value="${split.amount}" required />`)}
      ${modalField("Trip", `<select id="mSplitTrip">${tripOptions}</select>`)}
    </div>
    ${modalField("Paid by", `<input id="mSplitPaidBy" value="${escapeAttr(split.payer)}" />`)}
    ${modalField("People involved", `<input id="mSplitPeople" value="${escapeAttr(split.people.join(", "))}" />`, "Comma-separated. Not used for self-expense modes.")}
    ${modalField("Category", `<select id="mSplitCategory">${catOptions}</select>`)}
    ${modalField("What was it for?", `<input id="mSplitNote" value="${escapeAttr(split.note || "")}" />`)}
  `;

  openModal({
    title: "Edit Split",
    bodyHtml: body,
    saveLabel: "Save Changes",
    danger: { label: "Delete this split", onClick: () => { state.splits = state.splits.filter((s) => s.id !== id); persist(); render(); toast("Split deleted."); } },
    onSave: (panel) => {
      const mode = panel.querySelector("#mSplitMode").value;
      const amount = Number(panel.querySelector("#mSplitAmount").value);
      if (!amount) { toast("Enter an amount."); return false; }
      const payer = panel.querySelector("#mSplitPaidBy").value.trim() || split.payer;
      const peopleText = panel.querySelector("#mSplitPeople").value.trim();
      const people = peopleText.split(",").map((p) => p.trim()).filter(Boolean);
      const trip = panel.querySelector("#mSplitTrip").value;
      const category = panel.querySelector("#mSplitCategory").value;
      const note = panel.querySelector("#mSplitNote").value.trim();
      const rows = (mode === "selfExpenseTrip" || mode === "otherPaidSelf") ? [] : buildSplitRows(mode, amount, payer, people.length ? people : [payer]);
      Object.assign(split, { mode, amount, payer, people, trip, category, note, rows });
      persist();
      render();
      toast("Split updated.");
    },
  });
}

function deleteSplit(id) {
  if (!confirm("Delete this split?")) return;
  state.splits = state.splits.filter((splitItem) => splitItem.id !== id);
  persist();
  render();
  toast("Split deleted.");
}

function editSubscription(id) {
  const sub = state.subscriptions.find((item) => (item.id || item.name) === id);
  if (!sub) return;
  openSubscriptionModal(sub);
}

function deleteSubscription(id) {
  if (!confirm("Delete this subscription?")) return;
  state.subscriptions = state.subscriptions.filter((item) => (item.id || item.name) !== id);
  persist();
  render();
  toast("Subscription deleted.");
}

function openTrip(id) {
  state.settings.selectedTripId = id;
  persist();
  renderTrips();
}

function editTrip(id) {
  const trip = state.trips.find((item) => item.id === id);
  if (!trip || trip.name === "No trip") return;
  openTripModal(trip);
}

function deleteTrip(id) {
  state.settings.selectedTripId = "";
  deleteTripConfirmed(id);
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

function filterByRange(items, range) {
  if (range === "daily") return items.filter((x) => x.date === iso(new Date()));
  if (range === "weekly") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return items.filter((x) => new Date(x.date) >= cutoff);
  }
  return items.filter(isThisMonth);
}

function groupSum(items, key) {
  const map = new Map();
  items.forEach((item) => map.set(item[key], (map.get(item[key]) || 0) + item.amount));
  return [...map.entries()].map(([k, total]) => ({ key: k, total })).sort((a, b) => b.total - a.total);
}

function groupByPeriod(items, mode) {
  const map = new Map();
  items.forEach((item) => {
    const d = new Date(item.date);
    let label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (mode === "weekly") label = `Week of ${startOfWeek(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
    if (mode === "monthly") label = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(item);
  });
  return [...map.entries()].map(([label, groupItems]) => ({ label, items: groupItems }));
}

function isThisMonth(item) {
  const d = new Date(item.date);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function isPreviousMonth(item) {
  const d = new Date(item.date);
  const prev = new Date();
  prev.setMonth(prev.getMonth() - 1);
  return d.getMonth() === prev.getMonth() && d.getFullYear() === prev.getFullYear();
}

function sum(items) {
  return items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
}

function rupee(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

function iso(date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function titleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function dayOfMonth(date) {
  return new Date(date).getDate();
}

function daysLeftInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
}

function daysUntilDay(day) {
  const now = new Date();
  let target = new Date(now.getFullYear(), now.getMonth(), day);
  if (target < now) target = new Date(now.getFullYear(), now.getMonth() + 1, day);
  return Math.ceil((target - now) / 86400000);
}

function noSpendStreak() {
  let streak = 0;
  const dates = new Set(state.expenses.map((x) => x.date));
  const cursor = new Date();
  while (!dates.has(iso(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    if (streak > 60) break;
  }
  return streak;
}

function startOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  return copy;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 2600);
}

// ══════════════════════════════════════════════════════════════════════════════
// DARK MODE
// ══════════════════════════════════════════════════════════════════════════════

function applyDarkMode(on) {
  document.documentElement.setAttribute("data-theme", on ? "dark" : "light");
  const btn = document.getElementById("darkModeBtn");
  if (btn) btn.textContent = on ? "☀" : "☽";
}

function toggleDarkMode() {
  state.settings.darkMode = !state.settings.darkMode;
  applyDarkMode(state.settings.darkMode);
  persist();
}

// ══════════════════════════════════════════════════════════════════════════════
// BUDGET ALERTS
// ══════════════════════════════════════════════════════════════════════════════

function renderBudgetAlerts() {
  const container = document.getElementById("budgetAlerts");
  if (!container) return;
  const alerts = [];
  const budget = state.settings.monthlyBudget;
  const monthExp = state.expenses.filter(isThisMonth);
  const spent = sum(monthExp);

  if (budget > 0) {
    const pct = spent / budget;
    if (pct >= 1)
      alerts.push({ level: "danger", msg: `⛔ Monthly budget exceeded! You've spent ${rupee(spent)} of ${rupee(budget)}.` });
    else if (pct >= 0.9)
      alerts.push({ level: "warn", msg: `⚠ 90% of monthly budget used — only ${rupee(budget - spent)} left.` });
    else if (pct >= 0.75)
      alerts.push({ level: "info", msg: `💡 75% of monthly budget used. ${rupee(budget - spent)} remaining.` });
  }

  const catBudgets = state.settings.categoryBudgets || {};
  const catGroups = groupSum(monthExp, "category");
  catGroups.forEach(({ key, total }) => {
    const cb = catBudgets[key];
    if (!cb) return;
    const p = total / cb;
    if (p >= 1)
      alerts.push({ level: "danger", msg: `⛔ ${key} budget exceeded (${rupee(total)} of ${rupee(cb)}).` });
    else if (p >= 0.8)
      alerts.push({ level: "warn", msg: `⚠ ${key}: ${Math.round(p * 100)}% of ${rupee(cb)} budget used.` });
  });

  container.innerHTML = alerts.map(a =>
    `<div class="budget-alert alert-${a.level}">${a.msg}</div>`
  ).join("");
}

// ══════════════════════════════════════════════════════════════════════════════
// PIE CHART
// ══════════════════════════════════════════════════════════════════════════════

const PIE_COLORS = ["#107c5c","#2662d9","#8b5cf6","#bb7a0b","#e11d48","#d946ef","#0891b2","#059669","#f59e0b","#64748b"];

function buildPieChartSVG(slices, size = 180) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (!total) return '<p class="empty">No spending data.</p>';
  const cx = size / 2, cy = size / 2, r = size * 0.44, ir = size * 0.24;
  let angle = -Math.PI / 2;
  const paths = slices.filter(d => d.value > 0).map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const ea = angle + sweep;
    const cos0 = Math.cos(angle), sin0 = Math.sin(angle);
    const cos1 = Math.cos(ea),   sin1 = Math.sin(ea);
    const large = sweep > Math.PI ? 1 : 0;
    const path = [
      `M ${(cx+r*cos0).toFixed(1)} ${(cy+r*sin0).toFixed(1)}`,
      `A ${r} ${r} 0 ${large} 1 ${(cx+r*cos1).toFixed(1)} ${(cy+r*sin1).toFixed(1)}`,
      `L ${(cx+ir*cos1).toFixed(1)} ${(cy+ir*sin1).toFixed(1)}`,
      `A ${ir} ${ir} 0 ${large} 0 ${(cx+ir*cos0).toFixed(1)} ${(cy+ir*sin0).toFixed(1)}`,
      `Z`
    ].join(" ");
    const color = d.color || PIE_COLORS[i % PIE_COLORS.length];
    const pct = Math.round((d.value / total) * 100);
    angle = ea;
    return `<path d="${path}" fill="${color}" stroke="var(--bg,#f7f4ee)" stroke-width="1.5"><title>${d.label}: ₹${d.value} (${pct}%)</title></path>`;
  });
  const top = slices[0];
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-label="Category pie chart">
    ${paths.join("")}
    <text x="${cx}" y="${cy-7}" text-anchor="middle" font-size="10" font-weight="800" font-family="Inter,system-ui,sans-serif" fill="var(--ink,#1f2328)">${(top?.label||"").slice(0,9)}</text>
    <text x="${cx}" y="${cy+9}" text-anchor="middle" font-size="11" font-weight="900" font-family="Inter,system-ui,sans-serif" fill="var(--ink,#1f2328)">${top ? rupee(top.value) : ""}</text>
  </svg>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════════════════════════════════════════

let reportYear  = new Date().getFullYear();
let reportMonth = new Date().getMonth();

function renderReports() {
  const sect = document.getElementById("reports");
  if (!sect || !sect.classList.contains("active-view")) return;

  const label = document.getElementById("reportMonthLabel");
  const d = new Date(reportYear, reportMonth, 1);
  if (label) label.textContent = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const monthExp = state.expenses.filter((e) => {
    const ed = new Date(e.date);
    return ed.getFullYear() === reportYear && ed.getMonth() === reportMonth;
  });
  const total = sum(monthExp);
  const catGroups = groupSum(monthExp, "category");

  // Pie chart
  const pieEl = document.getElementById("reportPieChart");
  if (pieEl) {
    const slices = catGroups.map((g, i) => ({ label: g.key, value: g.total, color: PIE_COLORS[i % PIE_COLORS.length] }));
    pieEl.innerHTML = slices.length ? buildPieChartSVG(slices, 200) : '<p class="empty">No data.</p>';
  }

  // Category table with bars
  const tableEl = document.getElementById("reportCategoryBreakdown");
  if (tableEl) {
    if (!catGroups.length) {
      tableEl.innerHTML = '<p class="empty">No expenses this month.</p>';
    } else {
      const catBudgets = state.settings.categoryBudgets || {};
      tableEl.innerHTML = catGroups.map((g, i) => {
        const pct = total ? Math.round((g.total / total) * 100) : 0;
        const cb = catBudgets[g.key];
        const budgetNote = cb ? ` <span class="report-budget-note">${Math.round(g.total/cb*100)}% of budget</span>` : "";
        const color = PIE_COLORS[i % PIE_COLORS.length];
        return `<div class="report-cat-row">
          <div class="report-cat-meta">
            <span class="report-cat-name">${g.key}</span>
            <span class="report-cat-amt">${rupee(g.total)}${budgetNote}</span>
          </div>
          <div class="report-bar-track">
            <div class="report-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <span class="report-cat-pct">${pct}%</span>
        </div>`;
      }).join("");
    }
  }

  // Summary row
  const sumEl = document.getElementById("reportSummary");
  if (sumEl) {
    const prevDate = new Date(reportYear, reportMonth - 1, 1);
    const prevExp = state.expenses.filter((e) => {
      const ed = new Date(e.date);
      return ed.getFullYear() === prevDate.getFullYear() && ed.getMonth() === prevDate.getMonth();
    });
    const prevTotal = sum(prevExp);
    const diff = total - prevTotal;
    const diffStr = prevTotal
      ? `${diff >= 0 ? "+" : ""}${rupee(Math.abs(diff))} vs last month`
      : "No previous month data";
    const budget = state.settings.monthlyBudget;
    sumEl.innerHTML = `
      <div class="report-summary-card"><span>Total spent</span><strong>${rupee(total)}</strong></div>
      ${budget ? `<div class="report-summary-card"><span>Budget</span><strong>${rupee(budget)}</strong></div>
      <div class="report-summary-card ${total > budget ? "over" : "under"}"><span>Remaining</span><strong>${rupee(Math.abs(budget - total))} ${total > budget ? "over" : "left"}</strong></div>` : ""}
      <div class="report-summary-card"><span>vs Last Month</span><strong>${diffStr}</strong></div>
    `;
  }

  // 6-month trend chart
  const trendEl = document.getElementById("reportTrendChart");
  if (trendEl) {
    const data = Array.from({ length: 6 }, (_, i) => {
      const td = new Date(reportYear, reportMonth - 5 + i, 1);
      const total = sum(state.expenses.filter((e) => {
        const ed = new Date(e.date);
        return ed.getFullYear() === td.getFullYear() && ed.getMonth() === td.getMonth();
      }));
      return { label: td.toLocaleDateString("en-IN", { month: "short" }), total, isToday: i === 5 };
    });
    trendEl.innerHTML = buildBarChartSVG(data);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// GOALS
// ══════════════════════════════════════════════════════════════════════════════

function renderGoals() {
  const container = document.getElementById("goalList");
  if (!container) return;
  if (!state.goals.length) {
    container.innerHTML = '<p class="empty">No savings goals yet. Tap + to add one.</p>';
    return;
  }
  container.innerHTML = state.goals.map((g) => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    const left = Math.max(0, g.target - g.saved);
    const deadline = g.deadline ? `<span class="goal-deadline">🗓 ${new Date(g.deadline + "-01").toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span>` : "";
    return `<div class="goal-card">
      <div class="goal-card-head">
        <span class="goal-icon">${g.icon || "🎯"}</span>
        <div class="goal-card-meta">
          <strong>${g.name}</strong>
          ${deadline}
        </div>
        <div class="goal-card-actions">
          <button class="mini-text" data-action="add-to-goal" data-id="${g.id}" title="Add savings">+₹</button>
          <button class="mini-text" data-action="edit-goal" data-id="${g.id}" title="Edit">✎</button>
          <button class="mini-text" data-action="delete-goal" data-id="${g.id}" title="Delete">✕</button>
        </div>
      </div>
      <div class="goal-amounts">
        <span>${rupee(g.saved)} saved</span>
        <span>${rupee(left)} to go</span>
      </div>
      <div class="goal-bar-track">
        <div class="goal-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="goal-pct">${pct}% of ${rupee(g.target)}</div>
    </div>`;
  }).join("");
}

function handleGoalForm(e) {
  e.preventDefault();
  const id    = document.getElementById("goalId").value;
  const name  = document.getElementById("goalName").value.trim();
  const target = Number(document.getElementById("goalTarget").value);
  const saved  = Number(document.getElementById("goalSaved").value) || 0;
  const icon   = document.getElementById("goalIcon").value.trim() || "🎯";
  const deadline = document.getElementById("goalDeadline").value;
  if (!name || !target) { toast("Enter a name and target amount."); return; }
  if (id) {
    const g = state.goals.find((g) => g.id === id);
    if (g) Object.assign(g, { name, target, saved, icon, deadline });
  } else {
    state.goals.push({ id: crypto.randomUUID(), name, target, saved, icon, deadline });
  }
  persist();
  hideGoalForm();
  renderGoals();
  toast(`Goal "${name}" saved.`);
}

function showGoalForm(goal = null) {
  const form = document.getElementById("goalForm");
  if (!form) return;
  form.style.display = "grid";
  document.getElementById("goalId").value      = goal ? goal.id : "";
  document.getElementById("goalName").value    = goal ? goal.name : "";
  document.getElementById("goalTarget").value  = goal ? goal.target : "";
  document.getElementById("goalSaved").value   = goal ? goal.saved : "0";
  document.getElementById("goalIcon").value    = goal ? goal.icon : "🎯";
  document.getElementById("goalDeadline").value= goal ? (goal.deadline||"") : "";
  document.getElementById("goalName").focus();
}

function hideGoalForm() {
  const form = document.getElementById("goalForm");
  if (form) form.style.display = "none";
}

// ══════════════════════════════════════════════════════════════════════════════
// WALLETS
// ══════════════════════════════════════════════════════════════════════════════

function renderWallets() {
  const summaryEl = document.getElementById("walletSummary");
  const listEl    = document.getElementById("walletList");
  if (!summaryEl) return;

  const monthExp = state.expenses.filter(isThisMonth);
  const walletTotals = {};
  monthExp.forEach((e) => {
    const wid = e.wallet || "unassigned";
    walletTotals[wid] = (walletTotals[wid] || 0) + e.amount;
  });
  const grandTotal = sum(monthExp);

  summaryEl.innerHTML = state.wallets.map((w) => {
    const total = walletTotals[w.id] || 0;
    const pct = grandTotal ? Math.round((total / grandTotal) * 100) : 0;
    return `<div class="wallet-card">
      <div class="wallet-icon">${w.icon}</div>
      <div class="wallet-info">
        <strong>${w.name}</strong>
        <span>${rupee(total)} this month</span>
      </div>
      <div class="wallet-bar-track"><div class="wallet-bar-fill" style="width:${pct}%"></div></div>
      <span class="wallet-pct">${pct}%</span>
    </div>`;
  }).join("") || '<p class="empty">No wallets configured.</p>';

  if (listEl) {
    listEl.innerHTML = `<div class="panel-head" style="margin-bottom:10px"><h2>Manage Wallets</h2></div>` +
      state.wallets.map((w) => `<div class="wallet-manage-row">
        <span class="wallet-icon-sm">${w.icon}</span>
        <span class="wallet-manage-name">${w.name}</span>
        <button class="mini-text" data-action="delete-wallet" data-id="${w.id}">✕</button>
      </div>`).join("");
  }

  populateWalletSelect();
}

function populateWalletSelect() {
  const sel = document.getElementById("walletInput");
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = '<option value="">— Wallet —</option>' +
    state.wallets.map((w) => `<option value="${w.id}">${w.icon} ${w.name}</option>`).join("");
  if (prev) sel.value = prev;
}

function handleWalletForm(e) {
  e.preventDefault();
  const id   = document.getElementById("walletId").value;
  const name = document.getElementById("walletName").value.trim();
  const icon = document.getElementById("walletIcon").value.trim() || "💳";
  if (!name) { toast("Enter a wallet name."); return; }
  if (id) {
    const w = state.wallets.find((w) => w.id === id);
    if (w) Object.assign(w, { name, icon });
  } else {
    state.wallets.push({ id: crypto.randomUUID(), name, icon });
  }
  persist();
  hideWalletForm();
  renderWallets();
  toast(`Wallet "${name}" saved.`);
}

function showWalletForm(wallet = null) {
  const form = document.getElementById("walletForm");
  if (!form) return;
  form.style.display = "grid";
  document.getElementById("walletId").value   = wallet ? wallet.id : "";
  document.getElementById("walletName").value = wallet ? wallet.name : "";
  document.getElementById("walletIcon").value = wallet ? wallet.icon : "💳";
  document.getElementById("walletName").focus();
}

function hideWalletForm() {
  const form = document.getElementById("walletForm");
  if (form) form.style.display = "none";
}

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORY BUDGETS (settings section render)
// ══════════════════════════════════════════════════════════════════════════════

function renderCategoryBudgetInputs() {
  const el = document.getElementById("catBudgetGrid");
  if (!el) return;
  const cats = [...new Set(state.expenses.map((e) => e.category).filter(Boolean))].sort();
  if (!cats.length) { el.innerHTML = '<p class="empty">Add some expenses first to set per-category budgets.</p>'; return; }
  const cb = state.settings.categoryBudgets || {};
  el.innerHTML = cats.map((cat) =>
    `<label class="cat-budget-label">
      <span>${cat}</span>
      <input class="cat-budget-input" data-cat="${cat}" type="number" min="0" placeholder="₹ limit" value="${cb[cat] || ""}" />
    </label>`
  ).join("");
  el.querySelectorAll(".cat-budget-input").forEach((inp) => {
    inp.addEventListener("change", () => {
      if (!state.settings.categoryBudgets) state.settings.categoryBudgets = {};
      const val = Number(inp.value);
      if (val > 0) state.settings.categoryBudgets[inp.dataset.cat] = val;
      else delete state.settings.categoryBudgets[inp.dataset.cat];
      persist();
      renderBudgetAlerts();
    });
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// GENERIC MODAL SYSTEM
// ══════════════════════════════════════════════════════════════════════════════

function openModal({ title, bodyHtml, saveLabel = "Save", onSave, onMount, danger }) {
  const overlay = document.getElementById("modalOverlay");
  const panel = document.getElementById("modalPanel");
  if (!overlay || !panel) return;

  panel.innerHTML = `
    <div class="modal-header">
      <h2>${title}</h2>
      <button type="button" class="modal-close" id="modalCloseBtn" aria-label="Close">\u2715</button>
    </div>
    <form id="modalForm">
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-actions">
        <button type="button" class="modal-cancel" id="modalCancelBtn">Cancel</button>
        <button type="submit" class="save-button">${saveLabel}</button>
      </div>
      ${danger ? `<div class="modal-danger-row"><button type="button" id="modalDangerBtn">${danger.label}</button></div>` : ""}
    </form>
  `;

  overlay.hidden = false;
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
  document.getElementById("modalForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = onSave?.(panel);
    if (ok !== false) closeModal();
  });
  if (danger) {
    document.getElementById("modalDangerBtn").addEventListener("click", () => {
      const ok = danger.onClick?.(panel);
      if (ok !== false) closeModal();
    });
  }
  onMount?.(panel);

  // Focus the first field for fast keyboard entry
  panel.querySelector("input, select, textarea")?.focus();
}

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  const panel = document.getElementById("modalPanel");
  if (overlay) overlay.hidden = true;
  if (panel) panel.innerHTML = "";
}

// Close on backdrop click or Escape
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "modalOverlay") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const overlay = document.getElementById("modalOverlay");
    if (overlay && !overlay.hidden) closeModal();
    const more = document.getElementById("moreOverlay");
    if (more && !more.hidden) closeMoreMenu();
    const tut = document.getElementById("tutorialOverlay");
    if (tut && !tut.hidden) finishTutorial();
  }
});

function modalField(label, inputHtml, hint) {
  return `<label class="modal-field"><span>${label}</span>${inputHtml}${hint ? `<span class="modal-hint">${hint}</span>` : ""}</label>`;
}


// ══════════════════════════════════════════════════════════════════════════════
// SKIPPABLE ONBOARDING TUTORIAL
// ══════════════════════════════════════════════════════════════════════════════

const TUTORIAL_STEPS_QUICK = [
  {
    icon: "\u2302",
    title: "Welcome to Naya",
    body: "A fast, private expense tracker built for how you actually spend. Everything stays on this device \u2014 nothing is ever uploaded. Here's a 1-minute overview.",
  },
  {
    icon: "\u20b9",
    title: "Quick Add Expenses",
    body: "Type something like \u201c120 dosa\u201d in Quick Add on the Home screen. Naya guesses the amount, category and merchant automatically \u2014 just check it and hit Save.",
  },
  {
    icon: "\u2726",
    title: "Trip Mode",
    body: "Create a Trip to group expenses with friends \u2014 set a budget and add who's coming. Every expense and split you tag to that trip rolls up into one running total.",
  },
  {
    icon: "\u00f7",
    title: "Split Expenses",
    body: "In Split, pick what happened, who paid, and who's included \u2014 \u201cYou\u201d is always an option, but it never has to be. Naya works out exactly who owes who.",
  },
  {
    icon: "\u25ce",
    title: "Reports and Insights",
    body: "Monthly reports, a spending heatmap, savings goals, and wallets all live under the More tab. Replay this any time from More \u2192 Tutorial.",
  },
];

const TUTORIAL_STEPS_EXTENDED = [
  {
    icon: "\u2302",
    title: "Welcome to Naya",
    body: "A fast, private expense tracker built for how you actually spend. Everything stays on this device \u2014 nothing is ever uploaded, ever. This walkthrough covers everything, takes about 3 minutes.",
  },
  {
    icon: "\u20b9",
    title: "Quick Add Expenses",
    body: "Type something like \u201c120 dosa\u201d or \u201c350 fuel\u201d in Quick Add. Naya guesses the amount, category and merchant from the text. Correct a category once and it's remembered for next time \u2014 you can also add your own custom categories from the dropdown.",
  },
  {
    icon: "\u2726",
    title: "Trip Mode",
    body: "Create a Trip to group expenses with friends or family \u2014 give it a budget and add who's coming. Every expense and split you tag to that trip rolls up into one running total, separate from your personal budget.",
  },
  {
    icon: "\u00f7",
    title: "Splitting an Expense",
    body: "In Split, start with what happened: you paid for a group, someone paid for you, someone paid for one or more other people, or someone paid for themselves. Pick who paid and who's included \u2014 \u201cYou\u201d is always an option, but it's never assumed.",
  },
  {
    icon: "\u2705",
    title: "Settling Up",
    body: "Naya keeps a running ledger of who owes who across every split. When money actually changes hands, record it as a settlement \u2014 they paid you back, you paid them back, or even two other people settled between themselves \u2014 and the balance updates instantly.",
  },
  {
    icon: "\u25ce",
    title: "Reports and Insights",
    body: "The Reports tab (under More) breaks down any month by category with a pie chart and trend line. The Home screen also shows a spending heatmap and budget alerts as you approach your monthly limit.",
  },
  {
    icon: "\u25c8",
    title: "Goals and Wallets",
    body: "Set a Savings Goal and chip away at it over time. Use Wallets to track Cash, UPI, Card and Bank separately, so you can see not just what you spent but how you paid for it.",
  },
  {
    icon: "\u2699",
    title: "Make it yours",
    body: "Flip on dark mode from the top bar, set per-category budgets, and export a full JSON backup any time from Settings \u2014 especially useful before switching phones. Everything here can be replayed from More \u2192 Tutorial.",
  },
];

let activeTutorialSteps = TUTORIAL_STEPS_QUICK;
let tutorialStep = 0;

function startTutorial() {
  const overlay = document.getElementById("tutorialOverlay");
  if (!overlay) return;
  overlay.hidden = false;
  showTutorialChoice();
}

function showTutorialChoice() {
  document.getElementById("tutorialChoiceView").hidden = false;
  document.getElementById("tutorialStepsView").hidden = true;
}

function selectTutorial(type) {
  activeTutorialSteps = type === "extended" ? TUTORIAL_STEPS_EXTENDED : TUTORIAL_STEPS_QUICK;
  tutorialStep = 0;
  document.getElementById("tutorialChoiceView").hidden = true;
  document.getElementById("tutorialStepsView").hidden = false;
  renderTutorialStep();
}

function renderTutorialStep() {
  const step = activeTutorialSteps[tutorialStep];
  const isLast = tutorialStep === activeTutorialSteps.length - 1;
  const isFirst = tutorialStep === 0;

  document.getElementById("tutorialIcon").textContent = step.icon;
  document.getElementById("tutorialTitle").textContent = step.title;
  document.getElementById("tutorialBody").textContent = step.body;
  document.getElementById("tutorialDots").innerHTML = activeTutorialSteps
    .map((_, i) => `<span class="tutorial-dot ${i === tutorialStep ? "active" : ""}"></span>`).join("");

  const nextBtn = document.getElementById("tutorialNextBtn");
  const backBtn = document.getElementById("tutorialBackBtn");
  if (nextBtn) nextBtn.textContent = isLast ? "Finish" : "Next";
  if (backBtn) backBtn.hidden = isFirst;
}

function tutorialNext() {
  if (tutorialStep < activeTutorialSteps.length - 1) {
    tutorialStep++;
    renderTutorialStep();
  } else {
    finishTutorial();
  }
}

function tutorialBack() {
  if (tutorialStep > 0) {
    tutorialStep--;
    renderTutorialStep();
  } else {
    showTutorialChoice(); // stepping back from step 1 returns to the choice screen
  }
}

function finishTutorial() {
  const overlay = document.getElementById("tutorialOverlay");
  if (overlay) overlay.hidden = true;
  state.settings.tutorialSeen = true;
  persist();
}

function maybeAutoStartTutorial() {
  if (!state.settings.tutorialSeen) {
    startTutorial();
  }
}
