package jp.co.mms.lisla.testperipheral;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattServerCallback;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.ParcelUuid;
import android.support.design.widget.NavigationView;
import android.support.design.widget.Snackbar;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Locale;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

import co.nstant.in.cbor.CborBuilder;
import co.nstant.in.cbor.CborDecoder;
import co.nstant.in.cbor.CborEncoder;
import co.nstant.in.cbor.CborException;
import co.nstant.in.cbor.builder.ArrayBuilder;
import co.nstant.in.cbor.model.Array;
import co.nstant.in.cbor.model.ByteString;
import co.nstant.in.cbor.model.DataItem;
import co.nstant.in.cbor.model.Number;
import co.nstant.in.cbor.model.UnicodeString;
import co.nstant.in.cbor.model.UnsignedInteger;
import jp.co.mms.lisla.testperipheral.Data.CoapRequestHeader;
import jp.co.mms.lisla.testperipheral.Data.CoapResponseHeader;

import static android.bluetooth.BluetoothAdapter.getDefaultAdapter;


public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener, View.OnClickListener {

    private static final String TAG = "TestPeripheral";

    private static final String SHARED_PREFERENCE_KEY_LOCK_ID = "sp_key_lockid";
    private static final String SHARED_PREFERENCE_KEY_SMP_ID = "sp_key_smpid";
    private static final String SHARED_PREFERENCE_KEY_REVISION_NO = "sp_key_revNo";// 登録リビジョン番号

    private void setText(TextView tv, String msg){
        runOnUiThread(new Runnable() {
            String mMsg="";
            TextView mTv = null;
            public Runnable setParam(TextView tv, String msg){
                mMsg = msg;
                mTv = tv;
                return this;
            }
            @Override
            public void run() {
                mTv.setText(mMsg);
            }
        }.setParam(tv,msg));
    }

    BluetoothManager mBleManager;
    BluetoothAdapter mBleAdapter;
    BluetoothLeAdvertiser mBtAdvertiser;
    BluetoothDevice mConnectedDevice;

    EditText mEditText_LockId ;
    EditText mEditText_SmpId ;
    EditText mEditText_Header_Detail;
    EditText mEditText_Payload;
    EditText mEditText_LockBurreSize;
    EditText mEditText_RegistRevID;
    EditText mEditText_CnfSmpNum;
    EditText mEditText_CnfTagNum;
    EditText mEditText_CnfCardNum;
    EditText mEditText_CnfFamcode;
    EditText mEditText_VerControllerVer;
    EditText mEditText_NtfPmtRssi;
    EditText mEditText_Rssi;
    EditText mEditText_SleepMSec;
    EditText mEditText_Write_SleepMSec;
    EditText mEditText_GetHstRecNum;



    Spinner mSpinner_SmpId;
    Spinner mSpinner_inf_Battery;
    Spinner mSpinner_inf_Door;
    Spinner mSpinner_inf_LockUnLock;
    Spinner mSpinner_header_coapcode;
    Spinner mSpinner_lck_timeSync;
    Spinner mSpinner_ath_ath;
    Spinner mSpinner_ath_chk;
    Spinner mSpinner_frm_res_start;
    Spinner mSpinner_frm_res_execute;
    Spinner mSpinner_frm_res_finish;
    Spinner mSpinner_cnf_res_auto;
    Spinner mSpinner_cnf_res_sync;
    Spinner mSpinner_cnf_res_sound;
    Spinner mSpinner_ntf_pmt;
    Spinner mSpinner_ntf_sty;
    Spinner mSpinner_write_Result;
    Spinner mSpinner_test;

    TextView mTextView_Log;
    TextView mTextView_Session;
    TextView mTextView_Advertise;
    TextView mTextView_Time;


    ListView mListView ;
    ListAdapter mListAdapter;

    CheckBox mCheckBox_ALL;
    CheckBox mCheckBox_gethst;
    CheckBox mCheckBox_getinf1;
    CheckBox mCheckBox_getinf2;
    CheckBox mCheckBox_getcnf;
    CheckBox mCheckBox_setcnf;
    CheckBox mCheckBox_actath;
    CheckBox mCheckBox_actreg;
    CheckBox mCheckBox_readblob;

    CheckBox mCheckBox_actlck;
    CheckBox mCheckBox_actdsc;
    CheckBox mCheckBox_getver;
    CheckBox mCheckBox_setprm;
    CheckBox mCheckBox_actfrm1;
    CheckBox mCheckBox_actfrm2;
    CheckBox mCheckBox_actfrm3;
    CheckBox mCheckBox_actfrm4;
    CheckBox mCheckBox_setflg;
    CheckBox mCheckBox_cbor_error;
    CheckBox mCheckBox_disconnect_error;


    CheckBox mCheckBox_write_gethst;
    CheckBox mCheckBox_write_getinf1;
    CheckBox mCheckBox_write_getinf2;
    CheckBox mCheckBox_write_getcnf;
    CheckBox mCheckBox_write_setcnf;
    CheckBox mCheckBox_write_actath;
    CheckBox mCheckBox_write_actreg;
    CheckBox mCheckBox_write_actlck;
    CheckBox mCheckBox_write_actdsc;
    CheckBox mCheckBox_write_getver;
    CheckBox mCheckBox_write_setprm;
    CheckBox mCheckBox_write_actfrm1;
    CheckBox mCheckBox_write_actfrm2;
    CheckBox mCheckBox_write_actfrm3;
    CheckBox mCheckBox_write_actfrm4;
    CheckBox mCheckBox_write_setflg;
    CheckBox mCheckBox_write_disconnect_error;


    Logger mLogger;

    SharedPreferences mPrefer;
    HandlerThread mHandlerThread = new HandlerThread("notifyThread");
    Handler mHandler;
    HashMap mHashMap;


    /** ユーザ情報 */
    public static class UserInfo implements Cloneable {
        @Override
        public Object clone() throws CloneNotSupportedException {
            return super.clone();
        }

        public UserInfo() {
            this.mRegID = -1;
            this.mUserName = "";
            this.mAuth = -1;
            this.mExpiretime = -1;
        }

        public UserInfo(int regID, String userName, int auth, long expiretime) {
            this.mRegID = regID;
            this.mUserName = userName;
            this.mAuth = auth;
            this.mExpiretime = expiretime;
        }

        public long getRegID() {
            return mRegID;
        }

        public String getUserName() {
            return mUserName;
        }

        public int getAuth() {
            return mAuth;
        }

        public long getExpiretime() {
            return mExpiretime;
        }

        /**
         * ID(スマホID/タグID)
         */
        public long mRegID;

        /**
         * ユーザ名(最大20文字)
         * 電気錠毎に不揮発メモリに保存する。
         * 電気錠に通知する。
         */
        public String mUserName;
        /**
         * 権限
         * ユーザーに入力させない。
         * 常に「0x00」を設定する。
         * 電気錠毎に不揮発メモリに保存する。電気錠に通知する。
         */
        public int mAuth;
        /**
         * 登録情報の有効期限(unix time)
         * ユーザーに入力させない。
         * 常に「0xFFFFFFFF」を設定する。
         * 電気錠毎に不揮発メモリに保存する。電気錠に通知する。
         */
        public long mExpiretime;

        public void setExpiretime(long expiretime) {
            this.mExpiretime = expiretime;
        }

        public void setRegID(int regID) {
            this.mRegID = regID;
        }

        public void setUserName(String userName) {
            this.mUserName = userName;
        }

        public void setAuth(int auth) {
            this.mAuth = auth;
        }

        public enum ExpireKind {
            /**
             * 管理者
             */
            Administrator(0x00)
            /** 一般 */
            , General(0x01)
            /** 保守 */
            , Maintenance(0x02)
            /** ワンタイム */
            , OneTime(0x03)
            /** 該当無し */
            , None(0x99);

            int mTlsValue;

            ExpireKind(int tlsValue) {
                mTlsValue = tlsValue;
            }

            public int getTlsValue() {
                return mTlsValue;
            }

            public static ExpireKind get(int tlsValue) {
                ExpireKind ret = None;
                for (ExpireKind value : ExpireKind.values()) {
                    if (value.mTlsValue == tlsValue) {
                        ret = value;
                        break;
                    }
                }
                return ret;
            }
        }
        public String toDumpString() {
            return String.format(Locale.US, "ID [%d] / ユーザ名 [%s] / 権限 [%d] / 有効期限 [0x%X] "
                    , mRegID
                    , mUserName
                    , mAuth
                    , mExpiretime
            );
        }
    }


    ArrayList<UserInfo> mUserInfo = new ArrayList<>();

    private byte[] readFile(String path){
        path = getApplicationContext().getFilesDir().getPath() + "/" + path;

        File file = new File(path);
        int fsize = (int) file.length();
        byte[] ret = new byte[fsize];
        FileInputStream fileInputStream = null;
        try {
            fileInputStream = new FileInputStream(file);
            fileInputStream.read(ret, 0, fsize);
        } catch (final FileNotFoundException e) {
            mLogger.LogE(TAG,e.getMessage());
            return null;
        } catch (final IOException e) {
            mLogger.LogE(TAG,e.getMessage());
            return null;
        } finally {
            if (fileInputStream != null) {
                    /* FileInputStream Close */
                try {
                    fileInputStream.close();
                } catch (final IOException e) {
                    mLogger.LogE(TAG,e.getMessage());
                }
            }
        }
        return ret;

    }
    private boolean writeFile(String path, byte[] data) {

        path = getApplicationContext().getFilesDir().getPath() + "/" + path;

        File f = new File(path);
        File dir = f.getParentFile();
        if (!dir.exists()) {
            // ディレクトリが無ければ生成する
            dir.mkdirs();
        }
        OutputStream os = null;
        try {
            os = new FileOutputStream(f);
            os.write(data);
        } catch (Exception e) {
            mLogger.LogE(TAG,e.getMessage());
            return false;
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    mLogger.LogE(TAG,e.getMessage());
                }
            }
        }
        return true;
    }

    private void loadUseInfo(){
        try{
            byte[] ret = readFile("userinfos.json");
            String json = new String(ret, "UTF-8");
            JSONArray jsonArray = new JSONArray(json);
            mUserInfo.clear();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObj = jsonArray.getJSONObject(i);
                UserInfo ui = new UserInfo();
                ui.mRegID =jsonObj.getInt("mRegID");
                ui.mUserName =jsonObj.getString("mUserName");
                ui.mAuth =jsonObj.getInt("mAuth");
                ui.mExpiretime =jsonObj.getLong("mExpiretime");
                mUserInfo.add(ui);
            }


        }catch (Exception ex ){
            mLogger.LogE(TAG,ex.getMessage());
        }
    }

    private void saveUseInfo(){
        try {
            JSONObject jsonObject = new JSONObject();
            JSONArray jsonArray = new JSONArray();
            for( UserInfo ui : mUserInfo){
                JSONObject putObj = new JSONObject();
                putObj.put("mRegID", ui.mRegID);
                putObj.put("mUserName", ui.mUserName);
                putObj.put("mAuth", ui.mAuth);
                putObj.put("mExpiretime", ui.mExpiretime);
                jsonArray.put(putObj);
            }
            byte[] ret = jsonArray.toString().getBytes();
            writeFile("userinfos.json",ret);
        }catch (Exception ex ){
            mLogger.LogE(TAG,ex.getMessage());
        }
    }

    private void deleteUseInfo(long smpid){
        int index  = getUserInfoIndex(smpid);
        mUserInfo.remove(index);
        saveUseInfo();
        updateIncrementRevisionNo();

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mEditText_SmpId.setText( String.format("%04x",getNextSmpId()) );
            }
        });

    }
    public static int convertBytesToInt(byte[] bytes) {
        byte[] ret = {0x00, 0x00, 0x00, 0x00};
        if (bytes == null) {
            return 0;
        }
        if (bytes.length < 5) {
            System.arraycopy(bytes, 0, ret, 4 - bytes.length, bytes.length);
        }
        return ByteBuffer.wrap(ret).getInt();
    }


    private void createUserInfoMaxData(){
        mUserInfo.clear();
        byte[] keyID = convertKeyId();
        int lockID = convertBytesToInt(keyID);
        for( int i = 0; i < 10; i++ ) {
            UserInfo ui = new UserInfo();
            mUserInfo.add(ui);
            ui.mRegID = (0x0000FFL - i) ;
            ui.mUserName = String.format("%04x%02x３４５６７８",lockID,i);
            ui.mAuth = 0;
            ui.mExpiretime = 0xFFFFFFFF;
        }
        saveUseInfo();
        mRegistinfo.revno++;
    }

    // 0x0000はSmartLockアプリ側で受信エラーになるため、含めない
    static int[] SMAPHO_ID_RANGE_DATA_ARRAY = {0x0001, 0x0002, 0x01FE, 0x01FF, 0x0200, 0xFFFF};
    private void createUserInfoRangeCheckData(){
        mUserInfo.clear();
        byte[] keyID = convertKeyId();
        int lockID = convertBytesToInt(keyID);
        for( int i = 0; i < SMAPHO_ID_RANGE_DATA_ARRAY.length; i++ ) {
            UserInfo ui = new UserInfo();
            mUserInfo.add(ui);
            ui.mRegID = (SMAPHO_ID_RANGE_DATA_ARRAY[i]) ;
            ui.mUserName = String.format("%04X%04X",lockID,SMAPHO_ID_RANGE_DATA_ARRAY[i]);
            ui.mAuth = 0;
            ui.mExpiretime = 0xFFFFFFFF;
        }
        saveUseInfo();
        mRegistinfo.revno++;
    }



    private void addUseInfo(int smpid,String userName,int auth,long expiretime ){
        int index  = getUserInfoIndex(smpid);
        UserInfo ui ;
        if( index == -1 ){
            ui = new UserInfo();
            mUserInfo.add(ui);
        }
        else {
            ui = mUserInfo.get(index);
        }

        ui.mRegID =smpid;
        ui.mUserName =userName;
        ui.mAuth =auth;
        ui.mExpiretime =expiretime;

        saveUseInfo();
        updateIncrementRevisionNo();

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mEditText_SmpId.setText( String.format("%04x",getNextSmpId()) );
            }
        });

    }


    private int getUserInfoIndex(long smpid){
        int i = 0;
        for( UserInfo ui : mUserInfo){
            if( ui.getRegID() == smpid ){
                return i;
            }
            i++;
        }
        return -1;
    }

    private long getNextSmpId(){
        long smpid = 0;
        for( UserInfo ui : mUserInfo){
            if( smpid < ui.getRegID() ){
                smpid = ui.getRegID();
            }
        }
        smpid++;
        if( smpid > 0xFFFFL ){
            smpid = 1;
        }
        return smpid;
    }

    class Regsitinfo {
        int revno = 0;
    }
    Regsitinfo mRegistinfo = new Regsitinfo();

    /**
     * 機器登録時、名称変更、機器削除時に一つリビジョン番号を上げる
     * 自動更新無効の場合はGetInfのリビジョン番号を上げない
     * アプリ終了時は0に戻るので注意
     */
    private void updateIncrementRevisionNo(){
        int revNo = mRegistinfo.revno + 1;
        if( revNo > 0xFFFF ){
            revNo = 0;
        }
        CheckBox checkBox = (CheckBox) findViewById(R.id.checkbox_regist_revid_auto_update);
        if(checkBox.isChecked()) {
            final String setHexStr = String.format("%04x", revNo);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    setRevisionNo(setHexStr);
                }
            });
        }
    }

    private boolean setRevisionNo(String value){
        // テキストチェックで問題無ければ設定を適用する
        try {
            String revNoText = value;
            SharedPreferences.Editor editor = mPrefer.edit();
            editor.putString(SHARED_PREFERENCE_KEY_REVISION_NO, revNoText);
            editor.apply();
            setText(mEditText_RegistRevID,value);
            int revisionNo = Integer.parseInt(value, 16);
            mRegistinfo.revno = revisionNo;
            return true;
        }catch (Exception e) {
            Toast.makeText(MainActivity.this, "16進数で入力してください。", Toast.LENGTH_SHORT).show();
        }
        return false;
    }

    public class ListAdapter extends ArrayAdapter<UserInfo> {

        private LayoutInflater mLayoutInflater = null;
        private View.OnClickListener mClickListner = null;

        public ListAdapter(final Context context, final int resId, final List<UserInfo> items, View.OnClickListener clickListner) {
            super(context, resId, items);
            this.mLayoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            mClickListner = clickListner;
        }

        public View getView( int position,  View convertView,  ViewGroup parent) {
            View itemView = convertView;
            if (itemView == null) {
                itemView = mLayoutInflater.inflate(R.layout.custom_list_item, null);
            }

            TextView txtViewInfo = (TextView)itemView.findViewById(R.id.txtVinfo);

            UserInfo ui = getItem(position);

            setText(txtViewInfo,ui.toDumpString());

            Button btnDelete = (Button)itemView.findViewById(R.id.btnDelete);

            btnDelete.setTag(new Long( ui.getRegID() ));
            btnDelete.setOnClickListener(mClickListner);

            return itemView;
        }
    }

    class UncaughtExceptionHandler implements java.lang.Thread.UncaughtExceptionHandler {

        @Override
        public void uncaughtException(Thread thread, Throwable throwable) {
            if(mLogger != null ){

                mLogger.LogD(TAG,throwable.getMessage() );
            }
            throwable.printStackTrace();
        }
    }

        @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //バックライト制御
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
//
//        Context context = this.getApplicationContext();
//        Thread.setDefaultUncaughtExceptionHandler(new UncaughtExceptionHandler());


        mTextView_Log =(TextView)findViewById(R.id.logview);
        mLogger = new Logger(this,mTextView_Log);

            mTextView_Time =(TextView)findViewById(R.id.texttime);


        loadUseInfo();
        mListAdapter = new ListAdapter(this,0,mUserInfo,this);


        mPrefer = getSharedPreferences("sp_test_peripheral", MODE_PRIVATE);

        mBleManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBleAdapter = mBleManager.getAdapter();
        mBtAdvertiser = mBleAdapter.getBluetoothLeAdvertiser();

        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        bluetoothAdapter.setName("LTP");


        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        mSpinner_SmpId=(Spinner)findViewById(R.id.spinner_smpid);
        mSpinner_inf_Battery=(Spinner)findViewById(R.id.spn_inf_battery);
        mSpinner_inf_Door=(Spinner)findViewById(R.id.spn_inf_door);
        mSpinner_inf_LockUnLock=(Spinner)findViewById(R.id.spn_inf_lockunlock);
        mSpinner_header_coapcode=(Spinner)findViewById(R.id.spn_coapcode);
        mSpinner_lck_timeSync=(Spinner)findViewById(R.id.spn_lck_timesync);
        mSpinner_ath_ath=(Spinner)findViewById(R.id.spn_ath_ath_ath);
        mSpinner_ath_chk=(Spinner)findViewById(R.id.spn_ath_ath_chk);
        mSpinner_frm_res_start=(Spinner)findViewById(R.id.spn_frm_res_start);
        mSpinner_frm_res_execute=(Spinner)findViewById(R.id.spn_frm_res_execute);
        mSpinner_frm_res_finish=(Spinner)findViewById(R.id.spn_frm_res_finish);
        mSpinner_cnf_res_auto =(Spinner)findViewById(R.id.spn_cnf_res_auto);
        mSpinner_cnf_res_sync =(Spinner)findViewById(R.id.spn_cnf_res_sync);
        mSpinner_cnf_res_sound=(Spinner)findViewById(R.id.spn_cnf_res_sound);
        mSpinner_ntf_pmt=(Spinner)findViewById(R.id.spn_ntfprm);
        mSpinner_ntf_sty=(Spinner)findViewById(R.id.spn_ntfsty);

        mSpinner_write_Result=(Spinner)findViewById(R.id.spn_write_code);
        mSpinner_test=(Spinner)findViewById(R.id.spinner_testcode);
        mSpinner_test.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                byte testcode  = Byte.parseByte(getValueFromItemText(mSpinner_test.getSelectedItem().toString()));
                mTestCode = testcode;
                mTestCode2 = 0;

                /*
        <item>0:内部結合試験用</item>
        <item>1:ReadBlobギリギリ発生しないケース</item>
        <item>2:ReadBlob1回発生ケース</item>
        <item>3:ReadBlob2回でぴったりケース</item>
        <item>4:ReadBlob3回発生ケース</item>
        <item>5:ReadBlob中にNTFの確認をするために大量データ投入</item>
        <item>10:Notifyのヘッダ(サイズ超過)異常</item>
        <item>11:Notifyのヘッダ(サイズ不足)異常</item>

        <item>30:RSSI NOTIFYボタンでTLSコマンド発行＋ReadBlob強制</item>
        <item>31:RSSI NOTIFYボタンでTLSコマンド発行</item>
        <item>32:ReadBolob ReadError1</item>
        <item>33:ReadBolob ReadError2</item>

        <item>40:RSSI NOTIFYボタンで異常SeqNoケース1</item>
        <item>41:RSSI NOTIFYボタンで異常SeqNoケース2</item>

        <item>50:ReadBolob TLSReadの応答遅延5秒 1</item>
        <item>51:ReadBolob TLSReadの応答遅延5秒 2</item>

        <item>60:SMPID Write Error</item>
        <item>61:SMPID Read Error</item>
        <item>62:SMPID WriteDisconnect Error</item>
        <item>63:SMPID ReadDisconnect Error</item>
        <item>64:DescriptorWrite(TLS)Error</item>
        <item>65:DescriptorWrite(RSSI)Error</item>

        <item>66:SMPID Write 遅延5秒</item>
        <item>67:SMPID Read  遅延5秒</item>
        <item>68:DescriptorWait(TLS) 遅延5秒</item>
        <item>69:DescriptorWait(RSSI) 遅延5秒</item>

        <item>70:ハンドシェイク中に切断</item>
        <item>71:接続直後に切断</item>
        <item>72:ReadBolob 1回目のRead前に切断</item>
        <item>73:ReadBolob 2回目のRead前に切断</item>
        <item>74:ReadBolob 送信直後に切断</item>
        <item>75:DescriptorWrite(TLS)中に切断</item>
        <item>76:DescriptorWrite(RSSI)中に切断</item>

                  */
                String msg ="";
                if( mTestCode == 63 || mTestCode == 61 || mTestCode == 67 ){
                    msg = "(注意)運用モードの場合はスマホIDが0xFF00以上のエラーコードを返さないとSMPIDのRead自体が発生しない";
                }else if( mTestCode == 30 ){
                    msg = "TLSコマンド（ReadBolbなし)とTLSコマンド(ReadBlobあり）を発行。ただし、ReadBlobの並列はテストペリフェラルで対応していないのでこのReadBlobはReadしてもエラーになる。";
                }else if( mTestCode == 40 ){
                    msg = "Readに対する応答でSeqIDが異なるIDで返します";
                }else if( mTestCode == 41 ){
                    msg = "ReadBlob応答時に同じSeqIDでNotifyを発行します";
                }else if( mTestCode == 70 ){
                    msg = "(注意)SecLibパッチで擬似ハンドシェーク用のコードを有効にしないと発生しません。";
                }else if( mTestCode == 74 ){
                    msg = "おそらく、鍵側でSleepが必要";
                }
                if( msg.length() > 0 ){
                    Toast.makeText(MainActivity.this,msg,Toast.LENGTH_LONG).show();
                }



            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });



        mCheckBox_ALL=(CheckBox)findViewById(R.id.chk_response_all);
        mCheckBox_gethst =(CheckBox)findViewById(R.id.chk_response_gethst);
        mCheckBox_getinf1 =(CheckBox)findViewById(R.id.chk_response_getinf1);
        mCheckBox_getinf2 =(CheckBox)findViewById(R.id.chk_response_getinf2);

        mCheckBox_getcnf =(CheckBox)findViewById(R.id.chk_response_getcnf);
        mCheckBox_setcnf =(CheckBox)findViewById(R.id.chk_response_setcnf);
        mCheckBox_actath =(CheckBox)findViewById(R.id.chk_response_actath);
        mCheckBox_actreg =(CheckBox)findViewById(R.id.chk_response_actreg);
        mCheckBox_actlck =(CheckBox)findViewById(R.id.chk_response_actlck);
        mCheckBox_actdsc =(CheckBox)findViewById(R.id.chk_response_actdsc);
        mCheckBox_getver =(CheckBox)findViewById(R.id.chk_response_getver);
        mCheckBox_setprm =(CheckBox)findViewById(R.id.chk_response_setprm);
        mCheckBox_actfrm1 =(CheckBox)findViewById(R.id.chk_response_actfrm1);
        mCheckBox_actfrm2 =(CheckBox)findViewById(R.id.chk_response_actfrm2);
        mCheckBox_actfrm3 =(CheckBox)findViewById(R.id.chk_response_actfrm3);
        mCheckBox_actfrm4 =(CheckBox)findViewById(R.id.chk_response_actfrm4);
        mCheckBox_setflg =(CheckBox)findViewById(R.id.chk_response_setflg);
        mCheckBox_cbor_error = (CheckBox)findViewById(R.id.chk_response_cborerror);
        mCheckBox_disconnect_error = (CheckBox)findViewById(R.id.chk_response_disconnecterror);
        mCheckBox_readblob = (CheckBox)findViewById(R.id.chk_response_readblob);



        mCheckBox_write_gethst =(CheckBox)findViewById(R.id.chk_write_response_gethst);
        mCheckBox_write_getinf1 =(CheckBox)findViewById(R.id.chk_write_response_getinf1);
        mCheckBox_write_getinf2 =(CheckBox)findViewById(R.id.chk_write_response_getinf2);
        mCheckBox_write_getcnf =(CheckBox)findViewById(R.id.chk_write_response_getcnf);
        mCheckBox_write_setcnf =(CheckBox)findViewById(R.id.chk_write_response_setcnf);
        mCheckBox_write_actath =(CheckBox)findViewById(R.id.chk_write_response_actath);
        mCheckBox_write_actreg =(CheckBox)findViewById(R.id.chk_write_response_actreg);
        mCheckBox_write_actlck =(CheckBox)findViewById(R.id.chk_write_response_actlck);
        mCheckBox_write_actdsc =(CheckBox)findViewById(R.id.chk_write_response_actdsc);
        mCheckBox_write_getver =(CheckBox)findViewById(R.id.chk_write_response_getver);
        mCheckBox_write_setprm =(CheckBox)findViewById(R.id.chk_write_response_setprm);
        mCheckBox_write_actfrm1 =(CheckBox)findViewById(R.id.chk_write_response_actfrm1);
        mCheckBox_write_actfrm2 =(CheckBox)findViewById(R.id.chk_write_response_actfrm2);
        mCheckBox_write_actfrm3 =(CheckBox)findViewById(R.id.chk_write_response_actfrm3);
        mCheckBox_write_actfrm4 =(CheckBox)findViewById(R.id.chk_write_response_actfrm4);
        mCheckBox_write_setflg =(CheckBox)findViewById(R.id.chk_write_response_setflg);
        mCheckBox_write_disconnect_error = (CheckBox)findViewById(R.id.chk_write_disconnecterror);


        {
            TextView tv = (TextView) findViewById(R.id.title_ntfCmd);
            tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    LinearLayout ly = (LinearLayout) findViewById(R.id.ntfCmdLayout);
                    ly.setVisibility(ly.getVisibility() != View.VISIBLE ? View.VISIBLE : View.GONE);
                }
            });
        }
        {
            TextView tv = (TextView) findViewById(R.id.title_request);
            tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    LinearLayout ly = (LinearLayout) findViewById(R.id.requestLayout);
                    ly.setVisibility(ly.getVisibility() != View.VISIBLE ? View.VISIBLE : View.GONE);
                }
            });
        }
        {
            TextView tv = (TextView) findViewById(R.id.title_response);
            tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    LinearLayout ly = (LinearLayout) findViewById(R.id.responseLayout);
                    ly.setVisibility(ly.getVisibility() != View.VISIBLE ? View.VISIBLE : View.GONE);
                }
            });
        }


        mEditText_NtfPmtRssi=(EditText)findViewById(R.id.editText_ntfrssi);
        mEditText_Rssi = (EditText)findViewById(R.id.editText_rssi);
        mEditText_Header_Detail=(EditText)findViewById(R.id.editText_header_detail);
        mEditText_Payload=(EditText)findViewById(R.id.editText_Payload);
        mEditText_LockBurreSize=(EditText)findViewById(R.id.editText_lock_buffersize);
        // フォーカスが外れた場合とEnterで設定する様に対応。バックキーは未対応
        mEditText_RegistRevID=(EditText)findViewById(R.id.editText_regist_revid);
        mEditText_RegistRevID.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean b) {
                if( b == false ){
                    String revNo = mEditText_RegistRevID.getText().toString();
                    if (revNo != null && revNo.length() == 4) {
                        setRevisionNo(revNo);
                    } else {
                        Toast.makeText(MainActivity.this, "リビジョン番号は必ず4文字入力してください。", Toast.LENGTH_LONG).show();
                        setRevisionNo(mPrefer.getString(SHARED_PREFERENCE_KEY_REVISION_NO,null));
                    }
                }
            }
        });

        mEditText_RegistRevID.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                boolean handled = false;
                if(event != null && event.getKeyCode() == KeyEvent.KEYCODE_ENTER) {
                    if(event.getAction() == KeyEvent.ACTION_UP) {
                        String revNo = mEditText_RegistRevID.getText().toString();
                        if (revNo != null && revNo.length() == 4) {
                            setRevisionNo(revNo);
                        } else {
                            Toast.makeText(MainActivity.this, "リビジョン番号は必ず4文字入力してください。", Toast.LENGTH_LONG).show();
                            setRevisionNo(mPrefer.getString(SHARED_PREFERENCE_KEY_REVISION_NO,null));
                        }
                    }
                    handled = true;
                }

                return handled;
            }
        });

        mEditText_CnfSmpNum=(EditText)findViewById(R.id.editText_cnf_smp_num);
        mEditText_CnfTagNum=(EditText)findViewById(R.id.editText_cnf_tag_num);
        mEditText_CnfCardNum=(EditText)findViewById(R.id.editText_cnf_card_num);
        mEditText_CnfFamcode=(EditText)findViewById(R.id.editText_cnf_famcode);
        mEditText_VerControllerVer=(EditText)findViewById(R.id.editText_ver_controlerver);

        mEditText_SleepMSec=(EditText)findViewById(R.id.editText_sleeptime);
        mEditText_Write_SleepMSec=(EditText)findViewById(R.id.editText_write_sleeptime);


        mEditText_LockId=(EditText)findViewById(R.id.editText_lock_id);
        mEditText_LockId.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean b) {
                if( b == false ){
                    if( convertKeyId() != null ){
                        String keyIdText = mEditText_LockId.getText().toString();
                        if( keyIdText != null && keyIdText.length() == 6 ) {
                            SharedPreferences.Editor editor = mPrefer.edit();
                            editor.putString(SHARED_PREFERENCE_KEY_LOCK_ID, keyIdText);
                            editor.apply();


                            return;
                        }
                    }
                    Toast.makeText(MainActivity.this, "錠IDは必ず6文字入力してください。", Toast.LENGTH_LONG).show();
                }
            }
        });
        mEditText_SmpId=(EditText)findViewById(R.id.editText_smpid);
        mEditText_SmpId.setText( String.format("%04x",getNextSmpId()) );
