import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { hashPassword } from '../../helpers';
import { Users } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppErrors } from '../../common/errors';
import { TokenService } from '../token/token.service';
import { UserCreateResponse } from './response/user-create.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,
    private readonly tokenService: TokenService,
    private readonly logger: Logger,
  ) {}

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<UserCreateResponse> {
    try {
      const userExist: Users = await this.usersModel.findOne({
        where: { email: createUserDto.email },
      });
      if (userExist) throw new BadRequestException(AppErrors.USER_EXISTS);

      createUserDto.password = await hashPassword(createUserDto.password);
      const user: Users = await this.usersModel.create(createUserDto);

      const token: string = await this.tokenService.generateJwtToken({
        id: user.id,
        email: user.email,
      });

      delete user.dataValues.password;

      this.logger.log(user.dataValues, 'Create user successful');

      return { ...user.dataValues, token } as UserCreateResponse;
    } catch (e) {
      this.logger.error(
        e.response.message,
        'User service, create method error',
      );
      return e;
    }
  }

  public async findAll(): Promise<Users[]> {
    try {
      const users = await this.usersModel.findAll({
        attributes: {
          exclude: ['password'],
        },
      });
      console.log(users);
      return users;
    } catch (e) {
      this.logger.error(
        e.response.message,
        'User service findAll method error',
      );
      return e;
    }
  }

  public findOne(id: number): Promise<Users> {
    try {
      return this.usersModel.findOne({ where: { id } });
    } catch (e) {
      this.logger.error(
        e.response.message,
        'User service findOne method error',
      );
      return e;
    }
  }

  public findOneByEmail(email: string): Promise<Users> {
    try {
      return this.usersModel.findOne({ where: { email } });
    } catch (e) {
      this.logger.error(
        e.response.message,
        'User service findOneByEmail method error',
      );
      return e;
    }
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    try {
      await this.usersModel.update(updateUserDto, { where: { id } });

      const user: Users = await this.findOne(id);
      delete user.dataValues.password;

      return user;
    } catch (e) {
      this.logger.error(e.response.message, 'User service update method error');
      return e;
    }
  }

  public remove(id: number): Promise<number> {
    try {
      return this.usersModel.destroy({ where: { id } });
    } catch (e) {
      this.logger.error(e.response.message, 'User service remove method error');
      return e;
    }
  }
}
