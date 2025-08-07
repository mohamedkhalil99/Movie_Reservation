import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    @MinLength(3, {message: 'Name must be at least 3 characters long'})
    @MaxLength(50, {message: 'Name must be at most 50 characters long'})
    name: string;

    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @MaxLength(20, {message: 'Password must be at most 20 characters long'})
    password: string;
}

export class SignInDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @MaxLength(20, {message: 'Password must be at most 20 characters long'})
    password: string;
}

export class ForgotPasswordDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;
}

export class VerifyResetPasswordCodeDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'Code is required'})
    @IsString({message: 'Code must be a string'})
    @Length(6, 6, {message: 'Code must be exactly 6 characters long'})
    code: string;
}

export class NewPasswordDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'New Password is required'})
    @IsString({message: 'New Password must be a string'})
    @MinLength(6, {message: 'New Password must be at least 6 characters long'})
    @MaxLength(20, {message: 'New Password must be at most 20 characters long'})
    newPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}