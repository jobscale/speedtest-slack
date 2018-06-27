package jp.co.mms.lisla.testperipheral.Data;

/**
 * Created by ishizaki.yukihide on 2017/09/20.
 */

public class CoapResponseHeader {
    byte Code;
    byte MessageID;

    public void setCode(int code , int detail ){
        byte b = (byte)(code << 5);
        Code = (byte)( b | (byte)((detail & 0x1F) & 0xFF) ) ;
    }
    public void setMessageID(short id ){
        MessageID = (byte)(id & 0xFF);
    }

    public byte[] create(){
        return new byte[]{Code,MessageID};
    }

}
