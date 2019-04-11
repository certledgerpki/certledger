# CertLedger
CertLedger: A New PKI Model with Certicate Transparency Based on Blockchain

## Getting Started
In this repository we implement a prototype of CertLedger.The general architecture of CertLedger is depicted in the below Figure.

![Alt text](/img/architecture.png?raw=true "CertLedger Architecture")

### Prerequisites
In order to deploy the CertLedger smartcontract a private Ethereum network is required.

### Repository Organization

* **ethereum-smartcontract** - comprises the CertLedger smartcontract to add / revoke TLS certificates.

* **proof-generation-verification** - comprises the nodejs codes to generate state Merkle proof for TLS certificates and verify it. We use [zmitton/eth-proof](https://github.com/zmitton/eth-proof) as the underlying library.

* **tls-integration* -comprises a modified version of Bouncy Castle JSSE provider v1.6.1 for CertLedger. It uses the new TLS extensions introduced by CertLedger while validating certificate during a TLS handshake. It also comprises a sample TLS client and a TLS server for testing purposes.
