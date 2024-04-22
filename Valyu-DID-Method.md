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
	"id": "did:valyu:user:{valyu-id}",
	"controller": "did:valyu:user:{valyu-id}",
	"verificationMethod": [
		{
		  "id": "did:valyu:user:{valyu-id}#pk1"
		  "type": "Secp256k1VerificationKey2018",
		  "controller": "did:valyu:user:{valyu-id}",
		  "publicKeyHex": "[YOUR PUBLIC KEY IN HEX FORMAT HERE]"
		}
	],
	"authentication: [
		{
		  "did:valyu:user:{valyu-id}#pk1"
		}
	],
	"assertionMethod": [ 
		{
		   "did:valyu:user:{valyu-id}#pk1"
		}
	],
	"keyAgreement": [
		{
		  "id": "did:valyu:user:{valyu-id}#ka1",
		  "type": "X25519KeyAgreementKey2019",
		  "controller": "did:valyu:user:{valyu-id}",
		  "publicKeyHex": "[YOUR PUBLIC KEY IN HEX FORMAT HERE]"
		}
	]
}
```
The DID Document represents a user in the valyu network identified by did:valyu:user:{valyu-id}.

- **Controller**: The controller of this DID might be the user themselves or another entity, such as a parent or guardian in cases where the user might not have full control or autonomy over their data.
- **Verification Method**: The document specifies a Secp256k1VerificationKey2018 as its verification method, with the public key provided in hex format. This key is under the control of the user's DID.
- **Authentication**: Utilizing the aforementioned verification key (#pk1), this section ensures the user can be cryptographically verified when accessing their data within the valyu network.
- **Assertion Method**: The user DID uses the verification key (#pk1) for generating zk-proofs.
- **Key Agreement**: The document establishes a key agreement protocol using the X25519KeyAgreementKey2019. The public key for this protocol is also provided in hex format. This mechanism ensures secure communications and encrypted exchanges between the user and other entities on the valyu network.

---
An example of a data DID Document:
```
{
	"@context": "https://www.w3.org/ns/did/v1",
	"id": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c",
	"controller": "04e82fd1fb711ea613faf994885ca0c0c660add2e4abb375d6b3ded0d9ccb0cb492f15bc9cc994db6ed79f20406951761e32f6c0f1d938b58e46805e07b0365608",
	"verificationMethod": [
		{
			"id": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c#key-1",
                    	"type": "Secp256k1",
			"controller": "did:valyu:data:10xhc8c0eA52F40d4B8460353778f9b180Db33A4a9c",
			"publicKeyHex": "04e82fd1fb711ea613faf994885ca0c0c660add2e4abb375d6b3ded0d9ccb0cb492f15bc9cc994db6ed79f20406951761e32f6c0f1d938b58e46805e07b0365608"
                }
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
- **Verification Method**: It incorporates a verification method with a key using the Secp256k1 elliptic curve. The controller for this verification key is associated with a user DID in the valyu ecosystem.
- **Assertion Method**: This DID Document uses the previously mentioned verification method (#pk1) for generating zero-knowledge proofs on the data, ensuring data integrity and privacy without revealing the actual content.
- **Key Agreement**: An X25519 key agreement mechanism is set up, pointing again to a user DID, meant for the data access layer. This ensures secure, encrypted access and exchange of data between parties.
- **Services**:
	1. **Access Service**: Offers a direct link for accessing the data on the valyu network via a specific access key.
	2. **Compute Service**: Provides a computing endpoint, facilitating operations or transformations on the data using a specific compute key.

## Operations

This following section outlines the DID operations for the `did:valyu` method
### Create
#### DID creation algorithm
##### Overview
To create a `did:valyu`, use the DID creation service provided as part of the open-source Valyu-DID software (available in the following Github repository: www.github/valyu-networl/ValyuDID). This repository is well documented on the key generation process, and leverages Veramo.io. The process is as follows:
##### Prerequisites
- Docker installed on your machine. If Docker is not installed, follow the Docker installation guide.
##### Steps
1. Pull the Valyu DID docker image from the dockerhub registry (details on how to do this are provided in: www.github/valyu-networl/ValyuDID)
2. Run docker container
3. Once the container is running, you can create a Valyu User or Data DID by calling the /createDID endpoint 

**Note:** The API endpoints have thorough documentation, you can find the Postman collection in the Github repository under the /postman directory
#### Document creation algorithm
The DID creation process automatically creates a DID Document for each new DID created

### Read
##### Overview
To read/resolve a `did:valyu` value, use the DID resolution service provided as part of the open-source Valyu-DID software (available in the following Github repository: www.github/valyu-networl/ValyuDID)
##### Prerequisites
- Refer to prerequisites described in /DID-creation-algorithm
##### Steps
1. Follow steps 1 and 2 described in /DID-creation-algorithm
2. Once the container is running, you can resolve a `did:valyu` value into it's corresponding DID Document by calling the /resolveDID endpoint

**Note:** The API endpoints have thorough documentation, you can find the Postman collection in the Github repository under the /postman directory

### Update
This method does not *currently* support updating the DID document

### Deactivate
This method does not support deactivating the DID document

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
