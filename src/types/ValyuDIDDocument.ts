export type ValyuVerificationMethod = {
    id: string;
    type: string;
    controller: string;
    publicKeyHex: string;
};
  
export type ValyuKeyAgreement = {
    id: string;
    type: string;
    controller: string;
    publicKeyHex: string;
};

export type ValyuService = {
    id: string;
    type: string;
    serviceEndpoint: string;
};

export type ValyuDataDIDDocument = {
    '@context': string;
    id: string;
    controller: string;
    verificationMethod: Array<ValyuVerificationMethod>;
    assertionMethod: Array<string>;
    keyAgreement: Array<ValyuKeyAgreement>;
    service: Array<ValyuService>;
};
  
export type ValyuUserDIDDocument = {
    '@context': string;
    id: string;
    controller: string;
    verificationMethod: Array<ValyuVerificationMethod>;
    authentication: Array<string>;
    keyAgreement: Array<ValyuKeyAgreement>;
};
    