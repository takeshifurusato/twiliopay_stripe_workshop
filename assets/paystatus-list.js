let syncMap, syncClient;

$(function() {

    var updateList = function () {
        console.log("updateList.");
        syncMap.getItems()
        .then(function(page) {
            $('#callList').html('');
            $.each(page.items, function(i, item){
                style = '';
                if(item.value.Status === 'Error')     style='list-group-item-danger';
                if(item.value.Status === 'Completed') style='list-group-item-success';
                if(item.value.Status === 'Busy')      style='list-group-item-info';
                status = '<a target="_blank" class="list-group-item '+style+'" href="./paystatus.html?callsid='+item.key+'">'+item.key+'</a>';
                $('#callList').append(status);                
                console.log('show first item', i, item.key, item.value);                
            });
        });
    };

    $.getJSON('../pay-status-sync-token', function (tokenResponse) {
        syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: 'info' });

        syncClient.map('PayStatus')
        .then(function(map) {
            syncMap = map;

            syncMap.on('itemUpdated', function(o) {
                console.log("Sync itemUpdated.");
                updateList();
            });

            syncMap.on('itemAdded', function(o) {
                console.log("Sync itemAdded.");
                updateList();
            });
            
            updateList();
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


    $('#btnSyncClear').on('click', function() {
        syncMap.removeMap().then(function () {
            console.log('map deleted');
            $('#callList').html('');
        });
    });

});