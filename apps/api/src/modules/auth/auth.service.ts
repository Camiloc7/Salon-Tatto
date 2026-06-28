import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'refresh-secret-key',
    );
    const refreshExpiresInVal = this.configService.get<string | number>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );
    this.refreshExpiresIn = typeof refreshExpiresInVal === 'string' && !isNaN(Number(refreshExpiresInVal))
      ? (Number(refreshExpiresInVal) as any)
      : refreshExpiresInVal;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async refreshToken(userId: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findByIdOrFail(userId);
    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.refreshSecret,
      });
      return this.refreshToken(payload.sub);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findByIdWithRole(userId);
  }

  private async generateTokens(user: any): Promise<AuthResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        avatar: user.avatar,
      },
    };
  }

  private generateAccessToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: any): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn,
    });
  }
}
