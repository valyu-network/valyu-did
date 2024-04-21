import { IIdentifier, IKey, IService, IAgentContext, IKeyManager, DIDDocument } from '@veramo/core-types'
import { AbstractIdentifierProvider } from '@veramo/did-manager'
import { publicKeyToEthAddress } from "../utils/publicKeyToEthAddress.js";
import { dbConnection } from "../utils/configureDatabase.js";  // Adjust the import path as needed
import { Identifier, Key } from '@veramo/data-store';

export type IContext = IAgentContext<IKeyManager>

// Define the options for creating a ValyuUserDID
interface ValyuDIDCreateOptions {
  didType: string
}

// Define the options for creating a ValyuDataDID
interface ValyuDataDIDCreateOptions extends ValyuDIDCreateOptions {
  dataTokenAddress: string
  chainId: string
  accessEndpoint: string
}

/**
 * Creates a new identifier based on the provided options.
 * 
 * @param options - The options for creating the identifier.
 * @param options.kms - The key management system to use for creating the keys. If not provided, the defaultKms value from the constructor will be used.
 * @param options.options - The options for creating the identifier.
 * @param options.options.dataTokenAddress - The data token address for the identifier. Required if the options type is ValyuDataDIDCreateOptions.
 * @param options.options.chainId - The chain ID for the identifier. Required if the options type is ValyuDataDIDCreateOptions.
 * @param options.options.accessEndpoint - The access endpoint for the identifier. Required if the options type is ValyuDataDIDCreateOptions.
 * @param options.options.didType - The type of the identifier. Required if the options type is ValyuDIDCreateOptions and the didType is 'user'.
 * @param context - The context for creating the identifier.
 * 
 * @returns A promise that resolves to the created identifier, excluding the 'provider' property.
 * 
 * @throws {Error} If the options are invalid.
 * 
 * @example
 * ```typescript
 * const options: ValyuDataDIDCreateOptions = {
 *   dataTokenAddress: '0x1234567890abcdef',
 *   chainId: '123',
 *   accessEndpoint: 'https://example.com'
 * };
 * 
 * const context: IContext = {
 *   agent: new Agent(),
 * };
 * 
 * const identifier = await createIdentifier({ options, context });
 * console.log(identifier);
 * // Output: {
 * //   did: 'did:valyu:data:1230x1234567890abcdef',
 * //   controllerKeyId: '1234567890abcdef',
 * //   keys: [
 * //     { kid: '1234567890abcdef', publicKeyHex: '...', kms: '...', meta: '...', type: 'Secp256k1' },
 * //     { kid: '1234567890abcdef', publicKeyHex: '...', kms: '...', meta: '...', type: 'X25519' }
 * //   ],
 * //   services: [
 * //     { id: 'valyu', type: 'Access', serviceEndpoint: 'https://example.com' }
 * //   ]
 * // }
 * ```
 */
export class ValyuDIDProvider extends AbstractIdentifierProvider {
  private defaultKms: string

  constructor(options: { defaultKms: string }) {
    super()
    this.defaultKms = options.defaultKms
  }

