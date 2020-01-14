import Controller from './Controller.interface';
import * as express from 'express';
import {UserRepository} from '../infrastructure/repository/mongo/UserRepository';
import {BaseRepository} from '../infrastructure/repository/BaseRepository.interface';
import {User as UserInterface} from '../domain/user/User.interface';
import validationMiddleware from '../infrastructure/middleware/ValidationMiddleware';
import CreateUserDto from '../domain/user/user.dto';
import User from '../domain/user/User';

export class UserController implements Controller {
    path: string;
    private userRepository: BaseRepository<UserInterface>;
    router: express.Router;

    constructor() {
        this.path = '/posts';
        this.router = express.Router();
        this.userRepository = new UserRepository();
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.route(this.path)
            .get(this.getUsers)
            .post(validationMiddleware(CreateUserDto), this.createUser);
    }

    private createUser = async (request: express.Request, response: express.Response) => {
        const requestBody = request.body;
        const user = User.create(requestBody.name);
        await this.userRepository.create(user);
    };

    private getUsers = (request: express.Request, response: express.Response) => {
    }
}