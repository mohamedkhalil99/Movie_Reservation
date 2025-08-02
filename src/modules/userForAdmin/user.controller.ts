import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Query } from '@nestjs/common';
import { FindAllQuery, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Desc: Admin can Create a new user
  //Route: POST api/v1/user
  //Access: Private (admin only)
  @Post()
  @Roles(['admin'])
  create(@Body(new ValidationPipe({whitelist:true, forbidNonWhitelisted:true})) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //Desc: Admin can Get all users
  //Route: GET api/v1/user
  //Access: Private (admin only)
  @Get()
  @Roles(['admin'])
  findAll(@Query() query: FindAllQuery) {
    return this.userService.findAll(query);
  }

  //Desc: Admin can Get a single user
  //Route: GET api/v1/user/:id
  //Access: Private (admin only)
  @Get(':id')
  @Roles(['admin'])
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  //Desc: Admin can Update a user
  //Route: PATCH api/v1/user/:id
  //Access: Private (admin only)
  @Patch(':id')
  @Roles(['admin'])
  update(@Param('id') id: number, @Body(new ValidationPipe({whitelist:true, forbidNonWhitelisted:true})) updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  //Desc: Admin can Delete a user
  //Route: DELETE api/v1/user/:id
  //Access: Private (admin only)
  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}