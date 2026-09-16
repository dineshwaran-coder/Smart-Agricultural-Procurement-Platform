/**
 * Smart Farmer Procurement Management System - Core Client JavaScript (app.js)
 */

// -------------------------------------------------------------
// GLOBAL STATE & MULTI-LANGUAGE TRANSLATION DICTIONARY
// -------------------------------------------------------------

const state = {
  currentUser: {
    id: "USR-101",
    name: "Murugan K.",
    phone: "9876543210",
    role: "farmer",
    village: "Panchanathikottai",
    district: "Thanjavur",
    language: "ta"
  },
  currentRole: "farmer",
  centers: [],
  crops: [],
  selectedCenter: null,
  selectedCrop: null,
  activeBookingToken: null,
  activeQueue: [],
  pollTimer: null
};

const i18n = {
  en: {
    brandMain: "SMART FARMER",
    brandSub: "PROCUREMENT MANAGEMENT SYSTEM",
    btnFarmerPortal: "Farmer Portal",
    btnOfficerDesk: "Officer Desk",
    btnAdminAnalytics: "Admin Analytics",
    btnPublicTV: "Public Queue TV",

    heroBadge: "Tamil Nadu Civil Supplies Corporation (TNCSC) DPC Portal",
    heroTitle: "Smart Agricultural Procurement Platform",
    heroSubtitle: "Zero-waiting slot booking, perishability priority queueing, and instant Direct Benefit Transfer (DBT) payments across 12 DPCs.",
    bookSlotBtn: "Book Procurement Slot",

    farmersServed: "Farmers Served Today",
    procuredVolume: "Total Crops Procured",
    totalPayments: "DBT Payments Disbursed",
    activeQueue: "Current Queue Length",

    smartBookingTitle: "Product-Based Smart Slot Booking",
    aiOptimizationBadge: "AI Optimization Active",
    selectCenterLabel: "1. Select Procurement Center",
    selectCropLabel: "2. Select Crop & Quantity",
    arrivalDateLabel: "Date of Arrival",
    quantityLabel: "Estimated Quantity (Quintals)",
    aiCrowdTitle: "Predicted Center Crowd & Wait Time",
    bookSlotSubmitBtn: "Book Slot & Generate Digital Token",

    confirmedTokenBadge: "CONFIRMED PROCUREMENT TOKEN",
    scanBarcodeText: "Scan at Procurement Counter",
    farmerNameLabel: "Farmer Name",
    cropQtyLabel: "Crop & Quantity",
    slotTimeLabel: "Time Slot Window",
    priorityStatusLabel: "Priority Status",
    printPassBtn: "Print Pass",
    queueTrackBtn: "Queue",
    workflowTrackBtn: "Workflow",

    queueMonitorTitle: "Real-Time Queue Monitor",
    currentlyServingLabel: "Currently Serving at Desk #1",
    queuePositionLabel: "Your Queue Position",
    estWaitLabel: "Est. Wait Time",
    priorityLineTitle: "Priority Sorted Line (Perishability First)",

    trackTitle: "Track Procurement",
    trackSubtitle: "Track weighment, quality check & DBT payment status.",
    listenBtn: "Listen",
    caseIdLabel: "CASE ID",
    cropLabel: "Crop",
    tokenLabel: "Token",
    centerLabel: "Find a Center",
    workflowHeader: "END-TO-END WORKFLOW",

    step1Title: "Scheduled",
    step1Desc: "Procurement slot booked & token issued",
    step2Title: "Arrived at Mandi",
    step2Desc: "Gate entry pass recorded",
    step3Title: "Farmer Verified",
    step3Desc: "Farmer Aadhaar, land record & quota verified",
    step4Title: "Quality Inspected",
    step4Desc: "Moisture %, foreign matter & weighbridge weight test",
    step5Title: "Crop Accepted",
    step5Desc: "Quality passed MSP standard specs",
    step6Title: "Procurement Completed",
    step6Desc: "Procurement receipt generated",
    step7Title: "DBT Payment Settled",
    step7Desc: "Direct Benefit Transfer credited to bank",

    statementsTitle: "My Procurement & Payment Statements",
    aadhaarDbtBadge: "Aadhaar Linked DBT",
    colToken: "Token No",
    colDate: "Date",
    colCrop: "Crop",
    colNetWeight: "Net Weight",
    colGrade: "Quality Grade",
    colAmount: "Amount (₹)",
    colStatus: "Status",
    colUtr: "Bank UTR Ref"
  },
  hi: {
    brandMain: "स्मार्ट किसान",
    brandSub: "फसल खरीद प्रबंधन प्रणाली",
    btnFarmerPortal: "किसान पोर्टल",
    btnOfficerDesk: "अधिकारी डेस्क",
    btnAdminAnalytics: "प्रशासनिक विश्लेषण",
    btnPublicTV: "सार्वजनिक कतार टीवी",

    heroBadge: "तमिलनाडु नागरिक आपूर्ति निगम (TNCSC) DPC पोर्टल",
    heroTitle: "स्मार्ट कृषि खरीद मंच",
    heroSubtitle: "बिना प्रतीक्षा स्लॉट बुकिंग, शीघ्र खराब होने वाली फसलों के लिए प्राथमिकता कतार, और 12 DPC केंद्रों पर तत्काल DBT भुगतान।",
    bookSlotBtn: "खरीद स्लॉट बुक करें",

    farmersServed: "आज सेवा प्राप्त किसान",
    procuredVolume: "कुल फसल खरीद",
    totalPayments: "वितरित डीबीटी भुगतान",
    activeQueue: "वर्तमान कतार की लंबाई",

    smartBookingTitle: "उत्पाद-आधारित स्मार्ट स्लॉट बुकिंग",
    aiOptimizationBadge: "एआई अनुकूलन सक्रिय",
    selectCenterLabel: "1. खरीद केंद्र चुनें",
    selectCropLabel: "2. फसल और मात्रा चुनें",
    arrivalDateLabel: "आगमन की तारीख",
    quantityLabel: "अनुमानित मात्रा (क्विंटल)",
    aiCrowdTitle: "पूर्वानुमानित केंद्र भीड़ और प्रतीक्षा समय",
    bookSlotSubmitBtn: "स्लॉट बुक करें और डिजिटल टोकन जेनरेट करें",

    confirmedTokenBadge: "पुष्ट खरीद टोकन",
    scanBarcodeText: "खरीद काउंटर पर स्कैन करें",
    farmerNameLabel: "किसान का नाम",
    cropQtyLabel: "फसल और मात्रा",
    slotTimeLabel: "समय स्लॉट विंडो",
    priorityStatusLabel: "प्राथमिकता स्थिति",
    printPassBtn: "पास प्रिंट करें",
    queueTrackBtn: "कतार",
    workflowTrackBtn: "वर्कफ़्लो",

    queueMonitorTitle: "वास्तविक समय कतार मॉनिटर",
    currentlyServingLabel: "वर्तमान में डेस्क #1 पर सेवारत",
    queuePositionLabel: "आपकी कतार स्थिति",
    estWaitLabel: "अनुमानित प्रतीक्षा समय",
    priorityLineTitle: "प्राथमिकता क्रमित रेखा (शीघ्र खराब होने वाली फसलें पहले)",

    trackTitle: "खरीद ट्रैकिंग प्रक्रिया",
    trackSubtitle: "वजन, गुणवत्ता जांच और डीबीटी भुगतान स्थिति को ट्रैक करें।",
    listenBtn: "सुनें (ऑडियो)",
    caseIdLabel: "केस आईडी",
    cropLabel: "फसल",
    tokenLabel: "टोकन नं.",
    centerLabel: "खरीद केंद्र",
    workflowHeader: "एंड-टू-एंड कार्यप्रवाह (WORKFLOW)",

    step1Title: "बुकिंग निर्धारित (Scheduled)",
    step1Desc: "खरीद स्लॉट बुक और टोकन जारी किया गया",
    step2Title: "मंडी / केंद्र में आगमन",
    step2Desc: "गेट एंट्री पास दर्ज किया गया",
    step3Title: "किसान सत्यापन (Verified)",
    step3Desc: "किसान आधार, भूमि रिकॉर्ड और कोटा सत्यापित",
    step4Title: "गुणवत्ता निरीक्षण",
    step4Desc: "नमी %, बाह्य पदार्थ और धर्मकांटा वजन परीक्षण",
    step5Title: "फसल स्वीकृत (Accepted)",
    step5Desc: "गुणवत्ता MSP मानक विशिष्टताओं पर खरी उतरी",
    step6Title: "खरीद पूर्ण (Completed)",
    step6Desc: "खरीद रसीद जेनरेट की गई",
    step7Title: "डीबीटी भुगतान चुकता (Settled)",
    step7Desc: "डायरेक्ट बेनिफिट ट्रांसफर बैंक खाते में जमा",

    statementsTitle: "मेरे खरीद और भुगतान विवरण",
    aadhaarDbtBadge: "आधार से जुड़ा डीबीटी",
    colToken: "टोकन नं.",
    colDate: "तारीख",
    colCrop: "फसल",
    colNetWeight: "शुद्ध वजन",
    colGrade: "गुणवत्ता ग्रेड",
    colAmount: "राशि (₹)",
    colStatus: "स्थिति",
    colUtr: "बैंक UTR संदर्भ"
  },
  te: {
    brandMain: "స్మార్ట్ రైతు",
    brandSub: "పంట కొనుగోలు నిర్వహణ వ్యవస్థ",
    btnFarmerPortal: "రైతు పోర్టల్",
    btnOfficerDesk: "అధికారి డెస్క్",
    btnAdminAnalytics: "అడ్మిన్ విశ్లేషణలు",
    btnPublicTV: "పబ్లిక్ క్యూ టీవీ",

    heroBadge: "తమిళనాడు పౌర సరఫరాల సంస్థ (TNCSC) DPC పోర్టల్",
    heroTitle: "స్మార్ట్ వ్యవసాయ కొనుగోలు వేదిక",
    heroSubtitle: "వేచి ఉండాల్సిన అవసరం లేని స్లాట్ బుకింగ్, త్వరగా పాడైపోయే పంటలకు ప్రాధాన్యత క్యూ, మరియు 12 DPC కేంద్రాలలో తక్షణ DBT చెల్లింపులు.",
    bookSlotBtn: "కొనుగోలు స్లాట్ బుక్ చేయండి",

    farmersServed: "ఈరోజు సేవలందించిన రైతులు",
    procuredVolume: "మొత్తం కొనుగోలు చేసిన పంటలు",
    totalPayments: "మంజూరు చేసిన DBT చెల్లింపులు",
    activeQueue: "ప్రస్తుత క్యూ నిడివి",

    smartBookingTitle: "ఉత్పత్తి ఆధారిత స్మార్ట్ స్లాట్ బుకింగ్",
    aiOptimizationBadge: "AI ఆప్టిమైజేషన్ యాక్టివ్",
    selectCenterLabel: "1. కొనుగోలు కేంద్రాన్ని ఎంచుకోండి",
    selectCropLabel: "2. పంట మరియు పరిమాణాన్ని ఎంచుకోండి",
    arrivalDateLabel: "వచ్చిన తేదీ",
    quantityLabel: "అంచనా పరిమాణం (క్వింటాళ్లు)",
    aiCrowdTitle: "అంచనా వేసిన కేంద్రం రద్దీ మరియు నిరీక్షణ సమయం",
    bookSlotSubmitBtn: "స్లాట్ బుక్ చేసి డిజిటల్ టోకెన్ పొందండి",

    confirmedTokenBadge: "ధృవీకరించబడిన కొనుగోలు టోకెన్",
    scanBarcodeText: "కొనుగోలు కౌంటర్ వద్ద స్కాన్ చేయండి",
    farmerNameLabel: "రైతు పేరు",
    cropQtyLabel: "పంట & పరిమాణం",
    slotTimeLabel: "సమయం స్లాట్ విండో",
    priorityStatusLabel: "ప్రాధాన్యత స్థితి",
    printPassBtn: "పాస్ ప్రింట్ చేయండి",
    queueTrackBtn: "క్యూ",
    workflowTrackBtn: "వర్క్‌ఫ్లో",

    queueMonitorTitle: "రియల్ టైమ్ క్యూ మానిటర్",
    currentlyServingLabel: "ప్రస్తుతం డెస్క్ #1 వద్ద సేవలు అందిస్తున్నారు",
    queuePositionLabel: "మీ క్యూ స్థానం",
    estWaitLabel: "అంచనా వేసిన నిరీక్షణ సమయం",
    priorityLineTitle: "ప్రాధాన్యత ఆధారిత క్యూ (పాడైపోయే పంటలు మొదట)",

    trackTitle: "కొనుగోలు ట్రాకింగ్ ప్రక్రియ",
    trackSubtitle: "తూకం, నాణ్యత తనిఖీ మరియు DBT చెల్లింపు స్థితిని ట్రాక్ చేయండి.",
    listenBtn: "వినండి (ఆడియో)",
    caseIdLabel: "కేస్ ID",
    cropLabel: "పంట",
    tokenLabel: "టోకెన్ నంబర్",
    centerLabel: "కొనుగోలు కేంద్రం",
    workflowHeader: "ఎండ్-టు-ఎండ్ వర్క్‌ఫ్లో (WORKFLOW)",

    step1Title: "షెడ్యూల్ చేయబడింది (Scheduled)",
    step1Desc: "కొనుగోలు స్లాట్ బుక్ చేయబడింది & టోకెన్ జారీ చేయబడింది",
    step2Title: "మండి / కేంద్రానికి చేరుకున్నారు",
    step2Desc: "గేట్ ఎంట్రీ పాస్ నమోదైంది",
    step3Title: "రైతు ధృవీకరణ పూర్తయింది",
    step3Desc: "రైతు ఆధార్, భూమి రికార్డు & కోటా ధృవీకరించబడింది",
    step4Title: "నాణ్యత తనిఖీ",
    step4Desc: "తేమ %, విదేశీ పదార్థం & తూకం పరీక్ష",
    step5Title: "పంట ఆమోదించబడింది (Accepted)",
    step5Desc: "నాణ్యత MSP ప్రమాణాలకు అనుగుణంగా ఉంది",
    step6Title: "కొనుగోలు పూర్తయింది (Completed)",
    step6Desc: "కొనుగోలు రసీదు రూపొందించబడింది",
    step7Title: "DBT చెల్లింపు జమ (Settled)",
    step7Desc: "డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ బ్యాంకు ఖాతాలో జమ",

    statementsTitle: "నా కొనుగోలు మరియు చెల్లింపు నివేదికలు",
    aadhaarDbtBadge: "ఆధార్ లింక్డ్ DBT",
    colToken: "టోకెన్ నం",
    colDate: "తేదీ",
    colCrop: "పంట",
    colNetWeight: "నికర బరువు",
    colGrade: "నాణ్యత గ్రేడ్",
    colAmount: "మొత్తం (₹)",
    colStatus: "స్థితి",
    colUtr: "బ్యాంకు UTR రిఫరెన్స్"
  },
  ta: {
    brandMain: "ஸ்மார்ட் உழவர்",
    brandSub: "பயிர்கள் கொள்முதல் மேலாண்மை தளம்",
    btnFarmerPortal: "விவசாயி தளம்",
    btnOfficerDesk: "அதிகாரி மேஜை",
    btnAdminAnalytics: "நிர்வாக பகுப்பாய்வு",
    btnPublicTV: "பொது வரிசை டிவி",

    heroBadge: "தமிழ்நாடு நுகர்பொருள் வாணிபக் கழகம் (TNCSC) DPC தளம்",
    heroTitle: "ஸ்மார்ட் விவசாயிகள் கொள்முதல் தளம்",
    heroSubtitle: "காத்திருப்பு இல்லாத ஸ்லாட் முன்பதிவு, அழுகக்கூடிய பயிர்களுக்கு முன்னுரிமை வரிசை, மற்றும் 12 DPC மையங்களில் உடனடி DBT பணம் செலுத்தல்.",
    bookSlotBtn: "கொள்முதல் ஸ்லாட் முன்பதிவு செய்",

    farmersServed: "இன்று பயனடைந்த விவசாயிகள்",
    procuredVolume: "மொத்த கொள்முதல் அளவு",
    totalPayments: "வழங்கப்பட்ட DBT தொகை",
    activeQueue: "தற்போதைய வரிசை நீளம்",

    smartBookingTitle: "பயிர் சார்ந்த ஸ்மார்ட் ஸ்லாட் முன்பதிவு",
    aiOptimizationBadge: "செயற்கை நுண்ணறிவு (AI) செயலில்",
    selectCenterLabel: "1. கொள்முதல் மையத்தை தேர்ந்தெடுக்கவும்",
    selectCropLabel: "2. பயிர் மற்றும் அளவை தேர்ந்தெடுக்கவும்",
    arrivalDateLabel: "வருகை தரும் தேதி",
    quantityLabel: "மதிப்பிடப்பட்ட அளவு (குவிண்டால்)",
    aiCrowdTitle: "கணிக்கப்பட்ட கூட்ட நெரிசல் & காத்திருப்பு நேரம்",
    bookSlotSubmitBtn: "ஸ்லாட் முன்பதிவு செய்து டிஜிட்டல் டோக்கன் பெறுக",

    confirmedTokenBadge: "உறுதி செய்யப்பட்ட கொள்முதல் டோக்கன்",
    scanBarcodeText: "கொள்முதல் கவுண்டரில் ஸ்கேன் செய்யவும்",
    farmerNameLabel: "விவசாயி பெயர்",
    cropQtyLabel: "பயிர் & அளவு",
    slotTimeLabel: "நேர ஸ்லாட் சாளரம்",
    priorityStatusLabel: "முன்னுரிமை நிலை",
    printPassBtn: "சீட்டை அச்சிடுக",
    queueTrackBtn: "வரிசை",
    workflowTrackBtn: "செயல்முறை",

    queueMonitorTitle: "நேரலை வரிசை கண்காணிப்பு",
    currentlyServingLabel: "தற்போது கவுண்டர் #1 ல் அழைக்கப்படுபவர்",
    queuePositionLabel: "உங்கள் வரிசை எண்",
    estWaitLabel: "காத்திருப்பு நேரம்",
    priorityLineTitle: "முன்னுரிமை வரிசை (அழுகக்கூடிய பயிர்கள் முதலில்)",

    trackTitle: "கொள்முதல் கண்காணிப்பு செயல்முறை",
    trackSubtitle: "எடை, தர பரிசோதனை மற்றும் DBT பண நிலை நேரலையில்.",
    listenBtn: "கேளுங்கள் (ஆடியோ)",
    caseIdLabel: "வழக்கு எண் (CASE ID)",
    cropLabel: "பயிர்",
    tokenLabel: "டோக்கன் எண்",
    centerLabel: "கொள்முதல் மையம்",
    workflowHeader: "முழுமையான செயல்முறை (END-TO-END WORKFLOW)",

    step1Title: "முன்பதிவு செய்யப்பட்டது (Scheduled)",
    step1Desc: "கொள்முதல் ஸ்லாட் முன்பதிவு மற்றும் டோக்கன் வழங்கப்பட்டது",
    step2Title: "கொள்முதல் மையம் வருகை",
    step2Desc: "நுழைவுச்சீட்டு பதிவு செய்யப்பட்டது",
    step3Title: "விவசாயி சான்றிதழ் சரிபார்ப்பு",
    step3Desc: "ஆதார், நில ஆவணம் மற்றும் ஒதுக்கீடு சரிபார்க்கப்பட்டது",
    step4Title: "தர பரிசோதனை",
    step4Desc: "ஈரப்பதம் %, பிற பொருட்கள் & எடை மேடை பரிசோதனை",
    step5Title: "பயிர் ஏற்றுக்கொள்ளப்பட்டது (Accepted)",
    step5Desc: "தரம் குறைந்தபட்ச ஆதரவு விலை (MSP) தரநிலையை எட்டியது",
    step6Title: "கொள்முதல் நிறைவுற்றது (Completed)",
    step6Desc: "கொள்முதல் ரசீது உருவாக்கப்பட்டது",
    step7Title: "DBT பணம் கணக்கில் செலுத்தப்பட்டது",
    step7Desc: "நேரடி பயனடைவு தொகை வங்கி கணக்கில் வரவு வைக்கப்பட்டது",

    statementsTitle: "எனது கொள்முதல் மற்றும் பணப்பரிவர்த்தனை அறிக்கைகள்",
    aadhaarDbtBadge: "ஆதார் இணைக்கப்பட்ட DBT",
    colToken: "டோக்கன் எண்",
    colDate: "தேதி",
    colCrop: "பயிர்",
    colNetWeight: "நிகர எடை",
    colGrade: "தர வகை",
    colAmount: "தொகை (₹)",
    colStatus: "நிலை",
    colUtr: "வங்கி UTR எண்"
  }
};

