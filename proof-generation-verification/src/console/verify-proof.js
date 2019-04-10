const {ProofUtil} = require('eth-proof');
const CertHashProof = require('../lib/certHashProofLib.js');

var grab = require('ps-grab');
let contractAddress = grab('--contractAddress');
let allProofPartsInHex = grab('--proofValue');
let blockNumber = grab('--blockNumber');
let key = grab('--key');
const certHashProof = new CertHashProof('http://localhost:8543');
let position = ProofUtil.mappingAt('0x0', key);
const parsedAllProfParts = JSON.parse(new Buffer(allProofPartsInHex, 'hex'));
const storageProofObject = {
    header: Header.fromHex(parsedAllProfParts.headerHex),
    accountProof: Proof.fromHex(parsedAllProfParts.accountProofHex),
    storageProof: Proof.fromHex(parsedAllProfParts.storageProofHex),
};
let storageValuePromise = certHashProof.verify(storageProofObject, contractAddress, position, blockNumber);
storageValuePromise
    .then((storageValue) => {
        console.log(ProofUtil.toHex(storageValue));
    })
    .catch((error) => {
        console.log(error);
    });
