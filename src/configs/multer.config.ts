import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { BoardsService } from 'src/boards/boards.service';
import { BoardRepository } from 'src/boards/repositories/board.repository';

const imageFileFilter = /\/(jpg|jpeg|png|gif|bmp|tiff|tif)$/;

export const multerDiskOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(imageFileFilter)) {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          {
            message: '파일 형식 에러',
            error: '지원하지 않는 파일 형식입니다.',
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath = 'uploads';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      callback(null, uploadPath);
    },
    filename: (request: any, file, callback) => {
      console.log('리퀘스트유저', request.user);
      const ext = extname(file.originalname);
      const base = basename(file.originalname, ext);
      callback(
        null,
        `${Date.now()}${request.user.id}${request.user.email}${ext}`,
      );
    },
  }),
  limits: {
    fieldNameSize: 200,
    filedSize: 10 * 1024 * 1024, // 10MB
  },
};
