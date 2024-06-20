import os
import json
from flask import Flask, jsonify, send_from_directory
import boto3
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='public')

# Fetch AWS credentials from environment variables
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
STATE_FILE_KEY_AWS = os.getenv('STATE_FILE_KEY_AWS')

# Fetch Azure credentials from environment variables
AZURE_STORAGE_ACCOUNT_NAME = os.getenv('AZURE_STORAGE_ACCOUNT_NAME')
AZURE_CONTAINER_NAME = os.getenv('AZURE_CONTAINER_NAME')
STATE_FILE_KEY_AZURE = os.getenv('STATE_FILE_KEY_AZURE')

# Fetch local state file path
LOCAL_STATE_FILE_PATH = os.getenv('LOCAL_STATE_FILE_PATH')

# Initialize the S3 client
s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

# Initialize the Azure Blob Service Client
credential = DefaultAzureCredential()
blob_service_client = BlobServiceClient(
    account_url=f"https://{AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net",
    credential=credential
)

@app.route('/api/state/aws', methods=['GET'])
def get_state_aws():
    obj = s3.get_object(Bucket=S3_BUCKET_NAME, Key=STATE_FILE_KEY_AWS)
    state_data = obj['Body'].read().decode('utf-8')
    return jsonify(state_data)

@app.route('/api/state/azure', methods=['GET'])
def get_state_azure():
    blob_client = blob_service_client.get_blob_client(container=AZURE_CONTAINER_NAME, blob=STATE_FILE_KEY_AZURE)
    blob_data = blob_client.download_blob().readall()
    state_data = blob_data.decode('utf-8')
    return jsonify(state_data)

@app.route('/api/state/local', methods=['GET'])
def get_state_local():
    if not os.path.exists(LOCAL_STATE_FILE_PATH):
        return jsonify({'error': 'Local state file not found'}), 404
    with open(LOCAL_STATE_FILE_PATH, 'r') as file:
        state_data = file.read()
    return jsonify(state_data)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)