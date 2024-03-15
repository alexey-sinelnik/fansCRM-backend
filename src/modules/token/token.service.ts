import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { payloadTokenDto } from './dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  public async generateJwtToken(user: payloadTokenDto): Promise<string> {
    try {
      const payload: { user: payloadTokenDto } = { user };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('secret'),
        expiresIn: this.configService.get<string>('expireJwt'),
      });
    } catch (e) {
      this.logger.error(
        e.response.message,
        'Token service, generateJwtToken method error',
      );
      return e;
    }
  }
}
