exports.handler = function(context, event, callback) {
    console.log(event);

	let twiml = new Twilio.twiml.VoiceResponse();
	
	switch (event.Result) {
    case "success":
        status_text = "Completed";
        text = "100円の決済が完了しました。ご利用ありがとうございました。";
        break;
    case "payment-connector-error":
        status_text = "Error";
        text = "エラーが発生しました。決済に失敗しました。";
        console.log(decodeURIComponent(event.PaymentError));
        break;
    
    default: 
        status_text = "Error";
        text = "決済に失敗しました。";
    }

	twiml.say({ language: 'ja-JP', voice: 'Polly.Mizuki' },text);

    console.log(event);
    let callsid = event.CallSid;
    let payload = {
        'PaymentCardNumber' : event.PaymentCardNumber,
        'ExpirationDate'    : event.ExpirationDate,
        'SecurityCode'      : event.SecurityCode,
        'Status'            : status_text,
        'PhoneNumber'       : event.From,
    };
    let sync = Runtime.getSync({serviceName: context.PAY_SYNC_SERVICE_SID});
    console.log(`Maps created.`);
    sync.maps.create({
        uniqueName: "PayStatus"
    })
    .then(response => {
        console.log(`Maps created.`);
    })
    .catch(error => {
        console.log(`Maps exist.`);
    })
    .then(() => {
        sync.maps('PayStatus').syncMapItems(callsid).fetch()
        .then(item => {
            console.log(item);
            item.PaymentCardNumber = event.PaymentCardNumber;
            item.ExpirationDate    = event.ExpirationDate;
            item.SecurityCode      = event.SecurityCode;
            item.Status            = status_text;
            item.PhoneNumber       = event.From;
            return sync.maps('PayStatus').syncMapItems(callsid).update({
                data: item
            });    
        })
        .then(response => {
            console.log(response);
            callback(null, twiml);
        })
        .catch(error => {
            return sync.maps('PayStatus').syncMapItems.create({
               key: callsid,
               data: payload
            });
        })
        .then(response => {
            console.log(response);
            callback(null, twiml);
        })
        .catch(error => {
            console.log(error);
            callback(error);
        });
    })
    .catch(error => {
        console.log(error);
        callback(error);
    });
};