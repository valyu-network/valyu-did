import { configureAgent } from "./configureAgent.js";

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
 * Creates a Valyu Data DID.
 * 
 * This function creates a new Valyu Data DID using the provided parameters.
 * 
 * @param alias - The alias for the DID.
 * @param dataTokenAddress - The address of the data token associated with the DID.
 * @param chainId - The chain ID of the blockchain network.
 * @param accessEndpoint - The access endpoint for the DID.
 * @returns The resolved DID document.
 */
async function createValyuDataDID(alias: string, dataTokenAddress: string, chainId: string, accessEndpoint: string) {
  // Create a new agent instance
  const agent = configureAgent();

  // Create options for creating the DID
  const options: ValyuDataDIDCreateOptions = {
    didType: "data",
    dataTokenAddress: dataTokenAddress,
    chainId: chainId,
    accessEndpoint: accessEndpoint
  }

  // Create a new data DID using the agent
  const identifier = await agent.didManagerCreate({ alias: alias, options: options });

  // Resolve the DID document from the created DID
  const resolvedDid = await agent.resolveDid({ didUrl: identifier.did });
  const didDocument = resolvedDid.didDocument;

  // Return the resolved DID document
  return didDocument;
}


/**
 * Creates a Valyu user DID.
 * 
 * This function creates a new user DID using the Valyu agent. It configures the agent, creates options for creating the DID, and resolves the DID document from the created DID. The resolved DID document is then returned.
 * 
 * @param alias - The alias for the user.
 * @returns The resolved DID document.
 * @throws Any error that occurs during the process.
 */
async function createValyuUserDID(alias: string) {
  // Create a new agent instance
  const agent = configureAgent();

  // Create options for creating the DID
  const options: ValyuDIDCreateOptions = {
    didType: "user",
  }

  // Create a new user DID using the agent
  const identifier = await agent.didManagerCreate({ alias: alias, options: options });

  console.log(`\nIdentifier created: ${JSON.stringify(identifier, null, 2)}`);  
  // Resolve the DID document from the created DID
  const resolvedDid = await agent.resolveDid({ didUrl: identifier.did });
  const didDocument = resolvedDid.didDocument;

  // Return the resolved DID document
  return didDocument;
}

export { createValyuDataDID, createValyuUserDID }