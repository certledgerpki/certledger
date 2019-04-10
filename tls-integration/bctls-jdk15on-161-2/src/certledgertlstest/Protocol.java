package certledgertlstest;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import org.bouncycastle.util.Strings; /**
 * Simple protocol to execute.
 */
public class Protocol {

    /**
     * Carry out the '!' protocol - client side.
     */
    static void doClientSide(Socket cSock)
            throws IOException {
        OutputStream out = cSock.getOutputStream();
        InputStream in = cSock.getInputStream();
        out.write(Strings.toByteArray("World"));
        out.write('!');
        int ch = 0;
        while ((ch = in.read()) != '!') {
            System.out.print((char) ch);
        }
        System.out.println((char) ch);
    }

    /**
     * Carry out the '!' protocol - server side.
     */
    static void doServerSide(Socket sSock)
            throws IOException {
        System.out.println("session started.");
        InputStream in = sSock.getInputStream();
        OutputStream out = sSock.getOutputStream();
        out.write(Strings.toByteArray("Hello "));
        int ch = 0;
        while ((ch = in.read()) != '!') {
            out.write(ch);
        }
        out.write('!');
        sSock.close();
        System.out.println("session closed.");
    }
}