//        mEditText_SmpId.setOnFocusChangeListener(new View.OnFocusChangeListener() {
//            @Override
//            public void onFocusChange(View view, boolean b) {
//                if( b == false ){
//                    String keyIdText = mEditText_SmpId.getText().toString();
//                    byte[] smpid = hex2bin(keyIdText);
//                    if( smpid != null && smpid.length == 2  ) {
//                        SharedPreferences.Editor editor = mPrefer.edit();
//                        editor.putString(SHARED_PREFERENCE_KEY_SMP_ID, keyIdText);
//                        editor.apply();
//                        return;
//                    }
//                    Toast.makeText(MainActivity.this, "スマホIDは必ず4文字入力してください。", Toast.LENGTH_LONG).show();
//                }
//            }
//        });
        mLogger.LogE(TAG,mBleAdapter.getAddress());

        mEditText_GetHstRecNum = (EditText) findViewById(R.id.editText_gethst_num);

        if( !getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE) ){
            Toast.makeText(this, "お使いのデバイスでBLEが使用できません。", Toast.LENGTH_LONG).show();
            finish();
        }


        if ((mBleAdapter == null)
                || (! mBleAdapter.isEnabled())) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            // Intentでボタンを押すとonActivityResultが実行されるので、第二引数の番号を元に処理を行う.
            startActivityForResult(enableBtIntent, 123);
        }
        else {
            settingBle();
        }


        String key_id = mPrefer.getString(SHARED_PREFERENCE_KEY_LOCK_ID,null);
        if( key_id != null && key_id.length() == 6 ) {
            mEditText_LockId.setText(key_id);
        }
        else {
            mEditText_LockId.setText("000000");
        }

        String revNo = mPrefer.getString(SHARED_PREFERENCE_KEY_REVISION_NO,null);
        if( revNo != null && revNo.length() == 4 ) {
            setRevisionNo(revNo);
        }
        else {
            setRevisionNo("0000");
        }
