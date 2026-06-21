// Emergency Guides, Indian Crisis Scenarios, and Directory Data for SafeLink AI

const EMERGENCY_GUIDES = {
  earthquake: {
    title: "Earthquake Survival Guide",
    icon: "🌋",
    steps: [
      "DROP down onto your hands and knees.",
      "COVER your head and neck under a sturdy table or desk.",
      "HOLD ON to your shelter until shaking stops.",
      "STAY AWAY from windows, glass, and exterior walls.",
      "DO NOT use elevators; check for fires and hazards before moving.",
      "Be prepared for aftershocks."
    ],
    checklist: [
      { id: "eq-water", text: "3 gallons of water per person (3-day supply)", checked: false },
      { id: "eq-food", text: "Non-perishable food (canned goods, energy bars)", checked: false },
      { id: "eq-flashlight", text: "Flashlight and extra batteries", checked: false },
      { id: "eq-firstaid", text: "First Aid kit and essential medications", checked: false },
      { id: "eq-radio", text: "Hand-crank or battery-powered radio", checked: false },
      { id: "eq-whistle", text: "Whistle to signal for help", checked: false }
    ]
  },
  flood: {
    title: "Flash Flood Safety Guide",
    icon: "🌊",
    steps: [
      "Move to higher ground immediately; do not wait for instructions.",
      "Avoid walking or driving through flood waters (Turn Around, Don't Drown).",
      "Just 6 inches of moving water can knock you down; 12 inches can sweep a car away.",
      "Stay away from underpasses, canyons, and storm drains.",
      "If water rises in your home, go to the top floor or roof if necessary.",
      "Disconnect electrical appliances if safe to do so."
    ],
    checklist: [
      { id: "fl-documents", text: "Waterproof container for personal documents", checked: false },
      { id: "fl-boots", text: "Sturdy boots and rain gear", checked: false },
      { id: "fl-purification", text: "Water purification tablets or filter", checked: false },
      { id: "fl-powerbank", text: "Fully charged portable power banks", checked: false },
      { id: "fl-hygiene", text: "Personal hygiene items and wet wipes", checked: false }
    ]
  },
  fire: {
    title: "Structure & Wildfire Guide",
    icon: "🔥",
    steps: [
      "Get out, stay out, and call emergency services immediately.",
      "If there is smoke, crawl low under the smoke to your exit.",
      "Before opening any door, touch the knob/door with the back of your hand. If hot, use another exit.",
      "If your clothes catch fire: Stop, Drop, and Roll.",
      "For wildfires: clear combustibles around the house, close all windows, and evacuate early.",
      "Never return inside a burning building for any reason."
    ],
    checklist: [
      { id: "fr-extinguisher", text: "Class A:B:C fire extinguisher nearby", checked: false },
      { id: "fr-mask", text: "N95 respirator masks (for smoke inhalation)", checked: false },
      { id: "fr-detector", text: "Smoke alarms tested in the past month", checked: false },
      { id: "fr-escape", text: "Pre-planned evacuation route maps", checked: false }
    ]
  },
  active_threat: {
    title: "Active Threat/Crime Guide",
    icon: "🚨",
    steps: [
      "RUN: Have an escape route and plan. Leave your belongings.",
      "HIDE: If escape is impossible, hide out of the threat's view.",
      "Lock and barricade doors, silence your cell phone, and stay quiet.",
      "FIGHT: As a last resort, and only when your life is in imminent danger, attempt to disrupt/disable the threat.",
      "Call emergency services when safe to do so, providing location and descriptions."
    ],
    checklist: [
      { id: "at-alert", text: "Local emergency notification app active", checked: false },
      { id: "at-contacts", text: "Family emergency contact numbers memorized", checked: false },
      { id: "at-ice", text: "In-Case-of-Emergency medical card in wallet", checked: false }
    ]
  }
};

