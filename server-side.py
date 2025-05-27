from flask import Flask, request, jsonify
from flask_cors import CORS
import ssl
import json

app = Flask(__name__)
CORS(app, origins="*")  # 允许所有源

server_data_store = {
    "pos": {
        "-1": {},
        "-2": {},
        "1": {},
        "2": {},
        "3": {},
        "4": {},
        "5": {},
        "6": {},
        "11": {},
        "12": {},
        "13": {},
        "14": {},
        "21": {},
        "22": {},
        "23": {},
        "24": {},
        "31": {},
        "32": {},
        "33": {},
        "34": {},
        "41": {},
        "42": {},
        "43": {},
    }
}

def clean_data_for_json(data):
    """清理数据以确保JSON序列化兼容性"""
    if isinstance(data, dict):
        return {k: clean_data_for_json(v) for k, v in data.items() if v is not None}
    elif isinstance(data, list):
        return [clean_data_for_json(item) for item in data if item is not None]
    elif data is None:
        return {}
    return data

@app.route('/api/data', methods=['GET', 'POST'])
def handle_data():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        # 修正：使用字典访问方式
        pos = data["pos"]
        if pos is None or pos not in server_data_store["pos"]:
            return jsonify({"error": "Invalid position"}), 400

        pos_data = server_data_store["pos"].get(pos, {})
        pos_data.update({
            "name": data["name"],
            "rarity": data["rarity"],
            "timestamp": data["timestamp"],
            "beyond": data["beyond"],
            "threshold": data["threshold"]
        })
        server_data_store["pos"][pos] = pos_data
        
        response = {
            "status": "success",
            "message": "Data received successfully",
            "received_data": data
        }

        print(server_data_store)
        return jsonify(response)
    
    elif request.method == 'GET':
        # 清理数据以避免JSON序列化错误
        cleaned_data = clean_data_for_json(server_data_store)
        
        response = {
            "status": "success",
            "messages": cleaned_data,
            "server_info": "Python Flask server on Linux"
        }
        return jsonify(response)

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5588
    )