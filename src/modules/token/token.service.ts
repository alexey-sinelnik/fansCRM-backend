import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { payloadTokenDto } from './dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateJwtToken(user: payloadTokenDto): Promise<string> {
    const payload: { user: payloadTokenDto } = { user };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('secret'),
      expiresIn: this.configService.get<string>('expireJwt'),
    });
  }
}
