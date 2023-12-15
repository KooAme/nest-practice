import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { CustomRepository } from 'src/common/custom-repository.decorator';
import { CreateBoardDto } from '../dtos/create-board.dto';
import { BoardStatus } from '../boards-status.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    try {
      const { title, description } = createBoardDto;

      const board = this.create({
        title,
        description,
        status: BoardStatus.PUBLIC,
        user,
      });

      await this.save(board);
      return board;
    } catch (error) {
      throw new BadRequestException('글을 생성할 수 없습니다.');
    }
  }

  async deleteBoard(id: number, user: User): Promise<any> {
    try {
      const board = await this.getBoardById(id);

      if (board.user.email === user.email) {
        return await this.delete(id);
      } else {
        console.log('나의 게시글이 아닙니다.');
      }
    } catch (error) {
      throw new BadRequestException('삭제가 되지 않았습니다.');
    }
  }

  async updateBoard(
    id: number,
    title: string,
    description: string,
  ): Promise<Board> {
    try {
      const board = await this.update({ id }, { title, description });
      if (!board) {
        throw new BadRequestException('게시글 수정에 실패하였습니다.');
      }
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async getBoardById(id: number): Promise<Board> {
    try {
      const found = await this.findOne({ relations: ['user'], where: { id } });
      console.log(found);

      return found;
    } catch (error) {
      throw new BadRequestException('글을 찾을 수 없습니다.');
    }
  }
}
