import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/modules/userForAdmin/entities/user.entity';
import { UpdateUserDto } from '../userForAdmin/dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';

const saltRounds = 10;

@Injectable()
export class UserMeService {
  constructor(@Inject('USER_REPOSITORY')private userRepo: Repository<User>,) {}
  
  async getProfile(userId: number): Promise<{ status: number; data: User }> {
    if(!userId){throw new NotFoundException('User not found');}
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {throw new NotFoundException('User not found');}
    return {status: 200, data: user};
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto): Promise<{ status: number; message: string; data: Record<string, unknown> }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {throw new NotFoundException('User not found');}

    //If password is provided, hash it
    if (updateUserDto.password) {updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);}

    //Update user
    const updatedUser = await this.userRepo.save({ ...user, ...updateUserDto });
    return { status: 200, message: 'User updated successfully', data: instanceToPlain(updatedUser) as Record<string, unknown> };
  }

  async deActivateProfile(userId: number): Promise<{ status: number; message: string; data: Record<string, unknown> }> {
    if(!userId){throw new NotFoundException('User not found');}
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {throw new NotFoundException('User not found');}
    if(!user.isActive) {throw new NotFoundException('User is already deactivated');}
    const updatedUser = await this.userRepo.update(userId, { isActive: false });
    return { status: 200, message: 'User deactivated successfully', data: instanceToPlain(updatedUser) as Record<string, unknown> };
  }
}