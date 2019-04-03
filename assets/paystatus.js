let syncMap, syncClient;

$(function() {

    var getParam = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    var updateStatus = function (item) {
        console.log('key', item.key);
        console.log('JSON data', item.value);
        $('#CallSid').html(item.key);
        $('#PaymentConfirmationCode').html(item.value.PaymentConfirmationCode);
        $('#PhoneNumber').html(item.value.PhoneNumber);
        $('#Status').html(item.value.Status);
        $('#PaymentCardNumber').val(item.value.PaymentCardNumber);
        $('#ExpirationDate').val(item.value.ExpirationDate);
        $('#SecurityCode').val(item.value.SecurityCode);
    };

    callsid = getParam('callsid');
    console.log(callsid);

    $.getJSON('../pay-status-sync-token', function (tokenResponse) {
        syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: 'info' });

        syncClient.map('PayStatus')
        .then(function(map) {
            syncMap = map;
            syncMap.on('itemUpdated', function(o) {
                console.log("Sync itemUpdated.");
                item = o.item;
                if(item.key === callsid) updateStatus(item);
            });
            syncMap.on('itemAdded', function(o) {
                console.log("Sync itemUpdated.");
                item = o.item;
                if(item.key === callsid) updateStatus(item);
            });
            syncMap.get(callsid).then(function(item) {
                updateStatus(item);
            })
            .catch(function(error) {
                console.log(error);
            });

        })
        .catch(function(error) {
            console.log(error);
        });

        syncClient.on('tokenAboutToExpire', () => {
            $.getJSON('../pay-status-sync-token', function (tokenResponse) {
                syncClient.updateToken(tokenResponse.token);
            });
        });
    });

    $('#btnClear').on('click', function() {
        syncMap.remove(callsid).then(function() {
            console.log('item deleted',callsid);
        });
    });

    $('#btnGuide').on('click', function() {
        $.ajax({
                url:'../pay-guide-start',
                type:'POST',
            })
            .done( (data) => {
                alert('Sending completed');
            }
        );
    });

});