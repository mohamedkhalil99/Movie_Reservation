import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl, Length, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @IsOptional()
    @IsNumber({},{message: 'Id must be a number'})
    id: number;
    
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(50, { message: 'Name must not exceed 50 characters' })
    name: string;
    
    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;
    
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(20, { message: 'Password must not exceed 20 characters' })
    password: string;
    
    @IsOptional()
    @IsString({ message: 'Phone number must be a string' })
    @IsPhoneNumber('EG', { message: 'Phone number must be a valid Egyptian phone number' })
    phoneNumber: string;

    @IsString({ message: 'Role must be a string' })
    @IsEnum(['admin', 'customer'], { message: 'Role must be either admin or customer' })
    role: 'admin' | 'customer';
    
    @IsOptional()
    @IsNumber({}, { message: 'Age must be a number' })
    @Min(15, { message: 'Age must be at least 15' })
    age: number;

    @IsOptional()
    @IsString({ message: 'Photo must be a string' })
    @IsUrl({}, { message: 'Photo must be a valid URL' })
    photo: string;

    @IsOptional()    
    @IsString({ message: 'Verification code must be a string' })
    @Length(6, 6, { message: 'Verification code must be at least 6 characters long' })
    verificationCode: string;
   
    @IsOptional()
    @IsString({ message: 'Is active must be a string' })
    @IsEnum([true, false], { message: 'Is active must be either true or false' })    
    isActive: boolean;
    
    @IsOptional()
    @IsDate({ message: 'Created at must be a date' })
    createdAt: Date;
    
    @IsOptional()
    @IsDate({ message: 'Created at must be a date' })
    updatedAt: Date;
}