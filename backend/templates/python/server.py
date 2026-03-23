from flask import Flask, request, jsonify
import userCode

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
def handler():
    try:
        # Llamamos a la función principal que el orquestador creó con el código del usuario
        result = userCode.handler()
        
        # requisito de retornar JSON
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    # host='0.0.0.0' es obligatorio en Docker para exponer el puerto hacia afuera
    app.run(host='0.0.0.0', port=3000)