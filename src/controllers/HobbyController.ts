import * as express from 'express';
import Controller from './Controller.interface';
import {UserRepository} from '../infrastructure/repository/mongo/UserRepository';
import {BaseRepository, BaseUserRepository} from '../infrastructure/repository/BaseRepository.interface';
import validationMiddleware from '../infrastructure/middleware/ValidationMiddleware';
import HobbyDto from '../domain/hobby/hobby.dto';
import {Hobby as HobbyInterface} from '../domain/hobby/Hobby.interface';
import {HobbyRepository} from '../infrastructure/repository/mongo/HobbyRepository';
import Hobby from '../domain/hobby/Hobby';

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
            .post(validationMiddleware(HobbyDto), this.createHobbyToUser);

        this.router.route(`${this.path}/:hobbyId`)
            .delete(this.deleteHobby);
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

    private deleteHobby = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const userId = request.params.userId;
            const hobbyId = request.params.hobbyId;
            const user = await this.userRepository.findById(userId);
            user.deleteHobby(hobbyId);
            await this.hobbyRepository.delete(hobbyId);
            await this.userRepository.save(user);
            response.json(user);
        } catch (e) {
            next(e);
        }
    };
}