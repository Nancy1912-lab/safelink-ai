// SafeLink AI - Core Application Logic (Indian Version)

// Local State
let map;
let mapLayers = {
  safeZones: L.layerGroup(),
  hazards: L.layerGroup(),
  shelters: L.layerGroup(),
  heatmap: L.layerGroup()
};

let state = {
  lang: 'en',
  activeScenario: 'none',
  incidents: [],
  familyMembers: [],
  isMapPickerActive: false,
  isTtsEnabled: true,
  isSirenActive: false,
  isStrobeActive: false,
  sirenAudioContext: null,
  sirenOscillator: null,
  sirenGainNode: null,
  sirenSweepInterval: null,
  strobeInterval: null,
  sosCountdown: null,
  sosSeconds: 5
};

// Default Family Data (Indian Names & Locations)
const DEFAULT_FAMILY = [
  { name: "Aarav Sharma (Spouse)", status: "Safe", lat: 28.620, lng: 77.200 },
  { name: "Priyanjali (Daughter)", status: "Sheltered", lat: 28.600, lng: 77.220 },
  { name: "Sarah Sharma (Mother)", status: "Unreachable", lat: null, lng: null }
];

// Multilingual Translations Dictionary
const TRANSLATIONS = {
  en: {
    title: "SafeLink AI",
    subtitle: "Smart Community Safety & Crisis Assistant",
    sosHeader: "Emergency Dispatch & SOS",
    sosDesc: "Tap holding the button below to alert emergency response teams and broadcast your location.",
    beaconTitle: "Distress Signaling Beacon",
    strobeBtn: "Rescue Strobe",
    sirenBtn: "Audio Beacon",
    familyTitle: "Family Check-In Board",
    familyDesc: "Ensure family members report their status. Add and check in members below.",
    alertsTitle: "Active Safety Alerts",
    mapTitle: "Emergency Live Map",
    reportBtn: "Report Public Incident",
    directoryTitle: "Emergency Contact Registry",
    chatbotTitle: "AI Crisis Counsel",
    chatbotHelp: "Ask about evacuation, hazards, first aid...",
    checklistTitle: "Crisis Checklists & Guides",
    sosWarning: "SOS EMERGENCY BROADCAST",
    sosCountdownMsg: "Dispatching coordinates to regional services. Siren will sound in:",
    cancelBtn: "CANCEL DISPATCH",
    addBtn: "Add",
    callingMsg: "Calling Emergency Services...",
    gpsLabel: "GPS Dispatch coordinates:"
  },
  es: {
    title: "SafeLink AI",
    subtitle: "Asistente Inteligente de Seguridad y Crisis",
    sosHeader: "Despacho de Emergencia y SOS",
    sosDesc: "Mantenga presionado el botón de abajo para alertar a los equipos de emergencia y transmitir su ubicación.",
    beaconTitle: "Faro de Señal de Socorro",
    strobeBtn: "Estroboscopio de Rescate",
    sirenBtn: "Baliza de Audio",
    familyTitle: "Tablero de Control Familiar",
    familyDesc: "Asegúrese de que su familia informe su estado. Agregue miembros a continuación.",
    alertsTitle: "Alertas de Seguridad Activas",
    mapTitle: "Mapa de Emergencia en Vivo",
    reportBtn: "Reportar Incidente Público",
    directoryTitle: "Registro de Contactos de Emergencia",
    chatbotTitle: "Asesor de Crisis de IA",
    chatbotHelp: "Pregunte sobre evacuación, peligros, primeros auxilios...",
    checklistTitle: "Listas de Control y Guías",
    sosWarning: "TRANSMISIÓN DE EMERGENCIA SOS",
    sosCountdownMsg: "Despachando coordenadas a servicios regionales. La sirena sonará en:",
    cancelBtn: "CANCELAR DESPACHO",
    addBtn: "Agregar",
    callingMsg: "Llamando a Servicios de Emergencia...",
    gpsLabel: "Coordenadas GPS de despacho:"
  },
  fr: {
    title: "SafeLink AI",
    subtitle: "Assistant Intelligent de Sécurité & Crise",
    sosHeader: "Dépêche d'Urgence & SOS",
    sosDesc: "Maintenez le bouton ci-dessous pour alerter les secours et diffuser votre position.",
    beaconTitle: "Balise de Signal de Détresse",
    strobeBtn: "Stroboscope Sauvetage",
    sirenBtn: "Balise Audio",
    familyTitle: "Tableau de Suivi Familial",
    familyDesc: "Vérifiez le statut des membres de votre famille. Ajoutez des membres ci-dessous.",
    alertsTitle: "Alertes de Sécurité Actives",
    mapTitle: "Carte d'Urgence en Direct",
    reportBtn: "Signaler un Incident",
    directoryTitle: "Registre des Contacts d'Urgence",
    chatbotTitle: "Conseiller de Crise IA",
    chatbotHelp: "Questions sur l'évacuation, dangers, premiers secours...",
    checklistTitle: "Guides & Listes de Contrôle",
    sosWarning: "DIFFUSION D'URGENCE SOS",
    sosCountdownMsg: "Envoi des coordonnées aux secours. La sirène retentira dans :",
    cancelBtn: "ANNULER L'ENVOI",
    addBtn: "Ajouter",
    callingMsg: "Appel des Services d'Urgence...",
    gpsLabel: "Coordonnées GPS envoyées :"
  },
  ja: {
    title: "SafeLink AI",
    subtitle: "スマート防災・危機管理アシスタント",
    sosHeader: "緊急通報 & SOS",
    sosDesc: "下のボタンを長押しして緊急支援チームに通知し、現在地を送信します。",
    beaconTitle: "救助シグナルビーコン",
    strobeBtn: "救助用ストロボ",
    sirenBtn: "音声ビーコン",
    familyTitle: "家族安全確認ボード",
    familyDesc: "家族の安否情報を追跡します。以下から家族メンバーを追加・更新します。",
    alertsTitle: "アラート",
    mapTitle: "緊急リアルタイムマップ",
    reportBtn: "市民事故報告",
    directoryTitle: "緊急連絡先レジストリ",
    chatbotTitle: "AI防災相談室",
    chatbotHelp: "避難経路、ハザードについて質問...",
    checklistTitle: "危機管理チェックリスト",
    sosWarning: "SOS緊急放送システム発動",
    sosCountdownMsg: "位置情報を関係機関に送信中。サイレン鳴動まで：",
    cancelBtn: "通報をキャンセル",
    addBtn: "追加",
    callingMsg: "緊急ダイヤル発信中...",
    gpsLabel: "送信GPS座標情報："
  },
  hi: {
    title: "SafeLink AI",
    subtitle: "स्मार्ट सामुदायिक सुरक्षा एवं संकट सहायक",
    sosHeader: "आपातकालीन प्रेषण और एसओएस",
    sosDesc: "आपातकालीन टीमों को सतर्क करने और अपना स्थान साझा करने के लिए नीचे दिए बटन को दबाए रखें।",
    beaconTitle: "संकट संकेतक बीकन",
    strobeBtn: "बचाव स्ट्रोब लाइट",
    sirenBtn: "ध्वनि बीकन",
    familyTitle: "पारिवारिक चेक-इन बोर्ड",
    familyDesc: "परिवार के सदस्यों की सुरक्षा सुनिश्चित करें। नीचे सदस्यों को जोड़ें।",
    alertsTitle: "सक्रिय सुरक्षा चेतावनी",
    mapTitle: "आपातकालीन लाइव मानचित्र",
    reportBtn: "सार्वजनिक घटना की रिपोर्ट करें",
    directoryTitle: "आपातकालीन संपर्क सूची",
    chatbotTitle: "एआई संकट परामर्श",
    chatbotHelp: "निकासी, खतरों, प्राथमिक चिकित्सा के बारे में पूछें...",
    checklistTitle: "संकट चेकलिस्ट और मार्गदर्शिका",
    sosWarning: "एसओएस आपातकालीन प्रसारण",
    sosCountdownMsg: "क्षेत्रीय सेवाओं को निर्देशांक प्रेषित किए जा रहे हैं। सायरन बजेगा:",
    cancelBtn: "प्रेषण रद्द करें",
    addBtn: "जोड़ें",
    callingMsg: "आपातकालीन सेवाओं को कॉल किया जा रहा है...",
    gpsLabel: "जीपीएस प्रेषण निर्देशांक:"
  }
};

