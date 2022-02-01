const chokidar = require('chokidar');
const path     = require('path');
const fs       = require('fs-extra');
const vm       = require('vm');

module.exports = {

    files: {
        assets: 'assets'
    },

    // @todo Configurar o módulo kugel para ignorar o modulo dev em produção
    dev: true,

    reloadCss(filePath){

        let fileName = filePath.replace(global.dir.assets, '');

        global.io.emit('hotreload css', fileName);

        global.helpers.f.checksum(fileName);

    },

    reloadJs(filePath){

        let fileName = filePath.replace(global.dir.assets, '');

        global.io.emit('hotreload js', fileName);

        global.helpers.f.checksum(fileName);

    },

    loadFile(filePath){

        const ext = path.extname(filePath);

        switch(ext){

            case '.css':

                module.exports.reloadCss(filePath);

            break;
            case '.js':

                module.exports.reloadJs(filePath);

            break;

        }

    },

    init(assetsDir){

        var watcher = chokidar.watch(assetsDir, {
            ignored: /^\./,
            persistent: true
        });

        watcher.on('change', (path) => {

            module.exports.loadFile(path);

        }).on('error', (error) => {

            console.error('Error happened', error);

        });

    }

}

global.app.onload(() => {

    module.exports.init(global.dir.assets);

});