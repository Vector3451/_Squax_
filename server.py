from flask import Flask, request, Response
from flask_cors import CORS
import requests

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/proxy', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def proxy():
    if request.method == 'OPTIONS':
        return Response(status=204)

    target_url = request.args.get('url')
    if not target_url:
        return Response("Missing ?url= parameter", status=400)

    # Forward headers securely, stripping typical browser CORS limiters
    excluded_headers = ['Host', 'Origin', 'Referer', 'Connection', 'Accept-Encoding']
    headers = {k: v for k, v in request.headers if k not in excluded_headers}

    try:
        # Forward request from the backend, bypassing browser CORS
        resp = requests.request(
            method=request.method,
            url=target_url,
            headers=headers,
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=True,
            timeout=60
        )
        
        # Relay response back to the frontend
        excluded_resp_headers = ['Content-Encoding', 'Content-Length', 'Transfer-Encoding', 'Connection']
        resp_headers = {k: v for k, v in resp.headers.items() if k not in excluded_resp_headers}
        
        # Explicitly open CORS for the frontend
        resp_headers['Access-Control-Allow-Origin'] = '*'
        
        return Response(resp.content, resp.status_code, resp_headers)
    except Exception as e:
        return Response(f"Flask Proxy Error: {str(e)}", status=500)

if __name__ == '__main__':
    print("🚀 Squax Local Server started at http://127.0.0.1:5000")
    print("🔌 Local CORS Proxy available at http://127.0.0.1:5000/proxy")
    app.run(host='127.0.0.1', port=5000, debug=True)
