exports.handler = function(context, event, callback) {
    console.log(event);

    let callsid = event.CallSid;
    let payload = {
        'PaymentCardNumber' : event.PaymentCardNumber,
        'ExpirationDate'    : event.ExpirationDate,
        'SecurityCode'      : event.SecurityCode,
        'Status'            : event.For,
        'PhoneNumber'       : callsid,
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

            if(item.PaymentCardNumber && item.ExpirationDate ==='' && item.SecurityCode === '' && item.conferenceSid && item.callSid ){
                const client = context.getTwilioClient();
                client.conferences(item.conferenceSid)
                .participants(item.callSid)
                .update({hold: false});
            }

            item.PaymentCardNumber = event.PaymentCardNumber;
            item.ExpirationDate    = event.ExpirationDate;
            item.SecurityCode      = event.SecurityCode;
            item.Status            = event.For;
            item.PhoneNumber       = callsid;
            return sync.maps('PayStatus').syncMapItems(callsid).update({
                data: item
            });    

        })
        .then(response => {
            console.log(response);
            callback(null, 'updated.');
        })
        .catch(error => {
            return sync.maps('PayStatus').syncMapItems.create({
               key: callsid,
               data: payload
            });
        })
        .then(response => {
            console.log(response);
            callback(null, 'added.');
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