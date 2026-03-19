from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to the AI Projects Workspace",
        "apps_built": 200,
        "repository": "21leahcimhtiek-oss/ai-projects",
        "description": "This workspace contains 200+ production-level AI-powered web applications"
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/apps')
def apps():
    return jsonify({
        "total_apps": 200,
        "latest_apps": [
            {"id": 200, "name": "WeddingAI", "url": "https://00m4o.app.super.myninja.ai"},
            {"id": 199, "name": "HomeAI", "url": "https://00m4l.app.super.myninja.ai"},
            {"id": 198, "name": "PetAI", "url": "https://00m4j.app.super.myninja.ai"},
            {"id": 197, "name": "TripAI", "url": "https://00m4i.app.super.myninja.ai"}
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)