//        String smp_id = mPrefer.getString(SHARED_PREFERENCE_KEY_SMP_ID,null);
//        if( smp_id != null && smp_id.length() == 4 ) {
//            mEditText_SmpId.setText(smp_id);
//        }
//        else {
//            mEditText_SmpId.setText("0000");
//        }


        mTextView_Session=(TextView)findViewById(R.id.sessionTxt);
        mTextView_Session.setText("リモコンと未接続");

        mTextView_Advertise=(TextView)findViewById(R.id.text_advertise);
        mTextView_Advertise.setText("(停止中)");


        mHandlerThread.start();
        mHandler = new Handler(mHandlerThread.getLooper());

        mHashMap = new HashMap();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // インテントでBluetoothをOnにしたら、使用準備開始.
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 123:
                if ((mBleAdapter != null)
                        || (mBleAdapter.isEnabled())) {
                    // if BLE is enabled, start advertising.
                    settingBle();
                }
                break;
        }
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            mTextView_Log.setText("");
            return true;
        }

        return super.onOptionsItemSelected(item);
    }


    boolean mNtfAuto = false;
    long mLastSendNtf = 0;

    /** Ntfコマンド発行周期 */
    static final int DIVIDE_TIME = 5000;
    /** NtfTch,Pmt発行周期（インターバル回目） */
    static final int DIVIDE_CYCLE_TCH = 3;
    /** NtfSty（インターバル回目） */
    static final int DIVIDE_CYCLE_STY = 1;
    char mSendCounter = 0;


    private Timer mNtfTimer = null;
    private static final SimpleDateFormat sDf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss.SSS", Locale.US);


    boolean mLogView = true;
    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_camera) {
            mLogView = mLogView?false:true;
            findViewById(R.id.scrollv).setVisibility(mLogView?View.VISIBLE:View.GONE);
            // Handle the camera action
        } else if (id == R.id.nav_gallery) {
            if (mBleAdapter.isEnabled()) {

                createDialogWithDismissListner("BluetoothをOFFにしてアプリを終了します。再度アイコンタップして起動してください。", new DialogInterface.OnDismissListener() {
                    @Override
                    public void onDismiss(DialogInterface dialog) {
                        mBleAdapter.disable();
                        finish();
                    }
                });
            }
        } else if (id == R.id.nav_manage ){
            //定期実行
            mNtfAuto = mNtfAuto?false:true;
            Toast.makeText(this,mNtfAuto?"Ntf定期実行Start":"Ntf定期実行End",Toast.LENGTH_LONG).show();
            if( mNtfAuto ) {
                mSendCounter = 0;
                mLastSendNtf = Calendar.getInstance().getTime().getTime();
                if( mNtfTimer != null ){
                    mNtfTimer.cancel();
                    mNtfTimer = null;
                }
                mNtfTimer = new Timer(true);
                mNtfTimer.schedule(new TimerTask() {
                    @Override
                    public void run() {
                        final long nowTime = Calendar.getInstance().getTime().getTime();

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mTextView_Time.setText( sDf.format(new Date(nowTime)));
                            }
                        });


                        if( nowTime/DIVIDE_TIME > mLastSendNtf/DIVIDE_TIME ){
                            mSendCounter++;
                            mLastSendNtf = nowTime;



                            if( mSendCounter % DIVIDE_CYCLE_TCH == 0 ) {
                                {
                                    /** Ntfコマンド発行*/
                                    byte[] senddata = null;
                                    try {
                                        senddata = createNtfTch();
                                        mLogger.LogD(TAG, String.format("send ntftch addr %s \ndata %s", mConnectedDevice.getAddress(), ByteArrayToString(senddata)));
                                        synchronized (mBtCharacteristic_TSLRead) {
                                            mBtCharacteristic_TSLRead.setValue(senddata);
                                            mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);
                                        }
                                    } catch (Exception e) {
                                        mLogger.LogE(TAG, e.getMessage());
                                    }
                                }
                                {
                                    byte[] senddata = null;
                                    try {
                                        senddata = createNtfPmt();
                                        mLogger.LogD(TAG, String.format("send ntfpmt addr %s \ndata %s", mConnectedDevice.getAddress(), ByteArrayToString(senddata)));
                                        synchronized (mBtCharacteristic_TSLRead) {
                                            mBtCharacteristic_TSLRead.setValue(senddata);
                                            mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);
                                        }
                                    } catch (Exception e) {
                                        mLogger.LogE(TAG, e.getMessage());
                                    }

                                }
                            }

                            if( mSendCounter % DIVIDE_CYCLE_STY == 0 ) {
                                {
                                    byte[] senddata = null;
                                    try {
                                        senddata = createNtfSty();
                                        mLogger.LogD(TAG, String.format("send ntfsty addr %s \ndata %s", mConnectedDevice.getAddress(), ByteArrayToString(senddata)));
                                        synchronized (mBtCharacteristic_TSLRead) {
                                            mBtCharacteristic_TSLRead.setValue(senddata);
                                            mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);
                                        }
                                    } catch (Exception e) {
                                        mLogger.LogE(TAG, e.getMessage());
                                    }
                                }
                            }

                        }
                    }
                }, 500, 100);
            }
            else {
                if( mNtfTimer != null ){
                    mNtfTimer.cancel();
                    mNtfTimer = null;
                }
            }
        } else if (id == R.id.nav_slideshow) {
            mListView = new ListView(this);
            mListView.setAdapter(mListAdapter);
            AlertDialog dialog = new AlertDialog.Builder(this)
                    .setTitle("登録機器")
                    .setView(mListView).create();
            dialog.show();

        } else if (id == R.id.nav_test) {
            //テストコード実行
            createUserInfoMaxData();
        } else if (id == R.id.nav_test_check_smapho_id) {
            //テストコード実行
            createUserInfoRangeCheckData();
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    //==================================================================================================================================================================================================================
    //==================================================================================================================================================================================================================
    // UI
    //==================================================================================================================================================================================================================
    //==================================================================================================================================================================================================================

    synchronized private void sendRSSI(){
        if( mConnectedDevice != null && mBtCharacteristic_RSSI != null ) {
            byte[] sendata = new byte []{0x00/*アンテナ*/,(byte)Integer.parseInt(mEditText_Rssi.getText().toString(), 10)};
            mBtCharacteristic_RSSI.setValue(sendata);
            mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_RSSI, false);
        }
    }

    public void onClick(View view) {

        if( view.getId() == R.id.btn_lockid){
            String keyIdText = createKeyId();
            mEditText_LockId.setText(keyIdText);
            SharedPreferences.Editor editor = mPrefer.edit();
            editor.putString(SHARED_PREFERENCE_KEY_LOCK_ID, keyIdText);
            editor.apply();

        }
        else if( view.getId() == R.id.btn_scan_normal){
            startAdvertise(0);
        }
        else if( view.getId() == R.id.btn_scan_regist){
            if( mUserInfo.size() >= 10 ){
                createDialog("これ以上登録できなないので削除してください");
                return;
            }
            startAdvertise(1);
        }
        else if( view.getId() == R.id.btn_scan_stop){
            try {
                if (mConnectedDevice != null) {
                    mBtGattServer.cancelConnection(mConnectedDevice);
                }
            }catch (Exception e ){
                e.printStackTrace();
            }
            stopAdvertise();
        }
        else if( view.getId() == R.id.btn_scan_touch){
            startAdvertise(2);
        }
        else if( view.getId() == R.id.btn_rssi ){

            //-------------------------------------------------
            //テスト用にTLSコマンドを発行する
            //-------------------------------------------------
            if( mTestCode == 30 || mTestCode == 31 ) {
                try {
                    synchronized (mBtCharacteristic_TSLRead) {
                        //任意のコマンド発行
                        byte[] senddata = new byte[]{(byte) 0xFF, 0x00, 0x04, /* GetInf */ 0x40, (byte) 0xFF, 0x03, 0x00};
                        mBtCharacteristic_TSLRead.setValue(senddata);
                        mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);

                        if( mTestCode == 30 )
                        {
                            //任意のコマンド発行(ReadBlob発生する)
                            //ReadBlob
                            byte[] blobData = new byte[300];
                            System.arraycopy(senddata, 0, blobData, 0, senddata.length);
                            blobData[0] = (byte) 0xFE;
                            blobData[1] = (byte) (((300 - 3) >> 8) & 0xFF);
                            blobData[2] = (byte) (((300 - 3)) & 0xFF);
                            mBtCharacteristic_TSLRead.setValue(blobData);
                            mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);

                            //これは設定できない(性能限界。)受け側はReadできなくてエラーが返るがそれでテスト的には要件満たしている。
//                            mResponseDataBuffer.mResponsedata = blobData;
//                            mResponseDataBuffer.offset = notifyMaxBufferSize();
//                            mResponseDataBuffer.SequenceID = (byte)0xFE;
//                            mResponseDataBuffer.bufferSize =  notifyMaxBufferSize();

                        }
                    }
                }catch (Exception e ){
                    e.printStackTrace();
                }
                return;
            }
            sendRSSI();
        }
        else if( view.getId() == R.id.btn_ntftch){

            byte[] senddata = null;
            try {
                senddata = createNtfTch();
                mLogger.LogD(TAG, String.format("send ntftch addr %s \ndata %s", mConnectedDevice.getAddress(),  ByteArrayToString(senddata)));
                synchronized (mBtCharacteristic_TSLRead) {
                    mBtCharacteristic_TSLRead.setValue(senddata);
                    mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);
                }
            }catch (Exception e ){
                mLogger.LogE(TAG,e.getMessage());
            }

        }
        else if( view.getId() == R.id.btn_ntfsty){
            byte[] senddata = null;
            try {
                senddata = createNtfSty();
                mLogger.LogD(TAG, String.format("send ntfsty addr %s \ndata %s", mConnectedDevice.getAddress(),  ByteArrayToString(senddata)));
                synchronized (mBtCharacteristic_TSLRead) {
                    mBtCharacteristic_TSLRead.setValue(senddata);
                    mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);
                }
            }catch (Exception e ){
                mLogger.LogE(TAG,e.getMessage());
            }
        }
        else if( view.getId() == R.id.btn_ntfprm){
            byte[] senddata = null;
            try {
                senddata = createNtfPmt();
                mLogger.LogD(TAG, String.format("send ntfpmt addr %s \ndata %s", mConnectedDevice.getAddress(),  ByteArrayToString(senddata)));
                synchronized (mBtCharacteristic_TSLRead) {
                    mBtCharacteristic_TSLRead.setValue(senddata);
                    mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);
                }
            }catch (Exception e ){
                mLogger.LogE(TAG,e.getMessage());
            }
        }
        else if( view.getId() == R.id.btnDelete ){
            long deleteid = (Long)view.getTag();
            deleteUseInfo(deleteid);
            mListAdapter.notifyDataSetChanged();
        }
    }



    public byte[] hex2bin(String hex) {

        if( hex.length() % 2 != 0 ){
            hex = "0" + hex;
        }
        byte[] bytes = new byte[hex.length() / 2];

        try {
            for (int i = 0; i < bytes.length; i++) {
                bytes[i] = (byte) Integer.parseInt(hex.substring(i * 2, i * 2 + 2), 16);
            }
        }catch (NumberFormatException e ){
            mLogger.LogE(TAG,e.getMessage());
            bytes = null;
        }
        return bytes;
    }

    public static String ByteArrayToString(byte[] data){
        if( data == null ){
            return "null";
        }
        String buffer ="";
        int counter = 0;
        for (byte b : data) {
            if( counter % 16 == 0){
                buffer += "0x";
            }

            counter++;
            buffer += String.format(Locale.US,"%02x ", b);

            if( counter % 8 == 0){
                buffer += " ";
            }

            if( counter % 16 == 0){
                buffer += "\n";
            }

        }
        return buffer;
    }

    private String createKeyId(){
        byte[] sendKeyId = new byte[3];
        Random r = new Random();
        for( int i = 0 ; i < sendKeyId.length; i++ ) {
            int n = r.nextInt(255);
            sendKeyId[i] = (byte)n;
        }
        return ByteArrayToString(sendKeyId).replace(" ","").substring(2);
    }


    private byte[] convertKeyId(){
        byte[] sendKeyId = new byte[3];
        sendKeyId[0] = 0x00;

        String keyIdText = mEditText_LockId.getText().toString();
        if (TextUtils.isEmpty(keyIdText) || keyIdText.length() != 6) {
            Toast.makeText(MainActivity.this, "錠IDが入力されていないか、6文字分の入力ではありません。", Toast.LENGTH_SHORT).show();
            return null;
        }
        else {
            int j = 0;
            try {
                // 入力された錠IDの文字列から2文字ずつ取り出して、byte型に変換
                for (int i = 0; i < 3; i++, j++) {
                    String twoChar = keyIdText.substring(i * 2, i * 2 + 2);
                    sendKeyId[j] = (byte) Integer.parseInt(twoChar, 16);
                }
            } catch (NumberFormatException ex) {
                ex.printStackTrace();
                // エラーが発生した場合、そのバイトの値を0に
                return null;
            }
        }
        return sendKeyId;
    }


    //==================================================================================================================================================================================================================
    //==================================================================================================================================================================================================================
    // BLE
    //==================================================================================================================================================================================================================
    //==================================================================================================================================================================================================================
    BluetoothGattCharacteristic mBtCharacteristic_TSLWrite;
    BluetoothGattCharacteristic mBtCharacteristic_TSLRead;
    BluetoothGattCharacteristic mBtCharacteristic_SmpID;
    BluetoothGattCharacteristic mBtCharacteristic_RSSI;
    BluetoothGattServer mBtGattServer;

    private void settingBle(){
        if( !getDefaultAdapter().isMultipleAdvertisementSupported() ) {
            Toast.makeText(this, "お使いのデバイスではPeripheralモードが使用できません。", Toast.LENGTH_SHORT).show();
            return;
        }
        mBtAdvertiser = mBleAdapter.getBluetoothLeAdvertiser();

        // BLEでのデータのやり取りで使用する、ServiceとCharacteristicの準備.
        // 各UUIDはCentralと同じものを使用すること.
        BluetoothGattService btGattService = new BluetoothGattService(UUID.fromString(Define.UUID_SERVICE_TLS), BluetoothGattService.SERVICE_TYPE_PRIMARY);
        BluetoothGattDescriptor dataDescriptor1 = new BluetoothGattDescriptor(
                UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                , BluetoothGattDescriptor.PERMISSION_WRITE | BluetoothGattDescriptor.PERMISSION_READ);

        BluetoothGattDescriptor dataDescriptor2 = new BluetoothGattDescriptor(
                UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                , BluetoothGattDescriptor.PERMISSION_WRITE | BluetoothGattDescriptor.PERMISSION_READ);


        BluetoothGattDescriptor dataDescriptor3 = new BluetoothGattDescriptor(
                UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
                , BluetoothGattDescriptor.PERMISSION_WRITE | BluetoothGattDescriptor.PERMISSION_READ);
        //TLSWrite
        {
            mBtCharacteristic_TSLWrite = new BluetoothGattCharacteristic(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLWRITE)
                    ,BluetoothGattCharacteristic.PROPERTY_WRITE,
                    BluetoothGattCharacteristic.PERMISSION_WRITE
            );
            btGattService.addCharacteristic(mBtCharacteristic_TSLWrite);
        }

        //TLSRead
        {
            mBtCharacteristic_TSLRead = new BluetoothGattCharacteristic(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLREAD)
                    ,BluetoothGattCharacteristic.PROPERTY_READ|BluetoothGattCharacteristic.PROPERTY_NOTIFY,
                    BluetoothGattCharacteristic.PERMISSION_READ
            );
            mBtCharacteristic_TSLRead.addDescriptor(dataDescriptor1);
            btGattService.addCharacteristic(mBtCharacteristic_TSLRead);
        }

        //SMPID
        {
            mBtCharacteristic_SmpID = new BluetoothGattCharacteristic(UUID.fromString(Define.UUID_CHARACTERISTIC_SMAPHID)
                    ,BluetoothGattCharacteristic.PROPERTY_READ|BluetoothGattCharacteristic.PROPERTY_WRITE|BluetoothGattCharacteristic.PROPERTY_INDICATE,
                    BluetoothGattCharacteristic.PERMISSION_READ|BluetoothGattCharacteristic.PERMISSION_WRITE
            );
            btGattService.addCharacteristic(mBtCharacteristic_SmpID);
            mBtCharacteristic_SmpID.addDescriptor(dataDescriptor3);
        }

        //RSSI
        {
            mBtCharacteristic_RSSI = new BluetoothGattCharacteristic(UUID.fromString(Define.UUID_CHARACTERISTIC_RSSI)
                    ,BluetoothGattCharacteristic.PROPERTY_READ|BluetoothGattCharacteristic.PROPERTY_NOTIFY,
                    BluetoothGattCharacteristic.PERMISSION_READ
            );
            mBtCharacteristic_RSSI.addDescriptor(dataDescriptor2);
            btGattService.addCharacteristic(mBtCharacteristic_RSSI);
        }


        // やりとりするデータを管理するサーバを開き、サービスを追加する.
        // 接続・切断、WriteRequestなどの受け取りはmGattServerCallbackで.
        mBtGattServer = mBleManager.openGattServer(this, mGattServerCallback);

        mBtGattServer.addService(btGattService);



    }


    String mAdvUUID = "";

    private void showSnackBar(String msg){

        LinearLayout  mainLayout = null;
        try {
            mainLayout = (LinearLayout)findViewById(R.id.mainLayout);
            Snackbar snackBar = Snackbar.make(mainLayout, msg, Snackbar.LENGTH_INDEFINITE);
            // スナックバーのメッセージを表示しているViewを取得
            TextView textView = (TextView) snackBar.getView().findViewById(android.support.design.R.id.snackbar_text);
            textView.setMaxLines(10);

            // 閉じるボタンを押された際の動作を定義
            snackBar.setAction("close", new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                }
            });
            snackBar.show();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private void startAdvertise(int mode){

        stopAdvertise();

        //------------------------------------------------------------------------------
        // Advertisingの設定.
        //------------------------------------------------------------------------------
        AdvertiseData.Builder dataBuilder=new AdvertiseData.Builder();
        AdvertiseSettings.Builder settingsBuilder=new AdvertiseSettings.Builder();

        dataBuilder.setIncludeTxPowerLevel(false);
        mTextView_Advertise.setText("(運用中)");
        String adv_uuid = Define.UUID_ADV_SERVICE_NORMAL;

        if( mode == 1 ) {
            mTextView_Advertise.setText("(登録中)");
            adv_uuid = Define.UUID_ADV_SERVICE_REGIST;
        }
        else if( mode == 2 ) {
            mTextView_Advertise.setText("(タッチ中)");
            adv_uuid = Define.UUID_ADV_SERVICE_TOUCH;
        }

        mAdvUUID = adv_uuid;
        dataBuilder.addServiceUuid(ParcelUuid.fromString(adv_uuid));

        byte []key_id = convertKeyId();
        if(key_id == null ){
            Toast.makeText(this, "錠IDの入力がおかしいです。0x00000000で設定しました。", Toast.LENGTH_LONG).show();
            key_id = new byte[]{0x0,0x0,0x0};
        }
        dataBuilder.addManufacturerData(0x003a, key_id);
        //dataBuilder.setIncludeDeviceName(true);
        // → これ設定すると開始できない


        settingsBuilder.setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED);
        // ConnectableをtrueにするとFlags AD typeの3byteがManufacturer specific data等の前につくようになります。
        settingsBuilder.setConnectable(true);
        settingsBuilder.setTimeout(0);
        settingsBuilder.setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH);


        mBtAdvertiser.startAdvertising(settingsBuilder.build(),dataBuilder.build()
                ,mAdvertiseCallback);

    }

    AdvertiseCallback mAdvertiseCallback =  new AdvertiseCallback(){
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            mLogger.LogD(TAG,"onStartSuccess");

        }
        @Override
        public void onStartFailure(int errorCode) {
            mLogger.LogE(TAG,"onStartFailure:"+String.valueOf(errorCode));

        }
    };

    private void stopAdvertise(){
        if( mBtAdvertiser == null ) return ;
        mBtAdvertiser.stopAdvertising(mAdvertiseCallback);
        mTextView_Advertise.setText("(停止中)");
        mAdvUUID = "";
    }

    byte[] combine(byte[] a, byte[]b) {
        byte[] c = new byte[a.length + b.length];
        System.arraycopy(a, 0, c, 0, a.length);
        System.arraycopy(b, 0, c, a.length, b.length);
        return c;
    }


    class ResponseDataBuffer {
        public byte[] mResponsedata = null;
        public byte SequenceID = 0;
        public int offset;
        public int bufferSize = 0;
        public int readStartOffSet = 0;     //OffsetReadでレスポンス時のオフセット位置
    }

    ResponseDataBuffer mResponseDataBuffer = new ResponseDataBuffer();

    private int notifyMaxBufferSize(){
        if( mEditText_LockBurreSize != null ) {
            int ATT_MTU = Integer.parseInt(mEditText_LockBurreSize.getText().toString());
            return ATT_MTU - 3;
        }
        return 0;
    }

    private int mTestCode = 0;
    private int mTestCode2= 0;

    class SendQueue implements Runnable {
        public byte[] data;
        public int flg = 0;    //汎用フラグ
        public int kind = 0;    //コマンド内種別
        public CoapRequestHeader header;
        public BluetoothDevice device;
        public BluetoothGattCharacteristic characteristic;

        @Override
        public void run() {



            characteristic.setValue(data);
            mBtGattServer.notifyCharacteristicChanged(device, characteristic, true);

//            byte[] responsedata = new byte[]{0x0};
//            int bufferSize = 0;
//            mLogger.LogD(TAG, String.format("🌟Make TLS Command🌟 0x%02x" ,header.Uri_Path));
//
//            try {
//                bufferSize = notifyMaxBufferSize();
//
//                if (header.Code == (byte)0xEF) {
//                    //擬似ハンドシェーク用受信
//                    responsedata = new byte[]{(byte)0x11,(byte)0x22,(byte)0x33,(byte)0x44,(byte)0x55,(byte)0x66};
//                    mLogger.LogD(TAG, String.format("擬似ハンドシェーク用受信"));
//
//                    if( mTestCode == 70 ){
//                        mBtGattServer.cancelConnection(device);
//                        return;
//                    }
//
//                } else {
//                    //データの作成。
//                    switch (header.Uri_Path) {
//                        case 0x31:
//                            mLogger.LogD(TAG, "🌟TLS Command GetHst🌟");
//                            responsedata = createGetHstResponse(this);
//                            break;
//                        case 0x32:
//                        {
//                            mLogger.LogD(TAG, "🌟TLS Command GetInf🌟");
//                            responsedata = createGetInfResponse(this);
////FOR TLSReadテスト =============================================================
//                            if( mTestCode >= 1 && mTestCode <= 5 || ( mTestCode >= 30 && mTestCode <= 39 )  || ( mTestCode >= 40 && mTestCode <= 49 ) ) {
//                                int dataSize = 0;
//
//                                if (mTestCode == 1) {
//                                    //ReadBlobギリギリ発生しないケース
//                                    dataSize = (bufferSize - 3/* header分 */) ;
//                                }else if (mTestCode == 2) {
//                                    //ReadBlob1回発生ケース
//                                    dataSize = ( bufferSize - 3/* header分 */)   + 1;
//                                } else if (mTestCode == 3) {
//                                    //ReadBlob2回でぴったりケース
//                                    dataSize = ( bufferSize - 3/* header分 */)  + ( bufferSize  );
//                                } else if (mTestCode == 4) {
//                                    //ReadBlob3回発生ケース
//                                    dataSize = ( bufferSize - 3/* header分 */)  + ( bufferSize ) + 1  ;
//                                } else if (mTestCode == 5 || ( mTestCode >= 30 && mTestCode <= 39 )  ||( mTestCode >= 40 && mTestCode <= 49 )) {
//                                    //ReadBlob中にNTFの確認をするために大量データ投入
//                                    dataSize = 512-3  ;
//                                }
//                                byte[] wkData = new byte[dataSize];
//                                for (int xx = 0; xx < dataSize; xx++) {
//                                    wkData[xx] = (byte) xx;
//                                }
//                                byte messageid = responsedata[1];
//                                responsedata = wkData;
//                                responsedata[1]= messageid;
//
//                            }
////FOR TLSReadテスト =============================================================
//                            break;
//                        }
//                        case 0x33:
//                            mLogger.LogD(TAG, "🌟TLS Command GetCnf🌟");
//                            responsedata = createGetCnfResponse(this);
//                            break;
//                        case 0x34:
//                            mLogger.LogD(TAG, "🌟TLS Command SetCnf🌟");
//                            responsedata = createSetCnfResponse(this);
//                            break;
//                        case 0x35:
//                            mLogger.LogD(TAG, String.format("🌟TLS Command ActAth🌟"));
//                            responsedata = createActAthResponse(this);
//                            break;
//                        case 0x36:
//                            mLogger.LogD(TAG, "🌟TLS Command ActReg🌟");
//                            responsedata = createActRegResponse(this);
//                            break;
//                        case 0x37:
//                            mLogger.LogD(TAG, "🌟TLS Command ActLck🌟");
//                            responsedata = createActLckResponse(this);
//                            break;
//                        case 0x3b:
//                            mLogger.LogD(TAG, "🌟TLS Command ActDsc🌟");
//                            responsedata = createActDscResponse(this);
//                            break;
//                        case 0x3c:
//                            mLogger.LogD(TAG, "🌟TLS Command GetVer🌟");
//                            responsedata = createGetVerResponse(this);
//                            break;
//                        case 0x3D:
//                            mLogger.LogD(TAG, "🌟TLS Command SetPrm🌟");
//                            responsedata = createSetPrmResponse(this);
//                            break;
//                        case 0x44:
//                            mLogger.LogD(TAG, "🌟TLS Command ActFrm🌟");
//                            responsedata = createActFrmResponse(this);
//                            break;
//                        case 0x4E:
//                            mLogger.LogD(TAG, "🌟TLS Command SetFlg🌟");
//                            responsedata = createSetFlgResponse(this);
//                            break;
//                        default:
//                            responsedata = null;
//                            break;
//                    }
//                }
//            }catch(Exception e ){
//                mLogger.LogE(TAG, e.getMessage());
//                return;
//            }
//
//            if (responsedata == null) {
//                mLogger.LogE(TAG, "🌟TLS Command 未サポート🌟");
//                return;
//            }
//
//
//            if( getResultChecked(this)){
//                //チェック入っていたら遅延させる
//                int sleepMsec = 0;
//                try{
//                    sleepMsec = Integer.parseInt(mEditText_SleepMSec.getText().toString());
//                }catch (Exception e ){
//
//                }
//                if( sleepMsec > 0 ){
//                    try {
//                        Thread.sleep(sleepMsec);
//                    } catch (InterruptedException e) {
//                        e.printStackTrace();
//                    }
//                }
//
//                if( mCheckBox_cbor_error.isChecked() ){
//                    //電文異常にする。
//                    //ヘッダの次のフィールドに異常データをつける。
//                    //ペイロードありの場合
//                    if( responsedata.length > 2 ){
//                        byte[] header = Arrays.copyOfRange(responsedata,0,2);
//                        byte[] body = Arrays.copyOfRange(responsedata,2,responsedata.length );
//                        header = combine(header,new byte[]{(byte)0xFF,(byte)0x99});
//                        responsedata = combine(header,body);
//                    }
//                }
//                else if( mCheckBox_disconnect_error.isChecked() ){
//                    mBtGattServer.cancelConnection(this.device);
//                    return;
//                }
//
//
//            }
//
//            //NotifyCationの作成
//            //SquensIDの付与
//            byte seqid = (byte)(getSequenceid() & 0xFF);
//            //サイズの付与
//            byte[] lengths = null;
////FOR TLSReadテスト =============================================================
////        <item>10:Notifyのヘッダ(サイズ超過)Notify   異常</item>
////        <item>11:Notifyのヘッダ(サイズ不足)Notify   異常</item>
////        <item>12:Notifyのヘッダ(サイズ超過)ReadBlob 異常</item>
////        <item>13:Notifyのヘッダ(サイズ不足)ReadBlob 異常</item>
//            if( mTestCode == 10 ) {
//                //異常発生パッチ
//                responsedata = new byte[]{0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a};
//                lengths = ByteBuffer.allocate(2).putShort((short) (responsedata.length+1)).array();
//            }
//            else if( mTestCode == 11 ) {
//                //異常発生パッチ
//                responsedata = new byte[]{0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a};
//                lengths = ByteBuffer.allocate(2).putShort((short) (responsedata.length-1)).array();
//            }
//            else if( mTestCode == 12 ) {
//                //異常発生パッチ
//                lengths = ByteBuffer.allocate(2).putShort((short)(responsedata.length+1)).array();
//            }
//            else if( mTestCode == 13 ) {
//                //異常発生パッチ
//                lengths = ByteBuffer.allocate(2).putShort((short)(responsedata.length-1)).array();
//            }
//            else {
//                lengths = ByteBuffer.allocate(2).putShort((short) responsedata.length).array();
//            }
////FOR TLSReadテスト =============================================================
//
//            byte[] headre_ext = combine(new byte[]{seqid}, lengths);
//            byte[] senddata = combine(headre_ext, responsedata);
//
//            mLogger.LogD(TAG, String.format("send response(Notify) addr %s \ndata %s", device.getAddress(),  ByteArrayToString(senddata)));
//
//
//            //すでに切断されていて応答が返せない場合落ちるのでt
//            try {
//                synchronized (mBtCharacteristic_TSLRead) {
//                    mBtCharacteristic_TSLRead.setValue(
//                            Arrays.copyOf(senddata, senddata.length > bufferSize ? bufferSize : senddata.length)
//                    );
//                    mBtGattServer.notifyCharacteristicChanged(device, mBtCharacteristic_TSLRead, false);
//                }
//            }catch (Exception e ){
//                mResponseDataBuffer = new ResponseDataBuffer();
//                mLogger.LogE(TAG, e.getMessage());
//                return;
//            }
//
//
//
//            if( bufferSize < senddata.length ){
//                //ReadBlobのためにバッファを保存する。本来は複数管理したいが今のことろこれで事足りるのでは？
//                //ReadBlobが必要
//                mResponseDataBuffer.mResponsedata = senddata;
//                mResponseDataBuffer.offset = bufferSize;
//                mResponseDataBuffer.SequenceID = seqid;
//                mResponseDataBuffer.bufferSize = bufferSize;
//            }
//            else {
//                mResponseDataBuffer = new ResponseDataBuffer();
//            }


        }
    }


    short messageid=0;
    short getMessageid(){
        if( messageid > 255){
            messageid = 0;
        }
        return messageid++;
    }
    short sequensid=0;
    short getSequenceid(){
        if( sequensid > 255){
            sequensid = 0;
        }
        return sequensid++;
    }

    private byte[] createResponseHeader(SendQueue sendQueue) {
        byte []ret = null;
        int detail = 0;
        byte detailbytes[] = hex2bin(mEditText_Header_Detail.getText().toString());
        if( detailbytes != null && detailbytes.length == 1 ) {
            detail = detailbytes[0];
        }
        int coapcode = Integer.parseInt( getValueFromItemText(mSpinner_header_coapcode.getSelectedItem().toString()));

        if( !getResultChecked(sendQueue)){
            //チェックなしはデフォルトを返す
            coapcode = 2;   //サクセス
            detail = 0;
        }


        CoapResponseHeader header = new CoapResponseHeader();

        header.setCode(
                coapcode
                , detail );
        header.setMessageID(getMessageid());
        header.setMessageID(sendQueue.header.MessageID);


        return header.create();
    }

    private byte[] createNtfHeader(byte id) {
        byte []ret = new byte[]{0x02,(byte)getMessageid(),id};
        return ret;
    }


