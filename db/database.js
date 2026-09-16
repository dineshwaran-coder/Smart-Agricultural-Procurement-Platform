const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'procurement_data.json');

// Initial Default State with Tamil Nadu Direct Procurement Centers (DPCs)
const initialData = {
  users: [
    { id: "USR-101", name: "Murugan K.", phone: "9876543210", password: "123", role: "farmer", aadhaar: "9876-5432-1234", village: "Panchanathikottai", district: "Thanjavur", language: "ta" },
    { id: "USR-102", name: "Selvam R.", phone: "9876543211", password: "123", role: "farmer", aadhaar: "9876-5432-5678", village: "Vadipatti", district: "Madurai", language: "ta" },
    { id: "USR-103", name: "Rajendran S.", phone: "9876543212", password: "123", role: "farmer", aadhaar: "9876-5432-9012", village: "D. Pudaiyur", district: "Cuddalore", language: "ta" },
    { id: "USR-104", name: "Meenakshi Sundaram", phone: "9876543213", password: "123", role: "farmer", aadhaar: "9876-5432-3456", village: "Aachalpuram", district: "Mayiladuthurai", language: "ta" },
    { id: "USR-105", name: "Palanivel M.", phone: "9876543214", password: "123", role: "farmer", aadhaar: "9876-5432-7890", village: "Alathur", district: "Thiruvarur", language: "ta" },
    { id: "USR-OFFICER", name: "DPC Officer Arumugam", phone: "9900000001", password: "admin", role: "officer", centerId: "DPC-01" },
    { id: "USR-ADMIN", name: "TN Civil Supplies Admin", phone: "9900000000", password: "admin", role: "admin" }
  ],
  centers: [
    {
      id: "DPC-01",
      name: "Panchanathikottai DPC",
      district: "Thanjavur",
      state: "Tamil Nadu",
      tier: "Large",
      capacityPerDay: 200, // 200 slots per day
      operatingHours: "08:00 AM - 06:00 PM",
      status: "Active",
      contact: "+91 4362 234101"
    },
    {
      id: "DPC-02",
      name: "Kothangudi DPC",
      district: "Thanjavur",
      state: "Tamil Nadu",
      tier: "Medium",
      capacityPerDay: 100, // Benchmark: 100 slots per day
      operatingHours: "08:00 AM - 05:30 PM",
      status: "Active",
      contact: "+91 4362 234102"
    },
    {
      id: "DPC-03",
      name: "D. Pudaiyur DPC",
      district: "Cuddalore",
      state: "Tamil Nadu",
      tier: "Medium",
      capacityPerDay: 100,
      operatingHours: "08:30 AM - 05:30 PM",
      status: "Active",
      contact: "+91 4142 223303"
    },
    {
      id: "DPC-04",
      name: "Thiruvadhavur DPC",
      district: "Madurai",
      state: "Tamil Nadu",
      tier: "Medium",
      capacityPerDay: 100,
      operatingHours: "08:00 AM - 05:00 PM",
      status: "Active",
      contact: "+91 452 245604"
    },
    {
      id: "DPC-05",
      name: "Vadipatti DPC",
      district: "Madurai",
      state: "Tamil Nadu",
      tier: "Large",
      capacityPerDay: 200,
      operatingHours: "07:30 AM - 06:30 PM",
      status: "Active",
      contact: "+91 452 245605"
    },
    {
      id: "DPC-06",
      name: "Paruthiyur DPC",
      district: "Thiruvarur",
      state: "Tamil Nadu",
      tier: "Small",
      capacityPerDay: 50,
      operatingHours: "08:30 AM - 05:00 PM",
      status: "Active",
      contact: "+91 4366 221106"
    },
    {
      id: "DPC-07",
      name: "Alathur DPC",
      district: "Thiruvarur",
      state: "Tamil Nadu",
      tier: "Medium",
      capacityPerDay: 100,
      operatingHours: "08:00 AM - 05:30 PM",
      status: "Active",
      contact: "+91 4366 221107"
    },
    {
      id: "DPC-08",
      name: "Puthukudi DPC",
      district: "Thiruvarur",
      state: "Tamil Nadu",
      tier: "Small",
      capacityPerDay: 50,
      operatingHours: "08:30 AM - 05:00 PM",
      status: "Active",
      contact: "+91 4366 221108"
    },
    {
      id: "DPC-09",
      name: "Keezhaiyur DPC",
      district: "Nagapattinam",
      state: "Tamil Nadu",
      tier: "Medium",
      capacityPerDay: 100,
      operatingHours: "08:00 AM - 05:30 PM",
      status: "Active",
      contact: "+91 4365 242209"
    },
    {
      id: "DPC-10",
      name: "Aachalpuram DPC",
      district: "Mayiladuthurai",
      state: "Tamil Nadu",
      tier: "Medium",
      capacityPerDay: 100,
      operatingHours: "08:00 AM - 05:30 PM",
      status: "Active",
      contact: "+91 4364 228810"
    },
    {
      id: "DPC-11",
      name: "Aakurpandaravadai DPC",
      district: "Mayiladuthurai",
      state: "Tamil Nadu",
      tier: "Small",
      capacityPerDay: 50,
      operatingHours: "08:30 AM - 05:00 PM",
      status: "Active",
      contact: "+91 4364 228811"
    },
    {
      id: "DPC-12",
      name: "Aalangadu DPC",
      district: "Mayiladuthurai",
      state: "Tamil Nadu",
      tier: "Medium",
      capacityPerDay: 100,
      operatingHours: "08:00 AM - 05:30 PM",
      status: "Active",
      contact: "+91 4364 228812"
    }
  ],
  crops: [
    {
      id: "CRP-01",
      name: "Tomato",
      category: "Vegetables",
      perishability: "High",
      perishabilityScore: 10,
      priorityLevel: "High Priority",
      slotWindow: "08:00 AM - 10:00 AM",
      mspPerQuintal: 1800,
      shelfLifeDays: 2,
      icon: "fa-apple-whole",
      color: "#dc2626"
    },
    {
      id: "CRP-02",
      name: "Onion / Garlic",
      category: "Vegetables",
      perishability: "Medium",
      perishabilityScore: 5,
      priorityLevel: "Medium Priority",
      slotWindow: "10:00 AM - 12:00 PM",
      mspPerQuintal: 2400,
      shelfLifeDays: 14,
      icon: "fa-seedling",
      color: "#d97706"
    },
    {
      id: "CRP-03",
      name: "Paddy / Samba Rice",
      category: "Grains",
      perishability: "Normal",
      perishabilityScore: 2,
      priorityLevel: "Normal Priority",
      slotWindow: "01:00 PM - 04:00 PM",
      mspPerQuintal: 2300,
      shelfLifeDays: 180,
      icon: "fa-wheat-row",
      color: "#16a34a"
    },
    {
      id: "CRP-04",
      name: "Wheat",
      category: "Grains",
      perishability: "Normal",
      perishabilityScore: 2,
      priorityLevel: "Normal Priority",
      slotWindow: "01:00 PM - 04:00 PM",
      mspPerQuintal: 2275,
      shelfLifeDays: 180,
      icon: "fa-bowl-rice",
      color: "#ca8a04"
    },
    {
      id: "CRP-05",
      name: "Cotton",
      category: "Commercial",
      perishability: "Normal",
      perishabilityScore: 1,
      priorityLevel: "Normal Priority",
      slotWindow: "04:00 PM - 06:00 PM",
      mspPerQuintal: 7121,
      shelfLifeDays: 365,
      icon: "fa-plant-wilt",
      color: "#0284c7"
    }
  ],
  bookings: [
    {
      id: "BKG-2026-001",
      tokenNo: "TKN-2026-101",
      farmerId: "USR-101",
      farmerName: "Murugan K.",
      farmerPhone: "9876543210",
      centerId: "DPC-01",
      centerName: "Panchanathikottai DPC",
      cropId: "CRP-01",
      cropName: "Tomato",
      perishability: "High",
      perishabilityScore: 10,
      bookingDate: "2026-09-02",
      slotTime: "08:00 AM - 10:00 AM",
      estimatedQuantity: 25,
      status: "Processing",
      priorityScore: 18.5,
      qrCodeData: "SMART-FARMER|TKN-2026-101|Murugan K.|Tomato|25|Panchanathikottai DPC",
      bookedAt: "2026-09-02T07:30:00.000Z",
      calledAt: "2026-09-02T08:15:00.000Z"
    },
    {
      id: "BKG-2026-002",
      tokenNo: "TKN-2026-102",
      farmerId: "USR-102",
      farmerName: "Selvam R.",
      farmerPhone: "9876543211",
      centerId: "DPC-01",
      centerName: "Panchanathikottai DPC",
      cropId: "CRP-01",
      cropName: "Tomato",
      perishability: "High",
      perishabilityScore: 10,
      bookingDate: "2026-09-02",
      slotTime: "08:00 AM - 10:00 AM",
      estimatedQuantity: 40,
      status: "Waiting",
      priorityScore: 17.0,
      qrCodeData: "SMART-FARMER|TKN-2026-102|Selvam R.|Tomato|40|Panchanathikottai DPC",
      bookedAt: "2026-09-02T07:45:00.000Z"
    },
    {
      id: "BKG-2026-003",
      tokenNo: "TKN-2026-103",
      farmerId: "USR-103",
      farmerName: "Rajendran S.",
      farmerPhone: "9876543212",
      centerId: "DPC-01",
      centerName: "Panchanathikottai DPC",
      cropId: "CRP-02",
      cropName: "Onion / Garlic",
      perishability: "Medium",
      perishabilityScore: 5,
      bookingDate: "2026-09-02",
      slotTime: "10:00 AM - 12:00 PM",
      estimatedQuantity: 50,
      status: "Waiting",
      priorityScore: 11.2,
      qrCodeData: "SMART-FARMER|TKN-2026-103|Rajendran S.|Onion|50|Panchanathikottai DPC",
      bookedAt: "2026-09-02T08:00:00.000Z"
    },
    {
      id: "BKG-2026-004",
      tokenNo: "TKN-2026-104",
      farmerId: "USR-104",
      farmerName: "Meenakshi Sundaram",
      farmerPhone: "9876543213",
      centerId: "DPC-01",
      centerName: "Panchanathikottai DPC",
      cropId: "CRP-03",
      cropName: "Paddy / Samba Rice",
      perishability: "Normal",
      perishabilityScore: 2,
      bookingDate: "2026-09-02",
      slotTime: "01:00 PM - 04:00 PM",
      estimatedQuantity: 60,
      status: "Waiting",
      priorityScore: 5.5,
      qrCodeData: "SMART-FARMER|TKN-2026-104|Meenakshi Sundaram|Paddy|60|Panchanathikottai DPC",
      bookedAt: "2026-09-02T08:20:00.000Z"
    }
  ],
  weighingLogs: [
    {
      id: "WGH-2026-001",
      bookingId: "BKG-2026-000",
      tokenNo: "TKN-2026-100",
      farmerId: "USR-101",
      farmerName: "Murugan K.",
      cropName: "Paddy / Samba Rice",
      grossWeight: 20.5,
      tareWeight: 0.5,
      netWeight: 20.0,
      moistureContent: "12%",
      qualityGrade: "Grade A",
      gradeMultiplier: 1.05,
      pricePerQuintal: 2415,
      totalAmount: 48300,
      verifiedBy: "DPC Officer Arumugam",
      verifiedAt: "2026-09-01T14:30:00.000Z"
    }
  ],
  payments: [
    {
      id: "PAY-2026-001",
      bookingId: "BKG-2026-000",
      tokenNo: "TKN-2026-100",
      farmerId: "USR-101",
      farmerName: "Murugan K.",
      amount: 48300,
      bankAccount: "IOBA0001234 - XXXXXX9481",
      utrNumber: "DBT20260901894123",
      status: "Transferred",
      paymentMethod: "Direct Benefit Transfer (DBT)",
      disbursedAt: "2026-09-01T16:00:00.000Z"
    }
  ],
  smsLogs: [
    {
      id: "SMS-101",
      recipient: "9876543210",
      message: "Smart Procurement: Your slot for Tomato at Panchanathikottai DPC (Thanjavur) is confirmed for 2026-09-02 (08:00 AM - 10:00 AM). Token: TKN-2026-101.",
      sentAt: "2026-09-02T07:30:00.000Z"
    }
  ]
};

// Always overwrite DB File to update state with DPCs
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));

// Database helper methods
const db = {
  read: () => {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      return initialData;
    }
  },

  write: (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  },

  // Generic Helpers
  getCollection: (name) => {
    const data = db.read();
    return data[name] || [];
  },

  insert: (collectionName, item) => {
    const data = db.read();
    if (!data[collectionName]) data[collectionName] = [];
    data[collectionName].push(item);
    db.write(data);
    return item;
  },

  update: (collectionName, idKey, idValue, updates) => {
    const data = db.read();
    const items = data[collectionName] || [];
    const index = items.findIndex(i => i[idKey] === idValue);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      data[collectionName] = items;
      db.write(data);
      return items[index];
    }
    return null;
  },

  findOne: (collectionName, predicate) => {
    const items = db.getCollection(collectionName);
    return items.find(predicate);
  },

  filter: (collectionName, predicate) => {
    const items = db.getCollection(collectionName);
    return items.filter(predicate);
  }
};

module.exports = db;
