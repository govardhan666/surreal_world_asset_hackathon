// Background service worker for IP Guardian extension

console.log('IP Guardian background service worker initialized');

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('IP Guardian extension installed');

  // Set default storage
  chrome.storage.local.set({
    protectedAssets: [],
    violations: [],
    settings: {
      autoScan: true,
      notifications: true,
      scanInterval: 3600000 // 1 hour
    }
  });

  // Create context menu
  chrome.contextMenus.create({
    id: 'registerImage',
    title: 'Register with IP Guardian',
    contexts: ['image']
  });

  chrome.contextMenus.create({
    id: 'scanImage',
    title: 'Scan for Violations',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'registerImage') {
    handleImageRegistration(info, tab);
  } else if (info.menuItemId === 'scanImage') {
    handleImageScan(info, tab);
  }
});

// Register image from context menu
async function handleImageRegistration(info, tab) {
  const imageUrl = info.srcUrl;

  try {
    // Store image URL for registration
    await chrome.storage.local.set({
      pendingRegistration: {
        url: imageUrl,
        source: tab.url,
        timestamp: Date.now()
      }
    });

    // Open dashboard with registration flow
    chrome.tabs.create({
      url: 'http://localhost:3000/dashboard?register=true'
    });

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Image Captured',
      message: 'Image captured for registration. Opening dashboard...',
      priority: 1
    });
  } catch (error) {
    console.error('Registration error:', error);
  }
}

// Scan image from context menu
async function handleImageScan(info, tab) {
  const imageUrl = info.srcUrl;

  try {
    // In a real implementation, this would call the AI service
    // For demo purposes, we'll simulate a scan
    const mockSimilarity = Math.random() * 100;

    if (mockSimilarity > 85) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Violation Detected!',
        message: `This image may be violating your IP (${mockSimilarity.toFixed(1)}% similarity)`,
        priority: 2
      });

      // Store violation
      const result = await chrome.storage.local.get(['violations']);
      const violations = result.violations || [];

      violations.push({
        id: Date.now(),
        imageUrl,
        sourceUrl: tab.url,
        similarity: mockSimilarity,
        detectedAt: Date.now(),
        status: 'unresolved'
      });

      await chrome.storage.local.set({ violations });
    } else {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'No Violations Found',
        message: 'This image appears to be original or properly licensed',
        priority: 1
      });
    }
  } catch (error) {
    console.error('Scan error:', error);
  }
}

// Periodic scan for monitoring
async function periodicScan() {
  const result = await chrome.storage.local.get(['settings', 'protectedAssets']);
  const settings = result.settings || {};

  if (!settings.autoScan) return;

  // Get all tabs
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    try {
      // Send scan message to content script
      await chrome.tabs.sendMessage(tab.id, { action: 'backgroundScan' });
    } catch (error) {
      // Tab might not have content script injected
      console.log('Could not scan tab:', tab.id);
    }
  }
}

// Set up periodic scanning
chrome.alarms.create('periodicScan', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodicScan') {
    periodicScan();
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'violationDetected') {
    handleViolationDetection(message.data);
    sendResponse({ success: true });
  }

  if (message.action === 'getProtectedAssets') {
    chrome.storage.local.get(['protectedAssets'], (result) => {
      sendResponse({ assets: result.protectedAssets || [] });
    });
    return true; // Keep channel open for async response
  }

  if (message.action === 'addProtectedAsset') {
    addProtectedAsset(message.data).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle violation detection
async function handleViolationDetection(data) {
  const result = await chrome.storage.local.get(['violations']);
  const violations = result.violations || [];

  violations.push({
    id: Date.now(),
    ...data,
    detectedAt: Date.now(),
    status: 'unresolved'
  });

  await chrome.storage.local.set({ violations });

  // Send notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'New Violation Detected',
    message: `Found ${data.similarity}% similarity on ${data.sourceUrl}`,
    priority: 2
  });
}

// Add protected asset
async function addProtectedAsset(asset) {
  const result = await chrome.storage.local.get(['protectedAssets']);
  const protectedAssets = result.protectedAssets || [];

  protectedAssets.push({
    id: Date.now(),
    ...asset,
    registeredAt: Date.now()
  });

  await chrome.storage.local.set({ protectedAssets });

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Asset Protected',
    message: `${asset.name} is now being monitored`,
    priority: 1
  });
}
