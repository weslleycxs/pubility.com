module.exports = (router) => {

    // Rotas para o root
    router.get('/status', (req, res) => {

        res.std(global.helpers.f.getFolderSizes().then(folderSizes => {

            return {
                timestamp: new Date().getTime(),
                name: process.env.APP_NAME,
                folderSizes: folderSizes
            }

        }));

    });

    // Retorna o router
    return router

}