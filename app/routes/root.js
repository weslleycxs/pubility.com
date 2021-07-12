module.exports = (router) => {

    router.get('/', () => `${process.env.APP_NAME} running in ${process.env.NODE_ENV}`);

    return router;

}