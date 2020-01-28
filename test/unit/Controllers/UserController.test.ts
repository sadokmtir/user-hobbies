import * as express from 'express';
import {UserController} from '../../../src/controllers/UserController';

describe('test the UserController', () => {

    let routeSpy: jest.SpyInstance;
    beforeEach(() => {
        // @ts-ignore
        routeSpy = jest.spyOn(express.Router, 'route');
    });
    afterEach(() => {
        routeSpy.mockClear();
    });

    it('should configure the routes paths /users and /users/:id', () => {
        const userController = new UserController();
        expect(routeSpy).toHaveBeenNthCalledWith(1, '/users');
        expect(routeSpy).toHaveBeenNthCalledWith(2, '/users/:id');
    });
});