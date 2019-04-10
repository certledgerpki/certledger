const Web3 = require('web3')
const smartContractAddress = "0x839389a5c5bf71fdbe52059a98b9c846fa895cc0";

let web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8543"));
}

let abiJsonValue = "[\n" +
    "\t{\n" +
    "\t\t\"constant\": false,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"caCertHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"caCertificateValue\",\n" +
    "\t\t\t\t\"type\": \"bytes\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"requestSignature\",\n" +
    "\t\t\t\t\"type\": \"bytes\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"addCACertificate\",\n" +
    "\t\t\"outputs\": [],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"nonpayable\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": false,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"certHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"certificateValue\",\n" +
    "\t\t\t\t\"type\": \"bytes\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"addCertificate\",\n" +
    "\t\t\"outputs\": [],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"nonpayable\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": false,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"certHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"requestSignature\",\n" +
    "\t\t\t\t\"type\": \"bytes\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"revokeCertificate\",\n" +
    "\t\t\"outputs\": [],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"nonpayable\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": false,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"caCertHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t},\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"requestSignature\",\n" +
    "\t\t\t\t\"type\": \"bytes\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"untrustCaCertificate\",\n" +
    "\t\t\"outputs\": [],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"nonpayable\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": true,\n" +
    "\t\t\"inputs\": [],\n" +
    "\t\t\"name\": \"retrieveCaCertificateCount\",\n" +
    "\t\t\"outputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"view\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": true,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"caCertHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"retrieveCaCertificateStatus\",\n" +
    "\t\t\"outputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"view\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": true,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"caCertHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"retrieveCaCertificateValue\",\n" +
    "\t\t\"outputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"\",\n" +
    "\t\t\t\t\"type\": \"bytes\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"view\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": true,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"certHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"retrieveCertificateStatus\",\n" +
    "\t\t\"outputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"view\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": true,\n" +
    "\t\t\"inputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"certHash\",\n" +
    "\t\t\t\t\"type\": \"address\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"name\": \"retrieveCertificateValue\",\n" +
    "\t\t\"outputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"\",\n" +
    "\t\t\t\t\"type\": \"bytes\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"view\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t},\n" +
    "\t{\n" +
    "\t\t\"constant\": true,\n" +
    "\t\t\"inputs\": [],\n" +
    "\t\t\"name\": \"retrieveTlsCertificateCount\",\n" +
    "\t\t\"outputs\": [\n" +
    "\t\t\t{\n" +
    "\t\t\t\t\"name\": \"\",\n" +
    "\t\t\t\t\"type\": \"uint256\"\n" +
    "\t\t\t}\n" +
    "\t\t],\n" +
    "\t\t\"payable\": false,\n" +
    "\t\t\"stateMutability\": \"view\",\n" +
    "\t\t\"type\": \"function\"\n" +
    "\t}\n" +
    "]";

const abi = JSON.parse(abiJsonValue);
let smartContract = web3.eth.Contract(abi, smartContractAddress);

START_INDEX = 1510;
const TOTAL_CERTIFICATE_COUNT = 1511;

importCaCertificate();

