import HttpException from './HttpException';

export const HobbyDoesNotExistOnUserException = new HttpException(400, 'Hobby does already belong to the user.');
export const HobbyNotFoundException = new HttpException(404, 'Hobby does already belong to the user.');
export const HobbyIdNotValidException = new HttpException(400, 'Hobby id is not valid.');
