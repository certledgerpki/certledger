package certledgertlstest;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Date;
import javax.security.auth.x500.X500Principal;
import javax.security.auth.x500.X500PrivateCredential;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509ExtensionUtils;
import org.bouncycastle.cert.jcajce.JcaX509v1CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.util.encoders.Base64;
/**
 * Certificate/Key Utilities for the examples.
 */
public class Utils
{
    /**
     * Host name for our examples to use.
     */
    static final String HOST = "localhost";
    /**
     * Port number for our examples to use.
     */
    static final int PORT_NO = 9020; /**
 * Names and passwords for the key store entries we need.
 */
    public static String ROOT_ALIAS = "root";
    public static String INTERMEDIATE_ALIAS = "intermediate";
    public static String END_ENTITY_ALIAS = "end";
    public static final char[] SERVER_PASSWORD = "serverPassword".toCharArray();
    public static final char[] CLIENT_PASSWORD = "clientPassword".toCharArray();
    private static long baseTime = 0x15c57a33402L;
    private static final byte[] rootPrivateKey = Base64.decode( "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD" + "DYu2zJUsZAKQ31RzVqteZQwf4lxi3T8TCP8DSQ7Ke4IQp3DDKVP" + "9NUwVHRr/s0OZphln6JyUBkSHuQ2hTx4UQRoef2g06WLlFAHi1R" + "wr0QefkdGwhPgSuXMWh4dZ1AYGwuIK3KUIUfUU7x5aiwSO6Lyj5" + "BYTQQqeX4VFMmp1SMMU7tI88R5bAOkiJw1Wz/840BfVowPTR4Wt" + "TGgq33OJ8gb6GH8k1t8CdvmuFArV5D+iPApiluwVVCVINkSN0Aj" + "XwmkjtHUMOA+qC7aeZkzke4vPSSy1QABIzmAXIq1zUxS6o9DUqE" +
            "H9gLF1e91uqwKjmjj9SYnhZxHumEEx42J/XAgMBAAECggEAWdQZ" + "SYQrTx7q4RpzK87kWXumZgV9oQWlBdOOwHzMWdwKFz67FcLXL4M" + "sSZU+9s8iJ8DTjD1D98D0cxj9lYsE47Mxdm4nJ7yTzSQG2v0DDc" + "JhLTjTX8MmHs3bNO5iDSA4snlZ64Cl90qSsoWz/TbDyL0W3spJQ" + "gBrEdpO6OOq0ZZ54zekawgyG677aJbzInAG2o9b066HvGRSWNb3" + "Celw7RKvjPOohKPOWbSm2W/5gnlSnTaAUgm7W8A1AClTt7scyqg" + "PEtThxQHiBGorI6UGjVuO0xoT1MgYr2QWKaYJydo8mFaygaJxVJ" + "Hs1PeFQIhuJn7rA/F5BO8cFpuZGrYPUQKBgQDjJYQ7pDrrgRF8O" + "TDkvbR5lQdBEWHlK8MMD+1kyptwc8UpK2phZjqLOMofsLhURkgm" + "Fzc0UOEx03MdGJvHrWgGQRBc+0JHvYLzCepbOFumjkSPwbb2yQH" + "R9QfOPbDRpaqdFNTJnm4lQHZdTGTR4UvDX1X0PuCksRAVtPRA6P" + "sBsQKBgQDcNJ5H/ZwkSpT8ZA9GzdVJtxoCLjQPyi1AYYZp0xDUo" + "D0h6+JnDljFnsWnpy9OcoJAA6pCkQe+6Cm0vlLvMQ8eD9rcQ/+s" + "JFacr7lE3K9bYt56PBTLHyE+WYy90mOVu7FtLfOLz9XDjzyGMn2" + "ELuFrUjxlnI7ZCbpZh/GwXiXUBwKBgQDPTPbwg4KuWb2+dGd16t" + "ghuevD63w/bX/1qzeJrArORynh19ifiW/WjX6SC3M+nmHMOZXNL" + "h9HnOXK4SGSy2RLiOfJJBoqZP90lVEH7VhfmiliVXWIpov9tLVp" + "+Q09WAdsko1ccDWv07Pyk/zTOt0tMf29CgF07I90cBAWiUpDEQK" + "BgBycTZBm+BmTAyaDzaRSbArm2l88J5GBoD2ELlWjkcU+iJLWth" + "TTvV730RCGXVQg9qFgmIeLlmkMexa7v8TKJ/+s6a/Cuf5gvkwfX" + "MAAuFv0TZmuIrl9cvFJ60pigoPa3iOkW8dnmouNGb0J5Fr/SFSM" + "W8KMA9dZNzgYvKNAqEOTAoGBALIUD1PsOGciRA8htw3jA8hhaH8" + "rM+UeQEMC87QnsMEYTuXmkvsDHDNpkcs//X3woQBww+ll1qfByP" + "Wj4/GNn4vPjwah4M+6c2xFUez3hLpexD0qoeOS3udAXDGfvBiAT" + "zXkaQ1kp2LHPuQdBMGRM4vnbDYGjtq40khezAfHErK0");
    private static final byte[] rootPublicKey = Base64.decode( "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw2LtsyV" + "LGQCkN9Uc1arXmUMH+JcYt0/Ewj/A0kOynuCEKdwwylT/TVMFR0" + "a/7NDmaYZZ+iclAZEh7kNoU8eFEEaHn9oNOli5RQB4tUcK9EHn5" + "HRsIT4ErlzFoeHWdQGBsLiCtylCFH1FO8eWosEjui8o+QWE0EKn" + "l+FRTJqdUjDFO7SPPEeWwDpIicNVs//ONAX1aMD00eFrUxoKt9z" + "ifIG+hh/JNbfAnb5rhQK1eQ/ojwKYpbsFVQlSDZEjdAI18JpI7R" + "1DDgPqgu2nmZM5HuLz0kstUAASM5gFyKtc1MUuqPQ1KhB/YCxdX" + "vdbqsCo5o4/UmJ4WcR7phBMeNif1wIDAQAB");
    // 1 week
    private static final long VALIDITY_PERIOD = 7 * 24 * 60 * 60 * 1000L;
    /**
     * Create a random 2048 bit RSA key pair - okay for client and intermediate
     */
    public static KeyPair generateRSAKeyPair() throws Exception
    {
        KeyPairGenerator kpGen = KeyPairGenerator.getInstance("RSA", "BC");
        kpGen.initialize(2048, new SecureRandom());
        return kpGen.generateKeyPair();
    }
    /**
     * Create a fixed 2048 bit RSA key pair – to keep the server cert stable */
    public static KeyPair generateRootKeyPair() throws Exception {
        KeyFactory kFact = KeyFactory.getInstance("RSA", "BC");
        return new KeyPair(
                kFact.generatePublic(new X509EncodedKeySpec(rootPublicKey)),
                kFact.generatePrivate(new PKCS8EncodedKeySpec(rootPrivateKey)));

    }
    /**
     * Generate a sample V1 certificate to use as a CA root certificate
     */
    public static X509CertificateHolder generateRootCert(KeyPair pair) throws Exception
    {
        JcaX509v1CertificateBuilder certBldr = new JcaX509v1CertificateBuilder(
                new X500Principal("CN=Test CA Certificate"),
                BigInteger.valueOf(1),
                new Date(baseTime), // allow 1024 weeks for the root new Date(baseTime + 1024 * VALIDITY_PERIOD),
                new Date(baseTime),
                new X500Principal("CN=Test CA Certificate"),
                pair.getPublic()
        );
        ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
                .setProvider("BC").build(pair.getPrivate()); return certBldr.build(signer);
    }
    /**
     * Generate a sample V3 certificate to use as an
     * intermediate CA certificate
     */
    public static X509CertificateHolder generateIntermediateCert(
            PublicKey intKey, PrivateKey caKey, X509Certificate caCert)
            throws Exception {
        long timeMillis = System.currentTimeMillis(); JcaX509v3CertificateBuilder certBldr = new JcaX509v3CertificateBuilder(
                caCert.getSubjectX500Principal(), BigInteger.valueOf(1),
                new Date(timeMillis),
                new Date(timeMillis + VALIDITY_PERIOD),
                new X500Principal("CN=Test Intermediate Certificate"), intKey
        );
        JcaX509ExtensionUtils utils = new JcaX509ExtensionUtils();
        certBldr.addExtension( Extension.authorityKeyIdentifier, false,
                utils.createAuthorityKeyIdentifier(caCert));
        certBldr.addExtension(
                Extension.subjectKeyIdentifier, false,
                utils.createSubjectKeyIdentifier(intKey));
        certBldr.addExtension(
                Extension.basicConstraints, true,
                new BasicConstraints(0)); certBldr.addExtension(
                Extension.keyUsage, true,
                new KeyUsage(KeyUsage.digitalSignature |
                        KeyUsage.keyCertSign | KeyUsage.cRLSign));

        ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA") .setProvider("BC").build(caKey);
        return certBldr.build(signer); }
    /**
     * Generate a sample V3 certificate to use as an end entity certificate
     */
    public static X509CertificateHolder generateEndEntityCert(
            PublicKey entityKey, PrivateKey caKey, X509Certificate caCert)
            throws Exception {
        long timeMillis = System.currentTimeMillis();
        JcaX509v3CertificateBuilder certBldr = new JcaX509v3CertificateBuilder(
                caCert.getSubjectX500Principal(), BigInteger.valueOf(1),
                new Date(timeMillis),
                new Date(timeMillis + VALIDITY_PERIOD),
                new X500Principal("CN=Test End Certificate"), entityKey
        );
        JcaX509ExtensionUtils utils = new JcaX509ExtensionUtils();
        certBldr.addExtension(
                Extension.authorityKeyIdentifier, false,
                utils.createAuthorityKeyIdentifier(caCert));
        certBldr.addExtension(
                Extension.subjectKeyIdentifier, false,
                utils.createSubjectKeyIdentifier(entityKey));
        certBldr.addExtension(
                Extension.basicConstraints, true,
                new BasicConstraints(false)); certBldr.addExtension(
                Extension.keyUsage, true,
                new KeyUsage(KeyUsage.digitalSignature));
        ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA") .setProvider("BC").build(caKey);
        return certBldr.build(signer); }
    /**
     * Generate a X500PrivateCredential for the root entity.
     */
    public static X500PrivateCredential createRootCredential() throws Exception
    {
        KeyPair rootPair = generateRootKeyPair();
        X509Certificate rootCert = convertCert(generateRootCert(rootPair)); return new X500PrivateCredential(
            rootCert, rootPair.getPrivate(), ROOT_ALIAS);
    }
    /**
     * Generate a X500PrivateCredential for the intermediate entity.

     */
    public static X500PrivateCredential createIntermediateCredential( PrivateKey caKey,
                                                                      X509Certificate caCert)
            throws Exception {
        KeyPair interPair = generateRSAKeyPair();
        X509Certificate interCert = convertCert(generateIntermediateCert(
                interPair.getPublic(), caKey, caCert));
        return new X500PrivateCredential(
                interCert, interPair.getPrivate(), INTERMEDIATE_ALIAS);
    }
    /**
     * Generate a X500PrivateCredential for the end entity.
     */
    public static X500PrivateCredential createEndEntityCredential( PrivateKey caKey,
                                                                   X509Certificate caCert)
            throws Exception
    {
        KeyPair endPair = generateRSAKeyPair(); X509Certificate endCert = convertCert(
            generateEndEntityCert(endPair.getPublic(), caKey, caCert)); return new X500PrivateCredential(
            endCert, endPair.getPrivate(), END_ENTITY_ALIAS);
    }
    private static X509Certificate convertCert(X509CertificateHolder certHolder) throws CertificateException
    {
        return new JcaX509CertificateConverter()
                .setProvider("BC").getCertificate(certHolder);
    }
    /**
     * Create a server trust store.
     *
     * @return a key store containing the example server certificate */
    public static KeyStore createServerTrustStore() throws Exception
    {
        X500PrivateCredential serverCred = createRootCredential();
        KeyStore keyStore = KeyStore.getInstance("JKS"); keyStore.load(null, null);
        keyStore.setCertificateEntry(
                serverCred.getAlias(), serverCred.getCertificate());
        return keyStore; }
    /**
     * Create a client trust store.
     *
     * @return a key store containing the example client trust anchor */
    public static KeyStore createClientTrustStore()

