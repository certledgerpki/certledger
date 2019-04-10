package certledgertlstest;

import java.util.Arrays;

public class BlockChainServerParameters {
    public static long blockNumber;
    public static long freshnessTolerence;
    public static long selectedBlock;
    public static byte[] proof;
    public static long serverLastBlock;

    public static String getStringValue(){
        return "BlockChainServerParameters:"+
                "blockNumber:"+blockNumber+"/n"
                +"freshnessTolerence:"+freshnessTolerence+"/n"
                +"selectedBlock:"+selectedBlock+"/n"
                +"proof:"+ Arrays.toString(proof)+"/n"
                +"serverLastBlock:"+serverLastBlock;
    }


}
