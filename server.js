const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/database');
const aiEngine = require('./services/aiEngine');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------
// AUTHENTICATION APIs
// -------------------------------------------------------------

// Login API
app.post('/api/auth/login', (req, res) => {
  const { phone, password, role } = req.body;
  const user = db.findOne('users', u => u.phone === phone && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid Phone Number or Password" });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      aadhaar: user.aadhaar,
      village: user.village,
      district: user.district,
      language: user.language || 'en',
      centerId: user.centerId
    }
  });
});

// Register Farmer API
app.post('/api/auth/register', (req, res) => {
  const { name, phone, password, aadhaar, village, district, language } = req.body;

  const existing = db.findOne('users', u => u.phone === phone);
  if (existing) {
    return res.status(400).json({ success: false, message: "Phone number already registered" });
  }

  const newFarmer = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    name,
    phone,
    password: password || '123',
    role: 'farmer',
    aadhaar: aadhaar || '9876-XXXX-XXXX',
    village: village || 'Local Village',
    district: district || 'Kolar',
    language: language || 'en'
  };

  db.insert('users', newFarmer);

  res.json({
    success: true,
    message: "Registration successful! You can now log in.",
    user: newFarmer
  });
});

// -------------------------------------------------------------
// MASTER DATA APIs
// -------------------------------------------------------------

const govDataService = require('./services/govDataService');

app.get('/api/centers', (req, res) => {
  res.json({ success: true, centers: db.getCollection('centers') });
});

app.get('/api/crops', (req, res) => {
  res.json({ success: true, crops: db.getCollection('crops') });
});

// Official Real-Time Government Agmarknet & MSP Data API
app.get('/api/gov/realtime-data', (req, res) => {
  res.json(govDataService.getRealtimeGovData());
});

app.get('/api/gov/live-mandi-rates', (req, res) => {
  res.json(govDataService.getRealtimeGovData());
});

// -------------------------------------------------------------
// SMART SLOT & AI RECOMMENDATION APIs
// -------------------------------------------------------------

app.post('/api/slots/recommend', (req, res) => {
  const { centerId, cropId, date } = req.body;
  const recommendation = aiEngine.getSmartSlotRecommendation(centerId, cropId, date);
  res.json({ success: true, recommendation });
});

// -------------------------------------------------------------
// BOOKINGS & DIGITAL TOKEN APIs
// -------------------------------------------------------------

