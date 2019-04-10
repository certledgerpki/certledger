const {Header} = require('eth-object');
const {VerifyProof, ProofUtil} = require('eth-proof');
const Rpc = require('isomorphic-rpc');

class CertHashProof {
    constructor(rpcProviderUrl = 'http://localhost:8543') {
        this.rpc = new Rpc(rpcProviderUrl);
        this.eth_getProof = this.rpc.eth_getProof;
    }

    async readLastBlockNumber() {
        let rpcBlock;
        rpcBlock = await this.rpc.eth_getBlockByNumber('latest', false);
        return rpcBlock.number;
    }

    async generateProof(address, storageAddress, blockNumber) {
        let rpcBlock, rpcProof;
        rpcBlock = await this.rpc.eth_getBlockByNumber(blockNumber, false);
        rpcProof = await this.eth_getProof(address, [storageAddress], rpcBlock.number);
        return {
            header: Header.fromRpc(rpcBlock),
            accountProof: Proof.fromRpc(rpcProof.accountProof),
            storageProof: Proof.fromRpc(rpcProof.storageProof[0].proof),
        };
    }

    async verify(proofValue, accountAddress, position, trustedBlockNumber) {
        let trustedRpcBlock = await this.rpc.eth_getBlockByNumber(trustedBlockNumber, false);
        let trustedHeader = Header.fromRpc(trustedRpcBlock);
        let trustedBlockHash = VerifyProof.getBlockHashFromHeader(trustedHeader);
        let blockHashFromHeader = VerifyProof.getBlockHashFromHeader(proofValue.header);
        if (!ProofUtil.toBuffer(trustedBlockHash).equals(blockHashFromHeader)) throw new Error('BlockHash mismatch');
        let stateRoot = VerifyProof.getStateRootFromHeader(proofValue.header);
        let stateRootFromProof = VerifyProof.getRootFromProof(proofValue.accountProof);
        if (!stateRoot.equals(stateRootFromProof)) throw new Error('StateRoot mismatch');
        let account = await VerifyProof.getAccountFromProofAt(proofValue.accountProof, accountAddress);
        let storageRoot = VerifyProof.accountContainsStorageRoot(account);
        let storageRootFromProof = VerifyProof.getRootFromProof(proofValue.storageProof);
        if (!storageRoot.equals(storageRootFromProof)) throw new Error('StorageRoot mismatch');
        return VerifyProof.getStorageFromStorageProofAt(proofValue.storageProof, position);
    }
}

module.exports = CertHashProof;
