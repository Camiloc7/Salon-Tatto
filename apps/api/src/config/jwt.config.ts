import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET', 'super-secret-key'),
  signOptions: {
    expiresIn: configService.get<number>('JWT_EXPIRES_IN', 900),
  },
});
