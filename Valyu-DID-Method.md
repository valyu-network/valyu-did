# The VALYU DID Method Specification 1.0
## Abstract
The `did:valyu` DID method [DID-CORE](https://www.w3.org/TR/did-core/) provides a standardised format for representing both data and users within the Valyu data ecosystem. Used as part of a larger peer-to-peer fair data protocol.

## Terminology
**Decentralized Identifier**
- A [W3C specification](https://www.w3.org/TR/did-core/) describing an _identifier that enables verifiable, decentralized digital identity_. A DID identifier is associated with a JSON document containing cryptograhpic keys, services, and other properties outlined in the specification.

**Data token**
- An on-chain token representing ownership of the right to access / compute over a given dataset, under a specific policy. A data token is an implementation of the data tokenisation framework described in [DATA-TOKEN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4419590)

## Format
The format for `did:valyu` conforms to the [DID-CORE](https://www.w3.org/TR/did-core/) specification. It consists of the `did:valyu` prefix, followed by one of two types depending on whether the identifier is for a user, or data:
- User: `user:<ethereum-address>`
- Data: `data:<chain-id><data-token-address>`
Specifically, the format is as follows (Extended Backus-Naur Form):
```
<did-value> ::= "did:valyu:" <did-type> ":" <valyu-id>
<did-type> ::= "user" | "data"
<valyu-id> ::= <chain-id> ":" <ethereum-address>
<chain-id> ::= <hexdigit>+
<ethereum-address> ::= "0x" <40hexdigit>

<hexdigit> ::= [0-9A-Fa-f]
<40hexdigit> ::= <hexdigit> {39}
```

A simple example of a valid `did:valyu` DID for both `user`, and `data`:

**User** - User DID, with an ethereum address 
```
did:valyu:user:0x9c8c0eA52F40daB8460353778f9b180Db33A4a9c
```
**Data** - Data DID, with a data token address deployed to Ethereum Mainnet (chain id 0x1)
```
did:valyu:user:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c
```

## Status of the document
This document is a draft version and the initial iteration of the Valyu DID specification, subject to refinement and expansion in subsequent releases to address broader use cases and integrate learned lessons.

## Valyu DID Document Example
Example of a user DID Document:
```
{
	"@context": "https://www.w3.org/ns/did/v1",
	"id": "did:valyu:user:0x8b96279b2f902d878c00790d5c772b747032c653",
	"controller": "04f197e63902712e6be378de3b52d1350cc9df7de1158a43feebc18303a6f51e10736f109ace2365149e43b85cbb7d90fa315536cf0817cbf4bf55c60b50979d3d",
	"authenticationMethod": [
		{
			"id": "did:valyu:user:0x8b96279b2f902d878c00790d5c772b747032c653#ethereum-key-1",
			"type": "X25519",
			"controller": "did:valyu:user:0x8b96279b2f902d878c00790d5c772b747032c653",
			"publicKeyHex": "1fc88700b171ef427e43268132994bedeba8c4b1af8b57733ab202c1a1cb4831"
		}
	],
	"verificationMethod": [
		"did:valyu:user:0x8b96279b2f902d878c00790d5c772b747032c653#ethereum-key-1"
	],
	"assertionMethod": [
		"did:valyu:user:0x8b96279b2f902d878c00790d5c772b747032c653#ethereum-key-1"
	],
	"keyAgreement": [
		{
			"id": "did:valyu:user:0x8b96279b2f902d878c00790d5c772b747032c653#key-exchange-1",
	    		"type": "Secp256k1",
			"controller": "did:valyu:user:0x8b96279b2f902d878c00790d5c772b747032c653",
	    		"publicKeyHex": "04f197e63902712e6be378de3b52d1350cc9df7de1158a43feebc18303a6f51e10736f109ace2365149e43b85cbb7d90fa315536cf0817cbf4bf55c60b50979d3d"
		}
	]
}
```
The DID Document represents a user in the valyu network identified by did:valyu:user:{valyu-id}.

- **Controller**: The controller of this DID might be the user themselves or another entity, such as a parent or guardian in cases where the user might not have full control or autonomy over their data.
- **Authentication:** Utilizes the verification key for cryptographic authentication, ensuring the user's identity is verified when they engage within the network.
- **Verification Method:** Specifies a Secp256k1VerificationKey2018 with the public key in hexadecimal format, confirming that all cryptographic operations are initiated and verified under the user's authority.
- **Assertion Method:** The specified verification key is also used for generating cryptographic proofs (zk-SNARKs or similar zero-knowledge proofs) that support privacy-preserving authentication and authorization processes.
- **Key Agreement:** Establishes an X25519 key agreement protocol to facilitate secure, encrypted communication and data transfer between the data object and authorized parties.

---
An example of a data DID Document:
```
{
	"@context": "https://www.w3.org/ns/did/v1",
	"id": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c",
	"controller": "04e82fd1fb711ea613faf994885ca0c0c660add2e4abb375d6b3ded0d9ccb0cb492f15bc9cc994db6ed79f20406951761e32f6c0f1d938b58e46805e07b0365608",
	"authenticationMethod": [
		{
			"id": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c#key-1",
                    	"type": "Secp256k1",
			"controller": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c",
			"publicKeyHex": "04e82fd1fb711ea613faf994885ca0c0c660add2e4abb375d6b3ded0d9ccb0cb492f15bc9cc994db6ed79f20406951761e32f6c0f1d938b58e46805e07b0365608"
                }
	],
	"verificationMethod": [
		"did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c#key-1"
	],
	"assertionMethod": [
		"did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c#key-1"
	],
	"keyAgreement": [
		{
			"id": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c#key-exchange-1",
			"type": "X25519",
			"controller": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c",
			"publicKeyHex": "0879fe4df724af6d119b7efc564f21bed754976fbfdbf712dac30bd4f3f2aa3f"
                }
	],
	"service": [
		{
			"id": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c#access",
			"type": "Access",
			"serviceEndpoint": "https://access-layer-endpoint-example"
                }
	]
}
```

The DID Document represents a data object in the valyu network with the identifier did:valyu:data:{valyu-id}.

- **Controller**: The data object is self-sovereign, signified by the controller being the data DID itself.
- **Authentication:** Utilizes the verification key for cryptographic authentication, ensuring the data's identity is verified when engaging in the data exchange protocol.
- **Verification Method:** Specifies a Secp256k1VerificationKey2018 with the public key in hexadecimal format, confirming that all cryptographic operations are initiated and verified under the data's authority.
- **Assertion Method:** The specified verification key is also used for generating cryptographic proofs (zk-SNARKs or similar zero-knowledge proofs) that support privacy-preserving authentication and authorization processes.
- **Key Agreement:** Establishes an X25519 key agreement protocol to facilitate secure, encrypted communication and data transfer between the data object and authorized parties.
- **Services**:
	1. **Access Service**: Offers a direct link for secure data access, under specific polices, on the valyu network.
	2. **Compute Service**: Provides a data compute endpoint, facilitating secure operations or transformations on the data.

## Operations

This following section outlines the DID operations for the `did:valyu` method
### Create
#### DID creation algorithm
##### Overview
To create a did:valyu, utilize the DID creation service integrated within the open-source Valyu-DID software. The software repository is accessible on GitHub at Valyu-DID Repository and provides comprehensive documentation on the key generation process, leveraging the Veramo.io framework. The steps involved in the DID creation process are outlined as follows:
##### Prerequisites
- Ensure that Docker is installed on your system as it is required to run the Valyu-DID software containers. Installation instructions for Docker can be found at Docker's official site.
##### Steps
1. Pull the latest Valyu DID Docker image from the Docker Hub registry. Detailed instructions and necessary commands are provided in the repository documentation: [VALYU-DID-DOCS](www.github/valyu-network/ValyuDID/README.md)
2. Run docker container.
3. Once the Docker container is running, new Valyu DIDs can be created by invoking the /createDataDID, and /createUserDID endpoints via the provided API interfaces. The API is well-documented with a Postman collection available in the repository to facilitate interaction with the endpoint.

**Note:** The API is well-documented with a Postman collection available in the repository to facilitate interaction with the endpoint, you can find the Postman collection in [VALYU-DID](www.github/valyu-network/ValyuDID) under the /postman directory

#### Document creation algorithm
The DID creation process automatically creates a DID Document for each new DID created

### Read
##### Overview
To read or resolve a did:valyu identifier, utilize the DID resolution service provided by the open-source Valyu-DID software, available in [VALYU-DID](www.github/valyu-network/ValyuDID).
##### Prerequisites
- Ensure all prerequisites outlined in [DID Creation Algorithm](https://github.com/valyu-network/valyu-did/blob/main/Valyu-DID-Method.md#DID-creation-algorithm) are met, as the setup for reading DIDs uses the same environment.
##### Steps
1. Complete steps 1 and 2 from [DID Creation Algorithm](https://github.com/valyu-network/valyu-did/blob/main/Valyu-DID-Method.md#DID-creation-algorithm) to set up the Docker environment and run the Valyu-DID container.
2. With the container running, invoke the /resolveDID endpoint to resolve a `did:valyu` identifier into its corresponding DID document.

**Note:** Again, the API is well-documented with a Postman collection available in the repository to facilitate interaction with the endpoint, you can find the Postman collection in [VALYU-DID](www.github/valyu-network/ValyuDID) under the /postman directory

### Update
This method does not *currently* support updating the DID document

### Deactivate
This method does not *currently* support deactivating the DID document

## Security and Privacy Considerations
When implementing and using the `did:valyu` method, there are several security and privacy considerations to be aware of to ensure expected and legitimate behaviour.
##### Single DID restriction
The Valyu DID specification mandates a one-to-one mapping between a single Ethereum address and a Valyu DID. This constraint ensures that each Ethereum address is uniquely associated with only one Valyu DID, enhancing the clarity and integrity of identity management within the Valyu ecosystem.
#### Personal identity information
The Valyu DID method specification does not store any Personal Identifiable Information (PII) within DID documents. This policy ensures compliance with privacy regulations and reduces the risk of sensitive data exposure.
##### Cryptographic risk
The security of the Valyu DID system, which utilizes cryptographic keys based on the Secp256k1 and X25519 algorithms as outlined in SEC1 and RFC7748 respectively, is inherently tied to the cryptographic strength of these keys and their underlying algorithms. Should vulnerabilities be discovered in either Secp256k1 or X25519, or if advancements in quantum computing render these cryptographic foundations obsolete, the Valyu DID method could face significant security challenges. To mitigate these risks, ongoing evaluation and potential adaptation of emerging cryptographic techniques will be essential to maintain the robustness and security of the Valyu DID system.
##### Self or Delegated Control
The Valyu DID specification accommodates diverse control structures by allowing the controller of a DID to be either the user directly or a delegated authority, such as an organisation or legal guardian. This flexibility is crucial for maintaining user autonomy and ensuring data sovereignty across varied legal and operational contexts.

## References
##### DID-CORE
- [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/). Drummond Reed; Manu Sporny; Markus Sabadello; Dave Longley; Christopher Allen; Jonathan Holt; 2020-09-07. Status: WD.
##### DATA-TOKEN
- [Data assets: Tokenization and Valuation](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4419590) Pithadia, Hirsh and Fenoglio, Enzo and Batrinca, Bogdan and Treleaven, Philip and Echim, Radu and Bubutanu, Andrei and Kerrigan, Charles, Data Assets: Tokenization and Valuation (April 15, 2023).
##### VALYU-DID
- [VALYU-DID](www.github/valyu-network/ValyuDID) Harvey Yorke (April 21, 2024)
