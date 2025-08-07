import { Controller, Get, Body, Patch, Delete, UseGuards, Req, ValidationPipe } from '@nestjs/common';
import { UserMeService } from './user-me.service';
import { AuthGuard } from 'src/modules/userForAdmin/guards/auth.guard';
import { Roles } from 'src/modules/userForAdmin/decorators/roles.decorator';
import { UpdateUserDto } from '../userForAdmin/dto/update-user.dto';

@Controller('me')
@UseGuards(AuthGuard)
export class UserMeController {
  constructor(private readonly usermeService: UserMeService) {}

  //Desc: User can Get his/her profile
  //Route: GET api/v1/me
  //Access: Private (admin, customer)
  @Roles(['admin', 'customer'])
  @Get()
  getProfile(@Req() req: { user: { id: number } }) {
    const userId = req.user.id;
    return this.usermeService.getProfile(userId);
  }

  //Desc: User can Update his/her profile
  //Route: PATCH api/v1/me
  //Access: Private (customer only)
  @Roles(['customer'])
  @Patch()
  updateProfile(@Req() req: { user: { id: number } }, @Body(new ValidationPipe({whitelist:true, forbidNonWhitelisted:true})) updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.usermeService.updateProfile(userId, updateUserDto);
  }

  //Desc: User can UnActive his/her profile
  //Route: DELETE api/v1/me
  //Access: Private (customer only)
  @Roles(['customer'])
  @Delete()
  deActivateProfile(@Req() req: { user: { id: number } }) {
    const userId = req.user.id;
    return this.usermeService.deActivateProfile(userId);
  }
}