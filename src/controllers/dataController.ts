import { Request, Response } from "express";
import { createValyuDataDID } from "../utils/createDID.js"; 


/**
 * Creates a new data DID and retrieves the DID document.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the status, message, and the created DID document.
 * @throws If there is an error during the creation of the data DID.
 */
async function createDataDID(req: Request, res: Response) {
    if (!req.body) {
    return res.status(400).json({ status: "error", message: "Request body is missing." });
    }

    // Validate request body
    const dataTokenAddress = req.body.dataTokenAddress;
    const chainId = req.body.chainId;
    const accessEndpoint = req.body.accessEndpoint;
    const alias = req.body.alias;
    if (!dataTokenAddress || !chainId || !accessEndpoint || !alias) {
        return res.status(400).json({ status: "error", message: "Invalid request body provided" });
    }

    try {
        // Create a new data DID, and retrieve the DID document
        const didDocument = await createValyuDataDID(alias, dataTokenAddress, chainId, accessEndpoint);

        // Return success message with user didDocument
        return res.status(200).json({ 
            status: "success", 
            message: "DID successfully created.", 
            data: {
            didDocument: didDocument,
            } 
        });

    } catch (error) {
        return res.status(500).json({ status: "error", message: (error as any).message });
    }
}

export { createDataDID }
