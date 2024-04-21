# ValyuDID

Welcome to the ValyuDID repository. This project implements the Valyu DID method specification (detailed in DDOC.md) and provides RESTful APIs for creating and resolving Valyu DIDs, utilizing a straightforward SQL database architecture.

## Overview 📖

ValyuDID offers a set of endpoints designed for managing decentralized identifiers (DIDs). It enables the creation of new DIDs for users and data, as well as the resolution of existing DIDs, using a custom-built resolver, and provider, based on the Veramo framework.

## Getting Started 🚀

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

These endpoints allow you to interact with the blockchain and manage DIDs efficiently.

## Postman API Documentation 📚

For comprehensive API testing and documentation, access our Postman collection:

[Valyu-DID Postman Collection](https://api.postman.com/collections/30064176-1c83c789-8580-47d4-8778-1f110f370423?access_key=PMAT-01HW1BWC7376NQYN8CMKZ1VV7G)

This collection includes detailed requests and responses for each endpoint, helping you to effectively integrate and test the Valyu-DID APIs.

### Docker Image 🐳

For deploying using Docker, the Valyu-DID Docker image is available on DockerHub:

[DockerHub: yorkeccak/valyu-did](https://hub.docker.com/repository/docker/yorkeccak/valyu-did/general)

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

## Docker Deployment 🐳

This project includes a Dockerfile for building and running the app in a containerized environment. To build and run the Docker container, use:

```bash
docker build -t valyudid .
docker run -p 3000:3000 valyudid
```

This will expose the application on port 3000, accessible via `http://localhost:3000`.

## License 📄

This project is currently unlicensed and proprietary. Please contact us for any inquiries regarding usage or licensing.
