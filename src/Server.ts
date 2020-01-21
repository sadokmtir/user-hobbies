import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import createError from 'http-errors';
import cors from 'cors';
import httpLogger from 'morgan';
import Controller from './controllers/Controller.interface';
import nconf from './infrastructure/Nconf';
import logger from './infrastructure/logging/Logger';
import errorMiddleware from './infrastructure/middleware/ErrorMiddleware';

class Server {
    public app: express.Application;

    private constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.catchNotFoundRoutes();
    }

    public static async createServer(controllers: Controller[]): Promise<Server> {
        await this.connectToTheDatabase();
        return new Server(controllers);
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            logger.info(`App listening on the port ${nconf.get('server:port')}`);
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
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }

    private catchNotFoundRoutes() {

        // catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            next(new createError.NotFound());
        });
    }
}

export default Server;
