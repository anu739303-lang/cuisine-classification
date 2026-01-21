from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import os
import warnings
try:
    from sklearn.exceptions import InconsistentVersionWarning
    warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
except Exception:
    # If sklearn or the warning class isn't available, proceed without filtering
    pass

app = Flask(__name__, static_folder='frontend')
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
if not os.path.exists(MODEL_PATH):
    load_error = f"model.pkl not found at {MODEL_PATH}"
    model = None
else:
    try:
        model = joblib.load(MODEL_PATH)
        load_error = None
    except ModuleNotFoundError as e:
        # Missing dependency (e.g., sklearn) required to unpickle model
        model = None
        load_error = str(e)
    except Exception as e:
        model = None
        load_error = str(e)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    text = data.get('text', '')
    if model is None:
        return jsonify({'error': 'Model not loaded: ' + (load_error or 'unknown')}), 500
    try:
        pred = model.predict([text])
        return jsonify({'predicted_cuisine': str(pred[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