function importCaCertificate() {
    console.log("Adding CA certificate");
    const caCertHashHex = "0x2bc24a613240b15be1df74e018c1cfecc1ef3a2e";
    const caCertValueHex = "0x308204a33082038ba00302010202085cbe544b138b2ab3300d06092a864886f70d01010b05003072310b300906035504061302555331153013060355040a130c446967694365727420496e6331193017060355040b13107777772e64696769636572742e636f6d3131302f060355040313285465737420526f6f74202d20525341202d446967694365727420476c6f62616c20526f6f74204341301e170d3138313033313133353830305a170d3238313033313133353830305a307d310b300906035504061302555331153013060355040a130c446967694365727420496e6331193017060355040b13107777772e64696769636572742e636f6d313c303a06035504031333546573742d53756243412d5253412d456e6372797074696f6e204576657279776865726520445620544c53204341202d20473130820122300d06092a864886f70d01010105000382010f003082010a0282010100be8aa7a5ff6b3ae9b21eaf3ca1d70416c6953b7f56baf2b13ffb4552a2078d3b86ee206a2871baad6e9b78843c4cd252375f1e1143c64243b63cb169d2dda9a97315a06e0e3152d10950179cbfdc9b891c4f9ce9f2c5e6e6c917e7cf0e93b0b77e69281b77adee51d341d0264f0fa5a6670848a511f79b68e56e928253fce81c4f73ffae1650c2da94fc1f5b5a5b8737fbcb5d3744916278de178169d0fc6a020a68b61646c881a56526cd55a23fb8da29a0cc903f9909ac2fd75a637a0856a33fc1fdd14604cff1a45d4951bf16b16e4174b0cc2e61e6c745fbf89cdb68ce9746d19047ad9694d5e5537c65b1b62f58fea474eb6735409846e575b862ce29eb0203010001a38201303082012c30120603551d130101ff040830060101ff020100301d0603551d0e04160414e8b02c71f1ffa7ce98c5ec5eb6dd7a5668ff7635301f0603551d23041830168014873639830c3d9317e6b459665ac93e64235069c1300e0603551d0f0101ff04040302018630420603551d1f043b30393037a035a0338631687474703a2f2f63726c332e64696769636572742e636f6d2f4469676943657274476c6f62616c526f6f7443412e63726c303406082b0601050507010104283026302406082b060105050730018618687474703a2f2f6f6373702e64696769636572742e636f6d304c0603551d2004453043303706096086480186fd6c0102302a302806082b06010505070201161c68747470733a2f2f7777772e64696769636572742e636f6d2f4350533008060667810c010201300d06092a864886f70d01010b050003820101007a91badfa7c1ff02e0ba813ee1f73ea55c048c55575108ed4d0ba4b7e2f6f888487d52a0b37d86618a64b3c5bb67e128398f5dbb1280ca99cb9d42ff505c431f5f23d2fc21bb08ea7d89b5131581fc50bf652529c28000e8c3fc396c12c7c25b2f6f25dbe931824c6cd1192cc6117da0f7f585a335c307e3452ba90040d1953638045a183d41cce3dde4d5e22177ac449ef72a1c00247bc433de5f61f808503ec39542c2ae9877645ee1ec4c29f83d53d8919c5f59c6c3927697200e0ca35058a6c769faaa20f74e4de0878eacf2afc67cda3e33738bfab3cc3a3ea981d0e437029d3bc7d2494689a7d064524a38e47107d08e39c1aa3b46d7c7859458eb6679";
    const requestSignature = "0x63c24a613240b15be1df74e018c1cfecc1ef3a2e";
    smartContract.methods.addCACertificate(caCertHashHex, caCertValueHex, requestSignature)
        .send({
                from: '0x63e86833b4f71ddfb5f5c564e52aee434b332623',
                gas: 3000000,
                gasPrice: '0'
            }, (error, result) => {
                console.log(result)
                console.log(error)
                executeWhenTransactionCompleted(result, importTlsCertificates);
            }
        );
}

