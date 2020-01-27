import HttpException from './HttpException';

export const HobbyExistsOnUser = new HttpException(404, 'Hobby does already belong to the user.');
