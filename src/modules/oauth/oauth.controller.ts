import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { OAuthService } from "./oauth.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

interface GoogleUser {
  emails: { value: string }[];
  displayName?: string;
  photos?: { value?: string }[];
}

interface GoogleRequest extends Request {
  user: GoogleUser;
}

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  //Desc: Initiates Google OAuth login
  //Route: GET api/v1/oauth/login/google
  //Access: Public  
  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates the Google OAuth login process
  }

  //Desc: Handles Google OAuth callback
  //Route: GET api/v1/oauth/google/callback
  //Access: Public
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req : GoogleRequest) { 
    const user = req.user;   
    await this.oauthService.validateUser(user);
  }
}