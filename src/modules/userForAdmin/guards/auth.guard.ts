import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Roles } from "../decorators/roles.decorator";
import { Request } from "express";

interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'customer';
  iat?: number;
  exp?: number;
}

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate 
{
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) 
  {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [context.getHandler(),context.getClass()]);

    if (!requiredRoles) {return true;} // No roles defined, allow access

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {throw new UnauthorizedException('No Authorization header found');}

    const token = authHeader.split(' ')[1];

    try 
    {
      const payload = this.jwtService.verify<JwtPayload>(token, {secret: process.env.JWT_KEY});

      request.user = payload;

      // Check if the user has any of the required roles
      return requiredRoles.some((role) => payload.role === role);
    } 
    catch 
    {throw new UnauthorizedException('Invalid token');}
  }
}