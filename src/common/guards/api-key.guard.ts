import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const providedKey: string | undefined = request.headers['x-api-key'];
    const expected = this.configService.get<string>('apiKey');
    if (!providedKey || !expected || providedKey !== expected) {
      throw new UnauthorizedException({
        errorCode: 'UNAUTHORIZED',
        errorMessage: 'Invalid API key',
      });
    }
    return true;
  }
}

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const providedKey: string | undefined = request.headers['x-api-key'];
    const expected = this.configService.get<string>('adminApiKey');
    if (!providedKey || !expected || providedKey !== expected) {
      throw new UnauthorizedException({
        errorCode: 'UNAUTHORIZED',
        errorMessage: 'Invalid API key',
      });
    }
    return true;
  }
}
