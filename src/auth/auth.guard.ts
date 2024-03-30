import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ROLES_KEY } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const token = this.authService.extractAuthTokenFromHeader(request.headers.authorization);

        if (token) {
            const userPayload = await this.authService.verifyToken(token, !isPublic);
            request['user'] = userPayload;

            if (isPublic) return true;
            if (!requiredRoles) throw new UnauthorizedException('No roles are allowed to the endpoint!');
            const roleAllowed = requiredRoles.some(role => userPayload.roles.includes(role));

            if (!roleAllowed) {
                throw new UnauthorizedException(
                    `User does not have one of required roles: ${requiredRoles.join(', ')}`,
                );
            }
            return true;
        } else {
            if (!isPublic) throw new UnauthorizedException();
            return isPublic;
        }
    }
}
