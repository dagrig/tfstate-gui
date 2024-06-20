from flask import Flask, jsonify, send_from_directory
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

app = Flask(__name__)

S3_BUCKET = 'your-bucket-name'
S3_KEY = 'path/to/your/statefile.tfstate'
AWS_REGION = 'your-aws-region'

@app.route('/api/state', methods=['GET'])
def get_state_file():
    try:
        s3 = boto3.client('s3', region_name=AWS_REGION)
        response = s3.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
        state_file = response['Body'].read().decode('utf-8')
        return jsonify(state_file)
    except (NoCredentialsError, PartialCredentialsError):
        return jsonify({'error': 'AWS credentials not found'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def serve_index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)