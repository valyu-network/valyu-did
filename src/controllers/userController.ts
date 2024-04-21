import { Request, Response } from "express";
import { createValyuUserDID } from "../utils/createDID.js"; 


/**
 * Creates a new user DID and returns the DID document.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolves to the response object with the created user DID document.
 * @throws If there is an error while creating the user DID.
 */
async function createUserDID(req: Request, res: Response) {
  if (!req.body.alias) {
    return res.status(400).json({ status: "error", message: "Please provide an alias for the user." });
  }

  const alias = req.body.alias;

  try {
    // Create a new user DID, and retrieve the DID document
    const didDocument = await createValyuUserDID(alias);

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

export { createUserDID }
