package certledgertlstest;

import org.apache.commons.compress.utils.IOUtils;
import org.bouncycastle.util.encoders.Hex;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;

public class ProofValidatorConsoleRunner {
    public static long validate(long blockNumber,byte[] proofValue, byte [] certHash) throws IOException, InterruptedException {



       String contractAddress = "0x839389a5c5bf71fdbe52059a98b9c846fa895cc0";
       String blockNumberHex = Long.toHexString(blockNumber);
       String proofValueHex = Hex.toHexString(proofValue);
       String certHashHex = Hex.toHexString(certHash);

        ProcessBuilder pb = new ProcessBuilder("node", "verify-proof.js",
                "--contractAddress", contractAddress,
                "--proofValue", proofValueHex,
                "--blockNumber", blockNumberHex,
                "--key", certHashHex
        );
        pb.directory(new File("./eth-proof/console"));
        Process process = pb.start();
        process.waitFor();
        byte[] outputValue = IOUtils.toByteArray(process.getInputStream());
        System.out.println("Output :" + new String(outputValue));

        return new BigInteger(outputValue).longValue();
        //byte[] errorValue = IOUtils.toByteArray(process.getErrorStream());
        //System.out.println("Error :" + new String(errorValue));
    }
}


