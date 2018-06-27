package jp.co.mms.lisla.testperipheral;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.text.Html;
import android.util.Log;
import android.widget.TextView;

/**
 * TestPeripheral
 * <p>
 * <p>
 * <p>
 * Created by avcmms.
 */

public class Logger {

    Context mContext;
    TextView mTextView;

    public Logger(Context ctx,TextView tv ){
        mContext = ctx;
        mTextView = tv;
    }

    String mHtmlbuffer = "";
    class RunnableForTextView implements Runnable {
        public String tag = "";
        public String message = "";
        public String extent = "";
        @Override
        public void run() {
            synchronized (mTextView) {
                String oldlog = mTextView.getText().toString();
                if( oldlog == null || oldlog.length() == 0 ){
                    mHtmlbuffer = "";
                }
                RunnableForTextView r = new RunnableForTextView();

                message = Html.escapeHtml(message);
                message = message.replaceAll("&#10;","<BR>" );

                if(extent.equals("ERR")){
                    extent = "<font color=red>" + extent;
                    message = message+"</font>";
                }
                else if(message.indexOf("<BR>data") != 0) {
                    message = message.replaceAll("<BR>data","<BR><font color=blue>data" );
                    message = message+"</font>";
                }
                if( mHtmlbuffer.length() > 15000){
                    mHtmlbuffer = mHtmlbuffer.substring(0,10000);
                }
                mHtmlbuffer = extent + " : " + message + "<br>" + mHtmlbuffer;

                Handler handler = new Handler(Looper.getMainLooper());
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        mTextView.setText(Html.fromHtml(mHtmlbuffer));
                    }
                });
            }
        }
    }

    public void LogD(String tag, String message){
        Log.d(tag,message);

        RunnableForTextView r = new RunnableForTextView();
        r.message = message ;
        r.tag = tag;
        r.extent ="DBG";
        mTextView.post(r);
    }

    public void LogE(String tag, String message){
        Log.e(tag,message);

        RunnableForTextView r = new RunnableForTextView();
        r.message = message ;
        r.tag = tag;
        r.extent ="ERR";
        mTextView.post(r);
    }

}
