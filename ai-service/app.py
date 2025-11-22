from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import hashlib
import imagehash
from PIL import Image
import io
import numpy as np
import cv2
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class IPDetectionService:
    """AI-powered IP detection service"""

    @staticmethod
    def calculate_image_hash(image_data):
        """Calculate perceptual hash of image"""
        try:
            image = Image.open(io.BytesIO(image_data))
            # Calculate multiple hash types for better accuracy
            phash = str(imagehash.phash(image))
            ahash = str(imagehash.average_hash(image))
            dhash = str(imagehash.dhash(image))

            return {
                'phash': phash,
                'ahash': ahash,
                'dhash': dhash,
                'combined': f"{phash}_{ahash}_{dhash}"
            }
        except Exception as e:
            print(f"Error calculating image hash: {e}")
            return None

    @staticmethod
    def detect_image_similarity(image1_data, image2_data):
        """Detect similarity between two images"""
        try:
            hash1 = IPDetectionService.calculate_image_hash(image1_data)
            hash2 = IPDetectionService.calculate_image_hash(image2_data)

            if not hash1 or not hash2:
                return 0.0

            # Calculate Hamming distance for each hash type
            phash1 = imagehash.hex_to_hash(hash1['phash'])
            phash2 = imagehash.hex_to_hash(hash2['phash'])

            distance = phash1 - phash2
            max_distance = 64  # Maximum possible distance for 64-bit hash
            similarity = 1.0 - (distance / max_distance)

            return similarity
        except Exception as e:
            print(f"Error detecting similarity: {e}")
            return 0.0

    @staticmethod
    def extract_features(image_data):
        """Extract visual features from image using OpenCV"""
        try:
            # Convert to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return None

            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Detect features using ORB
            orb = cv2.ORB_create()
            keypoints, descriptors = orb.detectAndCompute(gray, None)

            return {
                'keypoints_count': len(keypoints),
                'descriptors_shape': descriptors.shape if descriptors is not None else (0, 0),
                'image_shape': img.shape
            }
        except Exception as e:
            print(f"Error extracting features: {e}")
            return None

    @staticmethod
    def scan_for_violations(content_hash, content_type='image'):
        """Scan for potential IP violations across the internet"""
        # In a production system, this would:
        # 1. Query image search APIs (Google, TinEye, etc.)
        # 2. Check social media platforms
        # 3. Search content databases
        # 4. Use AI models for similarity detection

        # For demo purposes, return mock results
        mock_matches = []

        # Simulate finding some matches
        import random
        if random.random() > 0.6:  # 40% chance of finding matches
            mock_matches = [
                {
                    'url': 'https://example.com/content-1',
                    'platform': 'Example Platform',
                    'similarity': 0.85,
                    'detected_at': '2025-01-15T10:00:00Z'
                },
                {
                    'url': 'https://social.example.com/post/123',
                    'platform': 'Social Media',
                    'similarity': 0.78,
                    'detected_at': '2025-01-14T15:30:00Z'
                }
            ]

        return {
            'matches': mock_matches,
            'total_scanned': 1000,
            'violations_found': len(mock_matches)
        }

# Routes

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'IP Detection AI'})

@app.route('/api/scan/image', methods=['POST'])
def scan_image():
    """Scan image for IP violations"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Read image data
        image_data = file.read()

        # Calculate hash
        hashes = IPDetectionService.calculate_image_hash(image_data)
        if not hashes:
            return jsonify({'error': 'Failed to process image'}), 500

        # Extract features
        features = IPDetectionService.extract_features(image_data)

        # Scan for violations
        scan_results = IPDetectionService.scan_for_violations(
            hashes['combined'],
            'image'
        )

        # Calculate content hash for storage
        content_hash = hashlib.sha256(image_data).hexdigest()

        return jsonify({
            'success': True,
            'contentHash': content_hash,
            'perceptualHashes': hashes,
            'features': features,
            'scanResults': scan_results,
            'isOriginal': len(scan_results['matches']) == 0,
            'similarity': max([m['similarity'] for m in scan_results['matches']], default=0.0),
            'matches': scan_results['matches']
        })

    except Exception as e:
        print(f"Error in scan_image: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/compare/images', methods=['POST'])
def compare_images():
    """Compare two images for similarity"""
    try:
        if 'file1' not in request.files or 'file2' not in request.files:
            return jsonify({'error': 'Two files required'}), 400

        file1 = request.files['file1']
        file2 = request.files['file2']

        image1_data = file1.read()
        image2_data = file2.read()

        similarity = IPDetectionService.detect_image_similarity(
            image1_data,
            image2_data
        )

        return jsonify({
            'success': True,
            'similarity': similarity,
            'match': similarity > 0.8,  # 80% threshold
            'confidence': similarity
        })

    except Exception as e:
        print(f"Error in compare_images: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/hash/generate', methods=['POST'])
def generate_hash():
    """Generate content hash for uploaded file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        file_data = file.read()

        # Generate SHA-256 hash
        content_hash = hashlib.sha256(file_data).hexdigest()

        # If image, also generate perceptual hash
        perceptual_hashes = None
        if file.content_type and file.content_type.startswith('image/'):
            perceptual_hashes = IPDetectionService.calculate_image_hash(file_data)

        return jsonify({
            'success': True,
            'contentHash': content_hash,
            'perceptualHashes': perceptual_hashes,
            'fileSize': len(file_data),
            'fileType': file.content_type
        })

    except Exception as e:
        print(f"Error in generate_hash: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('AI_SERVICE_PORT', 5000))
    print(f'🤖 AI Detection Service running on port {port}')
    print(f'   Health check: http://localhost:{port}/health')
    app.run(host='0.0.0.0', port=port, debug=True)