/*
GetHst ○
GetInf ●
GetCnf ○
SetCnf ○

ActAth ○
ActReg ○

ActLck ●
ActDsc ○
GetVer × //FIXME 仕様不明点あるので未実装
SetPrm ○
ActFrm ○
SetFlg ○

NtfTch ○
NtfPmt ○
NtfSty ○

* */


    //----------------------------------------------------
    // 履歴作成用データクラス
    //----------------------------------------------------
    class History {
        int startrecno;
        int endrecno;
        int revisionNo;
        ArrayList<LockHist> lockHists = new ArrayList<>();
        ArrayList<EventHist> eventHists = new ArrayList<>();
        ArrayList<InspHist> inspHists = new ArrayList<>();
    }
    class LockHist {
        int recno;
        int time;
        int lockstat;
 //       int doorstat;
        int operation;
        int id;
    }
    class EventHist {
        int recno;
        int time;
        int eventno;
        int smapid;
        byte[] extent = new byte[52];
    }
    //これ使わない。
    class InspHist  {

    }
    History mHistory;


    //操作要因
    private char[] sousayouin = {0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B};

    //イベントID
    private char[] ibentoid = {0x00,0x00,0x00,0x01,0x01,0x02,0x03,0x04,0x04,0x05,0x05,0x06,0x07,0x07,0x08,0x08,0x09,0x09,0x0A,0x0A
            ,0x10,0x11,0x12,0x12,0x13,0x13,0x14,0x15,0x15,0x15,0x16,0x17,0x18
            };

    //イベントIDに対応したテストデータ（パターン用意する場合は、イベントID配列数＊N倍で設定すること
    private byte[][] ibentodata ={
/*0x00*/            {0x00}
/*0x00*/            ,{0x01}
/*0x00*/            ,{0x02}
/*0x01*/            ,{0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x00}
/*0x01*/            ,{0x41,0x42,0x43,0x44,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00}
/*0x02*/            ,{}
/*0x03*/            ,{}
/*0x04*/            ,{0x00}
/*0x04*/            ,{0x01}
/*0x05*/            ,{0x00}
/*0x05*/            ,{0x01}
/*0x06*/            ,{}
/*0x07*/            ,{0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x00
                     ,0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x41,0x42,0x43,0x44,0x45,0x46,0x00}
/*0x07*/            ,{0x31,0x32,0x33,0x34,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00
                     ,0x39,0x38,0x37,0x36,0x35,0x34,0x33,0x32,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00}
/*0x08*/            ,{0x00}
/*0x08*/            ,{0x01}
/*0x09*/            ,{0x01,0x02,0x03,0x04}
/*0x09*/            ,{0x00,0x00,0x00,0x00}
/*0x0A*/            ,{0x00,0x01}
/*0x0A*/            ,{0x01,0x00}
/*0x10*/            ,{}
/*0x11*/            ,{}
/*0x12*/            ,{0x00}
/*0x12*/            ,{0x01}
/*0x13*/            ,{0x00}
/*0x13*/            ,{0x01}
/*0x14*/            ,{}
/*0x15*/            ,{0x00}
/*0x15*/            ,{0x01}
/*0x15*/            ,{0x02}
/*0x16*/            ,{}
/*0x17*/            ,{}
/*0x18*/            ,{}
    };



    private void buildHistory(){
        mHistory = new History();

        String historyNumString = mEditText_GetHstRecNum.getText().toString();
        int historyNum = TextUtils.isEmpty(historyNumString) ? -1 : Integer.parseInt(historyNumString);
        // 電気錠履歴の場合、アプリから5件x2の履歴データを要求されるので最低10件以上
        if (historyNum % 5 != 0) {
            historyNum = 30;
            createDialog("履歴データ件数に不正な値が入力されています。\nデフォルト値として30が使用されます。");
        }

        int revisionNo = 1;     //履歴リビジョン番号
//        int revisionNo = (new Random()).nextInt(100);     //履歴リビジョン番号　※リビジョン番号を変えるためのテストコード
        Calendar now = Calendar.getInstance();
        now.set(Calendar.HOUR_OF_DAY, 12);
        now.set(Calendar.MINUTE, 0);
        now.set(Calendar.SECOND, 0);
        now.set(Calendar.MILLISECOND, 0);
        int basetime = (int)(now.getTime().getTime() / 1000);

        int histsmapid = 0;
        String input_data = mEditText_SmpId.getText().toString();
        try {
            histsmapid = Integer.parseInt(input_data,16);
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }

        //==========================================================================================
        mHistory.startrecno = 0;
        mHistory.endrecno = historyNum-1;
        mHistory.revisionNo = revisionNo;
        //データは逆順に設定（新しいものは最後）
        for( int i = 0 ; i< historyNum; i++ ){
            //施解錠履歴
            {
                LockHist lockHist = new LockHist();
                lockHist.recno = i;
                lockHist.time = basetime - ((historyNum-i)*60);
                lockHist.lockstat = i % 2 ;
                lockHist.operation = sousayouin[ (i / 2) % sousayouin.length];
                Log.d("debug","操作要因:"+i+"======"+lockHist.operation);
                lockHist.id = histsmapid;
                mHistory.lockHists.add(lockHist);
            }

            //イベント履歴
            {
                EventHist eventHist = new EventHist();
                eventHist.recno = i;
                eventHist.time = basetime - ((historyNum-i)*60);
                eventHist.eventno = ibentoid[ i % ibentoid.length];;
                eventHist.smapid = histsmapid;
                eventHist.extent = ibentodata[ i % ibentodata.length];
                mHistory.eventHists.add(eventHist);
            }
        }


    }


    private byte[] createGetHstResponse(SendQueue sendQueue) throws CborException {
        buildHistory();

        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        byte request_type = 0;
        int request_startno = 0;
        int request_num = 0;

        try{
            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data,CoapRequestHeader.size,sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for(DataItem dataItem : dataItems) {
                if( dataItem instanceof Array ){
                    Array arry = ((Array)dataItem);

                    Number p1 = ((Number)arry.getDataItems().get(0));
                    Number p2 = ((Number)arry.getDataItems().get(1));
                    Number p3= ((Number)arry.getDataItems().get(2));
                    request_type = (byte)p1.getValue().intValue();
                    request_startno = p2.getValue().intValue();
                    request_num = p3.getValue().intValue();
                    sendQueue.kind = request_type;

                }
                break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }

        mLogger.LogD(TAG,String.format("GetHst受信 履歴種別 0x%x 開始レコード番号 0x%x 取得レコード数 %d "
                ,request_type,request_startno,request_num));


        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        int proc_result = getProcResult(sendQueue);
        byte []header = createResponseHeader(sendQueue);

        int dataSize = 0;
        if( request_type == 0){
            dataSize = mHistory.lockHists.size() ;
        }
        else {
            dataSize = mHistory.eventHists.size();
        }

        if( request_startno == 0xffff ){
            request_startno = dataSize -1;
        } else if (request_startno == 0xfffe) {
            dataSize =  0;
        }

        int endno = request_startno - (request_num - 1);
        if( endno < 0 ){
            endno = 0;
        }

        if( dataSize <= 0 ){
            request_startno = 0xffff;
            endno = 0xffff;
        }


        if( request_startno < endno || request_num == 0  ){
            proc_result = 0x01;
            mLogger.LogE(TAG,String.format("GetHst受信 パラメータエラー"));
        }

        mLogger.LogD(TAG,String.format("GetHst受信 履歴種別 開始レコードIndex 0x%x 終了レコードIndex 0x%x"
                ,request_startno ,endno));


        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(proc_result);

        if( proc_result == 0 ) {
            //履歴種別
            if( request_type == 0){

                arrayBuilder.add(request_type)
                        //開始レコード番号
                        .add(request_startno)
                        .add(endno)
                        .add(mHistory.revisionNo)
                ;

                if( dataSize > 0 ) {
                    ArrayList<LockHist> lockHists = new ArrayList(mHistory.lockHists.subList(endno , request_startno + 1));

                    arrayBuilder = arrayBuilder.addArray();

                    //降順に作成
                    for (ListIterator iterator = lockHists.listIterator(lockHists.size()); iterator.hasPrevious();) {
                        final LockHist lockHist = (LockHist) iterator.previous();
                        arrayBuilder.addArray()
                                .add(lockHist.recno)
                                .add(lockHist.time)
                                .add(lockHist.lockstat)
//                            .add(lockHist.doorstat)
                                .add(lockHist.operation)
                                .add(lockHist.id).end();
                    }

                    arrayBuilder.end();
                }
            }
            else if ( request_type == 1 ){

                arrayBuilder.add(request_type)
                        //開始レコード番号
                        .add(request_startno)
                        .add(endno)
                        .add(mHistory.revisionNo)
                ;

                if( dataSize > 0 ) {
                    ArrayList<EventHist> eventHists = new ArrayList(mHistory.eventHists.subList(endno, request_startno + 1));

                    arrayBuilder = arrayBuilder.addArray();

                    //降順に作成
                    for (ListIterator iterator = eventHists.listIterator(eventHists.size()); iterator.hasPrevious();) {
                        final EventHist eventHist = (EventHist) iterator.previous();
                        arrayBuilder.addArray()
                                .add(eventHist.recno)
                                .add(eventHist.time)
                                .add(eventHist.eventno)
                                .add(eventHist.smapid)
                                .add(eventHist.extent).end();
                    }
                    arrayBuilder.end();
                }
            }
            else {
                return null;    //非対応
            }
        }
        arrayBuilder.end();

        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);

    }


    private Boolean getResultChecked(SendQueue sendQueue){
        if( mCheckBox_ALL.isChecked() ){
            return true;
        }

        switch (sendQueue.header.Uri_Path) {
            case 0x31:
                return mCheckBox_gethst.isChecked();
            case 0x32:
            {
                if( sendQueue.kind == 0){
                    return mCheckBox_getinf1.isChecked();
                }
                return mCheckBox_getinf2.isChecked();
            }
            case 0x33:
                return mCheckBox_getcnf.isChecked();
            case 0x34:
                return mCheckBox_setcnf.isChecked();
            case 0x35:
                return mCheckBox_actath.isChecked();
            case 0x36:
                return mCheckBox_actreg.isChecked();
            case 0x37:
                return mCheckBox_actlck.isChecked();
            case 0x3b:
                return mCheckBox_actdsc.isChecked();
            case 0x3c:
                return mCheckBox_getver.isChecked();
            case 0x3D:
                return mCheckBox_setprm.isChecked();
            case 0x44: {
                switch (sendQueue.kind){
                    case 0:
                        return mCheckBox_actfrm1.isChecked();
                    case 1:
                        return mCheckBox_actfrm2.isChecked();
                    case 2:
                        return mCheckBox_actfrm3.isChecked();
                    case 0xa:
                        return mCheckBox_actfrm4.isChecked();
                }
                break;
            }
            case 0x4E:
                return mCheckBox_setflg.isChecked();
        }
        return mCheckBox_ALL.isChecked();
    }

    private Boolean getWriteChecked(SendQueue sendQueue){
        switch (sendQueue.header.Uri_Path) {
            case 0x31:
                return mCheckBox_write_gethst.isChecked();
            case 0x32:
            {
                try {
                    if (sendQueue.data[3] == (byte)0x82 && sendQueue.data[4] == 0 ) {
                        return mCheckBox_write_getinf1.isChecked();
                    }
                    return mCheckBox_write_getinf2.isChecked();
                }catch (Exception e ){
                    e.printStackTrace();
                    return false;
                }
            }
            case 0x33:
                return mCheckBox_write_getcnf.isChecked();
            case 0x34:
                return mCheckBox_write_setcnf.isChecked();
            case 0x35:
                return mCheckBox_write_actath.isChecked();
            case 0x36:
                return mCheckBox_write_actreg.isChecked();
            case 0x37:
                return mCheckBox_write_actlck.isChecked();
            case 0x3b:
                return mCheckBox_write_actdsc.isChecked();
            case 0x3c:
                return mCheckBox_write_getver.isChecked();
            case 0x3D:
                return mCheckBox_write_setprm.isChecked();
            case 0x44: {
                try{

                    byte command = sendQueue.data[3];
                    if( sendQueue.data.length >= 5 ){
                         command = sendQueue.data[4];
                    }

                    switch (command){
                        case 0:
                            return mCheckBox_write_actfrm1.isChecked();
                        case 1:
                            return mCheckBox_write_actfrm2.isChecked();
                        case 2:
                            return mCheckBox_write_actfrm3.isChecked();
                        case 0xa:
                            return mCheckBox_write_actfrm4.isChecked();
                    }
                }catch (Exception e ){
                    e.printStackTrace();
                    return false;
                }

                break;
            }

            case 0x4E:
                return mCheckBox_write_setflg.isChecked();
        }
        return false;
    }

    private int getProcResult(SendQueue sendQueue){
        int proc_result = 0; //Success固定
        if( getResultChecked(sendQueue)){
            proc_result = Integer.parseInt(  mEditText_Payload.getText().toString(), 10);
        }
        return  proc_result;
    }



    private byte[] createGetInfResponse(SendQueue sendQueue) throws CborException {
//        buildRegistInfo();

        byte jouhousyubetu = 0;
        int start_rec_no = 0;
        int end_rec_no = 0;

        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        try{
            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data, CoapRequestHeader.size, sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for (DataItem dataItem : dataItems) {
                if (dataItem instanceof Array) {
                    Array arry = ((Array) dataItem);

                    Number payload = ((Number) arry.getDataItems().get(0));
                    jouhousyubetu = payload.getValue().byteValue();
                    sendQueue.kind = jouhousyubetu;
                    //登録情報詳細の場合のみ
                    if (jouhousyubetu == 0) {
                        Array arra2 = ((Array) arry.getDataItems().get(1));
                        Number startrecno = ((Number) arra2.getDataItems().get(0));
                        Number endrecno = ((Number) arra2.getDataItems().get(1));
                        start_rec_no = startrecno.getValue().intValue();
                        end_rec_no = endrecno.getValue().intValue();
                    }
                }
                else if (dataItem instanceof Number) {
                    jouhousyubetu = ((Number)dataItem).getValue().byteValue();
                    sendQueue.kind = jouhousyubetu;
                }
                    break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }

        mLogger.LogD(TAG, String.format("GetInf受信 情報種別 %d 開始レコード番号 %d 終了レコード番号 %d ", jouhousyubetu, start_rec_no, end_rec_no));


        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        int proc_result = getProcResult(sendQueue);
        byte[] header = createResponseHeader(sendQueue);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(proc_result);

        if (proc_result == 0) {

            if (jouhousyubetu == 0) {

    /*
        BLE
        登録
        情報詳細
            登録情報リビジョン番号	1～3bytes	0x0000～0xFFFF	電気錠の保持する登録情報の最新リビジョン番号

            登録台数	1byte	0x00～0x0A	レコード総数を設定する。
            開始レコード番号	1～2byte	0x00～0x09,0xFF	取得したレコードの開始番号
        ※0xFFは、該当レコードなしを示す。
        ※電気錠は、空白のレコードを持たないようユーザ情報を前詰めで管理する。
            終了レコード番号	1～2byte	0x00～0x09,0xFF	取得したレコードの終了番号
        ※開始レコード番号=0xFFの場合は、終了レコード番号も0xFFをセットすること。
            ユーザ情報
    ========================================================================================
        ※開始レコードと終了レコードで指定されたレコード数を含む。
        ID	1～3bytes	0x0001～0xFFFF	スマホID / リモコンID
                ユーザ名	最大bytes：
        3×文字数+x	20文字（TBD）	－
                権限	1byte	0x00:管理者
        0x01:一般
        0x02:保守
        0x03:ワンタイム	－
                有効
        期限	最大：
        5bytes	0x00000000～0xFFFFFFFF(秒)	登録情報の有効期限をunix timeで表す。
        0xFFFFFFFF(秒)は無期限とする。
    */

                int start_recno = start_rec_no;
                int end_recno = end_rec_no;

                if( end_recno  == 0xFF ){
                    end_recno = mUserInfo.size() -1;
                }

                if(end_recno >=  mUserInfo.size() ) {
                    end_recno = mUserInfo.size() - 1;
                }

                ArrayList<UserInfo> userInfos = new ArrayList<>();
                try {
                    userInfos = new ArrayList<UserInfo>(mUserInfo.subList(start_rec_no,end_recno+1));
                }catch( Exception ex ){
                    userInfos.clear();
                    mLogger.LogE(TAG,ex.getMessage());
                }

                if( userInfos.size() == 0 ){
                    start_recno = 0xFF;
                    end_recno = 0xFF;
                }


                arrayBuilder = arrayBuilder
                        //情報種別
                        .add(jouhousyubetu)
                        .addArray()
                        //登録情報リビジョン番号
                        .add(mRegistinfo.revno)
                        //登録台数
                        .add((byte) mUserInfo.size())
                        //開始レコード番号
                        .add(start_recno)
                        //開始終了レコード番号
                        .add(end_recno)
                        .addArray();

                for (UserInfo userinfo : userInfos) {
                    ArrayBuilder inner_arrayBuilder = arrayBuilder.addArray()
                            .add(userinfo.mRegID)
                            .add(userinfo.mUserName)
                            .add(userinfo.mAuth)
                            .add((userinfo.mExpiretime&0xFFFFFFFFL));
                    inner_arrayBuilder.end();
                }
                arrayBuilder.end();
                arrayBuilder.end();

            } else if (jouhousyubetu == 1) {
    /*
            状態
            施解錠状態	1byte	0x00:施錠
            0x01:解錠	－
            扉状態	1byte	0x00:閉扉
            0x01:開扉	－
            電池状態	1byte	0x00:通常
            0x01:電池消耗
            0x02:動作停止
            0x10:AC式	－
            登録情報リビジョン番号	1～3bytes	0x0000～0xFFFF	電気錠の保持する登録情報の最新リビジョン番号
    */

                arrayBuilder
                        //情報種別
                        .add(jouhousyubetu)
                        .addArray()
                        //施解錠状態（施錠）
                        .add(Byte.parseByte(getValueFromItemText(mSpinner_inf_LockUnLock.getSelectedItem().toString()), 16))
                        //扉状態
                        .add(Byte.parseByte(getValueFromItemText(mSpinner_inf_Door.getSelectedItem().toString()), 16))
                        //電池状態
                        .add(Byte.parseByte(getValueFromItemText(mSpinner_inf_Battery.getSelectedItem().toString()), 16))
                        //登録情報リビジョン番号
                        .add(mRegistinfo.revno)
                        .end();

            }
        }
        arrayBuilder.end();

        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);

    }

    private byte[] createActLckResponse(SendQueue sendQueue) throws CborException {

        final byte old_kind = (byte)mSpinner_inf_LockUnLock.getSelectedItemPosition();

        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        long reqeustnowtime = 0;
        int requestTrigger = 0;
        int requestopKind = 0;
        try{
            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data,CoapRequestHeader.size,sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for(DataItem dataItem : dataItems) {
                if( dataItem instanceof Array ){
                    Array arry = ((Array)dataItem);

                    Number nowtime = ((Number)arry.getDataItems().get(0));
                    Number trigger = ((Number)arry.getDataItems().get(1));
                    reqeustnowtime = nowtime.getValue().longValue();
                    requestTrigger = trigger.getValue().intValue();
                    sendQueue.kind = requestTrigger;

                    if( requestTrigger == 0x01) {
                        Number op_kind = ((Number) arry.getDataItems().get(2));
                        requestopKind = op_kind.getValue().intValue();
                    }
                }
                break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }

        mLogger.LogD(TAG,String.format("ActLck受信 現在時刻 0x%x 操作トリガ %d 操作種別 %d ",reqeustnowtime,requestTrigger,requestopKind));


        //----------------------------------------------------
        // 施錠/解錠のセグメントコントロールを切り替え
        //----------------------------------------------------
        final  int requestTrigger_final = requestTrigger;
        final int requestopKind_final = requestopKind;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if ( requestTrigger_final == 0x00 ) {  // タッチ
                    // 前回の設定と反転させる
                    mSpinner_inf_LockUnLock.setSelection((old_kind + 1) % 2);
                } else if ( requestTrigger_final == 0x01 ) {  // リモート
                    mSpinner_inf_LockUnLock.setSelection((byte)requestopKind_final);
                }
            }
        });

        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        int proc_result =getProcResult(sendQueue);
        byte []header = createResponseHeader(sendQueue);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(proc_result);

        if( proc_result == 0 ) {
            arrayBuilder.add(old_kind)
                    //時刻同期判定結果
                    .add(Byte.parseByte(getValueFromItemText(mSpinner_lck_timeSync.getSelectedItem().toString()),16));
        }
        arrayBuilder.end();

        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);
    }

    private byte[] createGetCnfResponse(SendQueue sendQueue) throws CborException {

        long reqeust_prm_kind = 0;

        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        try{
            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data,CoapRequestHeader.size,sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for(DataItem dataItem : dataItems) {
                if( dataItem instanceof Number ) {
                    Number p1 = (Number)dataItem;
                    reqeust_prm_kind = p1.getValue().intValue();
                    sendQueue.kind = (int)reqeust_prm_kind;
                }
                break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }
        mLogger.LogD(TAG,String.format("GetCnf受信 パラメータ種別 0x%x " ,reqeust_prm_kind ));

        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        int proc_result = getProcResult(sendQueue);
        byte []header = createResponseHeader(sendQueue);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(proc_result);

        if( proc_result == 0 ) {
            if( reqeust_prm_kind == 0 ){
                arrayBuilder
                        .add((byte)reqeust_prm_kind)
                        .add(hex2bin(mEditText_CnfFamcode.getText().toString()));
            }
            else {
                arrayBuilder
                        .add((byte)reqeust_prm_kind)
                        .add(Byte.parseByte(getValueFromItemText(mSpinner_cnf_res_auto.getSelectedItem().toString()), 16))
                        .add(Byte.parseByte(getValueFromItemText(mSpinner_cnf_res_sync.getSelectedItem().toString()), 16))
                        .add(Byte.parseByte(getValueFromItemText(mSpinner_cnf_res_sound.getSelectedItem().toString()), 16))
                        .add(Byte.parseByte(mEditText_CnfSmpNum.getText().toString(),10))
                        .add(Byte.parseByte(mEditText_CnfTagNum.getText().toString(),10))
                        .add(Byte.parseByte(mEditText_CnfCardNum.getText().toString(),10));
            }

        }
        arrayBuilder.end();

        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);


    }
    private  static String encodeFamilyCode( byte[] bytes ){
        StringBuilder buffer = new StringBuilder();
        for (byte b : bytes) {
            buffer.append(String.format(Locale.US,"%02d", b));
        }
        return buffer.toString();
    }
    private byte[] createSetCnfResponse(SendQueue sendQueue) throws CborException, UnsupportedEncodingException {
        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        int reqeust_prm_kind = 0;
        byte[] request_famcode = null;
        String req_UserName  ="";
        int request_ath = 0;
        int request_expiretime = 0;
        int request_smpid = 0;
        int request_locksound = 0;
        int request_nowtime = 0;

        try {


            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data, CoapRequestHeader.size, sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for (DataItem dataItem : dataItems) {
                if (dataItem instanceof Array) {
                    Array arry = ((Array) dataItem);
                    Number p1 = ((Number) arry.getDataItems().get(0));
                    reqeust_prm_kind = p1.getValue().intValue();
                    sendQueue.kind = reqeust_prm_kind;
                    if (reqeust_prm_kind == 0) {
                        ByteString p2 = ((ByteString) arry.getDataItems().get(1));
                        request_famcode = p2.getBytes();

                        final String uiFamcode = encodeFamilyCode(request_famcode);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mEditText_CnfFamcode.setText(uiFamcode);
                            }
                        });
                    } else if (reqeust_prm_kind == 1) {
                        arry = ((Array) arry.getDataItems().get(1));
                        Number p2 = ((Number) arry.getDataItems().get(0));
                        UnicodeString p3 = ((UnicodeString) arry.getDataItems().get(1));
                        Number p4 = ((Number) arry.getDataItems().get(2));
                        Number p5 = ((Number) arry.getDataItems().get(3));

                        request_smpid = p2.getValue().intValue();
                        req_UserName = p3.getString();
                        request_ath = p4.getValue().intValue();
                        request_expiretime = p5.getValue().intValue();

                        final String updateMsg = String.format("ユーザ情報更新内容 \n"
                                        + "スマホID 0x%x ユーザ名 %s 権限 0x%x 有効期限 0x%x \n"
                                        + "施解錠音 0x%x \n"
                                        + "現在時刻 0x%x \n"
                                ,request_smpid ,req_UserName,request_ath,request_expiretime
                                ,request_locksound
                                ,request_nowtime
                        );
                        //データ更新する機能はない。
                        runOnUiThread(new Runnable() {

                            @Override
                            public void run() {
                                showSnackBar(updateMsg);
//                                Toast.makeText(MainActivity.this,updateMsg,Toast.LENGTH_LONG).show();
                            }
                        });



                    } else if (reqeust_prm_kind == 2) {

                        Number p2 = ((Number) arry.getDataItems().get(1));
                        request_locksound = p2.getValue().intValue();
                        mSpinner_cnf_res_sound.setSelection(request_locksound);

                    } else {
                        Number p2 = ((Number) arry.getDataItems().get(1));
                        request_nowtime = p2.getValue().intValue();
                    }
                }
                break;
            }


        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }

        mLogger.LogD(TAG,String.format("SetCnf受信 パラメータ種別 0x%x \n"
                        + "ファミリーコード %s \n"
                        + "スマホID 0x%x ユーザ名 %s 権限 0x%x 有効期限 0x%x \n"
                        + "施解錠音 0x%x \n"
                        + "現在時刻 0x%x \n"
                ,reqeust_prm_kind
                ,ByteArrayToString(request_famcode)
                ,request_smpid ,req_UserName,request_ath,request_expiretime
                ,request_locksound
                ,request_nowtime
        ));

        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        int proc_result = getProcResult(sendQueue);
        byte []header = createResponseHeader(sendQueue);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(proc_result);
        arrayBuilder.end();

        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);
    }

    private byte[] createActAthResponse(SendQueue sendQueue) throws CborException {


        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        long reqeustnowtime = 0;
        int requestAthKind = 0;
        byte []requestFamilyCode = null;
        try{
            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data,CoapRequestHeader.size,sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for(DataItem dataItem : dataItems) {
                if( dataItem instanceof Array ){
                    Array arry = ((Array)dataItem);

                    Number p1 = ((Number)arry.getDataItems().get(0));
                    requestAthKind = p1.getValue().intValue();
                    sendQueue.kind = requestAthKind;

                    if( requestAthKind == 0x01) {
                        ByteString p2 = ((ByteString) arry.getDataItems().get(1));
                        requestFamilyCode = p2.getBytes();
                    }
                }
                break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }

        mLogger.LogD(TAG,String.format("ActAth受信 認証種別 0x%x ファミリーコード %s",requestAthKind, ByteArrayToString(requestFamilyCode) ));

        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        byte []header = createResponseHeader(sendQueue);
        int proc_result =getProcResult(sendQueue);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        if( proc_result != 0 ){
            new CborEncoder(baos).encode(new CborBuilder()
                    //payload
                    .add(getProcResult(sendQueue))
                    .build());
            byte[] result = baos.toByteArray();
            return combine(header,result);
        }

        if( requestAthKind == 0 ) {
            new CborEncoder(baos).encode(new CborBuilder()
                    .addArray()
                    //payload
                    .add(getProcResult(sendQueue))
                    //認証種別
                    .add(requestAthKind)
                    //確認
                    .add(Byte.parseByte(getValueFromItemText(mSpinner_ath_chk.getSelectedItem().toString()), 16))
                    .end()
                    .build());
            byte[] result = baos.toByteArray();
            return combine(header,result);
        }
        else {
            new CborEncoder(baos).encode(new CborBuilder()
                    .addArray()
                    //payload
                    .add(getProcResult(sendQueue))
                    //認証種別
                    .add(requestAthKind)
                    //認証
                    .add(Byte.parseByte(getValueFromItemText(mSpinner_ath_ath.getSelectedItem().toString()), 16))
                    .end()
                    .build());
            byte[] result = baos.toByteArray();
            return combine(header,result);
        }


    }

    private byte[] createActRegResponse(SendQueue sendQueue) throws CborException, UnsupportedEncodingException {
        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        long reqeust_ope_kind = 0;
        int request_nowtime = 0;
        String req_UserName  ="";
        int request_ath = 0;
        int request_expiretime = 0;
        int request_smpid = 0;

        try {
            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data, CoapRequestHeader.size, sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for (DataItem dataItem : dataItems) {
                if (dataItem instanceof UnsignedInteger) {
                    UnsignedInteger data = ((UnsignedInteger) dataItem);
                    int type = data.getValue().intValue();
                    sendQueue.kind = type;
                    switch(type) {
                        case 3:
                            // 全BLEタグ抹消
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    mEditText_CnfTagNum.setText("00");
                                }
                            });
                            updateIncrementRevisionNo();
                            break;
                        case 4:
                            // ICカード抹消
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    mEditText_CnfCardNum.setText("00");
                                }
                            });
                            updateIncrementRevisionNo();
                            break;
                    }
                }
                if (dataItem instanceof Array) {
                    Array arry = ((Array) dataItem);

                    Number p1 = ((Number) arry.getDataItems().get(0));
                    reqeust_ope_kind = p1.getValue().intValue();

                    if (reqeust_ope_kind == 0x00) {

                        if (mUserInfo.size() >= 10) {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    createDialog("これ以上登録できなないので削除してください");
                                }
                            });
                            byte[] header = createResponseHeader(sendQueue);

                            ByteArrayOutputStream baos = new ByteArrayOutputStream();
                            CborBuilder builder = new CborBuilder();
                            ArrayBuilder arrayBuilder = builder.addArray()
                                    //payload
                                    .add((byte) 0x02);   //モードエラーで返してしまう。
                            arrayBuilder.end();

                            new CborEncoder(baos).encode(builder.build());
                            byte[] result = baos.toByteArray();
                            return combine(header, result);
                        }

                        arry = ((Array) arry.getDataItems().get(1));
                        Number p2 = ((Number) arry.getDataItems().get(0));
                        UnicodeString p3 = ((UnicodeString) arry.getDataItems().get(1));
                        Number p4 = ((Number) arry.getDataItems().get(2));
                        Number p5 = ((Number) arry.getDataItems().get(3));

                        request_nowtime = p2.getValue().intValue();
                        req_UserName = p3.getString();
                        request_ath = p4.getValue().intValue();
                        request_expiretime = p5.getValue().intValue();

                        addUseInfo(Integer.parseInt(mEditText_SmpId.getText().toString(),16), req_UserName, request_ath, request_expiretime);
                    } else if (reqeust_ope_kind == 0x01) {
                        Number p2 = ((Number) arry.getDataItems().get(1));
                        request_smpid = p2.getValue().intValue();
                        deleteUseInfo(request_smpid);
                    }
                }
                break;
            }

        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }


        mLogger.LogD(TAG,String.format("ActReg受信 操作種別 0x%x 現在時刻 %d ユーザ名 %s 権限 %d 有効期限 %d スマホID %d"
                ,reqeust_ope_kind ,request_nowtime, req_UserName,request_ath,request_expiretime,request_smpid
        ));

        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        int proc_result = getProcResult(sendQueue);
        byte []header = createResponseHeader(sendQueue);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(proc_result);
        if( proc_result == 0 ) {
            //TODO 同じでいいの？コマンド毎にそれぞれ別の部品使った方がいいかも
            arrayBuilder.add(Byte.parseByte(getValueFromItemText(mSpinner_lck_timeSync.getSelectedItem().toString()),16));
        }
        arrayBuilder.end();

        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);


    }

    private byte[] createActDscResponse(SendQueue sendQueue) throws CborException {
        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        byte []header = createResponseHeader(sendQueue);
        mBtGattServer.cancelConnection(sendQueue.device);
        return header;
    }

    private byte[] createGetVerResponse(SendQueue sendQueue) throws CborException {
        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        mLogger.LogD(TAG,String.format("GetVer受信"));


        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        int proc_result = getProcResult(sendQueue);
        byte []header = createResponseHeader(sendQueue);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(proc_result);

        if( proc_result == 0 ) {
            //更新結果
            arrayBuilder.add(0x6262)
                    .add(Integer.parseInt(mEditText_VerControllerVer.getText().toString(), 16))
                    .add(0x4321)
                    .add("製品品番");
        }

        arrayBuilder.end();
        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);
    }

    private byte[] createSetPrmResponse(SendQueue sendQueue) throws CborException {

        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        int prm1 = 0;
        int prm2 = 0;
        int prm3 = 0;
        int prm4 = 0;
        int prm5 = 0;
        int prm6 = 0;
        int prm7 = 0;
        int prm8 = 0;
        int prm9 = 0;

        try{
            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data,CoapRequestHeader.size,sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for(DataItem dataItem : dataItems) {
                if( dataItem instanceof Array ){
                    Array arry = ((Array)dataItem);
                    Number p1 = ((Number)arry.getDataItems().get(0));
                    Number p2 = ((Number)arry.getDataItems().get(1));
                    Number p3 = ((Number)arry.getDataItems().get(2));
                    Number p4 = ((Number)arry.getDataItems().get(3));
                    Number p5 = ((Number)arry.getDataItems().get(4));
                    Number p6 = ((Number)arry.getDataItems().get(5));
                    Number p7 = ((Number)arry.getDataItems().get(6));
                    Number p8 = ((Number)arry.getDataItems().get(7));
                    Number p9 = ((Number)arry.getDataItems().get(8));
                    prm1 = p1.getValue().intValue();
                    prm2 = p2.getValue().intValue();
                    prm3 = p3.getValue().intValue();
                    prm4 = p4.getValue().intValue();
                    prm5 = p5.getValue().intValue();
                    prm6 = p6.getValue().intValue();
                    prm7 = p7.getValue().intValue();
                    prm8 = p8.getValue().intValue();
                    prm9 = p9.getValue().intValue();
                }
                break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }

        mLogger.LogD(TAG,String.format("SetPrm受信 施錠エリア閾値 0x%x 解錠エリア閾値 0x%x 滞在判定閾値 0x%x 移動平均長 0x%x 滞在判定ウィンドウ時間 0x%x タッチ前判定ウィンドウ時間 0x%x エリア縮小感度 0x%x  "
                +"ADV送信周期設定値 0x%x アプリバージョン 0x%x"
                ,prm1
                ,prm2
                ,prm3
                ,prm4
                ,prm5
                ,prm6
                ,prm7
                ,prm8
                ,prm9
        ));

        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        byte []header = createResponseHeader(sendQueue);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        new CborEncoder(baos).encode(new CborBuilder()
                .addArray()
                .add(getProcResult(sendQueue))
                .end()
                .build());
        byte[] result = baos.toByteArray();
        return combine(header,result);
    }

    private byte[] createActFrmResponse(SendQueue sendQueue) throws CborException {
        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        int reqtype = 0;
        int frmtype = 0;
        int frmver = 0;
        int frmSize = 0;
        int frmOffset = 0;
        byte[] frmData = null;
        try{

            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data,CoapRequestHeader.size,sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();

            for(DataItem dataItem : dataItems) {
                if( dataItem instanceof Array ){
                    Array arry = ((Array)dataItem);

                    Number p1 = ((Number)arry.getDataItems().get(0));
                    reqtype = p1.getValue().intValue();
                    sendQueue.kind = reqtype;

                    arry = ((Array)arry.getDataItems().get(1));
                    if( reqtype == 0  ) {
                        Number p2 = ((Number) arry.getDataItems().get(0));
                        Number p3 = ((Number) arry.getDataItems().get(1));
                        Number p4 = ((Number) arry.getDataItems().get(2));
                        frmtype = p2.getValue().intValue();
                        frmver = p3.getValue().intValue();
                        frmSize = p4.getValue().intValue();
                        mLogger.LogD(TAG,String.format("ActFrm受信 種別 0x%x ファームウェアタイプ 0x%x ファームウェアバージョン 0x%x ファームサイズ %d",reqtype, frmtype,frmver,frmSize));
                    }
                    else
                    if( reqtype == 1  ) {
                        Number p2 = ((Number) arry.getDataItems().get(0));
                        frmOffset = p2.getValue().intValue();
                        ByteString p3 = ((ByteString) arry.getDataItems().get(1));
                        frmData = p3.getBytes();
                        mLogger.LogD(TAG,String.format("ActFrm受信 種別0x%x オフセット %d \ndata %s ",reqtype, frmOffset, ByteArrayToString(frmData) ));
                    }
                    else {
                        mLogger.LogD(TAG,String.format("ActFrm受信 種別0x%x ",reqtype ));
                    }
                }
                else if( dataItem instanceof Number ){
                    Number p1 = ((Number)dataItem);
                    reqtype = p1.getValue().intValue();
                    sendQueue.kind   = reqtype;
                }
                break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }


        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        byte []header = createResponseHeader(sendQueue);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();

        int proc_result =getProcResult(sendQueue);

        if( proc_result != 0 ){
            new CborEncoder(baos).encode(new CborBuilder()
                    //payload
                    .add(getProcResult(sendQueue))
                    .build());
            byte[] result = baos.toByteArray();
            return combine(header,result);
        }


        ArrayBuilder arrayBuilder = builder.addArray()
                //payload
                .add(getProcResult(sendQueue))
                //動作種別
                .add(reqtype);


        if( reqtype == 0 ) {
            //更新結果
            arrayBuilder.add(Byte.parseByte(getValueFromItemText(mSpinner_frm_res_start.getSelectedItem().toString()), 16));
            //オフセット
            if( mSpinner_frm_res_start.getSelectedItemPosition() == 0 ){
                arrayBuilder.add(frmOffset);
            }
        }
        else if( reqtype == 2 ){

        }
        else {
            Spinner spn = null;
            if( reqtype == 1 ){
                spn = mSpinner_frm_res_execute;
            }
            else {
                spn = mSpinner_frm_res_finish;
            }
            //更新結果
            arrayBuilder.add(Byte.parseByte(getValueFromItemText(spn.getSelectedItem().toString()), 16));
        }

        arrayBuilder.end();
        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();
        return combine(header,result);


    }

    private Timer mTimer = null;

    private void startRSSITimer(){
        mLogger.LogD(TAG,String.format("RSSI送信タイマー開始"));
        synchronized (this) {
            stopRSSITimer();
            mTimer = new Timer(false);
            mTimer.schedule(new TimerTask() {
                @Override
                public void run() {
                    Handler handler = new Handler(Looper.getMainLooper());
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            sendRSSI();
                        }
                    });
                }
            }, 300,500);
        }
    }

    private void stopRSSITimer(){
        mLogger.LogD(TAG,String.format("RSSI送信タイマー停止"));
        synchronized (this) {
            //停止
            if (mTimer != null) {
                mTimer.cancel();
                mTimer = null;
            }
        }
    }


    private byte[] createSetFlgResponse(SendQueue sendQueue) throws CborException {


        //----------------------------------------------------
        //受信データパース
        //----------------------------------------------------
        int requestRssiStatus = 0;
        try{

            ByteArrayInputStream bais = new ByteArrayInputStream(sendQueue.data,CoapRequestHeader.size,sendQueue.data.length - CoapRequestHeader.size);
            List<DataItem> dataItems = new CborDecoder(bais).decode();
            for(DataItem dataItem : dataItems) {
                Number rssi = ((Number)dataItem);
                requestRssiStatus= rssi.getValue().intValue();
                break;
            }
        }catch (Exception e){
            e.printStackTrace();
            mLogger.LogE(TAG,String.format("パースエラー:%s" ,ByteArrayToString(sendQueue.data)));
        }

        synchronized (this) {
            if (requestRssiStatus == 0) {
                //停止
                stopRSSITimer();
            } else {
                //送信
                startRSSITimer();
            }
        }

        mLogger.LogD(TAG,String.format("SetFlg受信 RSSI通知状態 0x%x ",requestRssiStatus ));

        //----------------------------------------------------
        //応答データ作成
        //----------------------------------------------------
        byte []header = createResponseHeader(sendQueue);
        return header;
    }

    private byte[] createNtfTch() throws CborException {
        byte []header = createNtfHeader((byte)0x31);

        byte seqid = (byte)(getSequenceid() & 0xFF);
        //サイズの付与
        byte[] lengths = ByteBuffer.allocate(2).putShort((short)header.length).array();
        byte[] headre_ext = combine(new byte[]{seqid}, lengths);
        byte[] senddata = combine(headre_ext, header);

        return senddata;
    }

    private byte[] createNtfPmt() throws CborException {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        CborBuilder builder  = new CborBuilder();
        ArrayBuilder arrayBuilder = builder.addArray()
                //エリア判定結果
                .add(Byte.parseByte(getValueFromItemText(mSpinner_ntf_pmt.getSelectedItem().toString()),16))
                //判定RSSI値
                .add(Integer.parseInt(mEditText_NtfPmtRssi.getText().toString(), 10));
        arrayBuilder.end();

        new CborEncoder(baos).encode(builder.build());
        byte[] result = baos.toByteArray();


        byte []header = createNtfHeader((byte)0x32);
        byte seqid = (byte)(getSequenceid() & 0xFF);
        //サイズの付与
        byte[] lengths = ByteBuffer.allocate(2).putShort((short)(header.length+result.length)).array();
        byte[] headre_ext = combine(new byte[]{seqid}, lengths);
        byte[] senddata = combine(headre_ext, header);
        senddata = combine(senddata, result);
        return senddata;
    }

    private byte[] createNtfSty() throws CborException {
        byte []header = createNtfHeader((byte)0x33);
        header = combine(header,new byte[]{Byte.parseByte(getValueFromItemText(mSpinner_ntf_sty.getSelectedItem().toString()),16)});

        byte seqid = (byte)(getSequenceid() & 0xFF);
        //サイズの付与
        byte[] lengths = ByteBuffer.allocate(2).putShort((short)header.length).array();
        byte[] headre_ext = combine(new byte[]{seqid}, lengths);
        byte[] senddata = combine(headre_ext, header);

        return senddata;
    }



    private String getValueFromItemText(String text){
        if(text == null || text.indexOf(":") == -1 ){
            return "";
        }
        return text.split(":")[0];
    }
    //==================================================================================================================================================================================================================
    //==================================================================================================================================================================================================================
    // BLE CALLBACK
    //==================================================================================================================================================================================================================
    //==================================================================================================================================================================================================================

    BluetoothGattServerCallback mGattServerCallback= new BluetoothGattServerCallback(){
        @Override
        public void onConnectionStateChange(BluetoothDevice device, int status, int newState) {

            mLogger.LogD(TAG,String.format("■onConnectionStateChange name %s addr %s status %d newstatus %d",device.getName(), device.getAddress(),status,newState));
            if( newState == BluetoothProfile.STATE_CONNECTED ){
                super.onConnectionStateChange(device, status, newState);
//                mConnectedDevice = device;


                if( mTestCode == 71 ){
                    mBtGattServer.cancelConnection(device);
                }
            }
            else {
                super.onConnectionStateChange(device, status, newState);
                if( mConnectedDevice != null && mConnectedDevice.equals(device)) {

                    MainActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            mLogger.LogE(TAG,String.format("■リモコンと切断しました"));
                            mTextView_Session.setText("リモコンと未接続");
                        }
                    });

                    mConnectedDevice = null;

                }
            }
        }

        @Override
        public void onServiceAdded(int status, BluetoothGattService service) {
            super.onServiceAdded(status, service);
            mLogger.LogD(TAG,String.format("■onServiceAdded status %d",status));
        }

        @Override
        public void onCharacteristicReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattCharacteristic characteristic) {

            super.onCharacteristicReadRequest(device, requestId, offset, characteristic);

            mLogger.LogD(TAG,String.format("■onCharacteristicReadRequest addr %s requestid %d UUID %s",device.getAddress(),requestId,characteristic.getUuid().toString()));

            mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, characteristic.getValue());