// AI Offline Responses DB (updated with India Specific Locations)
const AI_RESPONSES = {
  en: {
    greeting: "Hello, I am SafeLink AI. Ask me how to evacuate, perform CPR, prepare for earthquakes, or locate resources during this emergency.",
    unknown: "I've logged that query. Under offline guidelines, prioritize moving to designated Safe Zones, avoiding electricity near floodwater, and securing physical shelter. If in immediate danger, trigger the SOS alarm.",
    flood: "🌊 **Yamuna Flood Evacuation Guidance**:\n1. Seek high ground immediately.\n2. Do NOT cross moving flood water. ITO Ring road is heavily waterlogged.\n3. Turn off electricity at main switches.\n4. Head to *DND Flyway High Ground Relief Camp* (marked on the map) for safety packets and food.",
    earthquake: "🌋 **Delhi NCR Earthquake Guidelines**:\n1. DROP, COVER, and HOLD ON. Protect your neck.\n2. Watch out for structural debris collapse in areas like Connaught Place.\n3. Do NOT light open flames due to potential underground gas line shifts.\n4. Safe assembly point established at *Ramlila Maidan Open Assembly Ground*. Critical triage is at *AIIMS Emergency Trauma Centre*.",
    blackout: "🔌 **Grid Failure & Heatwave Guidelines**:\n1. Drink water frequently to avoid severe heat exhaustion (45°C heatwave).\n2. Insulate rooms, use hand fans, and conserve phone batteries.\n3. Do NOT run generators indoors due to carbon monoxide hazards.\n4. Locate solar-powered chilling and drinking water at *Sector 6 Cooling Camp*.",
    cpr: "🚑 **Hands-Only CPR instructions**:\n1. Push hard and fast in the center of the chest.\n2. Rate: 100 to 120 beats per minute (to the beat of 'Staying Alive').\n3. Allow the chest to rise completely between compressions.\n4. Continue until medical help arrives.",
    siren: "🚨 **Siren signaling information**:\nOur Audio Beacon emits a sweeping siren between 500Hz and 1200Hz. This frequency band penetrates thick debris and urban noise, helping emergency crews home in on your location. Keep the beacon active."
  },
  es: {
    greeting: "Hola, soy SafeLink AI. Pregúntame cómo evacuar, hacer RCP o prepararte para emergencias.",
    unknown: "He registrado su consulta. Priorice mudarse a las zonas seguras, evite el contacto con cables eléctricos y busque refugio. Si corre peligro, active el SOS.",
    flood: "🌊 **Instrucciones para Inundación**:\n1. Busque terrenos elevados inmediatamente.\n2. No cruce corrientes de agua en ITO Ring Road.\n3. Diríjase al *Refugio DND Flyway Relief Camp* (marcado en el mapa).",
    earthquake: "🌋 **Instrucciones para Terremoto**:\n1. AGACHESE, CUBRASE y SUJETESE.\n2. Cuidado con vidrios rotos y edificios antiguos en Connaught Place.\n3. No encienda fuego.\n4. Reúnase en el *Ramlila Maidan Ground* o diríjase al hospital AIIMS.",
    blackout: "🔌 **Protocolo de Apagón**:\n1. Beba agua para evitar el golpe de calor.\n2. No use generadores en espacios cerrados.\n3. Diríjase al *Sector 6 Cooling Camp*.",
    cpr: "🚑 **Instrucciones de RCP**:\n1. Presione fuerte y rápido en el centro del pecho.\n2. Frecuencia: 100-120 compresiones por minuto.\n3. Continúe hasta que llegue ayuda médica.",
    siren: "🚨 **Información de Sirena**:\nLa baliza de audio barre frecuencias de 500Hz a 1200Hz para penetrar escombros y ruido urbano. Manténgala encendida."
  },
  fr: {
    greeting: "Bonjour, je suis SafeLink AI. Demandez-moi comment évacuer, faire un massage cardiaque ou vous préparer.",
    unknown: "Consigne enregistrée. Déplacez-vous vers les zones de sécurité, évitez les fils électriques et abritez-vous. En cas de danger, déclenchez le SOS.",
    flood: "🌊 **Consignes Inondation**:\n1. Rejoignez immédiatement les hauteurs.\n2. Ne traversez pas les cours d'eau à ITO Ring Road.\n3. Rejoignez le *Refuge DND Flyway Relief Camp*.",
    earthquake: "🌋 **Consignes Séisme**:\n1. BAISSEZ-VOUS, COUVREZ-VOUS, PATIENTEZ.\n2. Évitez les vieux bâtiments à Connaught Place.\n3. Pas de flamme.\n4. Rejoignez le *Ramlila Maidan Ground* ou l'Hôpital AIIMS.",
    blackout: "🔌 **Consignes Panne d'Électricité**:\n1. Restez hydraté (canicule de 45°C).\n2. Ne pas allumer de générateurs à l'intérieur.\n3. Allez au *Sector 6 Cooling Camp*.",
    cpr: "🚑 **Instructions RCP**:\n1. Appuyez fort et vite au milieu de la poitrine.\n2. Rythme: 100 à 120 compressions par minute.\n3. Continuez jusqu'à l'arrivée des secours.",
    siren: "🚨 **Info Balise Sonore**:\nNotre balise sonore balaie les fréquences de 500Hz à 1200Hz pour percer le bruit urbain et aider les secours à vous localiser."
  },
  ja: {
    greeting: "こんにちは、SafeLink AIです。避難方法、応急手当、地震対策についてお尋ねください。",
    unknown: "質問を記録しました。安全な場所（セーフゾーン）への移動を最優先し、浸水地域での感電に注意してください。緊急時はSOSを発動してください。",
    flood: "🌊 **ヤムナー川洪水避難手順**:\n1. 直ちに高台へ避難してください。\n2. 水没したITOリングロードは避けてください。\n3. マップ上の「DND Flyway Relief Camp」へ移動してください。",
    earthquake: "🌋 **デリー首都圏地震発生時の行動基準**:\n1. まず低く、頭を守り、動かない（ドロップ、カバー、ホールドオン）。\n2. コノートプレイス周辺の倒壊物に注意してください。\n3. 「Ramlila Maidan安全広場」または「AIIMS救急病院」に避難してください。",
    blackout: "🔌 **大規模停電・猛暑対応**:\n1. 熱中症防止のため頻繁に水分補給を行ってください。\n2. 一酸化炭素中毒防止のため、発電機の屋内使用は厳禁です。\n3. 「Sector 6 Cooling Camp」で冷房施設を利用できます。",
    cpr: "🚑 **心肺蘇生法（CPR）の手順**:\n1. 胸の真ん中を「強く、速く」押します。\n2. ペースは1分間に100〜120回です。\n3. 救急隊が到着するまで継続してください。",
    siren: "🚨 **シグナルサイレンについて**:\n音声ビーコンは500Hz〜1200Hzの周波数を発信し、瓦礫の隙間や騒音を突き抜けて救助隊に位置を知らせます。"
  },
  hi: {
    greeting: "नमस्ते, मैं SafeLink AI हूँ। मुझसे निकासी, सीपीआर, या भूकंप की तैयारी के तरीकों के बारे में पूछें।",
    unknown: "आपका प्रश्न दर्ज कर लिया गया है। सुरक्षित क्षेत्रों में जाने को प्राथमिकता दें, बिजली के तारों से दूर रहें। खतरे में होने पर SOS दबाएं।",
    flood: "🌊 **यमुना बाढ़ निकासी निर्देश**:\n1. तुरंत ऊंचाई वाले स्थानों पर जाएं।\n2. आईटीओ (ITO) रिंग रोड पर जलभराव है, वहाँ न जाएँ।\n3. *डीएनडी फ्लाईवे रिलीफ कैंप (DND Flyway Camp)* की ओर प्रस्थान करें।",
    earthquake: "🌋 **दिल्ली एनसीआर भूकंप सुरक्षा निर्देश**:\n1. झुकें, ढकें, और पकड़ें (Drop, Cover, Hold on)।\n2. कनाट प्लेस (Connaught Place) जैसी जगहों पर गिरने वाले मलबे से बचें।\n3. *रामलीला मैदान (Ramlila Maidan)* सेफ फील्ड या *एम्स (AIIMS)* ट्रामा सेंटर की ओर जाएं।",
    blackout: "🔌 **बिजली गुल और लू (Heatwave) के निर्देश**:\n1. लू (45°C) से बचने के लिए लगातार पानी पिएं।\n2. बंद कमरों में जनरेटर न चलाएं।\n3. *सेक्टर 6 कूलिंग कैंप (Sector 6 Cooling Camp)* में जाएं।",
    cpr: "🚑 **सीपीआर (CPR) के निर्देश**:\n1. छाती के केंद्र में जोर से और तेजी से दबाएं।\n2. दर: 100 से 120 प्रति मिनट।\n3. चिकित्सा सहायता आने तक जारी रखें।",
    siren: "🚨 **सायरन संकेत जानकारी**:\nध्वनि बीकन मलबे और शोर को भेदने के लिए 500Hz से 1200Hz के बीच सायरन बजाता है। इसे चालू रखें।"
  }
};

