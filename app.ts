import Server from './src/Server';
import {UserController} from './src/controllers/UserController';

const main = async () => {
    const app = await Server.createServer([
        new UserController(),
    ]);
    app.listen();
};

main();