function importTlsCertificates() {
    console.log("Add CA Certificate transaction completed.");
    console.log("Adding TLS certificates");
    importTlsCertificate("0x8a64f084f09e82fef5af489d809e47ff91b4f8a4", "0x308205933082047ba0030201020208640d94b96e2da51a300d06092a864886f70d01010b0500307d310b300906035504061302555331153013060355040a130c446967694365727420496e6331193017060355040b13107777772e64696769636572742e636f6d313c303a06035504031333546573742d53756243412d5253412d456e6372797074696f6e204576657279776865726520445620544c53204341202d204731301e170d3138313033313134303530305a170d3139313033313134303530305a301a311830160603550403130f546573742d53534c2d6f6e742e696f30820122300d06092a864886f70d01010105000382010f003082010a0282010100be0f7cd1cb9b2862740c97782d839d36d008a01e5517575d1e695f1c1262a19e80d000d323427ba28c60b35f92881c250715885890d9fec0c23a65876944ed01cd7db2ee0ad396318b63cbc42e9c47504658f67565e6c3743fbe05c8a7f945c318a5772174da810e7c278996c7eebdbbec06a91c96842c1b70e12d6f44a761c654e147def5d68f68520b373481dbecc50f484a090ce07551b2bdb1e712ecc78cc24fdb2c6bc15e07a90c69aab54602f8ecddcbae484faf0069d27a8d86ebb5c9d3bbc9d0d34c3562cd41d4a6f3f3f352e2392097062f8cd2acca484862088bce8f85ca6af75c670dcb2e9893009d4863b649ed78424637fe7ddbe5cde09aad1d0203010001a38202783082027430090603551d1304023000301d0603551d0e04160414f359b1503dc5b64785307e6a485277b14157dc7e301f0603551d23041830168014e8b02c71f1ffa7ce98c5ec5eb6dd7a5668ff7635300e0603551d0f0101ff0404030205a0301d0603551d250416301406082b0601050507030106082b06010505070302301d0603551d110416301482066f6e742e696f820a7777772e6f6e742e696f30820105060a2b06010401d6790204020481f60481f300f1007600bbd9dfbc1f8a71b593942397aa927b473857950aab52e81a909664368e1ed1850000016667f8dab300000403004730450220398d1378fe80fd23868358e27ed4dd7f97099b31d4a5754cdfdf274317476e14022100c83cde3562790b3a257c7f47f16683c00e7bbdec7409391245c321998d6738020077008775bfe7597cf88c43995fbdf36eff568d475636ff4ab560c1b4eaff5ea0830f0000016667f8dab80000040300483046022100ca8d02ae9eb54bfb91b517f02b87218fed25d5135efdfae149d632c4f4967914022100d574e4c88b9b2d32e04e3d008c933ed6cdfe305025846350f52a400ce29ef910304c0603551d2004453043303706096086480186fd6c0102302a302806082b06010505070201161c68747470733a2f2f7777772e64696769636572742e636f6d2f4350533008060667810c01020130818106082b0601050507010104753073302506082b060105050730018619687474703a2f2f6f637370322e64696769636572742e636f6d304a06082b06010505073002863e687474703a2f2f636163657274732e64696769636572742e636f6d2f456e6372797074696f6e457665727977686572654456544c5343412d47312e637274300d06092a864886f70d01010b050003820101004c393b9b6d1cd2b4f989a623c1a679971c98fe3af2c929b7fb5b9be5e4cfbd999aa6449fa419f4b4c3802a6f3d224d3e33c1145b9c3c541ec7a5cb11069c0f9b596eb4aa010547e64b724e1e131c98b469718d10057bdf2d59f6a78ce8978881b0cdf4cf7362c6c72f228ff55226c66e50f82a059e4f175c0d5f54eeec29f44126359cc13fac74e3e5611acca6acfe7558340f980757d075663adefc1c547810daad5b13b9a20241036f504539e6d667954cb0306e4518e8b9067825fa0b8972de9692a7a900ae5a3503b61f7c32a893754668203ec62ec9516cffcaba9a077c08e8f4d15a5499529e27f1a312ec0fb43bbdd3276c620bff0aa1529642d523c9");
}

function importTlsCertificate(tlsCertHashHex, tlsCertValueHex) {
    smartContract.methods.addCertificate(tlsCertHashHex, tlsCertValueHex)
        .send({
                from: '0x63e86833b4f71ddfb5f5c564e52aee434b332623',
                gas: 3000000,
                gasPrice: '0'
            }, (error, result) => {
                importTlsCertificateWithIndex()
                console.log(result)
                console.log(error)
            }
        );
}

function readImportedCaCertificate() {
    console.log("Reading CA certificate status");
    const caCertHashHex = "0x2bC24A613240b15bE1Df74e018c1cFEcC1EF3a2e";
    smartContract.methods.retrieveCaCertificateStatus(caCertHashHex).call().then((response) => {
        return response;
    });
    smartContract.methods.retrieveCaCertificateStatus()
        .call({
                from: '0x63e86833b4f71ddfb5f5c564e52aee434b332623',
                gas: 6000000,
                gasPrice: '0',
                caCertHash: caCertHashHex
            }, (error, result) => {
                console.log(result)
                console.log(error)
                if (result === undefined || result.length == 0) {
                    readImportedCaCertificate();
                }
            }
        );
}

