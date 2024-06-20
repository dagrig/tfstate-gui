# Terraform State Visualizer

A Flask-based web application to visualize Terraform state files stored in AWS S3 and Azure Blob Storage. This application uses D3.js to render the state as a graph, where each node represents a Terraform resource.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [License](#license)

## Features

- Fetch Terraform state from AWS S3 and Azure Blob Storage.
- Visualize Terraform state as an interactive graph using D3.js.
- Display detailed information about each resource on node click.

## Prerequisites

- Python 3.7+
- Flask
- AWS and Azure SDKs for Python
- Node.js (for managing frontend dependencies if needed)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/dagrig/terraform-state-visualizer.git
    cd terraform-state-visualizer
    ```

2. **Create a virtual environment and activate it:**

    ```sh
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the required Python packages:**

    ```sh
    pip install -r requirements.txt
    ```

4. **Install frontend dependencies (if you need to modify the frontend):**

    ```sh
    npm install
    ```

## Configuration

Set the required environment variables for AWS and Azure credentials. You can use a `.env` file to manage these variables easily.

### Environment Variables

#### AWS

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
- `AWS_REGION`: Your AWS region.
- `S3_BUCKET_NAME`: The name of your S3 bucket.
- `STATE_FILE_KEY_AWS`: The key/path to your Terraform state file in S3.

#### Azure

- `AZURE_STORAGE_ACCOUNT_NAME`: Your Azure storage account name.
- `AZURE_CONTAINER_NAME`: The name of your Azure Blob container.
- `STATE_FILE_KEY_AZURE`: The key/path to your Terraform state file in Azure Blob Storage.

Example `.env` file:

```
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
S3_BUCKET_NAME=your-s3-bucket-name
STATE_FILE_KEY_AWS=path/to/terraform.tfstate

AZURE_STORAGE_ACCOUNT_NAME=your-azure-storage-account-name
AZURE_CONTAINER_NAME=your-azure-container-name
STATE_FILE_KEY_AZURE=path/to/terraform.tfstate
```

## Running the Application

1. **Activate the virtual environment (if not already activated):**

    ```sh
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

2. **Run the Flask application:**

    ```sh
    flask run
    ```

3. Open your browser and navigate to `http://127.0.0.1:5000`.

## Usage

- Use the buttons at the top of the page to load the Terraform state from AWS or Azure.
- Click on nodes in the graph to view detailed information about the resources.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
