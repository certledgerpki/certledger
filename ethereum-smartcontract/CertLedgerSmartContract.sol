pragma experimental ABIEncoderV2;

contract CertLedgerSmartContract {

    mapping(address => uint)  certificateStatusMap;
    mapping(address => uint)  caCertificateStatusMap;
    mapping(address => bytes)  certificateValueMap;
    mapping(address => bytes)  caCertificateValueMap;
    uint tlsCertificateCount;
    uint caCertificateCount;

    struct CertificateDetails {
            bool isStructureValid;
            address hashValue;
            bytes subject;
            bytes issuer;
            uint validityNotBefore;
            uint validityNotAfter;
            uint basicConstraintsIsCA;
            byte keyUsage;
            uint extendedKeyUsage;
            bytes subjectAlternativeName;
            bytes aki;
            bytes ski;
            bytes tbsCertificateValue;
            bytes publicKey;
            bytes signature;
    }

    function retrieveTlsCertificateCount() public view returns(uint){
        return tlsCertificateCount;
    }

    function retrieveCaCertificateCount() public view returns(uint){
        return caCertificateCount;
    }

    function retrieveCertificateStatus(address certHash) public view returns(uint){
        return certificateStatusMap[certHash];
    }

    function retrieveCertificateValue(address certHash) public view returns(bytes){
        return certificateValueMap[certHash];
    }

    function retrieveCaCertificateStatus(address caCertHash) public view returns(uint){
        return caCertificateStatusMap[caCertHash];
    }


    function retrieveCaCertificateValue(address caCertHash) public view returns(bytes){
        return caCertificateValueMap[caCertHash];
    }

    function addCACertificate(address caCertHash, bytes memory caCertificateValue, bytes memory requestSignature) public{
        bytes memory storedCaCertificateValue = caCertificateValueMap[caCertHash];
        if(bytesToUint(storedCaCertificateValue)!=0){
           revert("Ca certificate is already exists in the storage");
        }
        if (!validateAddCaRequestSignature(addressToBytes(caCertHash),caCertificateValue,requestSignature)) {
            revert("Invalid untrustCaCertificate request signature");
        }
        CertificateDetails memory caCertificateDetails = decodeCertificate(addressToBytes(caCertHash), caCertificateValue);
        if(!caCertificateDetails.isStructureValid){
            revert("Ca certificate asn1 structure is invalid");
        }
        if (!validateCACertificateSignature(caCertificateDetails)) {
           revert("Invalid Ca certificate signature");
        }

        if (!validateCACertificateFields(caCertificateDetails)) {
           revert("Invalid Ca certificate fields");
        }

       caCertificateValueMap[caCertHash] = caCertificateValue;
       caCertificateStatusMap[caCertHash] = 1;
       caCertificateCount=caCertificateCount=1;
    }

    function addCertificate(address certHash, bytes memory certificateValue) public {
        bytes memory storedCertificateValue = certificateValueMap[certHash];
        if(bytesToUint(storedCertificateValue) != 0){
           revert("End user certificate already exists in the storage");
        }
        CertificateDetails memory certificateDetails = decodeCertificate(addressToBytes(certHash),certificateValue);
        if(!certificateDetails.isStructureValid){
            revert("Tls certificate asn1 structure is invalid");
        }

        if(!validateCertificate(certificateDetails)){
            revert("Tls certificate is invalid");
        }

        certificateValueMap[certHash] = certificateValue;
        certificateStatusMap[certHash]=1;
        tlsCertificateCount = tlsCertificateCount + 1;
    }

    function revokeCertificate(address certHash, bytes memory requestSignature) public {
          bytes memory storedCertificateValue = certificateValueMap[certHash];
        if(bytesToUint(storedCertificateValue) == 0){
           revert("End user certificate not exists in the storage");
        }
        CertificateDetails memory certificateDetails = decodeCertificate(addressToBytes(certHash),storedCertificateValue);
        if(!certificateDetails.isStructureValid){
            revert("Tls certificate asn1 structure is invalid");
        }
        bytes memory storedCaCertificateValue = caCertificateValueMap[bytesToAddress(certificateDetails.aki)];
        if(bytesToUint(storedCaCertificateValue)==0){
            revert("Ca certificate is not present in the storage");
        }
        if(!validateRevocationRequestSignature(addressToBytes(certHash),storedCaCertificateValue,certificateDetails.aki,storedCaCertificateValue,requestSignature)) {
           revert("Invalid certificate revocation request signature");
        }
        certificateStatusMap[certHash] = 0;
    }

    function untrustCaCertificate(address caCertHash, bytes memory requestSignature) public{
        bytes memory storedCaCertificateValue = caCertificateValueMap[caCertHash];
        if(bytesToUint(storedCaCertificateValue)==0){
            revert("Ca certificate is not present in the storage");
        }
        if (!validateUntrustCaRequestSignature(addressToBytes(caCertHash),storedCaCertificateValue,requestSignature)) {
            revert("Invalid untrustCaCertificate request signature");
        }
        caCertificateStatusMap[caCertHash] = 0;
    }

    function validateCACertificateFields(CertificateDetails memory caCertificateDetails) private returns (bool) {
        if(caCertificateDetails.validityNotBefore > caCertificateDetails.validityNotAfter){
           revert("Invalid Ca certificate validity (caCertificateDetails.validityNotBefore > caCertificateDetails.validityNotAfter)");
        }
        if(caCertificateDetails.validityNotAfter < block.timestamp){
           revert("Invalid Ca certificate validity (caCertificateDetails.validityNotAfter > now)");
        }
        if(caCertificateDetails.basicConstraintsIsCA != 1){
          revert("Invalid Ca certificate basicConstraintsIsCA");
        }
        if(caCertificateDetails.keyUsage != 5){ //certificateSigning
           revert("Invalid Ca certificate keyUsage (caCertificateDetails.keyUsage != 5)");
        }
      return true;
    }

    function validateCACertificateSignature(CertificateDetails memory caCertificateDetails) private returns (bool) {
      //Validates CA certificate signature
      return true;
    }

    function validateCertificate(CertificateDetails memory certificateDetails) private returns (bool){
      if(!validateCertificateFields(certificateDetails)){
          return false;//Certificate fields are invalid
      }

      CertificateDetails memory caCertificateDetails = retrieveCaCertificate(certificateDetails);
      if(!validateWithIssuerCertificate(certificateDetails,caCertificateDetails)){
         return false;//Certificate validation with Ca certificate is failed
      }
      return true;
  }
    /* retrieves trusted Ca from trusted ca list */
    function retrieveCaCertificate(CertificateDetails memory certificateDetails) private returns (CertificateDetails memory){
         bytes memory storedCaCertificateValue = caCertificateValueMap[bytesToAddress(certificateDetails.aki)];
        if(bytesToUint(storedCaCertificateValue)==0){
            revert("Ca certificate is not present in the storage");
       }
      if(caCertificateStatusMap[bytesToAddress(certificateDetails.aki)] != 1){
         revert("Ca certificate is not trusted");
      }
      CertificateDetails memory caCertificateDetails = decodeCertificate(certificateDetails.aki, storedCaCertificateValue);
      return caCertificateDetails;
  }

    function validateCertificateFields(CertificateDetails memory certificateDetails) private returns (bool){
       if(certificateDetails.validityNotBefore > certificateDetails.validityNotAfter){
           revert("Invalid certificate validity");
        }
        if(certificateDetails.validityNotAfter < block.timestamp){
           revert("Invalid certificate validity");
        }
        if(certificateDetails.basicConstraintsIsCA != 0){
          revert("Invalid certificate basicConstraints");
        }
        if(certificateDetails.keyUsage != 0){ //digitalSignature
           revert("Invalid certificate keyUsage");
        }
    return true;
  }
    function validateWithIssuerCertificate(CertificateDetails memory certificateDetails, CertificateDetails memory caCertificateDetails) private returns (bool){

       if(!validateCertificateSignatureWithCaPublicKey(certificateDetails.tbsCertificateValue,caCertificateDetails.publicKey,certificateDetails.signature)){
                     return false;//Certificate validation with Ca certificate is failed
       }

       if(!validateCaRelatedFields(certificateDetails,caCertificateDetails)){
                     return false;//Certificate validation with Ca certificate is failed
       }

       return true;
    }
    //This is a mock function which is supposed to make the necessary validations in the TLS certificateValue
    //Due to limitations in the language it always return true at the moment
    //checks if certificate fields are matching with signer ca
   function validateCaRelatedFields(CertificateDetails memory certificateDetails, CertificateDetails memory issuerCertificateDetails) private returns (bool){
       return true;
   }
   //This is a mock function which is supposed to make the necessary validations in the TLS certificateValue
   //Due to limitations in the language it always return true at the moment
   //Validates signature with CA public key
   function validateCertificateSignatureWithCaPublicKey(bytes memory tbsCertificateValue,bytes memory caPublicKey, bytes memory signature) private returns (bool){
        return true;
    }
   //This is a mock function supposed to make ASN.1 decoding of certificate and returns certificate details
   function decodeCertificate(bytes memory certHash, bytes memory certificateValue) private returns (CertificateDetails memory){
       bytes memory predefinedCaCertHash = hex"2bc24a613240b15be1df74e018c1cfecc1ef3a2e";
       bytes memory predefinedTlsCertHash = hex"8a64f084f09e82fef5af489d809e47ff91b4f8a4";
        CertificateDetails memory mockCertificateDetails;
        if(bytesToUint(predefinedCaCertHash) == bytesToUint(certHash)){
            mockCertificateDetails.basicConstraintsIsCA = 1;
            mockCertificateDetails.keyUsage = 5;
            mockCertificateDetails.ski=predefinedTlsCertHash;
            mockCertificateDetails.validityNotBefore=1522502056;
            mockCertificateDetails.validityNotAfter=1680268456;
        } else if(bytesToUint(predefinedTlsCertHash) == bytesToUint(certHash)){
            mockCertificateDetails.basicConstraintsIsCA = 0;
            mockCertificateDetails.keyUsage = 0;
            mockCertificateDetails.aki=predefinedCaCertHash;
            mockCertificateDetails.ski=predefinedCaCertHash;
            mockCertificateDetails.validityNotBefore=1522502056;
            mockCertificateDetails.validityNotAfter=1680268456;
        }else { //Other certificates
            mockCertificateDetails.basicConstraintsIsCA = 0;
        }
        mockCertificateDetails.isStructureValid = true;
        return mockCertificateDetails;
    }
   //verifies if the transaction is signed by the private key if TLS certificate or issuing CA
   function validateRevocationRequestSignature(bytes memory certHash, bytes memory certificateValue,bytes memory caCertHash, bytes memory caCertificateValue, bytes memory signature) private returns (bool){
     CertificateDetails memory certificateDetails = decodeCertificate(certHash, certificateValue);
     if(verifySignature(certificateDetails.publicKey,certHash,signature)){
        //the revocation request is signed by the private key of the TLS certificate
        return true;
     }
     else {
        //if the revocation request is signed by the private key of the issuer of the TLS certificate
        CertificateDetails memory caCertificateDetails = decodeCertificate(caCertHash, caCertificateValue);
        return verifySignature(caCertificateDetails.publicKey,certHash,signature);
     }
 }

   //It is supposed to validate the Add CA transaction.
   //and return true if the transaction is signed by the private key CertLedger board
   function validateAddCaRequestSignature(bytes memory caCertHash, bytes memory caCertificateValue, bytes memory signature) private returns (bool){
      CertificateDetails memory caCertificateDetails = decodeCertificate(caCertHash, caCertificateValue);
      //if the AddCa request is signed by the private key of CertLedger board
      return verifySignature(caCertificateDetails.publicKey,caCertHash,signature);
   }

   //It is supposed to validate the untrust CA transaction.
   //and return true if the transaction is signed by the private key CertLedger board
   function validateUntrustCaRequestSignature(bytes memory caCertHash, bytes memory caCertificateValue, bytes memory signature) private returns (bool){
      CertificateDetails memory caCertificateDetails = decodeCertificate(caCertHash, caCertificateValue);
      //if the UntrustCa request is signed by the private key of the CertLedger board
      return verifySignature(caCertificateDetails.publicKey,caCertHash,signature);
   }
   function verifySignature(bytes memory publicKey, bytes memory signedData, bytes memory signature) private returns (bool){
      // verifies signed data signature with given public key
      return true;
  }

  function bytesToUint(bytes memory inputBytes) private constant returns (uint result) {
        uint i;
        result = 0;
        for (i = 0; i < inputBytes.length; i++) {
            uint c = uint(inputBytes[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }
    function addressToBytes(address inputAddress) private pure returns (bytes memory) {
            return abi.encodePacked(inputAddress);
    }
    function bytesToAddress(bytes memory inputBytes) private pure returns (address addr) {
        assembly {
          addr := mload(add(inputBytes,20))
        }
    }
}