//            if (characteristic.getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_SMAPHID))) {
//                mLogger.LogD(TAG, String.format("onCharacteristicReadRequest -> SMAPHID"));
//
//                if( mTestCode == 61 ){
//                    mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset,
//                            characteristic.getValue());
//                    return;
//                }
//                else if( mTestCode == 63 ){
//                    mBtGattServer.cancelConnection(device);
//                    return;
//                }
//                else if( mTestCode == 67 ) {
//                    try {
//                        Thread.sleep(5000);
//                    } catch (InterruptedException e) {
//                        e.printStackTrace();
//                    }
//                    return;
//                }
//
//
//                String input_data = mEditText_SmpId.getText().toString();
//                int selectindex = mSpinner_SmpId.getSelectedItemPosition();
//                if( selectindex != 0 ){
//                    input_data = getValueFromItemText(mSpinner_SmpId.getSelectedItem().toString());
//                }
//
//                byte[]smpid = hex2bin(input_data);
//                if( smpid != null && smpid.length == 2 ){
//                    characteristic.setValue(smpid);
//                    mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset,
//                            characteristic.getValue());
//                }
//                else {
//                    mLogger.LogE(TAG,"スマホIDの入力がおかしいです");
//                    mLogger.LogE(TAG,"スマホIDの入力がおかしいです");
//                    mLogger.LogE(TAG,"スマホIDの入力がおかしいです");
//                    mLogger.LogE(TAG,"スマホIDの入力がおかしいです");
//
//                    mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset,
//                            characteristic.getValue());
//                }
//
//            }
//            else if( characteristic.getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLREAD))) {
//                if( mConnectedDevice == null ||  !mConnectedDevice.equals(device)){
//                    mLogger.LogE(TAG,String.format("■LiSLA以外の機器と思われるので無視"));
//                    return;
//                }
//
//                mLogger.LogD(TAG, String.format("onCharacteristicReadRequest -> TSLREAD offset:" + String.valueOf(offset)));
//
//
//                if( mResponseDataBuffer.mResponsedata!= null ) {
//                    byte[] data = null;
//
//                    if( mCheckBox_readblob.isChecked() ){
//                        //遅延と戻り値設定を行う
//                        int sleepMsec = 0;
//                        try{
//                            sleepMsec = Integer.parseInt(mEditText_SleepMSec.getText().toString());
//                        }catch (Exception e ){
//
//                        }
//                        if( sleepMsec > 0 ){
//                            try {
//                                Thread.sleep(sleepMsec);
//                            } catch (InterruptedException e) {
//                                e.printStackTrace();
//                            }
//                        }
//                    }
//
//
//                    if (mTestCode == 32) {
//                        if( mResponseDataBuffer.readStartOffSet == 0 ) {
//                            mLogger.LogE(TAG, String.format("ReadErrorを返す 1回目"));
//                            mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset,new byte[]{0x00});
//                        }
//                        return;
//                    }
//                    else if (mTestCode == 33) {
//                        if( mResponseDataBuffer.readStartOffSet > 0 ) {
//                            mLogger.LogE(TAG, String.format("ReadErrorを返す 2回目以降"));
//                            mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset,new byte[]{0x00});
//                        }
//                        return;
//                    }
//                    if (mTestCode == 50) {
//                        if( mResponseDataBuffer.readStartOffSet == 0 ) {
//                            mLogger.LogE(TAG, String.format("Read 1回目 遅延"));
//                            try {
//                                Thread.sleep(5000);
//                            } catch (InterruptedException e) {
//                                e.printStackTrace();
//                            }
//                        }
//                    }
//                    else if (mTestCode == 51) {
//                        if( mResponseDataBuffer.readStartOffSet > 0 ) {
//                            mLogger.LogE(TAG, String.format("Read 2回目 遅延"));
//                            try {
//                                Thread.sleep(5000);
//                            } catch (InterruptedException e) {
//                                e.printStackTrace();
//                            }
//                        }
//                    }
//                    if (mTestCode == 72 ) {
//                        if( mResponseDataBuffer.readStartOffSet == 0 ) {
//                            mLogger.LogE(TAG, String.format("Read 1回目 切断"));
//                            mBtGattServer.cancelConnection(device);
//                            return;
//                        }
//                    }
//                    else if (mTestCode == 73) {
//                        if( mResponseDataBuffer.readStartOffSet > 0 ) {
//                            mLogger.LogE(TAG, String.format("Read 2回目 切断"));
//                            mBtGattServer.cancelConnection(device);
//                            return;
//                        }
//                    }
//
//
//                    //-------------------------------------------------
//                    //テスト用に不正な(ReadBlob中のSeqIDを変えてしまう
//                    //-------------------------------------------------
//                    if (mTestCode == 40) {
//                        mTestCode2++;
//                        if (mTestCode2 % 3 == 1) {
//                            byte[] senddata = new byte[]{(byte) (mResponseDataBuffer.SequenceID - 1), 0x00, 0x04, /* GetInf */ 0x40, (byte) 0xFF, 0x03, 0x00};
//                            mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, senddata);
//                            return;
//                        }
//                    }
//
//
//                    if (offset == 0) {
//                        int to = offset + mResponseDataBuffer.offset + mResponseDataBuffer.bufferSize - 1/*SEQNO分削減*/;
//                        if (to >= mResponseDataBuffer.mResponsedata.length) {
//                            to = mResponseDataBuffer.mResponsedata.length - 1;
//                        }
//                        data = Arrays.copyOfRange(mResponseDataBuffer.mResponsedata, offset + mResponseDataBuffer.offset, to + 1);
//
//                        //本来のReadBlobが発生するとoffsetが指定されてくる。（MTUより多きいレスポンスをReadResponseで送ると起きる）
//                        //これ以外はNotifyで送信した最後のReadを行う。
//                        mResponseDataBuffer.readStartOffSet = mResponseDataBuffer.offset;
//                        mResponseDataBuffer.offset += data.length;
//                    } else {
//                        //オフセット発生時の対応（今回のシステムでは起きないはず。）テストでこのケースにとおって
//                        //おかしくなることが多ければ、これが起きない対策をしたほうが良い→MTU以内でデータを送る
//                        int to = offset + mResponseDataBuffer.readStartOffSet + mResponseDataBuffer.bufferSize - 1/*SEQNO分削減*/;
//                        if (to >= mResponseDataBuffer.mResponsedata.length) {
//                            to = mResponseDataBuffer.mResponsedata.length - 1;
//                        }
//                        data = Arrays.copyOfRange(mResponseDataBuffer.mResponsedata, offset + mResponseDataBuffer.readStartOffSet, to + 1);
//                    }
//                    byte[] response = combine(new byte[]{mResponseDataBuffer.SequenceID}, data);
//                    mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, response);
//
//
//                    mLogger.LogD(TAG, String.format("send response(Read) seqid %d size %d \ndata %s", mResponseDataBuffer.SequenceID, data.length, ByteArrayToString(response)));
//
//                    if (mTestCode == 74) {
//                        int to = offset + mResponseDataBuffer.offset + mResponseDataBuffer.bufferSize - 1/*SEQNO分削減*/;
//                        if (to >= mResponseDataBuffer.mResponsedata.length) {
//                            mLogger.LogE(TAG, String.format("ReadBlob完了後 切断"));
//                            mBtGattServer.cancelConnection(device);
//                            return;
//                        }
//                     }
//
//                    //-------------------------------------------------
//                    //テスト用に不正な(ReadBlob中のSeqIDのNotifyを発行する
//                    //-------------------------------------------------
//                    if (mTestCode == 41) {
//                        mTestCode2++;
//                        if (mTestCode2 % 3 == 1) {
//                            synchronized (mBtCharacteristic_TSLRead) {
//                                //任意のコマンド発行
//                                byte[] senddata = new byte[]{(byte) mResponseDataBuffer.SequenceID, 0x00, 0x04, /* GetInf */ 0x40, (byte) 0xFF, 0x03, 0x00};
//                                mBtCharacteristic_TSLRead.setValue(senddata);
//                                mBtGattServer.notifyCharacteristicChanged(mConnectedDevice, mBtCharacteristic_TSLRead, false);
//                            }
//                        }
//                    }
//                }
//                else {
//                    mLogger.LogE(TAG, String.format("TSLREADのReadBlobは発生してないのにReadが来た"));
//                    mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset,new byte[]{0x00});
//                }
//            }
//            else {
//                return;
//            }
        }



        ByteBuffer mByteBufferForTLSWrite = ByteBuffer.allocate(1024*1000);
        BluetoothGattCharacteristic mCharacteristic;

        @Override
        public void onCharacteristicWriteRequest(BluetoothDevice device, int requestId, BluetoothGattCharacteristic characteristic, boolean preparedWrite, boolean responseNeeded, int offset, byte[] value) {

            super.onCharacteristicWriteRequest(device, requestId, characteristic, preparedWrite, responseNeeded, offset, value);

            mLogger.LogD(TAG, String.format("■onCharacteristicWriteRequest addr %s requestid %d UUID %s preparedWrite %b responseNeeded %b offset %d \ndata %s", device.getAddress(), requestId, characteristic.getUuid().toString(), preparedWrite, responseNeeded, offset, ByteArrayToString(value)));

            mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, value);


            if(!preparedWrite) {
                SendQueue sq = new SendQueue();
                sq.data = Arrays.copyOf(value,value.length);
                sq.device = device;
                sq.characteristic = characteristic;
                //念のためWriteのレスポンスを先に行いたいので100msecほど待つ
                mHandler.postDelayed(sq,100);
            }
            else {
                mByteBufferForTLSWrite.put(value);
                mCharacteristic = characteristic;
            }

