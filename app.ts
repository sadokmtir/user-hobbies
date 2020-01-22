import Server from './src/Server';
import {UserController} from './src/controllers/UserController';

process.on('unhandledRejection', reason => {
    throw reason;
});

const main = async () => {
    const app = await Server.createServer([
        new UserController(),
    ]);
    app.listen();
};

main();