import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './models/user.model';
import { JWTAuthGuard } from '../../guards/jwt-guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersApiResponse } from './response/users-api.response';
import { AppDescriptions } from '../../common/descriptions';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JWTAuthGuard)
  @Get('get-all')
  @ApiResponse({ status: 200, type: [UsersApiResponse] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  @ApiResponse({ status: 200, type: UsersApiResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: AppDescriptions.API_DELETE_DESCRIPTION,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<number> {
    return this.usersService.remove(+id);
  }
}