// -------------------------------------------------------------
// INITIALIZATION & DOM LOAD
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Smart Farmer System initializing...");
  
  // Set default booking date to today and restrict past dates
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  await fetchGovtRealTimeData();
  await loadMasterData();
  await loadDashboardMetrics();
  await loadFarmerPayments();
  updateTrackWorkflowUI();
  updateRoleButtonsVisibility();

  // Start Real-Time Queue Polling (Every 3 seconds)
  startQueuePolling();
});

// Fetch Official Live Government Agmarknet & MSP Data
async function fetchGovtRealTimeData() {
  try {
    const res = await fetch('/api/gov/realtime-data').then(r => r.json());
    if (res.success && res.tickerItems) {
      const ticker = document.getElementById('govTickerText');
      if (ticker) ticker.textContent = res.tickerItems.join(' • ');
    }
  } catch (err) {
    console.error("Failed to fetch live govt realtime data:", err);
  }
}

// 15-Second Polling for Official Govt Real-Time Feed
setInterval(fetchGovtRealTimeData, 15000);

// Load Centers & Crops from API
async function loadMasterData() {
  try {
    const [centersRes, cropsRes] = await Promise.all([
      fetch('/api/centers').then(r => r.json()),
      fetch('/api/crops').then(r => r.json())
    ]);

    if (centersRes.success) {
      state.centers = centersRes.centers;
      populateCentersDropdown();
    }

    if (cropsRes.success) {
      state.crops = cropsRes.crops;
      populateCropsDropdown();
    }

    // Initial Trigger
    onCenterChange();
    onCropChange();

  } catch (err) {
    console.error("Failed to load master data:", err);
  }
}

