import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { multerDiskOptions } from 'src/configs/multer.config';
import { User } from 'src/user/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { Board } from './entities/board.entity';
import { BoardRepository } from './repositories/board.repository';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  constructor(
    private boardsService: BoardsService,
    private boardRepository: BoardRepository,
  ) {}

  @Get()
  getAllBoard(@GetUser() user: User): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number, @GetUser() user: User) {
    return this.boardsService.getBoardById(id, user);
  }

  @Put('/:id')
  updateBoard(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('description') description: string,
    @GetUser() user: User,
  ) {
    return this.boardsService.updateBoard(id, title, description, user);
  }

  @Post('/upload/:id')
  @UseInterceptors(FileInterceptor('file', multerDiskOptions))
  async fileUpload(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    console.log('1111112312312312312312', file, id);
    await this.boardRepository.update({ id }, { filename: file.filename });
    return { message: 'Success' };
  }

  @Get('/images/:id')
  async getFileUpload(@Param('id') id: number, @Res() res: Response) {
    const board: any = await this.boardRepository.findOne({ where: { id } });
    res.sendFile(
      `/Users/koo/데스크탑 - koo’s MacBook Pro/nest/nest-homework/uploads/${board.filename}`,
    );
  }
}
