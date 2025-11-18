# IP Guardian AI Detection Service

AI-powered content detection and similarity analysis service for IP Guardian platform.

## Features

- **Image Detection**: Perceptual hashing for image similarity detection
- **Text Detection**: N-gram based text similarity analysis
- **Violation Monitoring**: Real-time scanning for unauthorized usage
- **Content Registration**: Track registered IP assets
- **Automated Reporting**: Generate violation reports automatically

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Run the service
python app.py
```

## API Endpoints

### Health Check
```
GET /health
```

### Detect Image Content
```
POST /api/detect/image
Content-Type: multipart/form-data

file: <image_file>
```

### Detect Text Content
```
POST /api/detect/text
Content-Type: application/json

{
  "text": "Content to analyze"
}
```

### Register Content
```
POST /api/register
Content-Type: application/json

{
  "content_id": "unique_id",
  "content_type": "image|text|video|audio",
  "hashes": {...},
  "owner": "0x...",
  "name": "Content name"
}
```

### Scan for Violations
```
POST /api/scan
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Report Violation
```
POST /api/report-violation
Content-Type: application/json

{
  "content_id": "unique_id",
  "url": "violator_url",
  "similarity": 95.5,
  "reporter": "0x..."
}
```

### Get Violations
```
GET /api/violations
```

### Get Statistics
```
GET /api/stats
```

## Technology Stack

- **Flask**: Web framework
- **Pillow**: Image processing
- **ImageHash**: Perceptual hashing algorithms
- **NumPy**: Numerical computations

## Development

For production deployment, replace the in-memory database with a proper database (PostgreSQL, MongoDB, etc.) and implement actual web crawling for violation detection.