const SIMULATOR_SCENARIOS = {
  none: {
    title: "Normal Safety Operations",
    banner: "Status: Active Monitoring. No active community-wide threats detected.",
    severity: "low",
    heatmap: [],
    markers: [],
    alerts: [
      { id: "a1", type: "info", text: "Routine safety inspection scheduled for Connaught Place area.", time: "10 mins ago" },
      { id: "a2", type: "info", text: "NDMA Weather report: Monsoon showers within normal limits.", time: "1 hour ago" }
    ],
    botSystemPrompt: "You are the SafeLink AI crisis assistant. You provide friendly community safety tips and general guidelines."
  },
  flood: {
    title: "Yamuna River Flash Flood - Level Red",
    banner: "CRITICAL: Yamuna water level has crossed Danger Mark. Low-lying sectors evacuate immediately.",
    severity: "critical",
    heatmap: [
      {
        coordinates: [
          [28.64, 77.24],
          [28.64, 77.27],
          [28.61, 77.27],
          [28.61, 77.24]
        ],
        options: { color: "#FF4B4B", fillColor: "#FF4B4B", fillOpacity: 0.35, weight: 2, dashArray: "5, 5" }
      }
    ],
    markers: [
      { lat: 28.627, lng: 77.247, type: "hazard", title: "Severe Waterlogging at ITO Ring Road", desc: "Blocked with 3 feet of water. Avoid this route." },
      { lat: 28.598, lng: 77.268, type: "shelter", title: "DND Flyway High Ground Relief Camp", desc: "Open. Food packets, clean drinking water, and medical aid provided by NDRF." },
      { lat: 28.632, lng: 77.251, type: "rescue", title: "NDRF Boat Evacuation Station", desc: "Active rescue operations on Yamuna banks." }
    ],
    alerts: [
      { id: "flood-a1", type: "danger", text: "EVACUATION ORDER: All residents near Yamuna Khadar relocate to relief camps immediately.", time: "Just now" },
      { id: "flood-a2", type: "warning", text: "Old Yamuna Bridge (Loha Pul) closed to all vehicular and train traffic.", time: "5 mins ago" },
      { id: "flood-a3", type: "info", text: "DND Flyway Relief Camp is at 50% capacity. Additional dry food distribution started.", time: "15 mins ago" }
    ],
    botSystemPrompt: "You are SafeLink AI, operating in FLASH FLOOD CRISIS mode. Focus on Yamuna flood warnings, advising citizens to avoid waterlogged roads like ITO, guiding them to DND Flyway High Ground Relief Camp, and warning against waterborne diseases."
  },
  earthquake: {
    title: "6.8 Richter Scale Earthquake - Delhi NCR Fault Shift",
    banner: "CRITICAL ALERT: Severe tremors felt in Delhi-NCR. Aftershocks expected. Stand clear of old tall buildings.",
    severity: "critical",
    heatmap: [
      {
        coordinates: [
          [28.62, 77.20],
          [28.65, 77.20],
          [28.65, 77.23],
          [28.62, 77.23]
        ],
        options: { color: "#FFAA00", fillColor: "#FFAA00", fillOpacity: 0.3, weight: 2 }
      }
    ],
    markers: [
      { lat: 28.629, lng: 77.221, type: "hazard", title: "Masonry Collapse at Outer Connaught Circle", desc: "Debris blocking roadways. Civil Defense cordoning the area." },
      { lat: 28.567, lng: 77.210, type: "hospital", title: "AIIMS Emergency Trauma Centre", desc: "Operating with generators. Emergency triage zone active." },
      { lat: 28.636, lng: 77.232, type: "shelter", title: "Ramlila Maidan Open Assembly Ground", desc: "Safe open zone with medical tents and clean drinking water facilities." }
    ],
    alerts: [
      { id: "eq-a1", type: "danger", text: "AFTERSHOCK ALERT: Major aftershocks likely. Stay in open spaces. Do not enter high-rise buildings.", time: "Just now" },
      { id: "eq-a2", type: "warning", text: "Delhi Metro operations suspended temporarily for structural safety track inspection.", time: "8 mins ago" },
      { id: "eq-a3", type: "info", text: "NDRF and Delhi Disaster Management Authority (DDMA) teams deployed at Connaught Place.", time: "20 mins ago" }
    ],
    botSystemPrompt: "You are SafeLink AI, operating in EARTHQUAKE CRISIS mode. Advise on safety in congested Delhi streets, staying away from old structures, guiding injured to AIIMS Emergency Trauma Centre, and pointing survivors to Ramlila Maidan Open Assembly Ground."
  },
  blackout: {
    title: "Northern Grid Power Failure - Severe Summer Heatwave",
    banner: "ALERT: Major grid failure. Temperatures hitting 45°C. Conserve water. Locate Cooling Centers.",
    severity: "warning",
    heatmap: [
      {
        coordinates: [
          [28.55, 77.10],
          [28.66, 77.30]
        ],
        options: { color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.2, weight: 2, dashArray: "10, 10" }
      }
    ],
    markers: [
      { lat: 28.615, lng: 77.180, type: "shelter", title: "Sector 6 Cooling Camp (Gen-Set Active)", desc: "Air-cooled facility. Mobile charging, cold water, and heatstroke triage available." },
      { lat: 28.592, lng: 77.060, type: "police", title: "Dwarka Integrated Police Command", desc: "Operating on backup solar power. Police patrols active for neighborhood security." },
      { lat: 28.638, lng: 77.135, type: "hazard", title: "Substation Transformer Exploded", desc: "Fire department fighting electrical fire at Janakpuri grid." }
    ],
    alerts: [
      { id: "bo-a1", type: "warning", text: "Northern Grid failure confirmed. Outage affecting Delhi, Punjab, and Haryana. Restoration time unknown.", time: "Just now" },
      { id: "bo-a2", type: "warning", text: "IMD Red Heatwave warning: 45°C (113°F). Stay hydrated, avoid direct sun, recognize heatstroke signs.", time: "12 mins ago" },
      { id: "bo-a3", type: "info", text: "Water tanker distribution scheduled by Delhi Jal Board for affected sectors.", time: "30 mins ago" }
    ],
    botSystemPrompt: "You are SafeLink AI, operating in POWER GRID OUTAGE & HEATWAVE mode. Advise on hydration, staying indoors, recognizing heat exhaustion, guiding to solar-powered Sector 6 Cooling Camp, and warning against water wastage."
  }
};

const EMERGENCY_DIRECTORY = [
  { name: "National Emergency Number", number: "112", desc: "All-in-one emergency helpline" },
  { name: "Police Helpline", number: "100", desc: "Direct police dispatch desk" },
  { name: "Fire Services", number: "101", desc: "Delhi Fire Services dispatch" },
  { name: "Ambulance / MedicalCATS", number: "102", desc: "Government emergency medical ambulance transport" },
  { name: "Disaster Management Hotline (NDMA)", number: "1078", desc: "National Disaster Response control room" },
  { name: "AIIMS Poison Control Centre", number: "011-26593677", desc: "Emergency toxicological consultation" }
];

// Export to window object for access in standard client-side app
window.EMERGENCY_GUIDES = EMERGENCY_GUIDES;
window.SIMULATOR_SCENARIOS = SIMULATOR_SCENARIOS;
window.EMERGENCY_DIRECTORY = EMERGENCY_DIRECTORY;
