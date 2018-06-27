package jp.co.mms.lisla.testperipheral.Data;

/**
 * Created by ishizaki.yukihide on 2017/09/20.
 */

public class CoapRequestHeader {
    public byte Code = 0;
    public byte MessageID= 0;
    public byte Uri_Path= 0;
    public static byte size = 3;

    public static CoapRequestHeader parseHeader(byte[] data){
        CoapRequestHeader header = new CoapRequestHeader();
        header.Code = data[0];
        header.MessageID = data[1];
        header.Uri_Path = data[2];
        return header;
    }

}
