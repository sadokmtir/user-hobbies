import * as express from 'express';
import Controller from './Controller.interface';
import {UserRepository} from '../infrastructure/repository/mongo/UserRepository';
import {BaseRepository} from '../infrastructure/repository/BaseRepository.interface';
import {User as UserInterface} from '../domain/user/User.interface';
import validationMiddleware from '../infrastructure/middleware/ValidationMiddleware';
import UserDto from '../domain/user/user.dto';
import User from '../domain/user/User';

export class UserController implements Controller {
    path: string;
    private userRepository: BaseRepository<UserInterface>;
    router: express.Router;

    constructor() {
        this.path = '/users';
        this.router = express.Router();
        this.userRepository = new UserRepository();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.route('')
            .get(this.getUsers)
            .post(validationMiddleware(UserDto), this.createUser);

        this.router.route('/:id')
            .get(this.getUser)
            .delete(this.deleteUser)
            .patch(validationMiddleware(UserDto), this.modifyUser);

    }

    private createUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const requestBody = request.body;
        const user = User.create(requestBody.name);
        try {
            await this.userRepository.create(user);
        } catch (e) {
            return next(e);
        }
        return response.status(201).json(user);
    };

    private getUsers = (request: express.Request, response: express.Response) => {
        return this.userRepository
            .get()
            .pipe(response.type('json'));
    };

    private deleteUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userId = request.params.id;
        try {
            await this.userRepository.delete(userId);
            return response.send(204);
        } catch (e) {
            next(e);
        }
    };

    private getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userId = request.params.id;
        try {
            const user = await this.userRepository.findById(userId);
            return response.json(user);
        } catch (e) {
            return next(e);
        }
    };

    private modifyUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userId = request.params.id;
        const userData: UserDto = request.body;
        try {
            const user = await this.userRepository.findById(userId);

            if (userData.name && userData.name !== user.name) {
                user.changeName(userData.name);
            }
            await this.userRepository.update(user);
            return response.json(user);
        } catch (e) {
            next(e);
        }

    }
}