//            int writeresult = BluetoothGatt.GATT_SUCCESS;
//            if (characteristic.getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLWRITE))) {
//                if( mConnectedDevice == null ||  !mConnectedDevice.equals(device)) {
//                    mLogger.LogE(TAG,String.format("■LiSLA以外の機器と思われるので無視"));
//                    return;
//                }
//
//                mLogger.LogD(TAG, String.format("onCharacteristicWriteRequest -> TSLWRITE"));
//
//                if( preparedWrite ){
//                    mByteBufferForTLSWrite.put(value);
//                    mLogger.LogD(TAG, String.format("onCharacteristicWriteRequest -> preparedWrite -> !responseNeed"));
//
//                    if( responseNeeded  ) {
//                        mLogger.LogD(TAG, String.format("onCharacteristicWriteRequest -> preparedWrite -> responseNeed"));
//
//                        CoapRequestHeader header = null;
//                        try {
//                            header = CoapRequestHeader.parseHeader(value);
//                        } catch (Exception e) {
//                            mLogger.LogE(TAG, "パースエラー");
//                            return;
//                        }
//
//                        SendQueue sq = new SendQueue();
//                        sq.data = Arrays.copyOf(value, value.length);
//                        sq.header = header;
//                        sq.device = device;
//                        sq.flg = 0;
//
//                        if( getWriteChecked(sq) ){
//
//                            if( mCheckBox_write_disconnect_error.isChecked() ){
//                                mBtGattServer.cancelConnection(device);
//                                return;
//                            }
//
//                            //遅延と戻り値設定を行う
//                            int sleepMsec = 0;
//                            try{
//                                sleepMsec = Integer.parseInt(mEditText_Write_SleepMSec.getText().toString());
//                            }catch (Exception e ){
//
//                            }
//                            if( sleepMsec > 0 ){
//                                try {
//                                    Thread.sleep(sleepMsec);
//                                } catch (InterruptedException e) {
//                                    e.printStackTrace();
//                                }
//                            }
//                            writeresult = Byte.parseByte(getValueFromItemText(mSpinner_write_Result.getSelectedItem().toString()));
//                        }
//
//
//                        mBtGattServer.sendResponse(device, requestId, writeresult, offset, value);
//                    }
//
//                    return;
//                }
//                else {
//
//                    mLogger.LogD(TAG, String.format("onCharacteristicWriteRequest -> !preparedWrite "));
//
//                    CoapRequestHeader header = null;
//                    try {
//                        header = CoapRequestHeader.parseHeader(value);
//                    } catch (Exception e) {
//                        mLogger.LogE(TAG, "パースエラー");
//                        return;
//                    }
//
//
//                    SendQueue sq = new SendQueue();
//                    sq.data = Arrays.copyOf(value, value.length);
//                    sq.header = header;
//                    sq.device = device;
//                    sq.flg = 0;
//
//
//                    if( getWriteChecked(sq) ){
//
//                        if( mCheckBox_write_disconnect_error.isChecked() ){
//                            mBtGattServer.cancelConnection(device);
//                            return;
//                        }
//
//                        //遅延と戻り値設定を行う
//                        int sleepMsec = 0;
//                        try{
//                            sleepMsec = Integer.parseInt(mEditText_Write_SleepMSec.getText().toString());
//                        }catch (Exception e ){
//
//                        }
//                        if( sleepMsec > 0 ){
//                            try {
//                                Thread.sleep(sleepMsec);
//                            } catch (InterruptedException e) {
//                                e.printStackTrace();
//                            }
//                        }
//                        writeresult = Byte.parseByte(getValueFromItemText(mSpinner_write_Result.getSelectedItem().toString()));
//                    }
//
//                    if( writeresult == BluetoothGatt.GATT_SUCCESS ){
//                        //念のためWriteのレスポンスを先に行いたいので100msecほど待つ
//                        mHandler.postDelayed(sq, 100);
//                    }
//                }
//
//
//            } else if (characteristic.getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_SMAPHID))) {
//                mLogger.LogD(TAG, String.format("onCharacteristicWriteRequest -> SMAPHID"));
//                if( mConnectedDevice != null ){
//                    mLogger.LogE(TAG,String.format("■接続対象が上書きされました。意図しない場合は接続を確認してください。"));
//                }
//
//
//                if( mTestCode == 60 ){
//                    mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_REQUEST_NOT_SUPPORTED, offset, value);
//                    return;
//                }
//                else if( mTestCode == 62 ){
//                    mBtGattServer.cancelConnection(device);
//                    return;
//                }
//                else if( mTestCode == 66 ) {
//                    try {
//                        Thread.sleep(5000);
//                    } catch (InterruptedException e) {
//                        e.printStackTrace();
//                    }
//                    return;
//                }
//
//
//
//                if( mSpinner_SmpId.getSelectedItemPosition() > 0 ){
//                    mBtGattServer.sendResponse(device, requestId, 0x80, offset, value);
//                    return;
//                }
//
//
//                mConnectedDevice = device;
//
//                MainActivity.this.runOnUiThread(new Runnable() {
//                    @Override
//                    public void run() {
//                        mTextView_Session.setText(String.format("リモコンと接続中:addr %s",mConnectedDevice.getAddress()));
//                        mLogger.LogE(TAG,String.format("リモコン接続:addr %s",mConnectedDevice.getAddress()));
//                    }
//                });
//
//            }
//            else {
//                return;
//            }
//
//            if( responseNeeded ) {
//                mBtGattServer.sendResponse(device, requestId, writeresult, offset, value);
//            }


        }


        @Override
        public void onDescriptorReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattDescriptor descriptor) {
            super.onDescriptorReadRequest(device, requestId, offset, descriptor);
            mLogger.LogD(TAG,String.format("■onDescriptorReadRequest addr %s requestid %d UUID %s",device.getAddress(),requestId,descriptor.getUuid().toString()));

            if (offset != 0) {
                mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_INVALID_OFFSET, offset,
            /* value (optional) */ null);
                return;
            }
            mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset,
                    descriptor.getValue());
        }

        @Override
        public void onDescriptorWriteRequest(BluetoothDevice device, int requestId, BluetoothGattDescriptor descriptor, boolean preparedWrite, boolean responseNeeded, int offset, byte[] value) {
            super.onDescriptorWriteRequest(device, requestId, descriptor, preparedWrite, responseNeeded, offset, value);
            mLogger.LogD(TAG,String.format("■onDescriptorWriteRequest addr %s requestid %d UUID %s",device.getAddress(),requestId,descriptor.getUuid().toString()));



            if( mTestCode == 64 && descriptor.getCharacteristic().getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLREAD))){
                mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_WRITE_NOT_PERMITTED, offset, value);
                return;
            }
            else if( mTestCode == 65 && descriptor.getCharacteristic().getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_RSSI))){
                mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_WRITE_NOT_PERMITTED, offset, value);
                return;
            }

            if( mTestCode == 75 && descriptor.getCharacteristic().getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLREAD))){
                mBtGattServer.cancelConnection(device);
                return;
            }
            else if( mTestCode == 76 && descriptor.getCharacteristic().getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_RSSI))){
                mBtGattServer.cancelConnection(device);
                return;
            }

            if( mTestCode == 68 && descriptor.getCharacteristic().getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLREAD))){
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return;
            }
            else if( mTestCode == 69 && descriptor.getCharacteristic().getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_RSSI))){
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return;
            }


            mBtGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, value);

            int status = BluetoothGatt.GATT_SUCCESS;
            if ((descriptor.getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_TSLREAD)))
                    || (descriptor.getUuid().equals(UUID.fromString(Define.UUID_CHARACTERISTIC_RSSI)))
                    )  {




                BluetoothGattCharacteristic characteristic = descriptor.getCharacteristic();
                boolean supportsNotifications = (characteristic.getProperties() &
                        BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0;
                boolean supportsIndications = (characteristic.getProperties() &
                        BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0;

                if (!(supportsNotifications || supportsIndications)) {
                    status = BluetoothGatt.GATT_REQUEST_NOT_SUPPORTED;
                } else if (value.length != 2) {
                    status = BluetoothGatt.GATT_INVALID_ATTRIBUTE_LENGTH;
                } else if (Arrays.equals(value, BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE)) {
                    status = BluetoothGatt.GATT_SUCCESS;
                    descriptor.setValue(value);
                } else if (supportsNotifications &&
                        Arrays.equals(value, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE)) {
                    status = BluetoothGatt.GATT_SUCCESS;
                    descriptor.setValue(value);
                } else if (supportsIndications &&
                        Arrays.equals(value, BluetoothGattDescriptor.ENABLE_INDICATION_VALUE)) {
                    status = BluetoothGatt.GATT_SUCCESS;
                    descriptor.setValue(value);
                } else {
                    status = BluetoothGatt.GATT_REQUEST_NOT_SUPPORTED;
                }
            } else {
                status = BluetoothGatt.GATT_SUCCESS;
                descriptor.setValue(value);
            }

            if (responseNeeded) {


                mBtGattServer.sendResponse(device, requestId,  BluetoothGatt.GATT_SUCCESS,
            /* No need to respond with offset */ 0,
            /* No need to respond with a value */ null);
            }
        }

        @Override
        public void onExecuteWrite(BluetoothDevice device, int requestId, boolean execute) {
            super.onExecuteWrite(device, requestId, execute);
            mLogger.LogD(TAG,String.format("■onExecuteWrite addr %s requestid %d execute %b",device.getAddress(),requestId,execute));
            mBtGattServer.sendResponse(device, requestId,
                    BluetoothGatt.GATT_SUCCESS, 0, null);

            if(execute){

                byte[]value = mByteBufferForTLSWrite.array();


//                CoapRequestHeader header = null;
//                try {
//                    header = CoapRequestHeader.parseHeader(value);
//                }catch (Exception e ){
//                    mLogger.LogE(TAG,"パースエラー");
//                    return;
//                }


                SendQueue sq = new SendQueue();
                sq.data = Arrays.copyOf(value,value.length);
//                sq.header = header;
                sq.device = device;
//                sq.flg = 0;
                sq.characteristic = mCharacteristic;

                //念のためWriteのレスポンスを先に行いたいので100msecほど待つ
                mHandler.postDelayed(sq,100);



                mByteBufferForTLSWrite.clear();


            }


        }

        @Override
        public void onNotificationSent(BluetoothDevice device, int status) {
            super.onNotificationSent(device, status);
            mLogger.LogD(TAG,String.format("■onNotificationSent addr %s status %d ",device.getAddress(),status));
        }

        @Override
        public void onMtuChanged(BluetoothDevice device, int mtu) {
            super.onMtuChanged(device, mtu);
            mLogger.LogD(TAG,String.format("■onMtuChanged addr %s mtu %d ",device.getAddress(),mtu));
            if( mTestCode != 0) {
                //ReadBlobテスト
                setText(mEditText_LockBurreSize,String.valueOf(58));
            }
            else {
                setText(mEditText_LockBurreSize,String.valueOf(mtu));
            }
        }
    };

    //-------------------------------
    // AlertDialog
    //-------------------------------
    AlertDialog mAlertDialog = null;
    protected  void createDialog(final String message) {
        closeDialog();

        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("メッセージ");
        builder.setMessage(message);
        builder.setNegativeButton("Close", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                mAlertDialog  = null;
            }
        });
        builder.setCancelable(false);
        mAlertDialog = builder.create();
        mAlertDialog.show();
    }
    protected void closeDialog(){
        if( mAlertDialog != null ){
            mAlertDialog.dismiss();
            mAlertDialog = null;
        }
    }
    protected void createDialogWithDismissListner(final String message, DialogInterface.OnDismissListener onDismissListner) {
        closeDialog();

        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("メッセージ");
        builder.setMessage(message);
        builder.setNegativeButton("Close", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                mAlertDialog  = null;
            }
        });
        builder.setCancelable(false);
        builder.setOnDismissListener(onDismissListner);
        mAlertDialog = builder.create();
        mAlertDialog.show();
    }




}
