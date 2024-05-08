import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserRequest } from '../dtos/create-user-request.dto';
import { UserResponse } from '../dtos/user-response.dto';
import { UpdateUserRequest } from '../dtos/update-user-request.dto';
import { JwtAuthUserGuard } from '../../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfigFile } from '../../helpers/config-file';
import { extname } from 'path';
import { RolesGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/dtos/role.decorator';
import { ROLE } from '../../shares/role.constant';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * get user by id
   * @param id id
   * @returns UserResponse
   */
  @UseGuards(JwtAuthUserGuard)
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: number): Promise<UserResponse> {
    return await this.userService.findOne(id);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  /**
   * Create a new User
   * @param userReq CreateUserRequest
   * @returns void
   */
  @Post()
  @HttpCode(201)
  async create(@Body() userReq: CreateUserRequest): Promise<void> {
    return await this.userService.create(userReq);
  }

  /**
   * update-picture
   * @param req Req
   * @param file Express.Multer.File
   */
  @UseGuards(JwtAuthUserGuard)
  @Patch('upload-avatar')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfigFile('avatar'),
      fileFilter: (req, file, cb) => {
        const etx = extname(file.originalname);
        const allowExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowExtArr.includes(etx)) {
          req.fileValidationError = `Wrong type file. Accepted file are:${allowExtArr} `;
          cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return await this.userService.uploadAvatar(
      req.user.id,
      file,
      req.fileValidationError,
    );
  }

  /**
   * Update user by id
   * @param id number
   * @param updateUserReq UpdateUserRequest
   * @returns UserResponse
   */
  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @Roles(ROLE.UPDATE)
  @HttpCode(200)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserReq: UpdateUserRequest,
  ): Promise<UserResponse> {
    return await this.userService.update(id, updateUserReq);
  }

  /**
   * delete user by id
   * @param id number
   * @returns void
   */
  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @Roles(ROLE.DELETE)
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.userService.delete(id);
  }
}
