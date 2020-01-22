import HttpException from './HttpException';

export const UserNotFoundException = new HttpException(404, 'User does not exist.');
