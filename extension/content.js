// Content script for IP Guardian extension

console.log('IP Guardian content script loaded');

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanPage') {
    scanCurrentPage().then(sendResponse);
    return true; // Keep channel open for async response
  }

  if (message.action === 'captureContent') {
    capturePageContent().then(sendResponse);
    return true;
  }

  if (message.action === 'backgroundScan') {
    performBackgroundScan();
    sendResponse({ success: true });
  }
});

// Scan current page for images
async function scanCurrentPage() {
  const images = document.querySelectorAll('img');
  const imageUrls = Array.from(images)
    .map(img => img.src)
    .filter(src => src.startsWith('http'));

  // Simulate AI detection (in production, this would call the AI service)
  const mockResults = {
    imageCount: imageUrls.length,
    maxSimilarity: Math.floor(Math.random() * 100),
    violations: []
  };

  // Check if any images match protected assets
  const protectedAssets = await getProtectedAssets();

  for (const imageUrl of imageUrls.slice(0, 5)) { // Limit to first 5 for demo
    const similarity = Math.random() * 100;

    if (similarity > 85) {
      mockResults.violations.push({
        imageUrl,
        similarity: similarity.toFixed(1),
        sourceUrl: window.location.href
      });

      if (similarity > mockResults.maxSimilarity) {
        mockResults.maxSimilarity = Math.floor(similarity);
      }
    }
  }

  return mockResults;
}

// Capture page content for registration
async function capturePageContent() {
  const images = document.querySelectorAll('img');
  const text = document.body.innerText;

  const content = {
    images: Array.from(images).slice(0, 10).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight
    })),
    text: text.substring(0, 5000), // First 5000 characters
    url: window.location.href,
    title: document.title,
    timestamp: Date.now()
  };

  return { success: true, content };
}

// Perform background scan
async function performBackgroundScan() {
  const protectedAssets = await getProtectedAssets();

  if (protectedAssets.length === 0) return;

  const images = document.querySelectorAll('img');

  for (const img of images) {
    // Simulate similarity check
    const similarity = Math.random() * 100;

    if (similarity > 90) {
      // Report violation
      chrome.runtime.sendMessage({
        action: 'violationDetected',
        data: {
          imageUrl: img.src,
          sourceUrl: window.location.href,
          similarity: similarity.toFixed(1)
        }
      });
      break; // Only report first violation to avoid spam
    }
  }
}

// Get protected assets from storage
async function getProtectedAssets() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: 'getProtectedAssets' },
      (response) => {
        resolve(response?.assets || []);
      }
    );
  });
}

// Add visual indicator for protected content (optional)
function addProtectionIndicator(element) {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
  indicator.textContent = '🛡️';
  indicator.title = 'Protected by IP Guardian';

  const parent = element.parentElement;
  if (parent.style.position === 'static') {
    parent.style.position = 'relative';
  }

  parent.appendChild(indicator);
}

// Initialize - mark protected images
async function initializeProtection() {
  const protectedAssets = await getProtectedAssets();

  if (protectedAssets.length > 0) {
    const images = document.querySelectorAll('img');

    // For demo, add protection indicator to first few images
    images.forEach((img, index) => {
      if (index < 3) { // Only first 3 for demo
        setTimeout(() => {
          // addProtectionIndicator(img); // Uncomment to enable visual indicators
        }, 500);
      }
    });
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProtection);
} else {
  initializeProtection();
}
