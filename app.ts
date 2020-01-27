import Server from './src/Server';
import {UserController} from './src/controllers/UserController';
import {HobbyController} from './src/controllers/HobbyController';

process.on('unhandledRejection', reason => {
    throw reason;
});

const main = async () => {
    const app = await Server.createServer([
        new UserController(),
        new HobbyController(),
    ]);
    app.listen();
};

main();