// Populate Centers Dropdown
function populateCentersDropdown() {
  const select = document.getElementById('selectCenter');
  if (!select) return;

  select.innerHTML = state.centers.map(c => `
    <option value="${c.id}">${c.name} (${c.district}) - Tier: ${c.tier} (${c.capacityPerDay} Farmers/Day)</option>
  `).join('');
}

// Populate Crops Dropdown
function populateCropsDropdown() {
  const select = document.getElementById('selectCrop');
  if (!select) return;

  select.innerHTML = state.crops.map(c => `
    <option value="${c.id}">${c.name} [${c.priorityLevel}] - Dedicated Window: ${c.slotWindow}</option>
  `).join('');
}

// Center Selection Event Handler
function onCenterChange() {
  const centerId = document.getElementById('selectCenter').value;
  state.selectedCenter = state.centers.find(c => c.id === centerId) || state.centers[0];

  const infoLabel = document.getElementById('centerCapacityInfo');
  if (infoLabel && state.selectedCenter) {
    infoLabel.innerHTML = `<strong>${state.selectedCenter.tier} Tier Center</strong> (${state.selectedCenter.capacityPerDay} Farmers/Day Limit benchmark)`;
  }

  fetchAIRecommendation();
  fetchQueueStatus();
}

// Crop Selection Event Handler
function onCropChange() {
  const cropId = document.getElementById('selectCrop').value;
  state.selectedCrop = state.crops.find(c => c.id === cropId) || state.crops[0];

  const banner = document.getElementById('cropPerishabilityBanner');
  const badge = document.getElementById('badgePerishability');
  const textWindow = document.getElementById('textCropWindow');
  const textMSP = document.getElementById('textCropMSP');
  const textNote = document.getElementById('textPerishabilityNote');

  // Dynamic Crop Showcase Image & Caption Elements
  const cropShowcaseImg = document.getElementById('cropShowcaseImg');
  const cropShowcaseText = document.getElementById('cropShowcaseText');

  if (!state.selectedCrop) return;

  const lang = state.currentUser.language || 'en';

  const windowLabels = {
    ta: `சிறப்பு ஸ்லாட் நேரம்: ${state.selectedCrop.slotWindow}`,
    hi: `समर्पित स्लॉट समय: ${state.selectedCrop.slotWindow}`,
    te: `కేటాయించిన స్లాట్ సమయం: ${state.selectedCrop.slotWindow}`,
    en: `Dedicated Slot Window: ${state.selectedCrop.slotWindow}`
  };

  const mspLabels = {
    ta: `ஆதரவு விலை: ₹${state.selectedCrop.mspPerQuintal.toLocaleString('en-IN')}/குவிண்டால்`,
    hi: `एमएसपी: ₹${state.selectedCrop.mspPerQuintal.toLocaleString('en-IN')}/क्विंटल`,
    te: `MSP: ₹${state.selectedCrop.mspPerQuintal.toLocaleString('en-IN')}/క్వింటాల్`,
    en: `MSP: ₹${state.selectedCrop.mspPerQuintal.toLocaleString('en-IN')}/Quintal`
  };

  textWindow.textContent = windowLabels[lang] || windowLabels.en;
  textMSP.textContent = mspLabels[lang] || mspLabels.en;

  // Map crop ID to dedicated high-resolution imagery and language captions
  const cropImages = {
    'CRP-01': { 
      img: 'images/crop_tomato.jpg', 
      captions: {
        ta: 'புதிய தக்காளி அறுவடை | காலை நேர ஸ்லாட் (08:00 AM - 10:00 AM)',
        hi: 'ताज़ा टमाटर की फसल | सुबह का स्लॉट समय (08:00 AM - 10:00 AM)',
        te: 'తాజా టమాటో పంట | ఉదయం స్లాట్ సమయం (08:00 AM - 10:00 AM)',
        en: 'Fresh Tomato Harvest | Dedicated Morning Slot Window (08:00 AM - 10:00 AM)'
      }
    },
    'CRP-02': { 
      img: 'images/crop_onion.jpg', 
      captions: {
        ta: 'வெங்காயம் & பூண்டு அறுவடை | காலை இடைவேளை ஸ்லாட் (10:00 AM - 12:00 PM)',
        hi: 'लाल प्याज और लहसुन | पूर्वाहन स्लॉट समय (10:00 AM - 12:00 PM)',
        te: 'ఉల్లిపాయ & వెల్లుల్లి పంట | మిడ్-మార్నింగ్ స్లాట్ (10:00 AM - 12:00 PM)',
        en: 'Red Onion & Garlic Harvest | Mid-Morning Slot Window (10:00 AM - 12:00 PM)'
      }
    },
    'CRP-03': { 
      img: 'images/crop_paddy.jpg', 
      captions: {
        ta: 'சம்பா நெல் அறுவடை | மதிய நேர ஸ்லாட் (01:00 PM - 04:00 PM)',
        hi: 'सांबा धान की फसल | दोपहर स्लॉट समय (01:00 PM - 04:00 PM)',
        te: 'సాంబ వరి పంట | మధ్యాహ్నం స్లాట్ (01:00 PM - 04:00 PM)',
        en: 'Samba Paddy Grain Harvest | Afternoon Slot Window (01:00 PM - 04:00 PM)'
      }
    },
    'CRP-04': { 
      img: 'images/crop_wheat.jpg', 
      captions: {
        ta: 'கோதுமை தானிய அறுவடை | மதிய நேர ஸ்லாட் (01:00 PM - 04:00 PM)',
        hi: 'सुनहरा गेहूं अनाज | दोपहर स्लॉट समय (01:00 PM - 04:00 PM)',
        te: 'గోధుమ ధాన్యం పంట | మధ్యాహ్నం స్లాట్ (01:00 PM - 04:00 PM)',
        en: 'Golden Wheat Grain Harvest | Afternoon Slot Window (01:00 PM - 04:00 PM)'
      }
    },
    'CRP-05': { 
      img: 'images/crop_cotton.jpg', 
      captions: {
        ta: 'பருத்தி அறுவடை | மாலை நேர ஸ்லாட் (04:00 PM - 06:00 PM)',
        hi: 'व्यावसायिक कपास | शाम स्लॉट समय (04:00 PM - 06:00 PM)',
        te: 'వాణిజ్య పత్తి పంట | సాయంత్రం స్లాట్ (04:00 PM - 06:00 PM)',
        en: 'Commercial Cotton Fiber Harvest | Evening Slot Window (04:00 PM - 06:00 PM)'
      }
    }
  };

  const cropData = cropImages[state.selectedCrop.id] || { img: 'images/crops.jpg', captions: { en: 'Inspected Crop Harvest' } };
  
  if (cropShowcaseImg) {
    cropShowcaseImg.src = cropData.img;
  }
  if (cropShowcaseText) {
    const captionText = cropData.captions[lang] || cropData.captions.en;
    cropShowcaseText.innerHTML = `<i class="fa-solid fa-award text-warning me-1"></i> ${captionText}`;
  }

  if (state.selectedCrop.perishability === 'High') {
    banner.style.background = '#fee2e2';
    banner.style.borderColor = '#fca5a5';
    badge.className = 'badge-perishable-high';

    const highBadges = {
      ta: `<i class="fa-solid fa-fire"></i> அதிக முன்னுரிமை (அழுகும் பயிர்)`,
      hi: `<i class="fa-solid fa-fire"></i> उच्च प्राथमिकता (शीघ्र खराब होने वाली)`,
      te: `<i class="fa-solid fa-fire"></i> అధిక ప్రాధాన్యత`,
      en: `<i class="fa-solid fa-fire"></i> High Perishability Priority`
    };
    const highNotes = {
      ta: `<i class="fa-solid fa-shield-halved me-1 text-danger"></i> பயிர் சேதமடைவதை தடுக்க வரிசையில் முதன்மை முன்னுரிமை அளிக்கப்படுகிறது.`,
      hi: `<i class="fa-solid fa-shield-halved me-1 text-danger"></i> फसल की खराबी को रोकने के लिए कतार में उच्च प्राथमिकता दी गई है।`,
      te: `<i class="fa-solid fa-shield-halved me-1 text-danger"></i> పంట పాడవకుండా నిరోధించడానికి క్యూలో అధిక ప్రాధాన్యత ఇవ్వబడింది.`,
      en: `<i class="fa-solid fa-shield-halved me-1 text-danger"></i> High priority queue assignment to reduce spoilage & farmer financial loss.`
    };

    badge.innerHTML = highBadges[lang] || highBadges.en;
    textNote.innerHTML = highNotes[lang] || highNotes.en;
  } else if (state.selectedCrop.perishability === 'Medium') {
    banner.style.background = '#fef3c7';
    banner.style.borderColor = '#fde047';
    badge.className = 'badge-perishable-medium';

    const medBadges = {
      ta: `<i class="fa-solid fa-triangle-exclamation"></i> நடுத்தர முன்னுரிமை`,
      hi: `<i class="fa-solid fa-triangle-exclamation"></i> मध्यम प्राथमिकता`,
      te: `<i class="fa-solid fa-triangle-exclamation"></i> మధ్యస్థ ప్రాధాన్యత`,
      en: `<i class="fa-solid fa-triangle-exclamation"></i> Medium Perishability`
    };
    const medNotes = {
      ta: `<i class="fa-solid fa-clock me-1 text-warning"></i> தானியங்கள் கையாளுவதற்கு முன் மிதமான முன்னுரிமை வழங்கப்படுகிறது.`,
      hi: `<i class="fa-solid fa-clock me-1 text-warning"></i> अनाज संभालने से पहले मध्यम प्राथमिकता स्लॉट विंडो आवंटित।`,
      te: `<i class="fa-solid fa-clock me-1 text-warning"></i> ధాన్యం హ్యాండ్లింగ్‌కు ముందు మధ్యస్థ ప్రాధాన్యత స్లాట్ కేటాయించబడింది.`,
      en: `<i class="fa-solid fa-clock me-1 text-warning"></i> Moderate priority slot window allocated before grain handling.`
    };

    badge.innerHTML = medBadges[lang] || medBadges.en;
    textNote.innerHTML = medNotes[lang] || medNotes.en;
  } else {
    banner.style.background = '#dcfce7';
    banner.style.borderColor = '#86efac';
    badge.className = 'badge-perishable-normal';

    const normBadges = {
      ta: `<i class="fa-solid fa-seedling"></i> சாதாரண முன்னுரிமை`,
      hi: `<i class="fa-solid fa-seedling"></i> सामान्य प्राथमिकता`,
      te: `<i class="fa-solid fa-seedling"></i> సాధారణ ప్రాధాన్యత`,
      en: `<i class="fa-solid fa-seedling"></i> Normal Priority`
    };
    const normNotes = {
      ta: `<i class="fa-solid fa-box me-1 text-success"></i> நிலையான சேமிப்புக்கான ஸ்லாட் ஒதுக்கப்பட்டுள்ளது.`,
      hi: `<i class="fa-solid fa-box me-1 text-success"></i> मानक अनाज भंडारण स्लॉट विंडो आवंटित।`,
      te: `<i class="fa-solid fa-box me-1 text-success"></i> ప్రామాణిక ధాన్యం నిల్వ స్లాట్ కేటాయించబడింది.`,
      en: `<i class="fa-solid fa-box me-1 text-success"></i> Standard grain storage slot window allocated.`
    };

    badge.innerHTML = normBadges[lang] || normBadges.en;
    textNote.innerHTML = normNotes[lang] || normNotes.en;
  }

  fetchAIRecommendation();
}

