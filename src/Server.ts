import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import httpLogger from 'morgan';
import Controller from './controllers/Controller.interface';
import nconf from './infrastructure/Nconf';
import logger from './infrastructure/logging/Logger';
import * as errorMiddleware from './infrastructure/middleware/ErrorMiddleware';

class Server {
    public app: express.Application;

    private constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.applyExceptionHandlers();
    }

    public static async createServer(controllers: Controller[]): Promise<Server> {
        await this.connectToTheDatabase();
        return new Server(controllers);
    }

    public listen() {
        const port = nconf.get('server:port');
        this.app.listen(port, () => {
            logger.info(`App listening on the port ${port}`);
        });
    }

    private static async connectToTheDatabase() {
        const mongoDsn = nconf.get('mongoose:url');
        const mongo = await mongoose.connect(mongoDsn, {useNewUrlParser: true});
        const {connection} = mongo;

        connection.once('open', () => {
            logger.info('Database started');
        });

        connection.on('error', () => {
            logger.error('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });
    }

    private initializeMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(httpLogger('dev'));
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }

    private applyExceptionHandlers() {
        errorMiddleware.handle404Error(this.app);
        errorMiddleware.handleClientError(this.app);
        errorMiddleware.handleServerError(this.app);
    }
}

export default Server;
