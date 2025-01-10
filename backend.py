from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import pandas as pd


app = Flask(__name__)
CORS(app)


qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if not file.filename.endswith('.xlsx'):
        return jsonify({"error": "Invalid file format. Please upload an Excel file."}), 400

    df = pd.read_excel(file)
    content = df.to_json(orient='records')
    return jsonify({"message": "File processed successfully", "content": content}), 200


@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    document = data.get('document', '')
    question = data.get('question', '')

    if not document or not question:
        return jsonify({"error": "Document or question missing."}), 400

    try:
        response = qa_pipeline({
            "context": document,  
            "question": question  
        })
        answer = response.get("answer", "I could not find an answer.")
        return jsonify({"answer": answer}), 200

    except Exception as e:
        print("Error occurred: {}".format(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    try:
        app.run(debug=True)
    except Exception as e:
        print("Error occurred: {}".format(e))
