import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, NewPasswordDto, RefreshTokenDto, SignInDto, SignUpDto, VerifyResetPasswordCodeDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Desc: Anyone can sign up
  //Route: GET api/v1/auth/sign-up
  //Access: Public
  @Post('sign-up')
  signUp(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  //Desc: User can sign in
  //Route: GET api/v1/auth/login
  //Access: Public
  @Post('login')
  signIn(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  //Reset password//
  //Desc: User can reset password
  //Route: POST api/v1/auth/forgot-password
  //Access: Public
  @Post('forgot-password')
  forgotPassword(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) emailDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(emailDto);
  }

  //Desc: User can verify the reset password code
  //Route: POST api/v1/auth/verify-reset-password-code
  //Access: Public
  @Post('verify-reset-password-code')
  verifyResetPasswordCode(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) verifyDto:VerifyResetPasswordCodeDto) {
    return this.authService.verifyResetPasswordCode(verifyDto);
  }

  //Desc: User can Put a new password
  //Route: PUT api/v1/auth/reset-password
  //Access: Public
  @Post('reset-password')
  newPassword(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) newPassDto:NewPasswordDto) {
    return this.authService.newPassword(newPassDto);
  }

  //Desc: User can refresh access token
  //Route: POST api/v1/auth/refresh-token/:refreshToken
  //Access: Public
  @Post('refresh-token')
  refreshToken(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}