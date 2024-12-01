from flask import Flask, jsonify
from flask_cors import CORS
from endpoints.autocomplete import autocomplete_bp
from endpoints.search_by_name import search_bp

app = Flask(__name__)

# Apply CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(autocomplete_bp)
app.register_blueprint(search_bp)

# Global error handler for uncaught exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    # Log the exception (optional for debugging)
    print(f"Unhandled exception: {str(e)}")
    return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)
