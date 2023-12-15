import { IsString } from 'class-validator';

export class ReadCommentDto {
  @IsString()
  commentId: number;

  @IsString()
  content: string;

  @IsString()
  useremail: string;
}