// -------------------------------------------------------------
// AI CROWD PREDICTION & SMART RECOMMENDATION
// -------------------------------------------------------------

async function fetchAIRecommendation() {
  const centerId = document.getElementById('selectCenter').value;
  const cropId = document.getElementById('selectCrop').value;
  const date = document.getElementById('bookingDate').value;

  if (!centerId || !cropId) return;

  try {
    const res = await fetch('/api/slots/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ centerId, cropId, date })
    }).then(r => r.json());

    if (res.success && res.recommendation) {
      const rec = res.recommendation;

      const meterFill = document.getElementById('crowdMeterFill');
      const utilPct = document.getElementById('crowdUtilPct');
      const waitTime = document.getElementById('crowdWaitTime');
      const badge = document.getElementById('crowdIndexBadge');
      const textSugg = document.getElementById('aiSmartSuggestionText');

      if (utilPct) utilPct.textContent = `${rec.capacityUtilizationPct}%`;
      if (waitTime) waitTime.textContent = `~${rec.estimatedWaitTimeMins} Mins`;

      if (meterFill) {
        meterFill.style.width = `${Math.min(100, rec.capacityUtilizationPct)}%`;
        if (rec.crowdLevel === 'High') meterFill.className = 'crowd-meter-fill fill-red';
        else if (rec.crowdLevel === 'Moderate') meterFill.className = 'crowd-meter-fill fill-amber';
        else meterFill.className = 'crowd-meter-fill fill-green';
      }

      if (badge) {
        badge.textContent = rec.crowdLevel + " Flow";
        badge.className = rec.crowdLevel === 'High' ? 'badge bg-danger' : (rec.crowdLevel === 'Moderate' ? 'badge bg-warning text-dark' : 'badge bg-success');
      }

      if (textSugg) {
        textSugg.innerHTML = `<strong>AI Smart Suggestion:</strong> Assigned window <strong>${rec.assignedWindow}</strong> has ${rec.crowdLevel.toLowerCase()} crowd density. Recommended for ${rec.cropName}.`;
      }
    }
  } catch (err) {
    console.error("Failed to fetch AI recommendation:", err);
  }
}

// -------------------------------------------------------------
// SLOT BOOKING & DIGITAL TOKEN GENERATION
// -------------------------------------------------------------

async function handleSlotBooking(e) {
  e.preventDefault();

  const centerId = document.getElementById('selectCenter').value;
  const cropId = document.getElementById('selectCrop').value;
  const date = document.getElementById('bookingDate').value;
  const estimatedQuantity = document.getElementById('estimatedQuantity').value;

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerId: state.currentUser.id,
        centerId,
        cropId,
        date,
        estimatedQuantity
      })
    }).then(r => r.json());

    if (!res.success) {
      alert("Booking Error: " + res.message);
      return;
    }

    state.activeBookingToken = res.booking;

    // Render Digital Token Pass Card
    renderDigitalTokenPass(res.booking);

    // Refresh Queue & Metrics
    await fetchQueueStatus();
    await loadDashboardMetrics();

    alert(`Slot Booked Successfully!\nDigital Token ${res.booking.tokenNo} Generated.\nSMS sent to ${state.currentUser.phone}`);

  } catch (err) {
    console.error("Error booking slot:", err);
    alert("System connection error while booking slot.");
  }
}

