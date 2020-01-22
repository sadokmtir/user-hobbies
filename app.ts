import Server from './src/Server';
import {UserController} from './src/controllers/UserController';

process.on('unhandledRejection', reason => {
    throw reason;
});

process.on('uncaughtException', (error) => {
    // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
    errorManagement.handler.handleError(error);
    if (!errorManagement.handler.isTrustedError(error))
        process.exit(1);
});


const main = async () => {
    const app = await Server.createServer([
        new UserController(),
    ]);
    app.listen();
};

main();