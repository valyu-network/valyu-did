import { createAgent, IDataStore, IResolver, IDIDManager, IKeyManager } from "@veramo/core";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { DIDManager } from "@veramo/did-manager";
import { getResolver as ValyuDidResolver } from "../valyu-did-resolver/resolver.js";
import { ValyuDIDProvider } from "../did-provider-valyu/valyu-did-provider.js";
import {
  KeyStore,
  IDataStoreORM,
  PrivateKeyStore,
  DIDStore,
  // DIDStore
} from "@veramo/data-store";
import { KeyManager } from "@veramo/key-manager"
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local"
import { initializeDatabase } from './configureDatabase.js'; // Adjust path as necessary
const dbConnection = await initializeDatabase();

// Load environment variables
import { config } from 'dotenv';
config();


/**
 * Configures and returns a Veramo agent with necessary plugins.
 * The agent is responsible for managing DIDs (Decentralized Identifiers),
 * keys, data storage, and resolving DIDs.
 *
 * @returns The configured Veramo agent.
 */
function configureAgent() {

  const KMS_SECRET_KEY = process.env.KMS_SECRET_KEY || '';
  console.log(`KMS_SECRET_KEY: ${KMS_SECRET_KEY}`);

  // Create a Veramo agent with necessary plugins
  const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver>({
    plugins: [
      // Initialise the public/private key manager/storage
      new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
          local: new KeyManagementSystem(
            new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY))
          ),
        },
      }),
      // Initialise the method for creation and storage of DIDs/Identifiers
      new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: "did:valyu",
        providers: {
          "did:valyu": new ValyuDIDProvider({
            defaultKms: "local"
          }),
        }
      }),
      // Configure the DID Resolver 
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ValyuDidResolver()
        }),
      })
    ]
  });

  return agent;
}

export { configureAgent }