// Render Digital Token Pass with QRCode.js
function renderDigitalTokenPass(booking) {
  document.getElementById('passTokenNo').textContent = booking.tokenNo;
  document.getElementById('passCenterName').textContent = booking.centerName;
  document.getElementById('passFarmerName').textContent = booking.farmerName;
  document.getElementById('passCropInfo').textContent = `${booking.cropName} (${booking.estimatedQuantity} Quintals)`;
  document.getElementById('passSlotTime').textContent = booking.slotTime;

  const priorityBadge = document.getElementById('passPriorityBadge');
  if (booking.perishability === 'High') {
    priorityBadge.className = 'badge-perishable-high';
    priorityBadge.innerHTML = `<i class="fa-solid fa-fire me-1"></i> High Priority (Score: ${booking.priorityScore})`;
  } else if (booking.perishability === 'Medium') {
    priorityBadge.className = 'badge-perishable-medium';
    priorityBadge.innerHTML = `<i class="fa-solid fa-clock me-1"></i> Medium Priority (Score: ${booking.priorityScore})`;
  } else {
    priorityBadge.className = 'badge-perishable-normal';
    priorityBadge.innerHTML = `<i class="fa-solid fa-seedling me-1"></i> Normal Priority (Score: ${booking.priorityScore})`;
  }

  // Generate QR Code
  const qrContainer = document.getElementById('qrcodeContainer');
  if (qrContainer) {
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
      text: booking.qrCodeData || booking.tokenNo,
      width: 110,
      height: 110,
      colorDark: "#1b4332",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // Sync Track Procurement Stepper UI
  updateTrackWorkflowUI(booking);

  // Smooth Scroll to Token
  document.getElementById('digitalTokenPass').scrollIntoView({ behavior: 'smooth' });
}

// -------------------------------------------------------------
// REAL-TIME QUEUE MONITORING & POLLING
// -------------------------------------------------------------

function startQueuePolling() {
  if (state.pollTimer) clearInterval(state.pollTimer);
  state.pollTimer = setInterval(fetchQueueStatus, 3000); // 3 seconds interval
}

async function fetchQueueStatus() {
  const centerId = state.selectedCenter ? state.selectedCenter.id : 'CTR-01';

  try {
    const res = await fetch(`/api/queue/status?centerId=${centerId}`).then(r => r.json());

    if (res.success) {
      state.activeQueue = res.activeQueue;

      // Update Currently Serving Display
      const servingToken = res.currentlyServing;
      const servingEl = document.getElementById('currentlyServingToken');
      const servingDetails = document.getElementById('currentlyServingDetails');

      if (servingToken) {
        servingEl.textContent = servingToken.tokenNo;
        servingDetails.textContent = `${servingToken.farmerName} - ${servingToken.cropName} (${servingToken.perishability} Priority)`;
      } else {
        servingEl.textContent = "Counter Idle";
        servingDetails.textContent = "Waiting for next farmer call...";
      }

      // Update Logged-in Farmer's Personal Position & Wait Time
      let myTokenNo = state.activeBookingToken ? state.activeBookingToken.tokenNo : null;
      let userInQueue = null;

      // Fallback to finding latest booking in active queue for current user
      if (!myTokenNo) {
        userInQueue = res.activeQueue.find(b => b.farmerId === state.currentUser.id);
        if (userInQueue) myTokenNo = userInQueue.tokenNo;
      } else {
        userInQueue = res.activeQueue.find(b => b.tokenNo === myTokenNo);
      }

      const myIndex = myTokenNo ? res.activeQueue.findIndex(b => b.tokenNo === myTokenNo) : -1;

      const posEl = document.getElementById('userQueuePosition');
      const waitEl = document.getElementById('userWaitTime');

      if (myIndex >= 0) {
        posEl.textContent = `#${myIndex + 1}`;
        waitEl.textContent = `${(myIndex + 1) * 12} Mins`;
      } else if (myTokenNo) {
        posEl.textContent = "Completed";
        waitEl.textContent = "0 Mins";
      } else {
        posEl.textContent = "No Booking";
        waitEl.textContent = "--";
      }

      // Render Queue Timeline List
      renderQueueTimeline(res.activeQueue);

      // Keep Track Stepper updated with latest booking state
      if (userInQueue) {
        updateTrackWorkflowUI(userInQueue);
      } else if (state.activeBookingToken) {
        updateTrackWorkflowUI(state.activeBookingToken);
      }

      // Sync Officer & TV Views if active
      if (window.renderOfficerQueueList) window.renderOfficerQueueList(res.activeQueue, servingToken);
      if (window.renderTVQueueDisplay) window.renderTVQueueDisplay(res.activeQueue, servingToken);
    }
  } catch (err) {
    console.error("Queue status polling failed:", err);
  }
}

// Render Queue Timeline List
function renderQueueTimeline(queue) {
  const container = document.getElementById('queueTimelineList');
  if (!container) return;

  if (queue.length === 0) {
    container.innerHTML = `<p class="text-muted small text-center my-3">No active tokens in queue.</p>`;
    return;
  }

  container.innerHTML = queue.map((item, idx) => `
    <div class="queue-timeline-item ${item.status === 'Processing' ? 'active-serving' : (item.perishability === 'High' ? 'high-priority' : '')}">
      <div>
        <strong class="d-block text-dark" style="font-size: 0.95rem;">${item.tokenNo} (${item.farmerName})</strong>
        <small class="text-muted">${item.cropName} • ${item.estimatedQuantity} Q</small>
      </div>
      <div class="text-end">
        <span class="badge ${item.status === 'Processing' ? 'bg-success' : 'bg-secondary'} mb-1">${item.status}</span>
        <small class="d-block text-danger fw-bold" style="font-size: 0.75rem;">Priority Score: ${item.priorityScore}</small>
      </div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// DASHBOARD METRICS & PAYMENTS
// -------------------------------------------------------------

async function loadDashboardMetrics() {
  try {
    const res = await fetch('/api/analytics/dashboard').then(r => r.json());
    if (res.success && res.metrics) {
      const m = res.metrics;
      document.getElementById('statFarmersServed').textContent = m.totalFarmersServed;
      document.getElementById('statProcuredVolume').textContent = `${m.totalVolumeQuintals.toLocaleString()} Q`;
      document.getElementById('statTotalPayments').textContent = `₹${(m.totalDisbursedAmt / 100000).toFixed(1)} L`;
      document.getElementById('statActiveQueue').textContent = `${m.activeQueueLength} Active`;
    }
  } catch (err) {
    console.error("Failed to load metrics:", err);
  }
}

async function loadFarmerPayments() {
  try {
    const res = await fetch(`/api/payments/history?farmerId=${state.currentUser.id}`).then(r => r.json());
    if (res.payments) {
      state.paymentHistory = res.payments;
    }
    const table = document.getElementById('farmerPaymentsTableBody');
    if (!table) return;

    if (!res.payments || res.payments.length === 0) {
      table.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-3">No payment records found.</td></tr>`;
      return;
    }

    table.innerHTML = res.payments.map(p => `
      <tr>
        <td class="fw-bold text-primary">${p.tokenNo}</td>
        <td>${new Date(p.disbursedAt).toLocaleDateString()}</td>
        <td><span class="badge bg-light text-dark border">Paddy (Samba)</span></td>
        <td>20.0 Q</td>
        <td><span class="badge bg-success">Grade A</span></td>
        <td class="fw-bold text-success">₹${p.amount.toLocaleString('en-IN')}</td>
        <td><span class="badge bg-success"><i class="fa-solid fa-check me-1"></i> ${p.status}</span></td>
        <td><code class="text-dark">${p.utrNumber}</code></td>
        <td>
          <button class="btn btn-outline-success btn-sm rounded-pill fw-bold" onclick="openOfficialCertificateModal('${p.tokenNo}')">
            <i class="fa-solid fa-award me-1"></i> Receipt
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error("Failed to load farmer payments:", err);
  }
}

async function loadSMSNotifications() {
  try {
    const res = await fetch(`/api/notifications/my?phone=${state.currentUser.phone}`).then(r => r.json());
    const container = document.getElementById('smsLogContainer');
    if (!container) return;

    if (!res.smsLogs || res.smsLogs.length === 0) {
      container.innerHTML = `<p class="text-muted text-center py-3">No SMS alerts received yet.</p>`;
      return;
    }

    container.innerHTML = res.smsLogs.map(s => `
      <div class="p-3 bg-light rounded-3 border mb-2">
        <div class="d-flex justify-content-between small text-muted mb-1">
          <span><i class="fa-solid fa-mobile-screen text-success me-1"></i> SMS Alert</span>
          <span>${new Date(s.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p class="mb-0 fw-semibold text-dark fs-7">${s.message}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error("Failed to load SMS logs:", err);
  }
}

// -------------------------------------------------------------
// ROLE SWITCHER & NAVIGATION
// -------------------------------------------------------------

function switchRole(role) {
  const currentUserRole = state.currentUser?.role || 'farmer';

  // Strict Role-Based Access Security Checks
  if (role === 'officer' && currentUserRole === 'farmer') {
    alert("🔒 Access Restricted: Officer Desk is restricted to authorized DPC Procurement Officers. Please log in with Officer credentials.");
    const modalEl = document.getElementById('loginRegisterModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      const tabBtn = document.querySelector('button[data-bs-target="#tabOfficerLogin"]');
      if (tabBtn) tabBtn.click();
    }
    return;
  }

  if (role === 'admin' && currentUserRole !== 'admin') {
    alert("🔒 Access Restricted: Admin Analytics is restricted to System Administrators. Please log in with Admin credentials.");
    const modalEl = document.getElementById('loginRegisterModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      const tabBtn = document.querySelector('button[data-bs-target="#tabAdminLogin"]');
      if (tabBtn) tabBtn.click();
    }
    return;
  }

  state.currentRole = role;

  const btnFarmer = document.getElementById('btnRoleFarmer');
  const btnOfficer = document.getElementById('btnRoleOfficer');
  const btnAdmin = document.getElementById('btnRoleAdmin');
  const btnTV = document.getElementById('btnRoleTV');

  [btnFarmer, btnOfficer, btnAdmin, btnTV].forEach(b => b && b.classList.remove('active'));

  const viewFarmer = document.getElementById('farmerPortalView');
  const viewOfficer = document.getElementById('officerPortalView');
  const viewAdmin = document.getElementById('adminPortalView');
  const viewTV = document.getElementById('tvPortalView');

  const hero = document.getElementById('heroBannerSection');
  const stats = document.getElementById('statsRowSection');
  const userBadge = document.getElementById('userBadgeRole');

  [viewFarmer, viewOfficer, viewAdmin, viewTV].forEach(v => v && v.classList.add('d-none'));

  if (role === 'farmer') {
    btnFarmer?.classList.add('active');
    viewFarmer?.classList.remove('d-none');
    hero?.classList.remove('d-none');
    stats?.classList.remove('d-none');
    if (stats) stats.classList.remove('no-hero-mode');
    if (userBadge) userBadge.textContent = "FARMER MODE";
  } else if (role === 'officer') {
    btnOfficer?.classList.add('active');
    viewOfficer?.classList.remove('d-none');
    hero?.classList.add('d-none');
    stats?.classList.remove('d-none');
    if (stats) stats.classList.add('no-hero-mode');
    if (userBadge) userBadge.textContent = "OFFICER COUNTER DESK";
    if (window.initOfficerDesk) window.initOfficerDesk();
  } else if (role === 'admin') {
    btnAdmin?.classList.add('active');
    viewAdmin?.classList.remove('d-none');
    hero?.classList.add('d-none');
    stats?.classList.remove('d-none');
    if (stats) stats.classList.add('no-hero-mode');
    if (userBadge) userBadge.textContent = "ADMIN & AI ANALYTICS";
    if (window.initAdminAnalytics) window.initAdminAnalytics();
  } else if (role === 'tv') {
    btnTV?.classList.add('active');
    viewTV?.classList.remove('d-none');
    hero?.classList.add('d-none');
    stats?.classList.add('d-none');
    if (userBadge) userBadge.textContent = "PUBLIC QUEUE SIGNAGE";
  }

  updateRoleButtonsVisibility();
}

// Dynamically hide/show navbar buttons depending on active user role
function updateRoleButtonsVisibility() {
  const role = state.currentUser?.role || 'farmer';
  const btnOfficer = document.getElementById('btnRoleOfficer');
  const btnAdmin = document.getElementById('btnRoleAdmin');

  if (btnOfficer) {
    if (role === 'farmer') {
      btnOfficer.style.opacity = '0.5';
      btnOfficer.title = 'Restricted to Procurement Officers';
      btnOfficer.innerHTML = `<i class="fa-solid fa-lock text-warning me-1"></i> Officer Desk`;
    } else {
      btnOfficer.style.opacity = '1';
      btnOfficer.title = '';
      btnOfficer.innerHTML = `<i class="fa-solid fa-scale-balanced me-1"></i> Officer Desk`;
    }
  }

  if (btnAdmin) {
    if (role !== 'admin') {
      btnAdmin.style.opacity = '0.5';
      btnAdmin.title = 'Restricted to Administrators';
      btnAdmin.innerHTML = `<i class="fa-solid fa-lock text-warning me-1"></i> Admin Analytics`;
    } else {
      btnAdmin.style.opacity = '1';
      btnAdmin.title = '';
      btnAdmin.innerHTML = `<i class="fa-solid fa-chart-line me-1"></i> Admin Analytics`;
    }
  }
}

// Language Switcher
function changeLanguage(langCode) {
  state.currentUser.language = langCode;
  const label = document.getElementById('currentLangLabel');
  const langNames = { en: "English", hi: "हिंदी", te: "తెలుగు", ta: "தமிழ்" };
  if (label) label.textContent = langNames[langCode] || "English";

  const dict = i18n[langCode] || i18n.en;

  // Translate all elements on the entire page with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = `${icon.outerHTML} ${dict[key]}`;
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Sync Track Stepper UI in new language
  if (state.activeBookingToken) {
    updateTrackWorkflowUI(state.activeBookingToken);
  } else {
    updateTrackWorkflowUI();
  }

  // Preserve Role Lock Icons in Navbar
  updateRoleButtonsVisibility();

  // Refresh crop showcase banner in new language
  onCropChange();
}

// Scroll Helpers
function scrollToBooking() {
  document.getElementById('bookingCard').scrollIntoView({ behavior: 'smooth' });
}
function scrollToQueue() {
  document.getElementById('queueTrackerWidget').scrollIntoView({ behavior: 'smooth' });
}

// Dedicated Role-Based Auth Handler
async function handleAuthLoginRole(e, targetRole) {
  if (e) e.preventDefault();

  let phone = "";
  let password = "";

  if (targetRole === 'farmer') {
    phone = document.getElementById('farmerPhone')?.value;
    password = document.getElementById('farmerPassword')?.value;
  } else if (targetRole === 'officer') {
    phone = document.getElementById('officerPhone')?.value;
    password = document.getElementById('officerPassword')?.value;
  } else if (targetRole === 'admin') {
    phone = document.getElementById('adminPhone')?.value;
    password = document.getElementById('adminPassword')?.value;
  } else {
    phone = document.getElementById('loginPhone')?.value || "9876543210";
    password = document.getElementById('loginPassword')?.value || "123";
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    }).then(r => r.json());

    if (res.success) {
      state.currentUser = res.user;
      
      // Update Dedicated Farmer Dashboard Header
      updatePersonalDashboardView(res.user);

      const modalEl = document.getElementById('loginRegisterModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      // Switch view portal to target role
      switchRole(targetRole || res.user.role);

      loadFarmerPayments();
      fetchQueueStatus();
    } else {
      alert("Login failed: " + res.message);
    }
  } catch (err) {
    alert("Connection error during login.");
  }
}

// 1-Click Quick Demo Login Handler
async function quickLoginDemo(phone, password, targetRole) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    }).then(r => r.json());

    if (res.success) {
      state.currentUser = res.user;
      updatePersonalDashboardView(res.user);

      const modalEl = document.getElementById('loginRegisterModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      switchRole(targetRole || res.user.role);

      loadFarmerPayments();
      fetchQueueStatus();
    } else {
      alert("Demo login failed: " + res.message);
    }
  } catch (err) {
    alert("Connection error during demo login.");
  }
}

