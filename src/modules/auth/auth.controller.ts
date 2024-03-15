import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserCreateResponse } from '../users/response/user-create.response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiResponse({ status: 201, type: UserCreateResponse })
  register(@Body() createAuthDto: CreateUserDto): Promise<UserCreateResponse> {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: UserCreateResponse })
  login(@Body() loginUserDto: LoginAuthDto): Promise<UserCreateResponse> {
    return this.authService.login(loginUserDto);
  }
}