            throws Exception {
        // for brevity we use the same TA as the server.
        return createServerTrustStore(); }
    /**
     * Create a server key store.
     *
     * @return a key store containing the example server * certificate and private key
     */
    public static KeyStore createServerKeyStore() throws Exception
    {
        X500PrivateCredential serverCred = createRootCredential();
        KeyStore keyStore = KeyStore.getInstance("JKS");
        keyStore.load(null, null);
        keyStore.setKeyEntry(
                serverCred.getAlias(), serverCred.getPrivateKey(), SERVER_PASSWORD,
                new X509Certificate[] { serverCred.getCertificate() }); return keyStore;
    }
    /**
     * Create a client key store - for client side authentication. *
     * @return a key store containing the example client
     * certificate and private key
     */
    public static KeyStore createClientKeyStore() throws Exception
    {
        X500PrivateCredential serverCred = createRootCredential(); X500PrivateCredential interCred = createIntermediateCredential(
            serverCred.getPrivateKey(), serverCred.getCertificate()); X500PrivateCredential clientCred = createEndEntityCredential(
            interCred.getPrivateKey(), interCred.getCertificate()); KeyStore keyStore = KeyStore.getInstance("JKS");
        keyStore.load(null, null);
        keyStore.setKeyEntry(
                clientCred.getAlias(), clientCred.getPrivateKey(), CLIENT_PASSWORD, new X509Certificate[] {
                        clientCred.getCertificate(), interCred.getCertificate() });
        return keyStore; }
}