function importTlsCertificateWithIndex() {
    START_INDEX = START_INDEX + 1;
    let tlsCertHashHexPrefix = "0x8a64f084f09e82fef5af489d809e47ff91b4";
    let tlsCertValueHexPrefix = "0x308205933082047ba0030201020208640d94b96e2da51a300d06092a864886f70d01010b0500307d310b300906035504061302555331153013060355040a130c446967694365727420496e6331193017060355040b13107777772e64696769636572742e636f6d313c303a06035504031333546573742d53756243412d5253412d456e6372797074696f6e204576657279776865726520445620544c53204341202d204731301e170d3138313033313134303530305a170d3139313033313134303530305a301a311830160603550403130f546573742d53534c2d6f6e742e696f30820122300d06092a864886f70d01010105000382010f003082010a0282010100be0f7cd1cb9b2862740c97782d839d36d008a01e5517575d1e695f1c1262a19e80d000d323427ba28c60b35f92881c250715885890d9fec0c23a65876944ed01cd7db2ee0ad396318b63cbc42e9c47504658f67565e6c3743fbe05c8a7f945c318a5772174da810e7c278996c7eebdbbec06a91c96842c1b70e12d6f44a761c654e147def5d68f68520b373481dbecc50f484a090ce07551b2bdb1e712ecc78cc24fdb2c6bc15e07a90c69aab54602f8ecddcbae484faf0069d27a8d86ebb5c9d3bbc9d0d34c3562cd41d4a6f3f3f352e2392097062f8cd2acca484862088bce8f85ca6af75c670dcb2e9893009d4863b649ed78424637fe7ddbe5cde09aad1d0203010001a38202783082027430090603551d1304023000301d0603551d0e04160414f359b1503dc5b64785307e6a485277b14157dc7e301f0603551d23041830168014e8b02c71f1ffa7ce98c5ec5eb6dd7a5668ff7635300e0603551d0f0101ff0404030205a0301d0603551d250416301406082b0601050507030106082b06010505070302301d0603551d110416301482066f6e742e696f820a7777772e6f6e742e696f30820105060a2b06010401d6790204020481f60481f300f1007600bbd9dfbc1f8a71b593942397aa927b473857950aab52e81a909664368e1ed1850000016667f8dab300000403004730450220398d1378fe80fd23868358e27ed4dd7f97099b31d4a5754cdfdf274317476e14022100c83cde3562790b3a257c7f47f16683c00e7bbdec7409391245c321998d6738020077008775bfe7597cf88c43995fbdf36eff568d475636ff4ab560c1b4eaff5ea0830f0000016667f8dab80000040300483046022100ca8d02ae9eb54bfb91b517f02b87218fed25d5135efdfae149d632c4f4967914022100d574e4c88b9b2d32e04e3d008c933ed6cdfe305025846350f52a400ce29ef910304c0603551d2004453043303706096086480186fd6c0102302a302806082b06010505070201161c68747470733a2f2f7777772e64696769636572742e636f6d2f4350533008060667810c01020130818106082b0601050507010104753073302506082b060105050730018619687474703a2f2f6f637370322e64696769636572742e636f6d304a06082b06010505073002863e687474703a2f2f636163657274732e64696769636572742e636f6d2f456e6372797074696f6e457665727977686572654456544c5343412d47312e637274300d06092a864886f70d01010b050003820101004c393b9b6d1cd2b4f989a623c1a679971c98fe3af2c929b7fb5b9be5e4cfbd999aa6449fa419f4b4c3802a6f3d224d3e33c1145b9c3c541ec7a5cb11069c0f9b596eb4aa010547e64b724e1e131c98b469718d10057bdf2d59f6a78ce8978881b0cdf4cf7362c6c72f228ff55226c66e50f82a059e4f175c0d5f54eeec29f44126359cc13fac74e3e5611acca6acfe7558340f980757d075663adefc1c547810daad5b13b9a20241036f504539e6d667954cb0306e4518e8b9067825fa0b8972de9692a7a900ae5a3503b61f7c32a893754668203ec62ec9516cffcaba9a077c08e8f4d15a5499529e27f1a312ec0fb43bbdd3276c620bff0aa1529642d5";
    let indexHexValue = padDigits(START_INDEX.toString(16), 4);
    console.log("Index :" + START_INDEX + ", Index Hex:" + indexHexValue)
    let tlsCertHashHex = tlsCertHashHexPrefix + indexHexValue;
    let tlsCertValueHex = tlsCertValueHexPrefix + indexHexValue;


    console.log("Adding TLS certificate. Hash:" + tlsCertHashHex);
    smartContract.methods.addCertificate(tlsCertHashHex, tlsCertValueHex)
        .send({
                from: '0x63e86833b4f71ddfb5f5c564e52aee434b332623',
                gas: 3000000,
                gasPrice: '0'
            }, (error, result) => {
                console.log(result)
                console.log(error)
                if (START_INDEX + 1 < TOTAL_CERTIFICATE_COUNT) {
                    executeWhenTransactionCompleted(result, importTlsCertificateWithIndex);
                }
            }
        );
}

function executeWhenTransactionCompleted(hash, callback) {
    console.log("Waiting for transaction being completed. Hash: " + hash);
    web3.eth.getTransactionReceipt(hash, (error, result) => {
        console.log(result)
        console.log(error)
        if (result === null) {
            setTimeout(function () {
                executeWhenTransactionCompleted(hash, callback);
            }, 5000);
        } else {
            callback();
        }
    });
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}