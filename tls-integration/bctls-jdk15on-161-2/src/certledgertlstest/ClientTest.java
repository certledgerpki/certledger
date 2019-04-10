package certledgertlstest;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jsse.provider.BouncyCastleJsseProvider;

import javax.net.ssl.SSLContext;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
import java.security.Security;

public class ClientTest {
    public static void main( String[] args)
            throws Exception {
        Security.addProvider(new BouncyCastleProvider());
        Security.addProvider(new BouncyCastleJsseProvider());
        BlockChainClientParameters blockChainClientParameters = new BlockChainClientParameters();
        blockChainClientParameters.clientBlock = (Long.valueOf(args[0]));
        blockChainClientParameters.freshnessTolerence = (Long.valueOf(args[0]));
        blockChainClientParameters.proof = (new byte[0]);//to be compatible with server
        blockChainClientParameters.selectedBlock = 0;//to be compatible with server
        SSLContext sslContext = SSLContext.getInstance("TLS", "BCJSSE");
        TrustManagerFactory trustMgrFact = TrustManagerFactory.getInstance("PKIX", "BCJSSE");
        trustMgrFact.init(Utils.createServerTrustStore());
        sslContext.init(null, trustMgrFact.getTrustManagers(), null);
        SSLSocketFactory fact = sslContext.getSocketFactory();
        SSLSocket cSock = (SSLSocket)fact.createSocket(Utils.HOST, Utils.PORT_NO);
        cSock.setUseClientMode(true);
        Protocol.doClientSide(cSock);
    }
}