// Initial Setup on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initLocalStorage();
  loadDirectory();
  loadChecklists();
  setupEventListeners();
  triggerScenario('none'); // Set normal operations
});

// 1. Map Controller Setup
function initMap() {
  // Center coordinate set to New Delhi, India
  const defaultCoord = [28.6139, 77.2090];
  
  map = L.map("leaflet-map", {
    zoomControl: true,
    attributionControl: true
  }).setView(defaultCoord, 12);

  // CartoDB Dark Matter Tiles (Professional looking dark theme map)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Add the Layer Groups to map
  mapLayers.safeZones.addTo(map);
  mapLayers.hazards.addTo(map);
  mapLayers.shelters.addTo(map);
  mapLayers.heatmap.addTo(map);

  // Default Delhi Safe Zones Map Markers
  const safeMarker1 = L.circleMarker([28.6150, 77.2090], {
    color: '#00E676', fillColor: '#00E676', fillOpacity: 0.5, radius: 10
  }).bindPopup("<h3>Central Park Assembly Zone</h3><p>Open safe lawn at Connaught Place. Emergency drinking water tank and first aid station active.</p>");
  mapLayers.safeZones.addLayer(safeMarker1);

  const safeMarker2 = L.circleMarker([28.5800, 77.2300], {
    color: '#00E676', fillColor: '#00E676', fillOpacity: 0.5, radius: 10
  }).bindPopup("<h3>Lodhi Garden Shelter Point</h3><p>Wide open green lawns. Civil defense volunteers setting up temporary tarps.</p>");
  mapLayers.safeZones.addLayer(safeMarker2);

  // Click on Map coordinates handler (for Incident Form)
  map.on('click', (e) => {
    if (state.isMapPickerActive) {
      document.getElementById("incident-lat").value = e.latlng.lat.toFixed(4);
      document.getElementById("incident-lng").value = e.latlng.lng.toFixed(4);
      
      // visual feedback marker temporary
      L.popup()
        .setLatLng(e.latlng)
        .setContent("Selected coordinates: " + e.latlng.lat.toFixed(4) + ", " + e.latlng.lng.toFixed(4))
        .openOn(map);
        
      state.isMapPickerActive = false;
      document.getElementById("map-picker-btn").textContent = "Click on Map";
      document.getElementById("map-picker-btn").classList.remove("btn-danger");
    }
  });
}

