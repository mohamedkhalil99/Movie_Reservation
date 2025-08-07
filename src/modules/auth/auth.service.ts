import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ForgotPasswordDto, NewPasswordDto, RefreshTokenDto, SignInDto, SignUpDto, VerifyResetPasswordCodeDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../userForAdmin/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { welcomeEmailHtml } from 'src/mails/templates/welcome.template';
import { instanceToPlain } from 'class-transformer';
import { getVerificationEmail } from 'src/mails/templates/verification-code';

const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(@Inject('USER_REPOSITORY')private userRepo: Repository<User>, private jwtService: JwtService, private readonly mailService: MailerService) {}
  
  async signUp(signUpDto: SignUpDto): Promise<{status: number, message: string, data: Record<string, unknown>, accessToken: string, refreshToken: string}> {
    //If email already exists
    const existingUser = await this.userRepo.findOne({ where: { email: signUpDto.email } });
    if (existingUser) {throw new ConflictException('Email already exists');}

    //Hash the password
    const hashedPassword = await bcrypt.hash(signUpDto.password, saltRounds);

    //Create a new user
    const user = {password: hashedPassword, role: 'customer' as User['role'], isActive:true};
    const newUser = this.userRepo.create({ ...signUpDto, ...user });
    await this.userRepo.save(newUser);
    
    //Create Access Token
    const payload= {email:newUser.email, role:newUser.role,};
    const accessToken= await this.jwtService.signAsync(payload, {secret: process.env.JWT_KEY,});
        
    //create refresh token
    const refreshToken = await this.jwtService.signAsync({...payload, countEX:5}, {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'});

    //Send Welcome Email
    const htmlmsg = welcomeEmailHtml(newUser.name);
    await this.mailService.sendMail({
      from: `Movie Reservation <${process.env.NODEMAILER_USERNAME}>`,
      to: newUser.email,
      subject: 'Movie Reservation | Welcome',
      html: htmlmsg,
    }); 

    return {status: 201, message: 'User created successfully', data: instanceToPlain(newUser) as Record<string, unknown>, accessToken, refreshToken};
  }

  async signIn(signInDto: SignInDto): Promise<{data: Record<string, unknown>, accessToken: string, refreshToken: string}> {
    //find the email
    const existingUser = await this.userRepo.findOne({ where: { email: signInDto.email } });
    if (!existingUser) {throw new ConflictException('Invalid email or password');}
        
    //compare password with hashed one
    const hashedPassword = existingUser.password;
    const isMatch = await bcrypt.compare(signInDto.password, hashedPassword);
    if(!isMatch){throw new ConflictException('Invalid email or password');}
        
    //create access token by payload
    const payload={email: existingUser.email, role: existingUser.role, id: existingUser.id};
    const accessToken= await this.jwtService.signAsync(payload, {secret: process.env.JWT_KEY,});

    //create refresh token
    const refreshToken = await this.jwtService.signAsync({...payload, countEX:5}, {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'});
        
    return {data: instanceToPlain(existingUser) as Record<string, unknown>, accessToken, refreshToken};
  }

  async forgotPassword(emailDto: ForgotPasswordDto): Promise<{status: number, message: string}> {
    //find the email
    const existingUser = await this.userRepo.findOne({ where: { email: emailDto.email } });
    if (!existingUser) {throw new ConflictException('Email Not Found');}  
            
    //Generate 6 digit Code    
    const code = Math.floor(100000 + Math.random() * 900000);
        
    //hash the code    
    const hashedCode = await bcrypt.hash(code.toString(), saltRounds);

    //Put the code in the Verification Code field in the database
    await this.userRepo.update({ email: emailDto.email}, {verificationCode: hashedCode });
        
    //Send the code to the email
    const htmlmsg= getVerificationEmail(code.toString());
        
    await this.mailService.sendMail({
      from: `Movie Reservation <${process.env.NODEMAILER_USERNAME}>`,
      to:emailDto.email,
      subject: 'Movie Reservation | Reset Password',
      html: htmlmsg,
    });

    return {status: 201, message: `Verification code has been Sent to ${emailDto.email}`};//`Verification code sent to your email ${email.email}`
  }

  async verifyResetPasswordCode(verifyDto:VerifyResetPasswordCodeDto): Promise<{status: number, message: string}> {
    //Check if the user exists
    const user = await this.userRepo.createQueryBuilder('user')
      .select(['user.email', 'user.verificationCode'])
      .where('user.email = :email', { email: verifyDto.email })
      .getOne();
    if (!user || !user.verificationCode) {throw new ConflictException('Invalid Code');}

    // Compare the provided code with the hashed code in the database
    const isMatch = await bcrypt.compare(verifyDto.code, user.verificationCode);
    if (!isMatch) {throw new ConflictException('Invalid Code');}

    // If the code matches, clear the verificationCode field
    await this.userRepo.update({ email: verifyDto.email}, {verificationCode: '' });

    return {status: 200, message: 'Code verified successfully'};  
  }

  async newPassword(newPassDto:NewPasswordDto): Promise<{status: number, message: string}> {
    //find the email
    const existingUser = await this.userRepo.findOne({ where: { email: newPassDto.email } });
    if (!existingUser) {throw new ConflictException('Email Not Found');}  
        
    //hash the new password
    const newPassword = await bcrypt.hash(newPassDto.newPassword, saltRounds);
    await this.userRepo.update({email:newPassDto.email},{password:newPassword});
    return {status: 200, message: 'Password updated successfully'};
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{status: number, message: string, accessToken: string, refreshToken: string}> {
    interface RefreshTokenPayload {
      id?: string;
      email: string;
      role: string;
      countEX: number;
      [key: string]: any;
    }
    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {secret: process.env.JWT_REFRESH_KEY});
    } 
    catch {throw new ConflictException('Refresh token expired or invalid');}

    if (!payload || payload.countEX <= 0) {throw new ConflictException('Invalid refresh token, Sign In Again!');}

    // Check if user ID is present in the payload
    let userId = payload.id;
    if (!userId) {
      const user = await this.userRepo.findOne({ where: { email: payload.email } });
      if (!user) {throw new ConflictException('User Not Found');}
      userId = user.id.toString();
    }

    const accessToken = await this.jwtService.signAsync(
      {id: userId, email: payload.email, role: payload.role},
      {secret: process.env.JWT_KEY}
    );

    const newRefreshToken = await this.jwtService.signAsync(
      {id: userId, email: payload.email, role: payload.role, countEX: payload.countEX - 1},
      {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'}
    );

    return { status: 200, message: 'Token refreshed successfully', accessToken, refreshToken: newRefreshToken};
  }
}