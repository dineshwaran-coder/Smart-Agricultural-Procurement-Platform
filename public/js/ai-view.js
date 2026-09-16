/**
 * Smart Farmer Procurement Management System - AI Visualizer & Public TV Display (ai-view.js)
 */

let cropChartInstance = null;
let crowdForecastChartInstance = null;

window.initAdminAnalytics = function() {
  console.log("Admin Analytics & AI Forecast initializing...");
  renderCropDistributionChart();
  renderCrowdForecastChart();
};

// Render Crop Distribution Chart (Chart.js)
function renderCropDistributionChart() {
  const ctx = document.getElementById('cropDistributionChart');
  if (!ctx) return;

  if (cropChartInstance) cropChartInstance.destroy();

  cropChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Tomato (High Priority)', 'Onion / Garlic', 'Paddy (Rice)', 'Wheat', 'Cotton'],
      datasets: [{
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          '#dc2626', // Tomato Red
          '#d97706', // Onion Amber
          '#16a34a', // Paddy Green
          '#ca8a04', // Wheat Gold
          '#0284c7'  // Cotton Blue
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Inter', weight: '600' } }
        }
      }
    }
  });
}

// Render AI Crowd Forecast Chart (Chart.js)
function renderCrowdForecastChart() {
  const ctx = document.getElementById('crowdForecastChart');
  if (!ctx) return;

  if (crowdForecastChartInstance) crowdForecastChartInstance.destroy();

  crowdForecastChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['08-09 AM', '09-10 AM', '10-11 AM', '11-12 PM', '01-03 PM', '03-05 PM'],
      datasets: [{
        label: 'Predicted Crowd Density (%)',
        data: [35, 85, 60, 40, 30, 20],
        backgroundColor: [
          '#22c55e',
          '#ef4444', // Peak bottleneck
          '#f59e0b',
          '#22c55e',
          '#22c55e',
          '#3b82f6'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(val) { return val + '%'; }
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Render Public Queue TV Signage Display
window.renderTVQueueDisplay = function(queue, currentlyServing) {
  const activeNoEl = document.getElementById('tvActiveTokenNo');
  const activeFarmerEl = document.getElementById('tvActiveFarmer');
  const activeCropEl = document.getElementById('tvActiveCrop');
  const tvQueueList = document.getElementById('tvQueueList');

  if (currentlyServing) {
    if (activeNoEl) activeNoEl.textContent = currentlyServing.tokenNo;
    if (activeFarmerEl) activeFarmerEl.textContent = currentlyServing.farmerName;
    if (activeCropEl) {
      activeCropEl.innerHTML = `<i class="fa-solid fa-fire me-1"></i> ${currentlyServing.cropName} - ${currentlyServing.perishability} Priority`;
    }
  } else {
    if (activeNoEl) activeNoEl.textContent = "STANDBY";
    if (activeFarmerEl) activeFarmerEl.textContent = "Counter Ready";
  }

  if (!tvQueueList) return;

  const upcoming = queue ? queue.filter(b => b.status === 'Waiting') : [];

  if (upcoming.length === 0) {
    tvQueueList.innerHTML = `<div class="text-muted py-3 text-center">No waiting tokens in line.</div>`;
    return;
  }

  tvQueueList.innerHTML = upcoming.map((item, idx) => `
    <div class="d-flex align-items-center justify-content-between p-3 bg-secondary bg-opacity-25 rounded-3 mb-2 border border-secondary">
      <div>
        <span class="badge bg-warning text-dark me-2 font-weight-bold">#${idx + 1}</span>
        <strong class="text-white">${item.tokenNo}</strong> - ${item.farmerName}
      </div>
      <div>
        <span class="${item.perishability === 'High' ? 'badge bg-danger' : 'badge bg-success'}">${item.cropName} (${item.estimatedQuantity} Q)</span>
      </div>
    </div>
  `).join('');
};

// Update Clock on TV Display
setInterval(() => {
  const clockEl = document.getElementById('tvClock');
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}, 1000);
