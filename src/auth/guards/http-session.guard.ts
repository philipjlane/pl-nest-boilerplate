import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

export const AllowUnauthorizedRequest = () =>
  SetMetadata('allowUnauthorizedRequest', true);

@Injectable()
export class HttpSessionGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // If user is logged in
    if (request.isAuthenticated()) return true;

    // Throw 401
    throw new UnauthorizedException();

    // return allowUnauthorizedRequest || request.isAuthenticated();
    // return super.canActivate(context);
  }
}