// Book Slot & Generate Digital Token
app.post('/api/bookings', (req, res) => {
  const { farmerId, centerId, cropId, date, estimatedQuantity } = req.body;

  const farmer = db.findOne('users', u => u.id === farmerId);
  const center = db.findOne('centers', c => c.id === centerId);
  const crop = db.findOne('crops', c => c.id === cropId);

  if (!farmer || !center || !crop) {
    return res.status(400).json({ success: false, message: "Invalid Farmer, Center or Crop ID" });
  }

  // Check Center Tier Capacity Safeguard (Small: 50, Medium: 100, Large: 200)
  const capacity = center.capacityPerDay || 100;
  const dayBookings = db.filter('bookings', b => b.centerId === centerId && b.bookingDate === date && b.status !== 'Cancelled');

  if (dayBookings.length >= capacity) {
    return res.status(400).json({
      success: false,
      message: `Center capacity limit reached (${capacity} farmers/day for ${center.tier} center). Please select another date or nearby center.`
    });
  }

  const tokenNum = `TKN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const bookedAt = new Date().toISOString();
  const priorityScore = aiEngine.calculatePriorityScore(crop.perishabilityScore, bookedAt);

  const newBooking = {
    id: `BKG-${Date.now().toString().slice(-6)}`,
    tokenNo: tokenNum,
    farmerId: farmer.id,
    farmerName: farmer.name,
    farmerPhone: farmer.phone,
    centerId: center.id,
    centerName: center.name,
    cropId: crop.id,
    cropName: crop.name,
    perishability: crop.perishability,
    perishabilityScore: crop.perishabilityScore,
    bookingDate: date,
    slotTime: crop.slotWindow,
    estimatedQuantity: parseFloat(estimatedQuantity) || 10,
    status: 'Waiting',
    priorityScore: priorityScore,
    qrCodeData: `SMART-FARMER|${tokenNum}|${farmer.name}|${crop.name}|${estimatedQuantity}Q|${center.name}`,
    bookedAt: bookedAt
  };

  db.insert('bookings', newBooking);

  // Trigger simulated SMS Notification
  const smsMessage = `Smart Procurement: Your slot for ${crop.name} at ${center.name} is confirmed for ${date} (${crop.slotWindow}). Token: ${tokenNum}.`;
  db.insert('smsLogs', {
    id: `SMS-${Date.now().toString().slice(-4)}`,
    recipient: farmer.phone,
    message: smsMessage,
    sentAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: "Slot successfully booked & Digital Token generated!",
    booking: newBooking,
    smsAlert: smsMessage
  });
});

// Get My Bookings (Farmer View)
app.get('/api/bookings/my', (req, res) => {
  const { farmerId } = req.query;
  const userBookings = db.filter('bookings', b => b.farmerId === farmerId);
  res.json({ success: true, bookings: userBookings });
});

// Lookup Token Details
app.get('/api/token/:tokenNo', (req, res) => {
  const tokenNo = req.params.tokenNo;
  const booking = db.findOne('bookings', b => b.tokenNo.toLowerCase() === tokenNo.toLowerCase());
  
  if (!booking) {
    return res.status(404).json({ success: false, message: "Token not found" });
  }

  const queue = aiEngine.getActiveQueue(booking.centerId);
  const positionIndex = queue.findIndex(b => b.tokenNo === booking.tokenNo);

  res.json({
    success: true,
    booking,
    queuePosition: positionIndex >= 0 ? positionIndex + 1 : (booking.status === 'Processing' ? 'Currently Serving' : 'Completed'),
    estimatedWaitMins: positionIndex >= 0 ? (positionIndex + 1) * 12 : 0
  });
});

// -------------------------------------------------------------
// REAL-TIME QUEUE TRACKING & OFFICER DESK APIs
// -------------------------------------------------------------

// Live Queue Status
app.get('/api/queue/status', (req, res) => {
  const centerId = req.query.centerId || 'CTR-01';
  const activeQueue = aiEngine.getActiveQueue(centerId);
  const currentlyServing = activeQueue.find(b => b.status === 'Processing') || null;
  const waitingTokens = activeQueue.filter(b => b.status === 'Waiting');

  const center = db.findOne('centers', c => c.id === centerId);

  res.json({
    success: true,
    centerName: center ? center.name : 'Procurement Center',
    currentlyServing,
    waitingCount: waitingTokens.length,
    activeQueue
  });
});

// Officer Action: Call Next Token (Prioritizes Perishable Crops)
app.post('/api/queue/call-next', (req, res) => {
  const { centerId } = req.body;
  const targetCenterId = centerId || 'CTR-01';

  const activeQueue = aiEngine.getActiveQueue(targetCenterId);

  // If there's currently a processing token, mark it as Verified/Moving to Weighing
  const currentProcessing = activeQueue.find(b => b.status === 'Processing');
  if (currentProcessing) {
    db.update('bookings', 'id', currentProcessing.id, { status: 'Verified' });
  }

  // Find next highest priority waiting token
  const nextWaiting = activeQueue.find(b => b.status === 'Waiting');

  if (!nextWaiting) {
    return res.json({ success: false, message: "No more waiting tokens in queue." });
  }

  // Update status to Processing
  const updated = db.update('bookings', 'id', nextWaiting.id, {
    status: 'Processing',
    calledAt: new Date().toISOString()
  });

  // SMS Notification to farmer
  const smsMsg = `Token Alert: Token ${updated.tokenNo} (${updated.farmerName}) is now CALLED to Counter #1 at ${updated.centerName}. Please proceed immediately with your crop.`;
  db.insert('smsLogs', {
    id: `SMS-${Date.now().toString().slice(-4)}`,
    recipient: updated.farmerPhone,
    message: smsMsg,
    sentAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `Token ${updated.tokenNo} (${updated.farmerName} - ${updated.cropName}) called to desk!`,
    calledToken: updated,
    smsAlert: smsMsg
  });
});