// LocalStorage Hydration
function initLocalStorage() {
  // Family Members
  if (localStorage.getItem("safelink_family")) {
    state.familyMembers = JSON.parse(localStorage.getItem("safelink_family"));
  } else {
    state.familyMembers = [...DEFAULT_FAMILY];
    localStorage.setItem("safelink_family", JSON.stringify(state.familyMembers));
  }
  renderFamilyList();

  // Incidents
  if (localStorage.getItem("safelink_incidents")) {
    state.incidents = JSON.parse(localStorage.getItem("safelink_incidents"));
    state.incidents.forEach(inc => {
      addIncidentToMapAndFeed(inc);
    });
  }
}

// 2. Incident & Feed Manager
function addIncidentToMapAndFeed(inc) {
  // Icon and Color based on urgency
  let markerColor = '#ef4444'; // Red for critical
  if (inc.urgency === 'warning') markerColor = '#f59e0b'; // Orange
  if (inc.urgency === 'info') markerColor = '#3b82f6'; // Blue

  // Create Marker on Map
  const marker = L.circleMarker([inc.lat, inc.lng], {
    color: markerColor,
    fillColor: markerColor,
    fillOpacity: 0.7,
    radius: 9
  }).bindPopup(`<h3>[${inc.type.toUpperCase()}] ${inc.title}</h3><p>${inc.desc}</p><span style="font-size:0.65rem; color:#9ca3af;">Urgency: ${inc.urgency.toUpperCase()}</span>`);
  
  if (inc.urgency === 'critical') {
    mapLayers.hazards.addLayer(marker);
  } else {
    mapLayers.shelters.addLayer(marker);
  }

  // Add to active alerts feed
  const alertsFeed = document.getElementById("alerts-feed-wrapper");
  const alertEl = document.createElement("div");
  alertEl.className = `alert-item alert-${inc.urgency}`;
  
  let typeIcon = "⚠️";
  if (inc.type === 'fire') typeIcon = "🔥";
  if (inc.type === 'medical') typeIcon = "🚑";
  if (inc.type === 'crime') typeIcon = "🚨";
  if (inc.type === 'missing') typeIcon = "👤";

  alertEl.innerHTML = `
    <div class="alert-item-header">
      <span>${typeIcon} ${inc.type} - ${inc.urgency}</span>
    </div>
    <div class="alert-item-body">${inc.title}: ${inc.desc}</div>
    <div class="alert-item-time">Just now</div>
  `;
  alertsFeed.insertBefore(alertEl, alertsFeed.firstChild);
}

// 3. Family Check-In logic
function renderFamilyList() {
  const container = document.getElementById("family-list");
  container.innerHTML = "";
  
  state.familyMembers.forEach((member, index) => {
    const row = document.createElement("div");
    row.className = "family-member-row";
    
    let statusClass = "status-safe";
    if (member.status === "Sheltered") statusClass = "status-sheltered";
    if (member.status === "Unreachable") statusClass = "status-unreachable";

    let coordText = "No GPS broadcast";
    if (member.lat && member.lng) {
      coordText = `Lat: ${member.lat.toFixed(3)}, Lng: ${member.lng.toFixed(3)}`;
    }

    row.innerHTML = `
      <div class="member-info">
        <span class="member-name">${member.name}</span>
        <span class="member-coords">${coordText}</span>
      </div>
      <div class="flex-row" style="display:flex; gap: 8px; align-items:center;">
        <span class="member-status ${statusClass}">${member.status}</span>
        <button class="toggle-icon-btn delete-member" data-index="${index}" style="color:var(--color-danger); font-size:1.1rem; padding: 2px;">&times;</button>
      </div>
    `;

    // Map family members if they have coordinates
    if (member.lat && member.lng) {
      let iconColor = member.status === "Safe" ? '#10b981' : '#f59e0b';
      if (member.status === "Unreachable") iconColor = '#ef4444';
      
      const famMarker = L.circleMarker([member.lat, member.lng], {
        color: iconColor,
        fillColor: iconColor,
        fillOpacity: 0.6,
        radius: 7
      }).bindPopup(`<h3>Family: ${member.name}</h3><p>Status: <strong>${member.status}</strong></p>`);
      mapLayers.safeZones.addLayer(famMarker);
    }

    container.appendChild(row);
  });

  // Attach delete handlers
  document.querySelectorAll(".delete-member").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-index");
      state.familyMembers.splice(idx, 1);
      localStorage.setItem("safelink_family", JSON.stringify(state.familyMembers));
      renderFamilyList();
    });
  });
}

