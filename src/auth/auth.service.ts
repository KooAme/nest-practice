import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomRepository } from 'src/common/custom-repository.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthCredentialsDto } from './dtos/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto, res: Response) {
    try {
      const hash = await bcrypt.hash(authCredentialsDto.password, 10);
      const { email } = authCredentialsDto;

      await this.userRepository.createUser(email, hash);
      return { message: '회원가입 완료' };
    } catch (error) {
      throw new BadRequestException('회원가입 오류');
    }
  }

  signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    return this.userRepository.signIn(authCredentialsDto);
  }
}
