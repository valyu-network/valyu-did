# ValyuDID

Welcome to the ValyuDID repository. This project implements the Valyu DID method specification (detailed in DDOC.md) and provides RESTful APIs for creating and resolving Valyu DIDs, utilizing a straightforward SQL database architecture.

## Overview 📖

ValyuDID offers a set of endpoints designed for managing decentralized identifiers (DIDs). It enables the creation of new DIDs for users and data, as well as the resolution of existing DIDs, using a custom-built resolver, and provider, leveraging the Veramo framework.

## Getting Started 🚀

### Dependencies 🧰
This project heavily relies on the Veramo framework, which is crucial for managing the lifecycle of decentralized identifiers and their associated cryptographic operations. For more details on Veramo, please visit their [official documentation](https://veramo.io/docs/basics/introduction)

### Prerequisites 📋

- Node.js (v18 or higher)
- npm (v8 or higher)
- Access to `.env` configurations (see example below)

### Setting Up the Environment 🛠️

**Clone the Repository:**

```bash
git clone https://github.com/valyu-network/valyu-did.git
cd valyu-did
```

**Install Dependencies:**

```bash
npm install
```

### Configuration 🛠️

**Environment Variables:**

Create a `.env` file in the root directory and populate it with the necessary secrets:

```plaintext
KMS_SECRET_KEY=<Your_Secret_Key>
```

The KMS_SECRET_KEY can be any string, like a password. It's used for key management operations within Veramo.

### Running the Project 🌐

Start the server locally with:

```bash
npm start
```

This will run the project at `http://localhost:3000`.

## Usage 🛠️

The server exposes three primary endpoints:

- `POST /createUserDID` - Create a new user DID.
- `POST /createDataDID` - Create a new data DID.
- `POST /resolveDID` - Resolve an existing DID.

## Postman API Documentation 📚

For comprehensive API testing and documentation, access our Postman collection:

[Valyu-DID Postman Collection](https://api.postman.com/collections/30064176-1c83c789-8580-47d4-8778-1f110f370423?access_key=PMAT-01HW1BWC7376NQYN8CMKZ1VV7G)

This collection includes detailed requests and responses for each endpoint, helping you to effectively integrate and test the Valyu-DID APIs.

### APIs Included in the Collection:

- **Create Data DID (POST /createDataDID)**: Create a new data DID.
  - Request Body: `alias`, `dataTokenAddress`, `chainId`, `accessEndpoint`.
  - Success Response: Returns a DID document for the registered data asset.

- **Create User DID (POST /createUserDID)**: Create a new user DID.
  - Request Body: `alias` (required).
  - Success Response: Returns a DID document for the newly created user identity.

- **Resolve DID (POST /resolveDID)**: Resolve a DID and retrieve the associated DID document.
  - Request Body: `did` (required).
  - Success Response: Returns the resolved DID document.
 
Here's a restructured version of the Docker Deployment section that emphasizes pulling the image from DockerHub first, followed by instructions on how to build and run the application locally while specifying the `KMS_SECRET_KEY` as an environment variable:

## Docker Deployment 🐳

This section outlines how to deploy the ValyuDID application using Docker, either by pulling a pre-built image from DockerHub or by building and running a Docker container locally.

### Pulling the Docker Image from DockerHub

To get started quickly without building the image yourself, you can pull the pre-built Docker image from DockerHub:

```bash
docker pull yorkeccak/valyudid:0.1-beta
```

### Running the Docker Container

After pulling the image from DockerHub, you can run the application as follows:

```bash
docker run -p 3000:3000 -e KMS_SECRET_KEY=Your_Secret_Key yorkeccak/valyudid:0.1-beta
```

This command starts a container from the `yorkeccak/valyudid:0.1-beta` image, maps port 3000 inside the container to port 3000 on your host, and sets the `KMS_SECRET_KEY` environment variable required for the application to function properly. Access the application via `http://localhost:3000`.

### Building the Docker Image Locally

If you prefer to build the Docker image yourself, especially for development or modifications, follow these steps:

**Build the Docker Image:**

```bash
docker build -t valyudid .
```

This command builds a Docker image named `valyudid` based on the instructions in your Dockerfile.

**Run the Docker Container:**

```bash
docker run -p 3000:3000 -e KMS_SECRET_KEY=Your_Secret_Key valyudid
```

This command runs your locally built image with the necessary `KMS_SECRET_KEY` set as an environment variable. This setup is crucial for managing cryptographic operations within Veramo used in the application.

### DockerHub

For ease of access and deployment, you can find the Docker image on DockerHub:

[DockerHub: yorkeccak/valyudid](https://hub.docker.com/repository/docker/yorkeccak/valyudid/general)

This configuration ensures that both quick deployments using DockerHub and customized local builds are possible, providing flexibility for different deployment scenarios.

## Contributing 🤝

We welcome contributions from the community! Please follow these steps:

- Fork the repository.
- Create a new branch for your feature.
- Commit your changes.
- Push to the branch.
- Submit a pull request.

### Conventions

- Use camelCase for variable names and function names.
- Keep functions small and focused.
- Document your code where necessary.

## License 📄

This project is currently unlicensed and proprietary. Please contact us for any inquiries regarding usage or licensing.
