import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertGoogleUser(profile: {
    providerUserId: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  }) {
    return this.prisma.user.upsert({
      where: { email: profile.email },
      update: {
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        lastLoginAt: new Date()
      },
      create: {
        email: profile.email,
        displayName: profile.displayName ?? profile.email,
        avatarUrl: profile.avatarUrl,
        authAccounts: {
          create: {
            provider: 'google',
            providerUserId: profile.providerUserId
          }
        }
      }
    });
  }
}
