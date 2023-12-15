import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto, user: User) {
    const { content, userId, boardId } = createCommentDto;

    try {
      const comment = this.commentRepository.save({
        content,
        userId: user.id,
        boardId,
      });

      console.log('콘텐트', comment);
      return comment;
    } catch (error) {
      console.log(error);
    }
  }

  async updateComment(updateCommentDto: UpdateCommentDto) {
    const { content, commentId } = updateCommentDto;
    try {
      await this.commentRepository.update(
        { id: commentId },
        { content: content },
      );
      console.log('commentId ddddd', commentId);
      console.log('content::::', content);

      return '댓글 수정 완료';
    } catch (error) {
      console.log(error);
    }
  }

  async deleteComment(id: number, user: User) {
    // console.log(id);

    try {
      const comment = await this.commentRepository.findOne({ where: { id } });
      console.log(comment);
      if (comment.userId === user.id) {
        await this.commentRepository.delete(id);
      } else {
        throw new BadRequestException('자신의 댓글이 아닙니다.');
      }
      return '댓글이 삭제되었습니다.';
    } catch (error) {
      console.log(error);
    }
  }

  // async findAllComment(boardId: number) {
  //   try {
  //     const comments = await this.commentRepository
  //       .createQueryBuilder('comment')
  //       .leftJoinAndSelect('comment.user', 'user')
  //       .select(['comment', 'user.email'])
  //       .where('boardId = :boardId', { boardId })
  //       .getMany();

  //     return comments;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async findOneComment(id: number) {
  //   try {
  //     return await this, this.commentRepository.findOneByOrFail({ id });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
