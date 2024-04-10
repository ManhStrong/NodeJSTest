import {
  ExecutionContext,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthUserGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) throw err;
    if (!user) {
      if (info.name == 'TokenExpiredError') {
        throw new RequestTimeoutException(info);
      }
      throw new UnauthorizedException(info);
    }
    return user;
  }
}
