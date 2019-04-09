# twiliopay_stripe_wordshop
## 概要
2019/03/21(木・祝)開催 JP_Stripes Connect 2019のワークショップ『「電話でペイ！」(Twilio Pay)  を試してみよう！』の中級編のソースコードです。

Twilio Pay を使って電話決済を体験する(中級編)  
https://qiita.com/takeshifurusato/items/af96ecc7ce69dec8f42c

Twilio Pay を使って電話決済を体験する(中級編)続き  
https://qiita.com/takeshifurusato/items/2fd5fc09ebaeca666677

## 導入について
上記Qiita記事を参考にしながら、Twilio管理コンソールのRuntimeに登録してください。

## 設置・設定について
### Configuration
Twilio管理コンソールからRuntime → Functions → 設定を選択、以下の内容を設定してください。  
PAY_SYNC_SERVICE_SID=ISから始まるSyncサービスのSID  
PAY_TWILIO_API_KEY=SKから始まるAPIキー  
PAY_TWILIO_API_SECRET=APIキーとセットで設定されたSECRET  
※Enable ACCOUNT_SID and AUTH_TOKENにはチェックを入れておきます。

### Assets
Twilio管理コンソールからRuntime → Assetsを選択、assetsディレクトリのファイルを登録してください。  
※すべての登録後、Assetsに登録したpaystatus-list.htmlのPATHにアクセスすると、決済リストが表示されます。  

### Functions
Twilio管理コンソールからRuntime → Functionsを選択、以下の内容を設定してください。  
pay-status-sync-token.jp

|項目名|設定値|
|:--|:--|
|**FUNCTION NAME**|pay-status-sync-token|
|**PATH**|/pay-status-sync-token|
|**ACCESS CONTROL**| チェックなし |
|**EVENT**| (未選択) |

pay-status.jp

|項目名|設定値|
|:--|:--|
|**FUNCTION NAME**|pay-status|
|**PATH**|/pay-status|
|**ACCESS CONTROL**| チェックあり |
|**EVENT**| (未選択) |

pay-result.jp

|項目名|設定値|
|:--|:--|
|**FUNCTION NAME**|pay-result|
|**PATH**|/pay-result|
|**ACCESS CONTROL**| チェックあり |
|**EVENT**| (未選択) |

### TwiML Bins
Twilio管理コンソールからRuntime → TwiML Binsを選択、以下の内容を設定してください。  
pay_verb.xml

|項目名|設定値|
|:--|:--|
|**FRIENDLY NAME**|pay|

※[pay-result FunctionのURL][pay-status FunctionのURL]は、それぞれFunctionsのPATHに置き換えること。

### Phone Numbers
Twilio管理コンソールから電話番号(Phone Numbers)を選択し、電話番号を購入してください。  
購入した電話番号の設定で、通話着信時の処理として、TwiML→payを選択します。  
※TwiML Binsで登録したものを選択。  


