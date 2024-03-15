import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { comparePassword } from '../../helpers';
import { Users } from '../users/models/user.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserCreateResponse } from '../users/response/user-create.response';
import { AppErrors } from '../../common/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly logger: Logger,
  ) {}
  public register(createAuthDto: CreateUserDto): Promise<UserCreateResponse> {
    try {
      return this.usersService.create(createAuthDto);
    } catch (e) {
      this.logger.error(
        e.response.message,
        'Auth service, register method error',
      );
      return e;
    }
  }

  public async login(loginUserDto: LoginAuthDto): Promise<UserCreateResponse> {
    try {
      const user: Users = await this.usersService.findOneByEmail(
        loginUserDto.email,
      );
      if (!user) throw new BadRequestException(AppErrors.USER_NOT_EXIST);

      const compareUserPassword: boolean = await comparePassword(
        loginUserDto.password,
        user.password,
      );
      if (!compareUserPassword)
        throw new BadRequestException(AppErrors.PASSWORD_NOT_VALID);

      const token: string = await this.tokenService.generateJwtToken({
        id: user.id,
        email: user.email,
      });

      delete user.dataValues.password;

      return { ...user.dataValues, token } as UserCreateResponse;
    } catch (e) {
      this.logger.error(e.response.message, 'Auth service, login method error');
      return e;
    }
  }
}
