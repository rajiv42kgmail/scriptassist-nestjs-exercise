import { Type } from 'class-transformer';
import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { UpdateTaskDto } from './update-task.dto';

export enum BatchOperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
}

export class BatchOperationDto {
    @IsEnum(BatchOperationType)
    operation: BatchOperationType;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateTaskDto)
    data: UpdateTaskDto[];
}