// Fast-Track Priority Override
app.post('/api/queue/fast-track', (req, res) => {
  const { bookingId } = req.body;
  const booking = db.findOne('bookings', b => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  // Boost fastTrackBoost by +25 to immediately propel token to position #1 at top of line
  const newBoost = (booking.fastTrackBoost || 0) + 25;
  const updated = db.update('bookings', 'id', bookingId, {
    fastTrackBoost: newBoost,
    priorityScore: (booking.priorityScore || 10) + 25
  });

  res.json({
    success: true,
    message: `Fast-track priority applied to Token ${booking.tokenNo}! Moved to top of queue line.`,
    booking: updated
  });
});

// -------------------------------------------------------------
// WEIGHING & CROP VERIFICATION APIs
// -------------------------------------------------------------

app.post('/api/procurement/verify', (req, res) => {
  const { bookingId, grossWeight, tareWeight, moistureContent, qualityGrade, officerName } = req.body;

  const booking = db.findOne('bookings', b => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const crop = db.findOne('crops', c => c.id === booking.cropId) || { mspPerQuintal: 2000 };

  const gross = parseFloat(grossWeight) || 0;
  const tare = parseFloat(tareWeight) || 0;
  const net = Math.max(0, gross - tare);

  let gradeMultiplier = 1.0;
  if (qualityGrade === 'Grade A') gradeMultiplier = 1.05; // 5% bonus for top grade
  else if (qualityGrade === 'Grade B') gradeMultiplier = 1.00;
  else if (qualityGrade === 'Grade C') gradeMultiplier = 0.90;

  const pricePerQuintal = Math.round(crop.mspPerQuintal * gradeMultiplier);
  const totalAmount = Math.round(net * pricePerQuintal);

  const weighingLog = {
    id: `WGH-${Date.now().toString().slice(-6)}`,
    bookingId: booking.id,
    tokenNo: booking.tokenNo,
    farmerId: booking.farmerId,
    farmerName: booking.farmerName,
    cropName: booking.cropName,
    grossWeight: gross,
    tareWeight: tare,
    netWeight: net,
    moistureContent: moistureContent || "12%",
    qualityGrade: qualityGrade || "Grade A",
    gradeMultiplier: gradeMultiplier,
    pricePerQuintal: pricePerQuintal,
    totalAmount: totalAmount,
    verifiedBy: officerName || "Officer Desk 1",
    verifiedAt: new Date().toISOString()
  };

  db.insert('weighingLogs', weighingLog);
  db.update('bookings', 'id', booking.id, { status: 'Verified' });

  res.json({
    success: true,
    message: "Crop successfully weighed & verified!",
    weighingLog
  });
});

// -------------------------------------------------------------
// DIRECT BENEFIT TRANSFER (DBT) PAYMENT APIs
// -------------------------------------------------------------

app.post('/api/payments/disburse', (req, res) => {
  const { bookingId, bankAccount, ifsc } = req.body;

  const booking = db.findOne('bookings', b => b.id === bookingId);
  const weighLog = db.findOne('weighingLogs', w => w.bookingId === bookingId);

  if (!booking || !weighLog) {
    return res.status(400).json({ success: false, message: "Booking has not completed verification weighing." });
  }

  const utr = `DBT2026${Math.floor(10000000 + Math.random() * 90000000)}`;

  const paymentRecord = {
    id: `PAY-${Date.now().toString().slice(-6)}`,
    bookingId: booking.id,
    tokenNo: booking.tokenNo,
    farmerId: booking.farmerId,
    farmerName: booking.farmerName,
    amount: weighLog.totalAmount,
    bankAccount: bankAccount || "SBIN0004829 - XXXXXX9481",
    utrNumber: utr,
    status: 'Transferred',
    paymentMethod: 'Direct Benefit Transfer (DBT)',
    disbursedAt: new Date().toISOString()
  };

  db.insert('payments', paymentRecord);
  db.update('bookings', 'id', booking.id, { status: 'Completed' });

  // SMS Notification to farmer
  const smsMsg = `DBT Payment Received: Rs ${weighLog.totalAmount.toLocaleString('en-IN')} has been transferred to your Aadhaar linked bank account (${paymentRecord.bankAccount}). Ref UTR: ${utr}. Thank you!`;
  db.insert('smsLogs', {
    id: `SMS-${Date.now().toString().slice(-4)}`,
    recipient: booking.farmerPhone,
    message: smsMsg,
    sentAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `DBT Payment of ₹${weighLog.totalAmount.toLocaleString('en-IN')} successfully disbursed!`,
    payment: paymentRecord,
    smsAlert: smsMsg
  });
});

app.get('/api/payments/history', (req, res) => {
  const { farmerId } = req.query;
  if (farmerId) {
    res.json({ success: true, payments: db.filter('payments', p => p.farmerId === farmerId) });
  } else {
    res.json({ success: true, payments: db.getCollection('payments') });
  }
});

// -------------------------------------------------------------
// NOTIFICATIONS API
// -------------------------------------------------------------

app.get('/api/notifications/my', (req, res) => {
  const { phone } = req.query;
  if (phone) {
    res.json({ success: true, smsLogs: db.filter('smsLogs', s => s.recipient === phone) });
  } else {
    res.json({ success: true, smsLogs: db.getCollection('smsLogs') });
  }
});

// -------------------------------------------------------------
// AI ANALYTICS & DASHBOARD APIs
// -------------------------------------------------------------

app.get('/api/analytics/dashboard', (req, res) => {
  const bookings = db.getCollection('bookings');
  const payments = db.getCollection('payments');
  const weighingLogs = db.getCollection('weighingLogs');

  const totalFarmersServed = bookings.filter(b => b.status === 'Completed' || b.status === 'Verified').length;
  const totalVolumeQuintals = weighingLogs.reduce((sum, w) => sum + (w.netWeight || 0), 0);
  const totalDisbursedAmt = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const activeQueueLength = bookings.filter(b => b.status === 'Waiting' || b.status === 'Processing').length;

  res.json({
    success: true,
    metrics: {
      totalFarmersServed,
      totalVolumeQuintals: Math.round(totalVolumeQuintals),
      totalDisbursedAmt,
      activeQueueLength,
      perishabilitySpoilageSavedPct: 94.8,
      avgWaitTimeMinutes: 18
    },
    recentBookings: bookings.slice(-5).reverse(),
    recentPayments: payments.slice(-5).reverse()
  });
});

app.get('/api/analytics/crowd-prediction', (req, res) => {
  const centerId = req.query.centerId || 'CTR-01';
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const prediction = aiEngine.getCrowdPrediction(centerId, date);
  res.json({ success: true, prediction });
});

// Catch-all route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Smart Farmer Procurement Management System Running!`);
  console.log(` Server URL: http://localhost:${PORT}`);
  console.log(` Environment: Node.js ${process.version}`);
  console.log(`=======================================================`);
});
