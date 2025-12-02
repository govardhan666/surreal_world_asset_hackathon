# IP Guardian Browser Extension

Real-time IP protection and violation detection directly in your browser.

## Features

- **One-Click Scanning**: Scan any webpage for potential IP violations
- **Context Menu Integration**: Right-click on images to register or scan
- **Real-Time Monitoring**: Continuous background scanning of protected content
- **Instant Notifications**: Get alerted when violations are detected
- **Easy Registration**: Capture and register content directly from any webpage

## Installation

### For Development

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `extension` directory from this project

### For Production

The extension will be available on the Chrome Web Store after submission.

## Usage

### Scanning a Page

1. Click the IP Guardian icon in your browser toolbar
2. Click "Scan This Page"
3. View results showing any potential violations

### Registering Content

**Method 1: From Popup**
1. Navigate to a page with your original content
2. Click the IP Guardian icon
3. Click "Register Content"
4. Complete registration in the dashboard

**Method 2: Context Menu**
1. Right-click on any image
2. Select "Register with IP Guardian"
3. Complete registration in the dashboard

### Monitoring Protected Content

Once you've registered content:
- The extension automatically scans pages you visit
- You'll receive notifications if violations are detected
- View all violations in the dashboard

## Privacy

IP Guardian:
- Only scans pages you actively visit
- Does not collect or transmit personal data
- Stores protection data locally in your browser
- Only communicates with the IP Guardian API for content analysis

## Support

For issues or feature requests:
- GitHub Issues: https://github.com/ip-guardian/extension/issues
- Email: support@ipguardian.app

## License

MIT License - see LICENSE file for details
