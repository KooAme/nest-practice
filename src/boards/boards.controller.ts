import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { Board } from './entities/board.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

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
    console.log('컨트롤러 아이디', id);
    console.log('컨트롤러', user);

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

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile() {
    return 'success';
  }
}
