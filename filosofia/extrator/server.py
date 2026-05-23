"""
Extrator PDF → JSON usando pdfplumber (versão simples)
Instalar: pip install flask pdfplumber
Rodar:    python server.py
Acessar:  http://localhost:5050/pdfplumber
"""

import json
import os
import tempfile
import time

import pdfplumber
from flask import Flask, Response, jsonify, request, stream_with_context

app = Flask(__name__)

@app.after_request
def cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@app.route("/ping")
def ping():
    return jsonify({"ok": True})


@app.route("/pdfplumber")
def index():
    with open(os.path.join(os.path.dirname(__file__), "pdfplumber.html"), "r", encoding="utf-8") as f:
        return f.read(), 200, {"Content-Type": "text/html; charset=utf-8"}


@app.route("/upload", methods=["POST", "OPTIONS"])
def upload():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    f = request.files.get("pdf")
    if not f:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    f.save(tmp.name)
    tmp.close()

    # Processa imediatamente e devolve o JSON
    result = {"filename": f.filename, "pages": [], "fullText": ""}
    try:
        with pdfplumber.open(tmp.name) as pdf:
            result["totalPages"] = len(pdf.pages)
            parts = []
            for i, page in enumerate(pdf.pages):
                text = page.extract_text(x_tolerance=3, y_tolerance=3) or ""
                result["pages"].append({"page": i + 1, "text": text})
                parts.append(text)
            result["fullText"] = "\n\n".join(parts)
    finally:
        os.unlink(tmp.name)

    return jsonify(result)


if __name__ == "__main__":
    print("=" * 50)
    print("  Extrator PDF → JSON  |  pdfplumber")
    print("  http://localhost:5050/pdfplumber")
    print("=" * 50)
    app.run(debug=False, port=5050, threaded=True)