// 4. Directory Search & Rendering
function loadDirectory() {
  const container = document.getElementById("directory-grid");
  const searchQuery = document.getElementById("directory-search").value.toLowerCase();
  
  container.innerHTML = "";
  
  const filtered = window.EMERGENCY_DIRECTORY.filter(item => 
    item.name.toLowerCase().includes(searchQuery) || 
    item.desc.toLowerCase().includes(searchQuery) ||
    item.number.includes(searchQuery)
  );

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "directory-card";
    card.innerHTML = `
      <div class="directory-card-info">
        <span class="directory-name">${item.name}</span>
        <span class="directory-desc">${item.desc}</span>
      </div>
      <span class="directory-number">${item.number}</span>
    `;

    card.addEventListener("click", () => {
      triggerSimulatedCall(item.name, item.number);
    });

    container.appendChild(card);
  });
}

// Simulated Telephone Call overlay
function triggerSimulatedCall(name, number) {
  const callOverlay = document.getElementById("call-overlay");
  document.getElementById("call-target").textContent = `Calling ${name}...`;
  document.getElementById("call-number").textContent = number;
  
  // Delhi coordinate fallback
  document.getElementById("call-gps").textContent = "Latitude: 28.6139, Longitude: 77.2090 (New Delhi)";

  callOverlay.classList.remove("hidden");
}

// 5. Survival Checklists & Guides Accordion
function loadChecklists() {
  const accordion = document.getElementById("guides-accordion");
  accordion.innerHTML = "";

  Object.entries(window.EMERGENCY_GUIDES).forEach(([key, guide]) => {
    const card = document.createElement("div");
    card.className = "guide-card";
    card.id = `guide-card-${key}`;

    const stepsLi = guide.steps.map(step => `<li>${step}</li>`).join("");

    // Load saved checklist states
    const savedStates = JSON.parse(localStorage.getItem(`checklist_${key}`)) || {};
    
    const checklistLi = guide.checklist.map(item => {
      const isChecked = savedStates[item.id] !== undefined ? savedStates[item.id] : item.checked;
      const checkedAttr = isChecked ? "checked" : "";
      return `
        <label class="checkbox-container">
          <input type="checkbox" id="${item.id}" data-guide="${key}" ${checkedAttr} class="checklist-item-cb">
          <span class="checkmark"></span> ${item.text}
        </label>
      `;
    }).join("");

    card.innerHTML = `
      <div class="guide-card-header">
        <span class="guide-card-title">${guide.icon} ${guide.title}</span>
        <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="guide-card-body">
        <div class="guide-section-title">Critical Survival Steps</div>
        <ol class="guide-steps-list">
          ${stepsLi}
        </ol>
        <div class="guide-section-title">Emergency Prep Checklist</div>
        <div class="checklist-group">
          ${checklistLi}
        </div>
      </div>
    `;

    // Accordion Toggle
    card.querySelector(".guide-card-header").addEventListener("click", () => {
      const isExpanded = card.classList.contains("expanded");
      document.querySelectorAll(".guide-card").forEach(c => c.classList.remove("expanded"));
      if (!isExpanded) {
        card.classList.add("expanded");
      }
    });

    accordion.appendChild(card);
  });

  // Checklist Change Listener
  document.querySelectorAll(".checklist-item-cb").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const guideKey = e.target.getAttribute("data-guide");
      const id = e.target.id;
      const checked = e.target.checked;

      const savedStates = JSON.parse(localStorage.getItem(`checklist_${guideKey}`)) || {};
      savedStates[id] = checked;
      localStorage.setItem(`checklist_${guideKey}`, JSON.stringify(savedStates));
    });
  });
}

// 6. Crisis Simulator Engine
function triggerScenario(scenarioKey) {
  state.activeScenario = scenarioKey;
  const config = window.SIMULATOR_SCENARIOS[scenarioKey];
  if (!config) return;

  // 1. Update Top Banner
  const banner = document.getElementById("live-banner");
  const bannerText = document.getElementById("banner-text");
  bannerText.textContent = config.banner;
  
  banner.className = "live-banner"; // reset
  if (config.severity === "critical") banner.classList.add("banner-critical");
  else if (config.severity === "warning") banner.classList.add("banner-warning");
  else banner.classList.add("banner-low");

  // 2. Clear Active map overlays
  mapLayers.heatmap.clearLayers();
  mapLayers.hazards.clearLayers();
  mapLayers.shelters.clearLayers();

  // 3. Render new heatmap polygons if checked
  if (document.getElementById("chk-heatmap").checked) {
    config.heatmap.forEach(poly => {
      const p = L.polygon(poly.coordinates, poly.options);
      mapLayers.heatmap.addLayer(p);
    });
  }

  // 4. Render scenario-specific pins
  config.markers.forEach(marker => {
    let pinColor = '#3b82f6';
    if (marker.type === 'hazard') pinColor = '#ef4444';
    if (marker.type === 'shelter') pinColor = '#10b981';

    const p = L.circleMarker([marker.lat, marker.lng], {
      color: pinColor,
      fillColor: pinColor,
      fillOpacity: 0.8,
      radius: 9
    }).bindPopup(`<h3>${marker.title}</h3><p>${marker.desc}</p>`);

    if (marker.type === 'hazard') mapLayers.hazards.addLayer(p);
    else mapLayers.shelters.addLayer(p);
  });

  // Add custom user-reported incidents back
  const localIncidents = JSON.parse(localStorage.getItem("safelink_incidents")) || [];
  localIncidents.forEach(inc => addIncidentToMapAndFeed(inc));

  // 5. Update Alerts Panel
  const feedWrapper = document.getElementById("alerts-feed-wrapper");
  feedWrapper.innerHTML = "";
  config.alerts.forEach(item => {
    const alertEl = document.createElement("div");
    alertEl.className = `alert-item alert-${item.type}`;
    alertEl.innerHTML = `
      <div class="alert-item-header">
        <span>${item.type.toUpperCase()} WARNING</span>
      </div>
      <div class="alert-item-body">${item.text}</div>
      <div class="alert-item-time">${item.time}</div>
    `;
    feedWrapper.appendChild(alertEl);
  });

  // 6. Direct chatbot to scenario guidance
  let welcomeMsg = AI_RESPONSES[state.lang].greeting;
  if (scenarioKey !== 'none') {
    welcomeMsg = `⚠️ **SYSTEM SCENARIO ALERT**: ${config.title}\n\n` + (AI_RESPONSES[state.lang][scenarioKey] || welcomeMsg);
  }
  
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";
  appendChatMessage(welcomeMsg, "bot");

  // Speak welcome message
  speakText(welcomeMsg);
}

