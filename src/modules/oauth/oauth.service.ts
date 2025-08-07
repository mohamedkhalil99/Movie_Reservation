import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../userForAdmin/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from "class-transformer";

export function generatePassword(length: number = 12): string {
  if (length < 6 || length > 20) {throw new Error('Password length must be between 6 and 20 characters');}

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
  const all = upper + lower + digits + symbols;

  const guarantee = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  //Complete the rest of the password with random characters
  const restLength = Math.max(length - guarantee.length, 0);
  const rest = Array.from({ length: restLength }, () => {
    return all[Math.floor(Math.random() * all.length)];
  });

  //Merge guaranteed characters with the rest
  const passwordArray = [...guarantee, ...rest].sort(() => Math.random() - 0.5); // shuffle
  return passwordArray.join('');
}

//bcrypt salt rounds
const saltRounds = 10;

@Injectable()
export class OAuthService {
  constructor(@Inject('USER_REPOSITORY')private userRepo: Repository<User>, private jwtService: JwtService){}
    
  async validateUser(profile: { emails: { value: string }[]; displayName?: string; photos?: { value?: string }[] }): Promise<any> {
    // Check if user exists in the database
    const googleEmail = profile?.emails?.[0]?.value;
    if (!googleEmail) {throw new ConflictException('Email is required');}
    const user = await this.userRepo.findOne({ where: { email : googleEmail } });
    if (!user) {
      // If user does not exist, create a new user
      const hasedPassword = await bcrypt.hash(generatePassword(), saltRounds);
      const newUser = this.userRepo.create({
        email: googleEmail,
        name: profile.displayName,
        password: hasedPassword,
        role: 'customer',
        isActive: true,
        photo: profile.photos?.[0]?.value ?? null,
      } as Partial<User>);

      const savedUser = await this.userRepo.save(newUser);

      return { status: 202, message: 'User created', data: savedUser };
    }

    // create access token by payload
    const payload={email: user.email, role: user.role, id: user.id};
    const accessToken= await this.jwtService.signAsync(payload, {secret: process.env.JWT_KEY,});

    //create refresh token
    const refreshToken = await this.jwtService.signAsync({...payload, countEX:5}, 
      {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'}
    );
  
    return {data: instanceToPlain(user) as Record<string, unknown>, accessToken, refreshToken};
  }
}