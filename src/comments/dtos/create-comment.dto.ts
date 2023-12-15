import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  boardId: number;

  @IsString()
  userId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
