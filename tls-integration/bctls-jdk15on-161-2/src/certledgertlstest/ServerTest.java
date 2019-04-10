package certledgertlstest;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jsse.provider.BouncyCastleJsseProvider;
import org.bouncycastle.util.encoders.Hex;

import javax.net.ssl.*;
import java.security.Security;

public class ServerTest {

        public static void main(String[] args)
        {
            try{
            Security.addProvider(new BouncyCastleProvider());
            Security.addProvider(new BouncyCastleJsseProvider());
            BlockChainServerParameters blockChainParameters = new BlockChainServerParameters();
            blockChainParameters.proof=Hex.decode(args[0]);
            blockChainParameters.serverLastBlock= Long.valueOf(args[1]);
            SSLContext sslContext = SSLContext.getInstance("TLS", "BCJSSE");
            KeyManagerFactory keyMgrFact = KeyManagerFactory.getInstance("PKIX", "BCJSSE");
            keyMgrFact.init(Utils.createServerKeyStore(), Utils.SERVER_PASSWORD);
            sslContext.init(keyMgrFact.getKeyManagers(), null, null);
            SSLServerSocketFactory fact = sslContext.getServerSocketFactory();
            SSLServerSocket sSock = (SSLServerSocket)fact.createServerSocket(Utils.PORT_NO);
            SSLSocket sslSock = (SSLSocket)sSock.accept();
            Protocol.doServerSide(sslSock);}
            catch (Exception e){
                e.printStackTrace();
            }
        }


}
