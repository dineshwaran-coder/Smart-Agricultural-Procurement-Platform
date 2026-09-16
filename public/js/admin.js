/**
 * Smart Farmer Procurement Management System - Officer Counter Desk & Admin Analytics (admin.js)
 */

window.initOfficerDesk = async function() {
  console.log("Officer Counter Desk active...");
  populateOfficerTokensDropdown();
  calculateNetPayout();
};

// Render Priority Queue List for Officer Counter
window.renderOfficerQueueList = function(queue, currentlyServing) {
  const container = document.getElementById('officerQueueList');
  const activeTokenEl = document.getElementById('officerActiveToken');
  const activeFarmerEl = document.getElementById('officerActiveFarmer');
  const activeBadgeEl = document.getElementById('officerActiveBadge');

  if (currentlyServing) {
    if (activeTokenEl) activeTokenEl.textContent = currentlyServing.tokenNo;
    if (activeFarmerEl) activeFarmerEl.textContent = `Farmer: ${currentlyServing.farmerName} (${currentlyServing.farmerPhone})`;
    if (activeBadgeEl) {
      activeBadgeEl.innerHTML = `<i class="fa-solid fa-fire me-1"></i> ${currentlyServing.cropName} - ${currentlyServing.perishability} Priority`;
    }
  } else {
    if (activeTokenEl) activeTokenEl.textContent = "IDLE DESK";
    if (activeFarmerEl) activeFarmerEl.textContent = "No active processing token.";
  }

  if (!container) return;

  if (!queue || queue.length === 0) {
    container.innerHTML = `<p class="text-muted text-center my-3">No tokens waiting in queue.</p>`;
    return;
  }

  container.innerHTML = queue.map((item, index) => `
    <div class="p-3 bg-light rounded-3 border mb-2 d-flex align-items-center justify-content-between">
      <div>
        <span class="badge bg-secondary me-2">#${index + 1}</span>
        <strong class="text-dark">${item.tokenNo}</strong> - <span class="fw-semibold">${item.farmerName}</span>
        <small class="d-block text-muted">${item.cropName} (${item.estimatedQuantity} Q) • Priority Score: ${item.priorityScore}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-danger font-weight-bold" onclick="fastTrackPriority('${item.id}')">
          <i class="fa-solid fa-bolt"></i> Fast-Track
        </button>
      </div>
    </div>
  `).join('');
};

// Call Next Token API Trigger
async function officerCallNextToken() {
  const centerId = state.selectedCenter ? state.selectedCenter.id : 'CTR-01';

  try {
    const res = await fetch('/api/queue/call-next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ centerId })
    }).then(r => r.json());

    if (res.success) {
      alert(`CALL TOKEN ALERT:\n${res.message}\nSimulated SMS Sent to ${res.calledToken.farmerPhone}`);
      fetchQueueStatus();
      populateOfficerTokensDropdown();
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.error("Call next token failed:", err);
  }
}

