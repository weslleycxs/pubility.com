var Hotreload = {

    bind: function(socket){

        // Apenas para conexão local
        if(socket.io.uri !== location.protocol + '//' + location.hostname + '/') return;

        console.log('bind!');

        socket.on('reload js', function(file){

            console.log(file);

            Alerts.notify('Recarregando JS: ' + file);

            var links = document.getElementsByTagName("script");

            for(var i = 0; i < links.length;i++){

                var link = links[i];
                var src = link.src.replace(location.origin, '').split('?version=')[0];

                if(src === file){

                    link.src = src + "?version=" + new Date().getTime();

                }

            }

        });

        socket.on('hotreload css', function(file){

            console.log(file);

            var links = document.getElementsByTagName("link");

            for(var i = 0; i < links.length;i++){

                var link = links[i];
                var href = link.href.replace(location.origin, '').split('?version=')[0];

                if(link.rel === "stylesheet"){

                    if(href === file){

                        link.href = href + "?version=" + new Date().getTime();

                    }

                }

            }

        });

    }

}

Kugel.module.addToComponent('websocket local', Hotreload.bind);