async function handleAuthRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const phone = document.getElementById('regPhone').value;
  const aadhaar = document.getElementById('regAadhaar').value;
  const village = document.getElementById('regVillage').value;
  const district = document.getElementById('regDistrict').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, aadhaar, village, district })
    }).then(r => r.json());

    if (res.success) {
      state.currentUser = res.user;
      
      // Immediately move registered farmer to their dedicated personal dashboard
      updatePersonalDashboardView(res.user);

      const modalEl = document.getElementById('loginRegisterModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      alert(`Registration Successful! Welcome to your Farmer Dashboard, ${name}.`);
      
      loadFarmerPayments();
      fetchQueueStatus();

      // Scroll smoothly to slot booking card
      scrollToBooking();
    } else {
      alert("Registration failed: " + res.message);
    }
  } catch (err) {
    alert("Connection error during registration.");
  }
}

// Update Personal Farmer Dashboard Display
function updatePersonalDashboardView(user) {
  const nameEl = document.getElementById('farmerNameDisplay');
  const metaEl = document.getElementById('farmerMetaDisplay');
  const badgeEl = document.getElementById('userBadgeRole');

  if (nameEl) nameEl.textContent = `${user.name} (FARMER DASHBOARD)`;
  if (metaEl) metaEl.textContent = `Mobile: ${user.phone} | Village: ${user.village} | District: ${user.district} | Aadhaar: ${user.aadhaar}`;
  if (badgeEl) badgeEl.textContent = `PERSONAL DASHBOARD: ${user.name.toUpperCase()}`;

  // Reset active booking for new user login/register
  state.activeBookingToken = null;
  
  // Fetch existing bookings for this farmer
  fetchMyActiveBookings(user.id);
}

// Fetch active bookings for logged in farmer
async function fetchMyActiveBookings(farmerId) {
  try {
    const res = await fetch(`/api/bookings/my?farmerId=${farmerId}`).then(r => r.json());
    if (res.success && res.bookings && res.bookings.length > 0) {
      const active = res.bookings.find(b => b.status === 'Waiting' || b.status === 'Processing') || res.bookings[res.bookings.length - 1];
      if (active) {
        state.activeBookingToken = active;
        renderDigitalTokenPass(active);
        updateTrackWorkflowUI(active);
      }
    }
  } catch (err) {
    console.error("Failed to fetch my active bookings:", err);
  }
}

// -------------------------------------------------------------
// TRACK PROCUREMENT WORKFLOW & ACCESSIBILITY READOUT
// -------------------------------------------------------------

