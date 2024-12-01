from flask import Flask
from endpoints.autocomplete import autocomplete_bp
from endpoints.search_by_name import search_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(autocomplete_bp)
app.register_blueprint(search_bp)

if __name__ == "__main__":
    app.run(debug=True)
