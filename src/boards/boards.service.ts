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

  getBoardById(id: number) {
    return this.boardRepository.getBoardById(id);
  }

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }
}