  // Take as input type ValyuDataDIDCreateOptions or ValyuDIDCreateOptions
  async createIdentifier(
    { kms, options }: { kms?: string; options: ValyuDataDIDCreateOptions | ValyuDIDCreateOptions},
    context: IContext
  ): Promise<Omit<IIdentifier, 'provider'>> {

    if (!options) {
      throw new Error('Invalid options')
    }

    // Check if type is ValyuDataDIDCreateOptions
    if ('dataTokenAddress' in options) {
      // Extract dataTokenAddress, chainId, and accessEndpoint from options
      const { dataTokenAddress, chainId, accessEndpoint } = options

      // Create keys for the DID
      const publickey = await context.agent.keyManagerCreate({ kms: kms || this.defaultKms, type: 'Secp256k1' })
      const DHKey = await context.agent.keyManagerCreate({ kms: kms || this.defaultKms, type: 'X25519' })

      // Construct dataDID
      const did = `did:valyu:data:${chainId}${dataTokenAddress}`

      const identifier: Omit<IIdentifier, 'provider'> = {
          did: did,
          controllerKeyId: publickey.kid,
          keys: [publickey, DHKey],
          services: [{id: 'valyu', type: 'Access', serviceEndpoint: accessEndpoint}]
      }

      return identifier
    } else if (options.didType === 'user') {
      // Extract didType from options
      const { didType } = options

      // Create keys for the DID
      const DHKey = await context.agent.keyManagerCreate({ kms: kms || this.defaultKms, type: 'X25519' })

      // Create new key for ethereum address
      const ethereumKey = await context.agent.keyManagerCreate({ kms: kms || this.defaultKms, type: 'Secp256k1' })
      const ethereumAddress = publicKeyToEthAddress(ethereumKey.publicKeyHex)

      // Construct userdid
      const did = `did:valyu:${didType}:${ethereumAddress}`

      const identifier: Omit<IIdentifier, 'provider'> = {
        did: did,
        controllerKeyId: ethereumKey.kid,
        keys: [ethereumKey, DHKey],
        services: []
      }

      return identifier
    } else {
      throw new Error('Invalid options')
    }
  }

  async deleteIdentifier(identity: IIdentifier, context: IContext): Promise<boolean> {
    throw new Error('not_implemented: deleteIdentifier')
  }

  async addKey(
    { identifier, key, options }: { identifier: IIdentifier; key: IKey; options?: any },
    context: IContext
  ): Promise<boolean> {
    const repository = dbConnection.getRepository(Identifier);
  
    try {
      const existingIdentifier = await repository.findOneBy({ did: identifier.did });
      if (!existingIdentifier) {
        console.error('Identifier not found');
        return false;
      }
  
      if (!existingIdentifier.keys) {
        existingIdentifier.keys = []; // Initialize keys array if it's not set
      }
  
      for (const argsKey of existingIdentifier.keys) {
        const key = new Key()
        key.kid = argsKey.kid
        key.publicKeyHex = argsKey.publicKeyHex
        key.kms = argsKey.kms
        key.meta = argsKey.meta
        key.type = argsKey.type
        key.identifier = existingIdentifier
        identifier.keys.push(key)
      }
      
      // Debugging log to see what's being saved
      console.log(`Saving keys for identifier ${existingIdentifier.did}: `, existingIdentifier.keys);
  
      await repository.save(existingIdentifier);
      console.log('Key added successfully');
      return true;
    } catch (error) {
      console.error('Failed to add key:', error);
      return false;
    }
  }

  async addService(
    { identifier, service, options }: { identifier: IIdentifier; service: IService; options?: any },
    context: IContext
  ): Promise<boolean> {
    try {
      // Fetch the identifier entity by DID
      const repository = dbConnection.getRepository(Identifier);
      const existingIdentifier = await repository.findOneBy({ did: identifier.did }) as IIdentifier;
  
      if (!existingIdentifier) {
        console.error('Identifier not found');
        return false;
      }
  
      // Append new service to the services array
      existingIdentifier.services = [...existingIdentifier.services, service]; // Ensure your entity supports this structure
      await repository.save(existingIdentifier as Identifier);
  
      console.log('Service added successfully');
      return true;
    } catch (error) {
      console.error('Failed to add service:', error);
      return false;
    }
  }

  async removeKey(args: { identifier: IIdentifier; kid: string; options?: any }, context: IContext): Promise<any> {
    throw new Error('not_implemented: removeKey')
  }

  async removeService(args: { identifier: IIdentifier; id: string; options?: any }, context: IContext): Promise<any> {
    throw new Error('not_implemented: removeService')
  }

  updateIdentifier?(args: { did: string; document: Partial<DIDDocument>; options?: { [x: string]: any } }, context: IContext): Promise<IIdentifier> {
    throw new Error('not_implemented: updateIdentifier')
  }
}