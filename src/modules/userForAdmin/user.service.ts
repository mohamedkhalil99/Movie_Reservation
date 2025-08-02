import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';

const saltRounds = 10;

export interface FindAllQuery {
  limit?: number;
  skip?: number;
  sort?: 'asc' | 'desc';
}

@Injectable()
export class UserService {
  constructor(@Inject('USER_REPOSITORY')private userRepo: Repository<User>,) {}

  async create(createUserDto: CreateUserDto): Promise<{ status: number; message: string; data: Record<string, unknown> }> {
    //if email already exists
    const existingUser = await this.userRepo.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {throw new ConflictException('Email already exists');}

    //Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);
    
    //Create new user
    const newUser = this.userRepo.create({ ...createUserDto, password: passwordHash, role: createUserDto.role ?? 'customer', isActive: true });
    const savedUser = await this.userRepo.save(newUser);
    return { status: 201, message: 'User created successfully', data: instanceToPlain(savedUser) as Record<string, unknown> };
  }

  async findAll(query: FindAllQuery): Promise<{ status: number; message: string; data: Record<string, unknown> }> {
    const { limit = 1000000000, skip = 0, sort = 'asc' } = query;
    if (Number.isNaN(+limit)) {throw new ConflictException('Invalid Limit query parameters');}
    if (Number.isNaN(+skip)) {throw new ConflictException('Invalid Skip query parameters');}
    if (!['asc', 'desc'].includes(sort)) {throw new ConflictException('Invalid Sort query parameters');}

    const users = await this.userRepo.find({take: limit, skip, order: { id: sort }});
    if (!users || users.length === 0) {throw new ConflictException('No users found');}
    return { status: 200, message: 'Users retrieved successfully', data: instanceToPlain(users) as Record<string, unknown> };
  }

  async findOne(id: number): Promise<{ status: number; message: string; data: Record<string, unknown> }> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {throw new NotFoundException('User not found');}
    return { status: 200, message: 'User retrieved successfully', data: instanceToPlain(user) as Record<string, unknown> };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<{ status: number; message: string; data: Record<string, unknown> }> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {throw new NotFoundException('User not found');}

    //If password is provided, hash it
    if (updateUserDto.password) {updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);}

    //Update user
    const updatedUser = await this.userRepo.save({ ...user, ...updateUserDto });
    return { status: 200, message: 'User updated successfully', data: instanceToPlain(updatedUser) as Record<string, unknown> };
  }

  async remove(id: number): Promise<{ status: number; message: string; data: Record<string, unknown> }> {
    return await this.userRepo.delete(id).then((result) => {
      if (result.affected === 0) {throw new NotFoundException('User not found');}
      return { status: 200, message: 'User deleted successfully', data: {} };
    });
  }
}