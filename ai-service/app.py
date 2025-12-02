"""
IP Guardian AI Detection Service
Provides AI-powered content similarity detection and violation monitoring
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import imagehash
from PIL import Image
import io
import base64
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# In-memory database for demo (replace with real database in production)
registered_content = {}
violation_reports = []


class ContentDetector:
    """AI-powered content detection engine"""

    @staticmethod
    def generate_image_hash(image_data):
        """Generate perceptual hash for images"""
        try:
            image = Image.open(io.BytesIO(image_data))
            # Generate multiple hashes for better accuracy
            ahash = str(imagehash.average_hash(image))
            phash = str(imagehash.phash(image))
            dhash = str(imagehash.dhash(image))
            whash = str(imagehash.whash(image))

            return {
                "average_hash": ahash,
                "perceptual_hash": phash,
                "difference_hash": dhash,
                "wavelet_hash": whash,
                "combined_hash": f"{ahash}-{phash}-{dhash}-{whash}",
            }
        except Exception as e:
            raise ValueError(f"Error processing image: {str(e)}")

    @staticmethod
    def generate_text_hash(text):
        """Generate hash for text content"""
        # SHA-256 hash
        sha256 = hashlib.sha256(text.encode()).hexdigest()

        # Simple n-gram based similarity (for demo)
        words = text.lower().split()
        ngrams = [" ".join(words[i : i + 3]) for i in range(len(words) - 2)]

        return {
            "sha256": sha256,
            "word_count": len(words),
            "ngrams": ngrams[:10],  # First 10 n-grams
        }

    @staticmethod
    def calculate_similarity(hash1, hash2, content_type="image"):
        """Calculate similarity between two content hashes"""
        if content_type == "image":
            # Calculate Hamming distance for image hashes
            try:
                h1 = imagehash.hex_to_hash(hash1.get("perceptual_hash", ""))
                h2 = imagehash.hex_to_hash(hash2.get("perceptual_hash", ""))
                distance = h1 - h2

                # Convert distance to similarity percentage
                # Smaller distance = higher similarity
                max_distance = 64  # For 8x8 hash
                similarity = ((max_distance - distance) / max_distance) * 100
                return max(0, min(100, similarity))
            except:
                return 0

        elif content_type == "text":
            # Simple text similarity based on SHA-256
            if hash1.get("sha256") == hash2.get("sha256"):
                return 100.0

            # N-gram based similarity
            ngrams1 = set(hash1.get("ngrams", []))
            ngrams2 = set(hash2.get("ngrams", []))

            if not ngrams1 or not ngrams2:
                return 0

            intersection = len(ngrams1.intersection(ngrams2))
            union = len(ngrams1.union(ngrams2))

            similarity = (intersection / union) * 100 if union > 0 else 0
            return similarity

        return 0


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "IP Guardian AI Detection"}), 200


@app.route("/api/detect/image", methods=["POST"])
def detect_image():
    """Detect and analyze image content"""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        image_data = file.read()

        # Generate hashes
        hashes = ContentDetector.generate_image_hash(image_data)

        # Check for similar registered content
        violations = []
        for content_id, content in registered_content.items():
            if content["type"] != "image":
                continue

            similarity = ContentDetector.calculate_similarity(
                hashes, content["hashes"], "image"
            )

            if similarity > 85:  # Threshold for potential violation
                violations.append(
                    {
                        "content_id": content_id,
                        "similarity": round(similarity, 2),
                        "owner": content.get("owner", "Unknown"),
                        "name": content.get("name", "Unnamed"),
                        "registered_date": content.get("registered_date"),
                    }
                )

        response = {
            "content_type": "image",
            "hashes": hashes,
            "timestamp": datetime.now().isoformat(),
            "violations_detected": len(violations),
            "violations": sorted(violations, key=lambda x: x["similarity"], reverse=True),
            "is_original": len(violations) == 0,
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/detect/text", methods=["POST"])
def detect_text():
    """Detect and analyze text content"""
    try:
        data = request.json
        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data["text"]

        # Generate hashes
        hashes = ContentDetector.generate_text_hash(text)

        # Check for similar registered content
        violations = []
        for content_id, content in registered_content.items():
            if content["type"] != "text":
                continue

            similarity = ContentDetector.calculate_similarity(
                hashes, content["hashes"], "text"
            )

            if similarity > 70:  # Threshold for potential violation
                violations.append(
                    {
                        "content_id": content_id,
                        "similarity": round(similarity, 2),
                        "owner": content.get("owner", "Unknown"),
                        "name": content.get("name", "Unnamed"),
                        "registered_date": content.get("registered_date"),
                    }
                )

        response = {
            "content_type": "text",
            "hashes": hashes,
            "timestamp": datetime.now().isoformat(),
            "violations_detected": len(violations),
            "violations": sorted(violations, key=lambda x: x["similarity"], reverse=True),
            "is_original": len(violations) == 0,
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/register", methods=["POST"])
def register_content():
    """Register content for monitoring"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        content_id = data.get("content_id")
        content_type = data.get("content_type")
        hashes = data.get("hashes")
        owner = data.get("owner")
        name = data.get("name")

        if not all([content_id, content_type, hashes, owner]):
            return jsonify({"error": "Missing required fields"}), 400

        # Store registered content
        registered_content[content_id] = {
            "type": content_type,
            "hashes": hashes,
            "owner": owner,
            "name": name,
            "registered_date": datetime.now().isoformat(),
        }

        return (
            jsonify(
                {
                    "success": True,
                    "content_id": content_id,
                    "message": "Content registered successfully",
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/scan", methods=["POST"])
def scan_for_violations():
    """Scan for violations across registered content"""
    try:
        data = request.json
        url = data.get("url")

        # Mock violation detection (in production, this would crawl the web)
        # For demo, we'll return simulated results

        mock_violations = [
            {
                "url": "https://example.com/unauthorized-use",
                "similarity": 95.5,
                "detected_at": datetime.now().isoformat(),
                "status": "unresolved",
                "content_type": "image",
            }
        ]

        return (
            jsonify(
                {
                    "scan_id": hashlib.sha256(str(datetime.now()).encode()).hexdigest()[
                        :16
                    ],
                    "scanned_url": url,
                    "violations_found": len(mock_violations),
                    "violations": mock_violations,
                    "timestamp": datetime.now().isoformat(),
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/report-violation", methods=["POST"])
def report_violation():
    """Report a detected violation"""
    try:
        data = request.json

        violation = {
            "id": len(violation_reports) + 1,
            "content_id": data.get("content_id"),
            "violator_url": data.get("url"),
            "similarity": data.get("similarity"),
            "reported_at": datetime.now().isoformat(),
            "status": "pending",
            "reporter": data.get("reporter"),
        }

        violation_reports.append(violation)

        return (
            jsonify(
                {
                    "success": True,
                    "violation_id": violation["id"],
                    "message": "Violation reported successfully",
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/violations", methods=["GET"])
def get_violations():
    """Get all reported violations"""
    return jsonify({"violations": violation_reports}), 200


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get detection service statistics"""
    stats = {
        "total_registered_content": len(registered_content),
        "total_violations_reported": len(violation_reports),
        "content_by_type": {
            "image": sum(
                1 for c in registered_content.values() if c["type"] == "image"
            ),
            "text": sum(1 for c in registered_content.values() if c["type"] == "text"),
            "video": sum(
                1 for c in registered_content.values() if c["type"] == "video"
            ),
            "audio": sum(
                1 for c in registered_content.values() if c["type"] == "audio"
            ),
        },
        "unresolved_violations": sum(
            1 for v in violation_reports if v["status"] == "pending"
        ),
    }

    return jsonify(stats), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("DEBUG", "True") == "True"

    print("=" * 60)
    print("🛡️  IP Guardian AI Detection Service")
    print("=" * 60)
    print(f"🚀 Starting server on port {port}")
    print(f"🔍 Detection engine initialized")
    print(f"📊 Endpoints available:")
    print(f"   - POST /api/detect/image - Detect image content")
    print(f"   - POST /api/detect/text - Detect text content")
    print(f"   - POST /api/register - Register content for monitoring")
    print(f"   - POST /api/scan - Scan for violations")
    print(f"   - POST /api/report-violation - Report a violation")
    print(f"   - GET  /api/violations - Get all violations")
    print(f"   - GET  /api/stats - Get service statistics")
    print("=" * 60)

    app.run(host="0.0.0.0", port=port, debug=debug)
