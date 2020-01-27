import {IsIn, IsNumber, IsString} from 'class-validator';
import {PassionLevel} from './Hobby.interface';

export default class HobbyDto {
    @IsIn(Object.values(PassionLevel))
    public passionLevel: string;
    @IsString()
    public name: string;
    @IsNumber()
    public year: number;
}