function updateTrackWorkflowUI(booking) {
  if (!booking) {
    booking = {
      caseId: "PC-CASE-868030",
      tokenNo: "A-104",
      cropName: "Wheat",
      centerName: "Balasore Main APMC Mandi",
      status: "Waiting"
    };
  }

  const caseId = booking.caseId || `PC-CASE-${(booking.tokenNo || '868030').replace(/[^0-9]/g, '') || '868030'}`;

  const caseIdEl = document.getElementById('trackCaseId');
  const cropEl = document.getElementById('trackCropName');
  const tokenEl = document.getElementById('trackTokenNo');
  const centerEl = document.getElementById('trackCenterName');
  const badgeEl = document.getElementById('trackCaseStatusBadge');

  if (caseIdEl) caseIdEl.textContent = caseId;
  if (cropEl) cropEl.textContent = `${booking.cropName || 'Wheat'} (Grade A)`;
  if (tokenEl) tokenEl.textContent = booking.tokenNo || 'A-104';
  if (centerEl) centerEl.textContent = booking.centerName || 'Balasore Main APMC Mandi';

  let currentStep = 1; // Default: Scheduled
  let statusText = "Scheduled";
  let statusClass = "status-badge-scheduled";

  if (booking.status === 'Processing') {
    currentStep = 3;
    statusText = "In Progress";
    statusClass = "status-badge-progress";
  } else if (booking.status === 'Verified') {
    currentStep = 5;
    statusText = "In Progress";
    statusClass = "status-badge-progress";
  } else if (booking.status === 'Completed') {
    currentStep = 7;
    statusText = "Completed";
    statusClass = "status-badge-completed";
  } else {
    currentStep = 1;
    statusText = "Scheduled";
    statusClass = "status-badge-scheduled";
  }

  if (badgeEl) {
    badgeEl.textContent = statusText;
    badgeEl.className = statusClass;
  }

  // Update Overall Completion Progress Bar & Percentage
  const pct = Math.round((currentStep / 7) * 100);
  const trackOverallProgressBar = document.getElementById('trackOverallProgressBar');
  const trackOverallPctVal = document.getElementById('trackOverallPctVal');
  if (trackOverallProgressBar) trackOverallProgressBar.style.width = `${pct}%`;
  if (trackOverallPctVal) trackOverallPctVal.textContent = `Step ${currentStep} of 7 (${pct}% Complete)`;

  const lang = state.currentUser.language || 'en';
  const dict = i18n[lang] || i18n.en;

  const stepsConfig = [
    { num: 1, icon: "fa-calendar-check", title: dict.step1Title || "Scheduled", desc: dict.step1Desc || "Procurement slot booked & token issued", meta: "Token: TKN-2026-101 | Priority Slot" },
    { num: 2, icon: "fa-truck-ramp-box", title: dict.step2Title || "Arrived at Mandi", desc: dict.step2Desc || "Gate entry pass recorded", meta: "Gate Entry Pass #4928 | Timestamp Recorded" },
    { num: 3, icon: "fa-id-card", title: dict.step3Title || "Farmer Verified", desc: dict.step3Desc || "Farmer Aadhaar, land record & quota verified", meta: "Aadhaar e-KYC Verified | Land Quota OK" },
    { num: 4, icon: "fa-vial-circle-check", title: dict.step4Title || "Quality Inspected", desc: dict.step4Desc || "Moisture %, foreign matter & weighbridge weight test", meta: "Moisture: 14.2% (Passed) | Weight: 30.2 Q" },
    { num: 5, icon: "fa-shield-check", title: dict.step5Title || "Crop Accepted", desc: dict.step5Desc || "Quality passed MSP standard specs", meta: "MSP Grade A Approved | Official Acceptance" },
    { num: 6, icon: "fa-receipt", title: dict.step6Title || "Procurement Completed", desc: dict.step6Desc || "Procurement receipt generated", meta: "Receipt #RCP-98210 | Signed by DPC Officer" },
    { num: 7, icon: "fa-building-columns", title: dict.step7Title || "DBT Payment Settled", desc: dict.step7Desc || "Direct Benefit Transfer credited to bank", meta: "Bank UTR: SBIN00293847291 | Instant Credit" }
  ];

  // Update Horizontal Breadcrumb Pills (Desktop)
  const pillsContainer = document.getElementById('trackHorizontalPills');
  if (pillsContainer) {
    pillsContainer.innerHTML = stepsConfig.map(s => {
      let pillClass = "bg-dark text-secondary border border-secondary";
      if (s.num < currentStep) pillClass = "bg-success text-white border border-success fw-bold";
      else if (s.num === currentStep) pillClass = "bg-warning text-dark fw-bold border border-warning shadow-sm";

      return `
        <div class="px-2 py-1 rounded-pill small flex-fill ${pillClass}" style="font-size: 0.72rem;">
          <i class="fa-solid ${s.icon} me-1"></i> ${s.num}. ${s.title.split(' ')[0]}
        </div>
      `;
    }).join('');
  }

  const container = document.getElementById('workflowTimelineContainer');
  if (!container) return;

  const doneLabel = lang === 'hi' ? 'पूर्ण' : (lang === 'te' ? 'పూర్తయింది' : (lang === 'ta' ? 'நிறைவுற்றது' : 'Completed'));
  const progressLabel = lang === 'hi' ? 'प्रगति पर' : (lang === 'te' ? 'జరుగుతోంది' : (lang === 'ta' ? 'நடைபெறுகிறது' : 'In Progress'));

  container.innerHTML = stepsConfig.map(s => {
    let stepClass = "pending";
    let nodeContent = `<i class="fa-solid ${s.icon}"></i>`;
    let badgeHtml = "";
    let metaTagHtml = "";

    if (s.num < currentStep) {
      stepClass = "completed";
      nodeContent = `<i class="fa-solid fa-check fs-6"></i>`;
      badgeHtml = `<span class="stepper-badge-done"><i class="fa-solid fa-circle-check me-1"></i>${doneLabel}</span>`;
      metaTagHtml = `<div class="mt-1 small text-success-light fw-bold opacity-90"><i class="fa-solid fa-certificate me-1 text-success"></i> ${s.meta}</div>`;
    } else if (s.num === currentStep) {
      stepClass = "active";
      nodeContent = `<i class="fa-solid ${s.icon} fs-6 text-warning animate-pulse"></i>`;
      badgeHtml = currentStep === 7 ? `<span class="stepper-badge-done"><i class="fa-solid fa-circle-check me-1"></i>${doneLabel}</span>` : `<span class="stepper-badge-progress"><i class="fa-solid fa-spinner fa-spin me-1"></i>${progressLabel}</span>`;
      metaTagHtml = `<div class="mt-1 small text-warning fw-bold"><i class="fa-solid fa-clock-rotate-left me-1"></i> Active Processing at Desk</div>`;
    } else {
      stepClass = "pending";
      nodeContent = `<i class="fa-solid ${s.icon} text-muted"></i>`;
      badgeHtml = "";
    }

    return `
      <div class="stepper-step ${stepClass}" id="step${s.num}">
        <div class="stepper-node shadow-sm">${nodeContent}</div>
        <div class="flex-fill">
          <div class="stepper-step-title">
            <span>${s.title}</span> ${badgeHtml}
          </div>
          <div class="stepper-step-desc">${s.desc}</div>
          ${metaTagHtml}
        </div>
      </div>
    `;
  }).join('');
}

function speakCaseStatus() {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-speech voice narration is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const caseId = document.getElementById('trackCaseId')?.textContent || "PC-CASE-868030";
  const status = document.getElementById('trackCaseStatusBadge')?.textContent || "Scheduled";
  const crop = document.getElementById('trackCropName')?.textContent || "Wheat";
  const token = document.getElementById('trackTokenNo')?.textContent || "A-104";
  const center = document.getElementById('trackCenterName')?.textContent || "Mandi";

  const lang = state.currentUser.language || 'en';

  const readTexts = {
    hi: `खरीद ट्रैकिंग केस आईडी: ${caseId}. वर्तमान स्थिति: ${status}. फसल: ${crop}. टोकन नंबर: ${token}. खरीद केंद्र: ${center}. स्लॉट बुकिंग, गेट पास दर्ज, गुणवत्ता जांच और डीबीटी बैंक भुगतान लाइव अपडेट हो रहा है।`,
    te: `కొనుగోలు ట్రాకింగ్ కేస్ ID: ${caseId}. ప్రస్తుత స్థితి: ${status}. పంట: ${crop}. టోకెన్ నంబర్: ${token}. కొనుగోలు కేంద్రం: ${center}. స్లాట్ బుకింగ్, గేట్ పాస్ నమోదు, నాణ్యత తనిఖీ మరియు DBT చెల్లింపు లైవ్ అప్‌డేట్ అవుతోంది.`,
    ta: `கொள்முதல் கண்காணிப்பு வழக்கு எண்: ${caseId}. தற்போதைய நிலை: ${status}. பயிர்: ${crop}. டோக்கன் எண்: ${token}. கொள்முதல் மையம்: ${center}. ஸ்லாட் முன்பதிவு, நுழைவுச்சீட்டு பதிவு, தர பரிசோதனை மற்றும் DBT வங்கி பணம் நேரலையில் புதுப்பிக்கப்படுகிறது.`,
    en: `Track Procurement Case ID: ${caseId}. Status: ${status}. Crop: ${crop}. Token number: ${token}. Center: ${center}. Procurement slot booked, gate pass recorded, quality inspection and DBT payment status updating live.`
  };

  const textToRead = readTexts[lang] || readTexts.en;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  
  const voiceLangs = { hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', en: 'en-IN' };
  utterance.lang = voiceLangs[lang] || 'en-US';
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  const btn = document.getElementById('btnListenSpeech');
  const listenLabels = { hi: 'सुनें', te: 'వినండి', ta: 'கேளுங்கள்', en: 'Listen' };

  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-volume-high text-danger animate-pulse"></i> ${listenLabels[lang] || 'Listen'}...`;
    utterance.onend = () => {
      btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> ${listenLabels[lang] || 'Listen'}`;
    };
    utterance.onerror = () => {
      btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> ${listenLabels[lang] || 'Listen'}`;
    };
  }

  window.speechSynthesis.speak(utterance);
}

