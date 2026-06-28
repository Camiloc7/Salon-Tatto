import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const expiresInVal = configService.get<string | number>('JWT_EXPIRES_IN', '1d');
  const expiresIn = typeof expiresInVal === 'string' && !isNaN(Number(expiresInVal))
    ? Number(expiresInVal)
    : expiresInVal;

  return {
    secret: configService.get<string>('JWT_SECRET', 'super-secret-key'),
    signOptions: {
      expiresIn,
    },
  };
};
