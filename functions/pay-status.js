exports.handler = function(context, event, callback) {
    let payload = {
        PaymentCardNumber : event.PaymentCardNumber,
        ExpirationDate    : event.ExpirationDate,
        SecurityCode      : event.SecurityCode,
        Status            : 'in-progress',
    };

    let sync = Runtime.getSync({serviceName: context.PAY_SYNC_SERVICE_SID});
    sync.documents("PayStatus")
        .update({
            data: payload,
        }).then(response => {
            callback(null, 'OK');
        }).catch(error => {
            sync.documents.create({
                uniqueName: "PayStatus",
                data: payload
            }).then(response => {
                callback(null, 'OK');
            }).catch(error => {
                console.log(error);
                callback(error);
            });
        });
};