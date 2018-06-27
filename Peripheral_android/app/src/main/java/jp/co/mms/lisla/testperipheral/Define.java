package jp.co.mms.lisla.testperipheral;

/**
 * TestPeripheral
 * <p>
 * <p>
 * <p>
 * Created by avcmms.
 */

public class Define {
    /*

電気錠データ通信サービス
    電気錠データ通信サービス	6fb5052f-6d4a-4a02-92a9-a9360035ae5e
	TLSWriteキャラクタリスティック	86df3e01-c172-4a05-85a1-d72b28a0e1d6
	TLSReadキャラクタリスティック	694c829d-6ffa-4703-9262-3eb5f899c3f4
	スマホIDキャラクタリスティック	2d3af062-a77f-4733-8e96-7f62e8dfead3
	RcodeWriteキャラクタリスティック	bf4906d1-5366-4490-a5b5-ce6a6c2f9665
	RcodeReadキャラクタリスティック	55432d04-e069-4ec0-9a00-3cda0b6972b0
	RSSIキャラクタリスティック	d8977733-b87c-456b-bb68-42b16c320202
電気錠Advertiseサービス
    ADV_IND（運用/検査用）	1b302a4c-93b5-4b1a-bf4a-6031edf3dd1f
	ADV_IND（登録）	93a9214a-58de-4ad9-b32b-956287f9e01f
	ADV_IND（タッチ）	67718a69-7390-4fd6-95af-1b4b4de96c3f

1	ADV_IND（運用）	運用モードを通知する。	1b302a4c-93b5-4b1a-bf4a-6031edf3dd1f
2	ADV_IND（登録）	登録モードを通知する。	93a9214a-58de-4ad9-b32b-956287f9e01f
3	ADV_IND（タッチ）	タッチ時に通知する。	67718a69-7390-4fd6-95af-1b4b4de96c3f

     */
//#define UUID_SERVICE_TLS                 "6fb5052f-6d4a-4a02-92a9-a9360035ae5e"
////サービスTLS -- キャラクタリスティック
//            #define UUID_CHARACTERISTIC_TSLWRITE     "86df3e01-c172-4a05-85a1-d72b28a0e1d6"
//            #define UUID_CHARACTERISTIC_TSLREAD      "694c829d-6ffa-4703-9262-3eb5f899c3f4"
//            #define UUID_CHARACTERISTIC_SMAPHID      "2d3af062-a77f-4733-8e96-7f62e8dfead3"
////アドバタイズ 運用モード
//            #define UUID_ADV_SERVICE_NORMAL "1b302a4c-93b5-4b1a-bf4a-6031edf3dd1f"
////アドバタイズ 登録モード
//            #define UUID_ADV_SERVICE_REGIST "93a9214a-58de-4ad9-b32b-956287f9e01f"
////アドバタイズ タッチ屋内モード
//            #define UUID_ADV_SERVICE_INDOOR_TOUCH  "9a1000b6-d69d-4930-bf5f-81d1824ebec5"
//


    /** サービスTLS */
    @SuppressWarnings("CanBeFinal")
//    public static String UUID_SERVICE_TLS                ="6fb5052f-6d4a-4a02-92a9-a9360035ae5e";
    public static String UUID_SERVICE_TLS                ="d37b0820-34ef-4f73-9b1d-c1c9882c1f45";
    /** サービスTLS -- キャラクタリスティック */
    @SuppressWarnings("CanBeFinal")
//    public static String UUID_CHARACTERISTIC_TSLWRITE    ="86df3e01-c172-4a05-85a1-d72b28a0e1d6";
    public static String UUID_CHARACTERISTIC_TSLWRITE    ="cc363ec4-2184-4281-b091-8e557fd9b9a2";
    /** サービスTLS -- キャラクタリスティック */
    @SuppressWarnings("CanBeFinal")
//    public static String UUID_CHARACTERISTIC_TSLREAD     ="694c829d-6ffa-4703-9262-3eb5f899c3f4";
    public static String UUID_CHARACTERISTIC_TSLREAD     ="c3cf560a-ab94-4ac2-9051-a266104568ad";
    /** サービスTLS -- キャラクタリスティック */
    @SuppressWarnings("CanBeFinal")
//    public static String UUID_CHARACTERISTIC_SMAPHID     ="2d3af062-a77f-4733-8e96-7f62e8dfead3";
    public static String UUID_CHARACTERISTIC_SMAPHID     ="c3988d7e-9695-4e82-8d36-6b7fefd63f77";

    /**アドバタイズ 運用モード */
    @SuppressWarnings("CanBeFinal")
//    public static  String UUID_ADV_SERVICE_NORMAL = "1b302a4c-93b5-4b1a-bf4a-6031edf3dd1f";
    public static  String UUID_ADV_SERVICE_NORMAL = "ee5ffac6-eca7-46b4-99cf-eca4ad20e594";
    /**アドバタイズ 登録モード */
    @SuppressWarnings("CanBeFinal")
//    public static  String UUID_ADV_SERVICE_REGIST = "93a9214a-58de-4ad9-b32b-956287f9e01f";
    public static  String UUID_ADV_SERVICE_REGIST = "fc83cdb7-5fb8-4e4b-8908-51992d7f0e00";
    /**アドバタイズ 屋内タッチモード */
    @SuppressWarnings("CanBeFinal")
//    public static  String UUID_ADV_SERVICE_TOUCH = "67718a69-7390-4fd6-95af-1b4b4de96c3f";
    public static  String UUID_ADV_SERVICE_TOUCH = "b5d1d736-0374-46c1-a6c4-512ecfb2803b";


    /** サービスTLS -- キャラクタリスティック */
    @SuppressWarnings("CanBeFinal")
//    public static String UUID_CHARACTERISTIC_RSSI     ="d8977733-b87c-456b-bb68-42b16c320202";
    public static String UUID_CHARACTERISTIC_RSSI     ="68579341-faec-475c-86cb-2335e0df981f";

//            #define UUID_CHARACTERISTIC_RSSI      "d8977733-b87c-456b-bb68-42b16c320202"


}
