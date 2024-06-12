from flask import Flask, jsonify, render_template
import json

app = Flask(__name__)

# Load the Terraform state file (terraform.tfstate)
def load_terraform_state(file_path):
    with open(file_path) as f:
        return json.load(f)

@app.route('/api/state')
def get_state():
    state = load_terraform_state('terraform.tfstate')
    return jsonify(state)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)