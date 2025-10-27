import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsString, IsUUID,IsNotEmpty } from 'class-validator';


export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsNotEmpty()
    id: string; // 👈 Add this
}