import * as express from 'express';
import Controller from './Controller.interface';
import {UserRepository} from '../infrastructure/repository/mongo/UserRepository';
import {BaseRepository, BaseUserRepository} from '../infrastructure/repository/BaseRepository.interface';
import validationMiddleware from '../infrastructure/middleware/ValidationMiddleware';
import HobbyDto from '../domain/hobby/hobby.dto';
import {Hobby as HobbyInterface} from '../domain/hobby/Hobby.interface';
import {HobbyRepository} from "../infrastructure/repository/mongo/HobbyRepository";
import Hobby from "../domain/hobby/Hobby";
import {User as UserInterface} from "../domain/user/User.interface";

export class HobbyController implements Controller {
    path: string;
    private hobbyRepository: BaseRepository<HobbyInterface>;
    private userRepository: BaseUserRepository;
    router: express.Router;

    constructor() {
        this.path = '/users/:userId/hobbies';
        this.router = express.Router();
        this.hobbyRepository = new HobbyRepository();
        this.userRepository = new UserRepository();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.route(this.path)
        // .get(this.getUsers)
            .post(validationMiddleware(HobbyDto), this.createHobbyToUser);

        // this.router.route('/:id')
        //     .get(this.getUser)
        //     .delete(this.deleteUser)
        //     .patch(validationMiddleware(UserDto), this.modifyUser);

    }

    private createHobbyToUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userId = request.params.userId;
        const hobbyDto: HobbyDto = request.body;
        try {
            const hobby = Hobby.create(hobbyDto.name, hobbyDto.passionLevel, hobbyDto.year);
            await this.hobbyRepository.create(hobby);
            const user = await this.userRepository.findById(userId);
            user.addHobby(hobby);
            this.userRepository.save(user);
            response.status(200).json(user);
        } catch (e) {
            next(e);
        }
    };

    private getUsers = (request: express.Request, response: express.Response) => {
        // return this.userRepository
        //     .get()
        //     .pipe(response.type('json'));
    };

    private deleteUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        // const userId = request.params.id;
        // try {
        //     await this.userRepository.delete(userId);
        //     return response.send(204);
        // } catch (e) {
        //     next(e);
        // }
    };

    private getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        // const userId = request.params.id;
        // try {
        //     const user = await this.userRepository.findById(userId);
        //     return response.json(user);
        // } catch (e) {
        //     return next(e);
        // }
    };

    private modifyUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        // const userId = request.params.id;
        // const userData: UserDto = request.body;
        // try {
        //     const user = await this.userRepository.findById(userId);
        //
        //     if (userData.name && userData.name !== user.name) {
        //         user.changeName(userData.name);
        //     }
        //     await this.userRepository.update(user);
        //     return response.json(user);
        // } catch (e) {
        //     next(e);
        // }

    }
}