import { IsString } from 'class-validator';

class UserDto {
    @IsString()
    public name: string;
}

export default UserDto;
