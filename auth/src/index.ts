import app from "./app"
import logger from "./logger"

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    logger.info(`server is runnning on http://127.0.0.1:${PORT}`)
    console.log(`server is runnning on http://127.0.0.1:${PORT}`)
})


process.on('SIGTERM', () => {

    server.close((err) => {
        if (err) {
            logger.error("error during shutdown", err)
            console.log("error during shutdown", err)
            process.exit(1)
        }

        console.log("server shutdown successfully")
        process.exit(0)
    })


    setTimeout(() => {
        // force shutdown & cleanup area for cleanining resources
        logger.warn("forcefully shutting down server after 10 seconds")
        process.exit(0)
    }, 10000)
})

process.on('uncaughtException', (reason) => {

    logger.error(`uncaughtError ${reason}`)
    console.log(`uncaughtError ${reason}`)
    process.exit(1)
    
});

process.on('unhandledRejection', (reason, promise) => {

    logger.error(`uncaughtError ${reason}`)
    console.log(`uncaughtError ${reason}`)
    process.exit(1)

});