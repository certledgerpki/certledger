package certledgertlstest;

import java.util.Arrays;

public class BlockChainClientParameters {
    public static long clientBlock;
    public static long freshnessTolerence;
    public static long selectedBlock;
    public static byte[] proof;

    public static String getStringValue(){
        return "BlockChainClientParameters:"+
                "clientBlock:"+clientBlock+"/n"
                +"freshnessTolerence:"+freshnessTolerence+"/n"
                +"selectedBlock:"+selectedBlock+"/n"
                +"proof:"+ Arrays.toString(proof);
    }
}
