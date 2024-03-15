import { BadRequestException, Injectable } from '@nestjs/common';
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
  ) {}

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<UserCreateResponse> {
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
    return { ...user, token } as UserCreateResponse;
  }

  public findAll(): Promise<Users[]> {
    return this.usersModel.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
  }

  public findOne(id: number): Promise<Users> {
    return this.usersModel.findOne({ where: { id } });
  }

  public findOneByEmail(email: string): Promise<Users> {
    return this.usersModel.findOne({ where: { email } });
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    await this.usersModel.update(updateUserDto, { where: { id } });
    return this.findOne(id);
  }

  public remove(id: number): Promise<number> {
    return this.usersModel.destroy({ where: { id } });
  }
}
