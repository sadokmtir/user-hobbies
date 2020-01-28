import {IsIn, IsInt, IsNumber, IsString, Max, Min} from 'class-validator';
import {PassionLevel} from './Hobby.interface';

export default class HobbyDto {
    @IsIn(Object.values(PassionLevel))
    public passionLevel: string;
    @IsString()
    public name: string;
    @IsInt()
    @Min(1900)
    @Max(2020) //could also use custom validation and infer the year automatically
    public year: number;
}