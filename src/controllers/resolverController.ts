import { Request, Response } from "express";
import { configureAgent } from "../utils/configureAgent";


/**
 * Resolves a Decentralized Identifier (DID) and returns the associated DID document.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A Promise that resolves to the response object with the resolved DID document.
 * @throws If the request body is missing or if an invalid request body is provided.
 * @throws If there is an error resolving the DID.
 */
async function resolveDID(req: Request, res: Response) {
    if (!req.body) {
    return res.status(400).json({ status: "error", message: "Request body is missing." });
    }

    // Configure veramo agent
    const agent = configureAgent();

    // Validate request body
    const did = req.body.did;
    if (!did) {
        return res.status(400).json({ status: "error", message: "Invalid request body provided" });
    }

    try {
        // Resolve the DID document
        const didDocument = (await agent.resolveDid({ didUrl: did })).didDocument;

        // Return success message with user didDocument
        return res.status(200).json({ 
            status: "success", 
            message: "DID successfully resolved.", 
            data: {
            didDocument: didDocument,
            } 
        });

    } catch (error) {
        return res.status(500).json({ status: "error", message: (error as any).message });
    }
}

export { resolveDID }