import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './repositories/board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dtos/create-board.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  deleteBoard(id: number, user: User): Promise<void> {
    return this.boardRepository.deleteBoard(id, user);
  }

  updateBoard(id: number, title: string, description: string): Promise<Board> {
    return this.boardRepository.updateBoard(id, title, description);
  }

  getBoardById(id: number, user: User) {
    return this.boardRepository.getBoardById(id);
  }

  async getAllBoards(): Promise<any[]> {
    let test: any[] = await this.boardRepository.find({
      relations: ['user'],
    });
    let noPassword = test.map((board) => {
      return {
        id: board.id,
        title: board.title,
        description: board.description,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        status: board.status,
        user: board.user.id,
      };
    });

    console.log('nono', noPassword);
    console.log('test', test);

    return noPassword;
  }
}
