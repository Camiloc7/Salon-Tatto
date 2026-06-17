import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({
    properties: {
      id: { type: 'string' },
      email: { type: 'string' },
      name: { type: 'string' },
      role: { type: 'string' },
      avatar: { type: 'string', nullable: true },
    },
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string | null;
  };
}
