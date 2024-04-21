import {
  DIDResolutionResult,
  DIDResolver,
  DIDResolutionOptions,
} from "did-resolver";
import { DataSource } from "typeorm";
import {
  ValyuDataDIDDocument,
  ValyuUserDIDDocument,
  ValyuVerificationMethod,
  ValyuKeyAgreement,
  ValyuService,
} from "../types/ValyuDIDDocument.js";
import { Identifier } from '@veramo/data-store';
import { initializeDatabase } from "../utils/configureDatabase.js";

const dbConnection = await initializeDatabase();


/**
 * Retrieves the resolver for Valyu DIDs.
 * 
 * @returns A record containing the resolver for Valyu DIDs.
 */
export function getResolver(): Record<string, DIDResolver> {
  return new ValyuDidResolver(dbConnection).build();
}


/**
 * Resolves a Decentralized Identifier (DID) using the Valyu DID Resolver.
 * 
 * @param did - The Decentralized Identifier (DID) to resolve.
 * @param options - The options for DID resolution.
 * @returns A Promise that resolves to a `DIDResolutionResult` object containing the resolved DID document, metadata, and resolution metadata.
 * @throws If the required parameters are not provided or an error occurs during resolution.
 */
export class ValyuDidResolver {
  private dbConnection: DataSource;

  constructor(dbConnection: DataSource) {
    this.dbConnection = dbConnection;
  }

  async resolve(
    did: string,
    options: DIDResolutionOptions
    ): Promise<DIDResolutionResult> {
      
    try {
      const alias = undefined
      let where: { did?: string; alias?: string; provider?: string } = {}
      console.log(`What is the did? ${did}`)
      if (did !== undefined && alias === undefined) {
        console.log(`What is the did? ${did}`)
        where = { did }
      } else if (did === undefined && alias !== undefined) {
        where = { alias }
      } else {
        throw Error('[veramo:data-store:identifier-store] Get requires did or (alias and provider)')
      }

      const connection = await this.dbConnection;
      const identifier = await connection.getRepository(Identifier).findOne({
        where,
        relations: ['keys', 'services'],
      })

      console.log('Retrieved identifier from the database:', identifier);

      if (!identifier) {
        return {
          didDocument: null,
          didDocumentMetadata: {},
          didResolutionMetadata: { error: "notFound" }
        };
      }

      // Determine if the DID is for a user or data and build the DID document accordingly
      const didType = determineDidType(did);
      let didDocument;

      if (didType === 'user') {
        didDocument = buildUserDIDDocument(identifier);
      } else {
        didDocument = buildDataDIDDocument(identifier);
      }

      return {
        didDocument: didDocument,
        didDocumentMetadata: {},
        didResolutionMetadata: { contentType: "application/did+ld+json" },
      };
    } catch (error) {
      console.error('Error retrieving DID document from the database:', error);
      return {
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: { error: "notFound" }
      };
    }
  }

  // Method to build the resolver for the 'valyu' DID method
  build(): Record<string, DIDResolver> {
    return { valyu: this.resolve.bind(this) };
  }
}


/**
 * Determines the type of a Decentralized Identifier (DID).
 * @param did - The DID to determine the type for.
 * @returns The type of the DID, which can be either 'user' or 'data'.
 * @throws {Error} If the DID type is unknown.
 */
function determineDidType(did: string): 'user' | 'data' {
  if (did.includes(':user:')) {
    return 'user';
  } else if (did.includes(':data:')) {
    return 'data';
  } else {
    throw new Error('Unknown DID type');
  }
}


/**
 * Constructs a Valyu User DID Document based on the provided identifier data.
 * 
 * @param data - The identifier data used to build the DID Document.
 * @returns The constructed Valyu User DID Document.
 */
function buildUserDIDDocument(data: Identifier): ValyuUserDIDDocument {
  // Construct the user DID document
  const verificationMethod: Array<ValyuVerificationMethod> = [
    {
      id: `${data.did}#ethereum-key-1`,
      type: data.keys[0].type,
      controller: data.did,
      publicKeyHex: data.keys[0].publicKeyHex,
    }
  ]

  const keyAgreement: Array<ValyuKeyAgreement> = [{
      id: `${data.did}#key-exchange-1`,
      type: data.keys[1].type,
      controller: data.did,
      publicKeyHex: data.keys[1].publicKeyHex,
  }]

  // Return the DID Document
  return {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: data.did,
    controller: data.controllerKeyId || '',
    verificationMethod: verificationMethod,
    authentication: [`${data.did}#ethereum-key-1`],
    keyAgreement: keyAgreement,
  };
}


/**
 * Constructs a Valyu Data DID Document based on the provided data.
 * 
 * @param data - The identifier data used to build the DID document.
 * @returns The constructed Valyu Data DID Document.
 */
function buildDataDIDDocument(data: Identifier): ValyuDataDIDDocument {
  // Construct the data DID document
  // Build the verification method, key agreement and service arrays
  const verificationMethod: Array<ValyuVerificationMethod> = [
  {
    id: `${data.did}#key-1`,
    type: data.keys[0].type,
    controller: data.did,
    publicKeyHex: data.keys[0].publicKeyHex,
  }]

  const keyAgreement: Array<ValyuKeyAgreement> = [{
      id: `${data.did}#key-exchange-1`,
      type: data.keys[1].type,
      controller: data.did,
      publicKeyHex: data.keys[1].publicKeyHex,
  }]

  const service: Array<ValyuService> = [{
      id: `${data.did}#access`,
      type: data.services[0].type,
      serviceEndpoint: data.services[0].serviceEndpoint as string,
  }]

  return {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: data.did,
    controller: data.controllerKeyId || '',
    verificationMethod: verificationMethod,
    assertionMethod: [`${data.did}#key-1`], 
    keyAgreement: keyAgreement,
    service: service,
  };
}