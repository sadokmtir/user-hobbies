import mongoose from 'mongoose';
import {UserRepository} from '../../../src/infrastructure/repository/mongo/UserRepository';
import {MongoBaseRepository} from '../../../src/infrastructure/repository/mongo/MongoRepository';
import User from '../../../src/domain/user/User';
import { UserNotFoundException, UserIdNotValidException} from '../../../src/infrastructure/middleware/exceptions/UserExceptions';

jest.mock('../../../src/infrastructure/repository/mongo/MongoRepository');
const mongoRepoMock = MongoBaseRepository as jest.Mock;

describe('test the UserRepository', () => {
    const expectedUserId = mongoose.Types.ObjectId();
    let userId = expectedUserId.toHexString();
    const expectedUserName = 'testName';
    let mockBaseFindById: jest.Mock;

    describe('User exist happy cases', () => {
        beforeEach(() => {
            mockBaseFindById = jest.fn(() => ({
                populate: () => ({
                    _id: expectedUserId,
                    hobby: [],
                    name: expectedUserName,
                })
            }));
            mongoRepoMock.mockImplementation(() => {
                return {
                    findById: mockBaseFindById,
                };
            });

        });

        it('should resolve findById when the user is found', async () => {
            const userRepository = new UserRepository();
            expect(await userRepository.findById(userId)).toEqual(User.hydrate(expectedUserId, expectedUserName));
        });

    });


    describe('User does not exist', () => {
        beforeEach(() => {
            mockBaseFindById = jest.fn(() => ({
                populate: () => null
            }));
        });

        it('should reject with user not found exception', async () => {
            const userRepository = new UserRepository();
            await expect(userRepository.findById(userId)).rejects.toThrow(UserNotFoundException);
        });
    });


    describe('Mongoose Id is not valid', () => {
        beforeEach(() => {
            mockBaseFindById = jest.fn(() => ({
                populate: () => null
            }));
        });
        it('should reject with user not found exception', async () => {
            userId = '1234';
            const userRepository = new UserRepository();
            await expect(userRepository.findById(userId)).rejects.toThrow(UserIdNotValidException);

        });
    });

});