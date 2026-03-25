from flask import Flask, request, jsonify
import userCode

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
def index():
    try:
        # 1. Capturamos los datos de la URL y el Body
        query = request.args.to_dict()
        body = request.get_json(silent=True) or {}
        
        # 2. Le pasamos query y body a la función
        resultado = userCode.handler(query, body)
        
        return jsonify({"success": True, "data": resultado})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)