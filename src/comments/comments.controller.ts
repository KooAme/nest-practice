import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { ReadCommentDto } from './dtos/read-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('/write')
  @UseGuards()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.createComment(createCommentDto, user);
  }

  @Patch('/:id')
  updateComment(@Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.updateComment(updateCommentDto);
  }

  @Delete('/:id')
  deleteComment(@Param('id') id: number, @GetUser() user: User) {
    return this.commentsService.deleteComment(id, user);
  }

  @Get('/:id')
  getCommentByBoardId(@Param('id') id: number) {
    return this.commentsService.getCommentByBoardId(id);
  }
}
