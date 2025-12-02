// Popup functionality for IP Guardian extension

let isScanning = false;

// Load stored data
async function loadData() {
  try {
    const result = await chrome.storage.local.get(['protectedAssets', 'violations']);
    const protectedAssets = result.protectedAssets || [];
    const violations = result.violations || [];

    document.getElementById('protectedCount').textContent = protectedAssets.length;
    document.getElementById('violationCount').textContent = violations.length;
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Scan current page
async function scanPage() {
  if (isScanning) return;

  isScanning = true;
  const scanBtn = document.getElementById('scanBtn');
  const scanIcon = document.getElementById('scanIcon');
  const scanText = document.getElementById('scanText');
  const scanResults = document.getElementById('scanResults');

  // Update button state
  scanIcon.innerHTML = '<div class="loading"></div>';
  scanText.textContent = 'Scanning...';
  scanBtn.disabled = true;

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute content script to scan page
    const results = await chrome.tabs.sendMessage(tab.id, { action: 'scanPage' });

    // Display results
    document.getElementById('imagesFound').textContent = results.imageCount || 0;

    // Determine status based on similarity
    const similarity = results.maxSimilarity || 0;
    document.getElementById('similarity').textContent = `${similarity}%`;

    const scanStatus = document.getElementById('scanStatus');
    if (similarity > 85) {
      scanStatus.textContent = 'Violation Detected';
      scanStatus.className = 'badge danger';
    } else if (similarity > 70) {
      scanStatus.textContent = 'Suspicious';
      scanStatus.className = 'badge warning';
    } else {
      scanStatus.textContent = 'Clean';
      scanStatus.className = 'badge success';
    }

    scanResults.classList.remove('hidden');

    // Send notification if violation detected
    if (similarity > 85) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'IP Violation Detected',
        message: `Potential IP violation found with ${similarity}% similarity`,
        priority: 2
      });
    }
  } catch (error) {
    console.error('Scan error:', error);
    alert('Error scanning page. Please try again.');
  } finally {
    // Reset button state
    scanIcon.textContent = '🔍';
    scanText.textContent = 'Scan This Page';
    scanBtn.disabled = false;
    isScanning = false;
  }
}

// Register content
async function registerContent() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send message to content script to capture content
    const result = await chrome.tabs.sendMessage(tab.id, { action: 'captureContent' });

    if (result.success) {
      // Open dashboard with registration flow
      chrome.tabs.create({
        url: 'http://localhost:3000/dashboard?register=true'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Error capturing content. Please try again.');
  }
}

// Open dashboard
function openDashboard() {
  chrome.tabs.create({
    url: 'http://localhost:3000/dashboard'
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadData();

  document.getElementById('scanBtn').addEventListener('click', scanPage);
  document.getElementById('registerBtn').addEventListener('click', registerContent);
  document.getElementById('dashboardBtn').addEventListener('click', openDashboard);
});

// Listen for updates from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStats') {
    loadData();
  }
});