function scrollToTrack() {
  const el = document.getElementById('trackProcurementSection');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// -------------------------------------------------------------
// KISAN SUN-DRYING & MSP PROFITABILITY CALCULATOR LOGIC
// -------------------------------------------------------------

function updatePayoutCalculator() {
  const crop = document.getElementById('calcCropSelect')?.value || 'paddy';
  const qty = parseInt(document.getElementById('calcQtySlider')?.value || 30, 10);

  const calcQtyVal = document.getElementById('calcQtyVal');
  if (calcQtyVal) calcQtyVal.textContent = `${qty} Q`;

  // Crop MSP and Rates data
  const cropRates = {
    paddy: { name: "Paddy (Samba)", msp: 2300, bonus: 107, trader: 2140, comm: 0.05, unit: "Q" },
    wheat: { name: "Wheat (Grade A)", msp: 2275, bonus: 75, trader: 2120, comm: 0.05, unit: "Q" },
    tomato: { name: "Tomato (Grade A)", msp: 1800, bonus: 50, trader: 1620, comm: 0.06, unit: "Q" },
    onion: { name: "Red Onion", msp: 2400, bonus: 60, trader: 2150, comm: 0.05, unit: "Q" },
    cotton: { name: "Commercial Cotton", msp: 6620, bonus: 150, trader: 6200, comm: 0.04, unit: "Q" }
  };

  const data = cropRates[crop] || cropRates.paddy;

  // Govt DPC Total Payout = (MSP + State Bonus) * Qty
  const govRateTotal = data.msp + data.bonus;
  const govTotalPayout = govRateTotal * qty;

  // Private Trader Payout = (Trader Rate * (1 - Commission)) * Qty
  const traderEffectiveRate = data.trader * (1 - data.comm);
  const traderTotalPayout = Math.round(traderEffectiveRate * qty);

  const diff = govTotalPayout - traderTotalPayout;

  const govPayoutVal = document.getElementById('govPayoutVal');
  const traderPayoutVal = document.getElementById('traderPayoutVal');
  const govBreakdownText = document.getElementById('govBreakdownText');
  const traderBreakdownText = document.getElementById('traderBreakdownText');
  const calcDifferenceVal = document.getElementById('calcDifferenceVal');

  if (govPayoutVal) govPayoutVal.textContent = `₹${govTotalPayout.toLocaleString('en-IN')}`;
  if (traderPayoutVal) traderPayoutVal.textContent = `₹${traderTotalPayout.toLocaleString('en-IN')}`;
  if (govBreakdownText) govBreakdownText.textContent = `₹${data.msp.toLocaleString('en-IN')} MSP + ₹${data.bonus} Bonus/Q`;
  if (traderBreakdownText) traderBreakdownText.textContent = `₹${data.trader.toLocaleString('en-IN')}/Q (Minus ${data.comm*100}% Comm.)`;

  if (calcDifferenceVal) {
    if (diff >= 0) {
      calcDifferenceVal.textContent = `₹${diff.toLocaleString('en-IN')} MORE`;
      calcDifferenceVal.className = "text-warning fw-extrabold";
    } else {
      calcDifferenceVal.textContent = `₹${Math.abs(diff).toLocaleString('en-IN')} LESS`;
      calcDifferenceVal.className = "text-danger fw-extrabold";
    }
  }
}

function speakAdvisorySummary() {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-speech voice narration is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const lang = state.currentUser.language || 'en';
  const qty = document.getElementById('calcQtySlider')?.value || "30";
  const diff = document.getElementById('calcDifferenceVal')?.textContent || "₹8,010 MORE";

  const advisoryTexts = {
    hi: `किसान सलाह केंद्र: आज मंडी में धूप सुखाने का सूचकांक 88 प्रतिशत उत्तम है। धान में नमी 20 प्रतिशत से घटाकर 16.5 प्रतिशत करने के लिए 3 घंटे धूप में सुखाएं। 30 क्विंटल धान सरकारी DPC पर बेचने पर आपको निजी व्यापारी की तुलना में ${diff} की शुद्ध अतिरिक्त कमाई होगी।`,
    te: `రైతు సలహా కేంద్రం: ఈ రోజు ధాన్యం ఆరబెట్టడానికి 88 శాతం అత్యుత్తమ వాతావరణం ఉంది. ధాన్యంలో తేమను 3 గంటల్లో తగ్గించవచ్చు. 30 క్వింటాళ్ల పంటను ప్రభుత్వ DPCలో విక్రయించడం ద్వారా మీకు ప్రైవేట్ వ్యాపారి కంటే ${diff} నికర అదనపు ఆదాయం లభిస్తుంది.`,
    ta: `விவசாயி வழிகாட்டி மையம்: இன்று தானியங்களை வெயிலில் காயவைக்கும் குறியீடு 88 சதவீதம் மிக நன்று. 3 மணி நேரத்தில் நெல் ஈரப்பதத்தை 16.5 சதவீதமாக குறைக்கலாம். 30 குவிண்டால் பயிரை அரசு DPC மையத்தில் விற்பனை செய்வதன் மூலம் வியாபாரியை விட உங்களுக்கு ${diff} கூடுதல் லாபம் கிடைக்கும்.`,
    en: `Kisan Advisory Hub: Open yard grain drying suitability index is 88 percent optimal today. Sun dry paddy for 3 hours to drop moisture to allowable 16.5 percent limit. Selling 30 quintals at Govt DPC yields ${diff} net profit compared to private traders.`
  };

  const textToRead = advisoryTexts[lang] || advisoryTexts.en;
  const utterance = new SpeechSynthesisUtterance(textToRead);
  const voiceLangs = { hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', en: 'en-IN' };
  utterance.lang = voiceLangs[lang] || 'en-US';
  utterance.rate = 0.92;

  window.speechSynthesis.speak(utterance);
}

// Auto-initialize calculator on page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    updatePayoutCalculator();
  }, 500);
});

// -------------------------------------------------------------
// OFFICIAL GOVERNMENT PROCUREMENT CERTIFICATE MODAL LOGIC
// -------------------------------------------------------------

function openOfficialCertificateModal(tokenNo) {
  const user = state.currentUser || {};

  // Check if tokenNo matches a record in paymentHistory
  const paymentMatch = (state.paymentHistory || []).find(p => p.tokenNo === tokenNo);

  let token = tokenNo || state.activeBookingToken?.tokenNo || "TKN-2026-101";
  let crop = state.activeBookingToken?.cropName || "Paddy / Samba Rice";
  let qty = parseFloat(state.activeBookingToken?.estimatedQuantity || 25);
  let centerName = state.selectedCenter?.name || state.activeBookingToken?.centerName || "Panchanathikottai DPC";
  let disbursedDate = new Date();
  let utrNo = `DBT2026${Math.floor(10000000 + Math.random() * 90000000)}`;
  let totalAmount = 0;
  let mspRate = 2300;
  let bonusRate = 107;
  let moistureText = '14.2% <small class="text-muted">(Max 17%)</small>';
  let refuseText = "0.3%";

  if (paymentMatch) {
    token = paymentMatch.tokenNo;
    totalAmount = paymentMatch.amount;
    utrNo = paymentMatch.utrNumber;
    disbursedDate = new Date(paymentMatch.disbursedAt);
    crop = "Paddy / Samba Rice";
    qty = 20.0;
    mspRate = 2300;
    bonusRate = 115;
  } else {
    // Determine crop pricing & specs dynamically
    const cLower = crop.toLowerCase();
    if (cLower.includes('tomato')) {
      mspRate = 1800;
      bonusRate = 50;
      moistureText = 'Fresh Harvest <small class="text-muted">(96% Freshness Index)</small>';
      refuseText = "0.1%";
    } else if (cLower.includes('onion')) {
      mspRate = 2400;
      bonusRate = 60;
      moistureText = '11.5% <small class="text-muted">(Max 14%)</small>';
      refuseText = "0.4%";
    } else if (cLower.includes('wheat')) {
      mspRate = 2275;
      bonusRate = 75;
      moistureText = '10.8% <small class="text-muted">(Max 12%)</small>';
      refuseText = "0.2%";
    } else if (cLower.includes('cotton')) {
      mspRate = 6620;
      bonusRate = 150;
      moistureText = '6.9% <small class="text-muted">(Max 8%)</small>';
      refuseText = "0.2%";
    } else {
      mspRate = 2300;
      bonusRate = 107;
      moistureText = '14.2% <small class="text-muted">(Max 17%)</small>';
      refuseText = "0.3%";
    }

    const totalRatePerQ = mspRate + bonusRate;
    totalAmount = Math.round(qty * totalRatePerQ);
  }

  const grossWeight = (qty + 1.90).toFixed(2);
  const tareWeight = "1.90";
  const netWeight = qty.toFixed(2);

  // Populate Certificate Modal Fields
  const docRef = document.getElementById('certDocRef');
  if (docRef) docRef.textContent = `REF: TNCSC/DPC/2026/RCP-${token.replace(/\D/g,'') || '98210'}`;

  const certFarmerName = document.getElementById('certFarmerName');
  if (certFarmerName) certFarmerName.textContent = `${user.name || "Murugan K."} (Farmer)`;

  const certFarmerAadhaar = document.getElementById('certFarmerAadhaar');
  if (certFarmerAadhaar) certFarmerAadhaar.textContent = `Aadhaar: ${user.aadhaar || "9876-XXXX-4920"} | Phone: ${user.phone || "9876543210"}`;

  const certFarmerLocation = document.getElementById('certFarmerLocation');
  if (certFarmerLocation) certFarmerLocation.textContent = `Village: ${user.village || "Panchanathikottai"} | District: ${user.district || "Thanjavur"}`;

  const certCenterName = document.getElementById('certCenterName');
  if (certCenterName) certCenterName.textContent = `${centerName} (Hub #12)`;

  const certTokenNo = document.getElementById('certTokenNo');
  if (certTokenNo) certTokenNo.textContent = `Token No: ${token} | Case ID: PC-CASE-${token.replace(/\D/g,'') || '868030'}`;

  const certDate = document.getElementById('certDate');
  if (certDate) certDate.textContent = `Date: ${disbursedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${disbursedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  const certCropType = document.getElementById('certCropType');
  if (certCropType) certCropType.textContent = crop;

  document.getElementById('certGrossWeight').textContent = `${grossWeight} Q`;
  document.getElementById('certTareWeight').textContent = `${tareWeight} Q`;
  document.getElementById('certNetWeight').textContent = `${netWeight} Quintals`;
  document.getElementById('certMoisture').innerHTML = moistureText;
  document.getElementById('certRefuse').textContent = refuseText;

  const totalRatePerQ = mspRate + bonusRate;
  document.getElementById('certPriceCalculation').innerHTML = `Base MSP Rate: <strong>₹${mspRate.toLocaleString('en-IN')}/Q</strong> + TN Bonus: <strong>₹${bonusRate}/Q</strong> = <strong>₹${totalRatePerQ.toLocaleString('en-IN')}/Q</strong>`;
  document.getElementById('certTotalAmount').textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
  document.getElementById('certBankUtr').textContent = `UTR: ${utrNo}`;

  // Open Modal
  const modalEl = document.getElementById('officialReceiptModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function printOfficialCertificate() {
  const printArea = document.getElementById('receiptPrintableArea');
  if (!printArea) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TNCSC Official DPC Procurement Certificate</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        body { font-family: 'Outfit', sans-serif; background: #ffffff; padding: 25px; }
        .receipt-cert-card { border: 2px solid #10b981 !important; box-shadow: none !important; }
        @media print {
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body onload="window.print(); setTimeout(function(){ window.close(); }, 500);">
      ${printArea.innerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
}