// 7. Audio Synthesizer (Siren Beacon)
function initAudio() {
  if (!state.sirenAudioContext) {
    state.sirenAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function startSiren() {
  initAudio();
  if (state.isSirenActive) return;

  state.isSirenActive = true;
  document.getElementById("toggle-siren-btn").classList.add("active");
  document.getElementById("siren-synth-controls").classList.remove("hidden");

  // Create Synth node chain
  state.sirenOscillator = state.sirenAudioContext.createOscillator();
  state.sirenGainNode = state.sirenAudioContext.createGain();

  state.sirenOscillator.type = "sine";
  const userPitch = parseInt(document.getElementById("siren-pitch").value);
  state.sirenOscillator.frequency.value = userPitch;

  // Volume
  const volumeSlider = document.getElementById("siren-volume").value;
  state.sirenGainNode.gain.value = (volumeSlider / 100) * 0.2; // Keep at safe max level

  state.sirenOscillator.connect(state.sirenGainNode);
  state.sirenGainNode.connect(state.sirenAudioContext.destination);

  state.sirenOscillator.start();

  // Sweeping Pitch Modulation
  let goingUp = true;
  let currentFreq = userPitch;
  state.sirenSweepInterval = setInterval(() => {
    if (!state.sirenOscillator) return;
    const baseFreq = parseInt(document.getElementById("siren-pitch").value);
    
    if (goingUp) {
      currentFreq += 25;
      if (currentFreq >= baseFreq + 250) goingUp = false;
    } else {
      currentFreq -= 25;
      if (currentFreq <= baseFreq - 250) goingUp = true;
    }
    state.sirenOscillator.frequency.value = currentFreq;
  }, 40);
}

function stopSiren() {
  state.isSirenActive = false;
  document.getElementById("toggle-siren-btn").classList.remove("active");
  document.getElementById("siren-synth-controls").classList.add("hidden");

  if (state.sirenSweepInterval) {
    clearInterval(state.sirenSweepInterval);
    state.sirenSweepInterval = null;
  }

  if (state.sirenOscillator) {
    try {
      state.sirenOscillator.stop();
      state.sirenOscillator.disconnect();
    } catch(e) {}
    state.sirenOscillator = null;
  }
}

// 8. Visual Rescue Strobe Flasher
function startStrobe() {
  if (state.isStrobeActive) return;
  state.isStrobeActive = true;
  document.getElementById("toggle-strobe-btn").classList.add("active");

  const overlay = document.getElementById("strobe-overlay");
  overlay.classList.remove("hidden");

  let isYellow = false;
  
  function flash() {
    if (!state.isStrobeActive) return;
    const speed = parseInt(document.getElementById("strobe-speed").value);
    
    overlay.style.backgroundColor = isYellow ? "#FFFFFF" : "#FFEB3B";
    isYellow = !isYellow;
    
    state.strobeInterval = setTimeout(flash, speed);
  }
  flash();
}

function stopStrobe() {
  state.isStrobeActive = false;
  document.getElementById("toggle-strobe-btn").classList.remove("active");
  document.getElementById("strobe-overlay").classList.add("hidden");
  
  if (state.strobeInterval) {
    clearTimeout(state.strobeInterval);
    state.strobeInterval = null;
  }
}

// 9. AI Chatbot Controller
function handleChatSubmit() {
  const inputEl = document.getElementById("chat-input");
  const query = inputEl.value.trim();
  if (!query) return;

  // Append user message
  appendChatMessage(query, "user");
  inputEl.value = "";

  // Show typing indicator
  const indicator = document.getElementById("typing-indicator");
  indicator.classList.remove("hidden");

  // Scroll
  const chatCont = document.getElementById("chat-messages");
  chatCont.scrollTop = chatCont.scrollHeight;

  // Simulated AI response delay
  setTimeout(() => {
    indicator.classList.add("hidden");
    const response = computeChatResponse(query);
    appendChatMessage(response, "bot");
    speakText(response);
  }, 1000);
}

function computeChatResponse(query) {
  const q = query.toLowerCase();
  const resSet = AI_RESPONSES[state.lang];

  // Match keyword priorities
  if (q.includes("flood") || q.includes("water") || q.includes("inund") || q.includes("बाढ़") || q.includes("yamuna")) {
    return resSet.flood;
  }
  if (q.includes("earthquake") || q.includes("shake") || q.includes("aftershock") || q.includes("terremoto") || q.includes("séisme") || q.includes("भूकंप") || q.includes("delhi")) {
    return resSet.earthquake;
  }
  if (q.includes("blackout") || q.includes("power") || q.includes("outage") || q.includes("electricity") || q.includes("heat") || q.includes("grid") || q.includes("बिजली") || q.includes("लू")) {
    return resSet.blackout;
  }
  if (q.includes("cpr") || q.includes("heart") || q.includes("medical") || q.includes("rcp") || q.includes("चिकित्सा") || q.includes("first aid")) {
    return resSet.cpr;
  }
  if (q.includes("siren") || q.includes("sound") || q.includes("beacon") || q.includes("audio") || q.includes("सायरन")) {
    return resSet.siren;
  }

  // Contextual addition based on active simulated scenario
  if (state.activeScenario !== 'none') {
    const scName = window.SIMULATOR_SCENARIOS[state.activeScenario].title;
    return `During the active **${scName}**, please stay alert. I couldn't find a direct match for "${query}", but here are the primary guidelines for the current disaster:\n\n` + resSet[state.activeScenario];
  }

  return resSet.unknown;
}

function appendChatMessage(text, sender) {
  const container = document.getElementById("chat-messages");
  const msg = document.createElement("div");
  msg.className = `message message-${sender}`;
  
  // Simple markdown conversion for bold text and lists
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
    
  msg.innerHTML = formattedText;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

// Text to Speech (TTS) Reader
function speakText(text) {
  if (!state.isTtsEnabled) return;
  
  window.speechSynthesis.cancel();
  
  const cleanText = text.replace(/\*\*|#|_/g, "");
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  if (state.lang === 'es') utterance.lang = 'es-ES';
  else if (state.lang === 'fr') utterance.lang = 'fr-FR';
  else if (state.lang === 'ja') utterance.lang = 'ja-JP';
  else if (state.lang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-IN'; // Indian English voice preferred!

  const micBtn = document.getElementById("mic-btn");
  utterance.onstart = () => {
    micBtn.classList.add("listening");
  };
  utterance.onend = () => {
    micBtn.classList.remove("listening");
  };
  utterance.onerror = () => {
    micBtn.classList.remove("listening");
  };

  window.speechSynthesis.speak(utterance);
}

// Voice input simulation (speech waves)
function simulateVoiceInput() {
  const visualizer = document.getElementById("voice-recognition-visualizer");
  visualizer.classList.remove("hidden");
  
  setTimeout(() => {
    visualizer.classList.add("hidden");
    
    let voicePrompt = "Where is the nearest shelter?";
    if (state.activeScenario === "earthquake") voicePrompt = "What is the status of gas leaks?";
    if (state.activeScenario === "blackout") voicePrompt = "Where is the cooling camp?";
    
    document.getElementById("chat-input").value = voicePrompt;
    handleChatSubmit();
  }, 3000);
}

// Translation Manager
function translateUI(lang) {
  state.lang = lang;
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  // Header
  document.querySelector(".header-logo h1").textContent = dict.title;
  document.querySelector(".header-logo .subtitle").textContent = dict.subtitle;
  
  // SOS & Distress
  document.querySelector(".panel-sos h2").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
    ${dict.sosHeader}
  `;
  document.querySelector(".panel-sos .panel-desc").textContent = dict.sosDesc;
  document.querySelector(".distress-tools h3").textContent = dict.beaconTitle;
  document.getElementById("toggle-strobe-btn").innerHTML = `
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    ${dict.strobeBtn}
  `;
  document.getElementById("toggle-siren-btn").innerHTML = `
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 6v6m0 0l2 2"/></svg>
    ${dict.sirenBtn}
  `;

  // Family Board
  document.querySelector(".panel-family h2").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm10 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>
    ${dict.familyTitle}
  `;
  document.querySelector(".panel-family .panel-desc").textContent = dict.familyDesc;
  document.querySelector("#add-family-form button").textContent = dict.addBtn;

  // Alerts, Map & Directories
  document.querySelector(".panel-feed h2").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
    ${dict.alertsTitle}
  `;
  document.querySelector(".panel-map h2").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
    ${dict.mapTitle}
  `;
  document.getElementById("trigger-report-btn").innerHTML = `
    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    ${dict.reportBtn}
  `;
  document.querySelector(".panel-directory h2").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
    ${dict.directoryTitle}
  `;
  document.querySelector(".panel-bot h2").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
    ${dict.chatbotTitle}
  `;
  document.getElementById("chat-input").placeholder = dict.chatbotHelp;
  document.querySelector(".panel-guides h2").innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
    ${dict.checklistTitle}
  `;

  // SOS Countdown
  document.querySelector(".sos-title").textContent = dict.sosWarning;
  document.querySelector(".sos-alert-desc").textContent = dict.sosCountdownMsg;
  document.getElementById("cancel-sos-btn").textContent = dict.cancelBtn;

  // Call dialog
  document.getElementById("call-target").textContent = dict.callingMsg;
  document.querySelector(".call-info p strong").textContent = dict.gpsLabel;

  loadChecklists();
  triggerScenario(state.activeScenario);
}

// SOS Dispatch Countdown
function triggerSOS() {
  const overlay = document.getElementById("sos-overlay");
  overlay.classList.remove("hidden");

  state.sosSeconds = 5;
  document.getElementById("sos-timer-display").textContent = state.sosSeconds;

  state.sosCountdown = setInterval(() => {
    state.sosSeconds--;
    document.getElementById("sos-timer-display").textContent = state.sosSeconds;

    if (state.sosSeconds <= 0) {
      clearInterval(state.sosCountdown);
      executeSOSDispatch();
    }
  }, 1000);
}

function cancelSOS() {
  if (state.sosCountdown) {
    clearInterval(state.sosCountdown);
    state.sosCountdown = null;
  }
  document.getElementById("sos-overlay").classList.add("hidden");
}

function executeSOSDispatch() {
  document.getElementById("sos-overlay").classList.add("hidden");
  startSiren();

  const newSosIncident = {
    type: "crime",
    urgency: "critical",
    title: "SOS DISTRESS SIGNAL ACTIVE",
    desc: "Critical user SOS broadcasted. NDRF and regional Indian emergency response team dispatched to coordinates.",
    lat: 28.6139,
    lng: 77.2090
  };

  const incidents = JSON.parse(localStorage.getItem("safelink_incidents")) || [];
  incidents.push(newSosIncident);
  localStorage.setItem("safelink_incidents", JSON.stringify(incidents));

  addIncidentToMapAndFeed(newSosIncident);
  map.setView([28.6139, 77.2090], 14);

  triggerSimulatedCall("NDMA & NDRF Emergency Control", "112");
}

// Setup UI Event Listeners
function setupEventListeners() {
  document.getElementById("simulator-select").addEventListener("change", (e) => {
    triggerScenario(e.target.value);
  });

  document.getElementById("lang-select").addEventListener("change", (e) => {
    translateUI(e.target.value);
  });

  document.getElementById("sos-btn").addEventListener("click", () => {
    triggerSOS();
  });
  document.getElementById("cancel-sos-btn").addEventListener("click", () => {
    cancelSOS();
  });

  document.getElementById("toggle-strobe-btn").addEventListener("click", () => {
    if (state.isStrobeActive) stopStrobe();
    else startStrobe();
  });
  document.getElementById("close-strobe-btn").addEventListener("click", () => {
    stopStrobe();
  });
  document.getElementById("toggle-siren-btn").addEventListener("click", () => {
    if (state.isSirenActive) stopSiren();
    else startSiren();
  });

  document.getElementById("siren-pitch").addEventListener("input", (e) => {
    document.getElementById("siren-pitch-value").textContent = `${e.target.value}Hz`;
    if (state.sirenOscillator) {
      state.sirenOscillator.frequency.value = e.target.value;
    }
  });

  document.getElementById("siren-volume").addEventListener("input", (e) => {
    if (state.sirenGainNode) {
      state.sirenGainNode.gain.value = (e.target.value / 100) * 0.2;
    }
  });

  document.getElementById("directory-search").addEventListener("input", () => {
    loadDirectory();
  });

  document.getElementById("chat-send-btn").addEventListener("click", handleChatSubmit);
  document.getElementById("chat-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleChatSubmit();
  });

  document.getElementById("tts-toggle-btn").addEventListener("click", () => {
    state.isTtsEnabled = !state.isTtsEnabled;
    const btn = document.getElementById("tts-toggle-btn");
    if (state.isTtsEnabled) {
      btn.classList.add("active");
      window.speechSynthesis.cancel();
    } else {
      btn.classList.remove("active");
      window.speechSynthesis.cancel();
    }
  });

  document.getElementById("mic-btn").addEventListener("click", simulateVoiceInput);

  document.getElementById("add-family-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("member-name").value.trim();
    const status = document.getElementById("member-status-select").value;
    if (!name) return;

    // Simulate placing near New Delhi coordinates
    const lat = 28.61 + (Math.random() - 0.5) * 0.05;
    const lng = 77.20 + (Math.random() - 0.5) * 0.05;

    state.familyMembers.push({ name, status, lat, lng });
    localStorage.setItem("safelink_family", JSON.stringify(state.familyMembers));
    renderFamilyList();

    document.getElementById("member-name").value = "";
  });

  document.getElementById("trigger-report-btn").addEventListener("click", () => {
    document.getElementById("report-modal").classList.remove("hidden");
  });
  document.getElementById("close-report-modal").addEventListener("click", () => {
    document.getElementById("report-modal").classList.add("hidden");
  });

  document.getElementById("map-picker-btn").addEventListener("click", () => {
    state.isMapPickerActive = !state.isMapPickerActive;
    const btn = document.getElementById("map-picker-btn");
    
    if (state.isMapPickerActive) {
      btn.textContent = "Click on Map Mode";
      btn.classList.add("btn-danger");
      document.getElementById("report-modal").classList.add("hidden");
      
      map.once("click", () => {
        setTimeout(() => {
          document.getElementById("report-modal").classList.remove("hidden");
        }, 300);
      });
    } else {
      btn.textContent = "Click on Map";
      btn.classList.remove("btn-danger");
    }
  });

  document.getElementById("incident-report-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("incident-type").value;
    const urgency = document.querySelector('input[name="urgency"]:checked').value;
    const title = document.getElementById("incident-title").value.trim();
    const desc = document.getElementById("incident-desc").value.trim();
    const lat = parseFloat(document.getElementById("incident-lat").value);
    const lng = parseFloat(document.getElementById("incident-lng").value);

    const newInc = { type, urgency, title, desc, lat, lng };

    state.incidents.push(newInc);
    localStorage.setItem("safelink_incidents", JSON.stringify(state.incidents));

    addIncidentToMapAndFeed(newInc);

    document.getElementById("incident-title").value = "";
    document.getElementById("incident-desc").value = "";
    document.getElementById("report-modal").classList.add("hidden");

    map.setView([lat, lng], 14);
  });

  document.getElementById("end-call-btn").addEventListener("click", () => {
    document.getElementById("call-overlay").classList.add("hidden");
  });

  document.getElementById("chk-safe-zones").addEventListener("change", (e) => {
    if (e.target.checked) map.addLayer(mapLayers.safeZones);
    else map.removeLayer(mapLayers.safeZones);
  });
  document.getElementById("chk-hazards").addEventListener("change", (e) => {
    if (e.target.checked) map.addLayer(mapLayers.hazards);
    else map.removeLayer(mapLayers.hazards);
  });
  document.getElementById("chk-shelters").addEventListener("change", (e) => {
    if (e.target.checked) map.addLayer(mapLayers.shelters);
    else map.removeLayer(mapLayers.shelters);
  });
  document.getElementById("chk-heatmap").addEventListener("change", (e) => {
    if (e.target.checked) {
      map.addLayer(mapLayers.heatmap);
      triggerScenario(state.activeScenario);
    } else {
      map.removeLayer(mapLayers.heatmap);
    }
  });

  document.querySelectorAll(".quick-prompt-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.getElementById("chat-input").value = e.target.textContent;
      handleChatSubmit();
    });
  });
}
