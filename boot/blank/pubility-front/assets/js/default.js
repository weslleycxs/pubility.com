let Default = {}

$(() => {

    let local  = new socketIoRealtime.load('/', (socket) => {

        Kugel.module.eachComponent('websocket local', f => f(socket));

        socket.on('checksum', function(checksum, file){

            var oldChecksum = localStorage.getItem('checksum');

            // Caso exista um checksum marcado
            if(oldChecksum !== null){

                if(checksum !== oldChecksum){

                    localStorage.updatepending = true;

                    localStorage.setItem('checksum', checksum);

                }

            } else{

                localStorage.setItem('checksum', checksum);

            }

            Kugel.module.eachComponent('check update').then(f => f(checksum));

        });

    });

    let remote = new socketIoRealtime.load(Api.origin, (socket) => {

        // @todo A ser usado com o objetivo de notificar algum processo
        socket.on('set status', function(key, msg){

            console.log('@status' + key + ': ' + msg);

        });

    });

    Kugel.module.addToComponent('websockets', local);
    Kugel.module.addToComponent('websockets', remote);

    shortcut.add('CTRL+SHIFT+R', () => {

        caches.delete('kugel-offline-cache').then(() => {

            Alerts.notify('Cache limpo');
            location.reload();

        });
        
    });

});