// Fast-Track Priority Override
async function fastTrackPriority(bookingId) {
  try {
    const res = await fetch('/api/queue/fast-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    }).then(r => r.json());

    if (res.success) {
      alert(`Fast-Track Priority Applied to ${res.booking.tokenNo}! Score boosted to ${res.booking.priorityScore}.`);
      fetchQueueStatus();
    }
  } catch (err) {
    console.error("Fast track failed:", err);
  }
}

// Populate Token Selector in Weighing Form
async function populateOfficerTokensDropdown() {
  const select = document.getElementById('officerSelectToken');
  if (!select) return;

  try {
    const centerId = state.selectedCenter ? state.selectedCenter.id : 'DPC-01';
    const res = await fetch(`/api/queue/status?centerId=${centerId}`).then(r => r.json());

    if (res.success && res.activeQueue) {
      if (res.activeQueue.length === 0) {
        select.innerHTML = `<option value="">No active tokens in queue</option>`;
        return;
      }

      select.innerHTML = res.activeQueue.map(b => `
        <option value="${b.id}" data-cropid="${b.cropId}" data-cropname="${b.cropName}" data-est="${b.estimatedQuantity}">${b.tokenNo} - ${b.farmerName} (${b.cropName} ${b.estimatedQuantity}Q)</option>
      `).join('');

      onOfficerTokenSelect();
    }
  } catch (err) {
    console.error("Failed to load officer tokens:", err);
  }
}

function onOfficerTokenSelect() {
  const select = document.getElementById('officerSelectToken');
  if (!select || select.selectedIndex < 0) return;

  const selectedOpt = select.options[select.selectedIndex];
  if (selectedOpt && selectedOpt.dataset.est) {
    const estQty = parseFloat(selectedOpt.dataset.est) || 15;
    const grossInput = document.getElementById('inputGrossWeight');
    if (grossInput) grossInput.value = estQty;
  }

  calculateNetPayout();
}

// Calculate Net Verified Weight & Gross Payout
function calculateNetPayout() {
  const select = document.getElementById('officerSelectToken');
  const gross = parseFloat(document.getElementById('inputGrossWeight')?.value) || 0;
  const tare = parseFloat(document.getElementById('inputTareWeight')?.value) || 0;
  const grade = document.getElementById('selectQualityGrade')?.value || 'Grade B';

  const net = Math.max(0, gross - tare);

  // Dynamic Crop MSP Lookup based on selected token
  let basePrice = 1800; // Default fallback
  if (select && select.selectedIndex >= 0) {
    const opt = select.options[select.selectedIndex];
    const cropId = opt ? opt.dataset.cropid : null;
    const cropName = opt ? opt.dataset.cropname : null;

    const cropObj = state.crops.find(c => c.id === cropId || c.name === cropName);
    if (cropObj && cropObj.mspPerQuintal) {
      basePrice = cropObj.mspPerQuintal;
    }
  }

  let mult = 1.0;
  if (grade === 'Grade A') mult = 1.05;
  else if (grade === 'Grade C') mult = 0.90;

  const finalPrice = Math.round(basePrice * mult);
  const totalPayout = Math.round(net * finalPrice);

  const calcNet = document.getElementById('calcNetWeight');
  const calcPrice = document.getElementById('calcPricePerQ');
  const calcTotal = document.getElementById('calcTotalPayout');

  if (calcNet) calcNet.textContent = `${net.toFixed(1)} Quintals`;
  if (calcPrice) calcPrice.textContent = `₹${finalPrice.toLocaleString('en-IN')}`;
  if (calcTotal) calcTotal.textContent = `₹${totalPayout.toLocaleString('en-IN')}`;
}

// Handle Officer Weighing Verification Submit
async function handleOfficerVerification(e) {
  e.preventDefault();

  const bookingId = document.getElementById('officerSelectToken').value;
  const grossWeight = document.getElementById('inputGrossWeight').value;
  const tareWeight = document.getElementById('inputTareWeight').value;
  const moistureContent = document.getElementById('inputMoisture').value;
  const qualityGrade = document.getElementById('selectQualityGrade').value;

  if (!bookingId) {
    alert("Please select a token from the list.");
    return;
  }

  try {
    const res = await fetch('/api/procurement/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        grossWeight,
        tareWeight,
        moistureContent,
        qualityGrade,
        officerName: "Officer Counter Desk #1"
      })
    }).then(r => r.json());

    if (res.success) {
      alert(`Crop Verification & Weighing Saved!\nNet Weight: ${res.weighingLog.netWeight} Quintals\nTotal Amount: ₹${res.weighingLog.totalAmount.toLocaleString('en-IN')}`);
      loadDashboardMetrics();
    } else {
      alert("Error: " + res.message);
    }
  } catch (err) {
    console.error("Verification submit error:", err);
  }
}

// Trigger Instant Direct Benefit Transfer (DBT) Payment
async function triggerDBTPayment() {
  const bookingId = document.getElementById('officerSelectToken').value;

  if (!bookingId) {
    alert("Please select a verified token first.");
    return;
  }

  try {
    const res = await fetch('/api/payments/disburse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        bankAccount: "SBIN0004829 - XXXXXX9481",
        ifsc: "SBIN0004829"
      })
    }).then(r => r.json());

    if (res.success) {
      alert(`DBT PAYMENT DISBURSED SUCCESSFULLY!\nAmount: ₹${res.payment.amount.toLocaleString('en-IN')}\nBank UTR: ${res.payment.utrNumber}\nSMS Notification dispatched to farmer.`);
      loadDashboardMetrics();
      loadFarmerPayments();
      fetchQueueStatus();
      populateOfficerTokensDropdown();
    } else {
      alert("DBT Payment Error: " + res.message);
    }
  } catch (err) {
    console.error("DBT Payment trigger failed:", err);
  }
}

// Admin Center Tier & Capacity Configurator
function updateCenterTierConfig() {
  const tierVal = document.getElementById('adminConfigTier').value;
  console.log("Tier capacity selection:", tierVal);
}

function saveAdminTierConfig() {
  const centerId = document.getElementById('adminConfigCenter').value;
  const capacity = document.getElementById('adminConfigTier').value;

  const center = state.centers.find(c => c.id === centerId);
  if (center) {
    center.capacityPerDay = parseInt(capacity);
    alert(`Center Capacity Updated!\n${center.name} is now configured for ${capacity} Farmers / Day.`);
    onCenterChange();
  }
}

// Export CSV Report
function exportReportCSV() {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Token No,Farmer Name,Crop,Net Weight (Q),Grade,Amount (INR),Payment Status,Bank UTR\n"
    + "TKN-2026-101,Ramesh Kumar,Tomato,25.0,Grade A,48300,Transferred,DBT20260901894123\n"
    + "TKN-2026-102,Suresh Patel,Tomato,40.0,Grade B,72000,Pending,N/A\n"
    + "TKN-2026-103,Anita Devi,Onion,50.0,Grade A,126000,Transferred,DBT20260902998811";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Government_Procurement_Audit_Report_2026.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
