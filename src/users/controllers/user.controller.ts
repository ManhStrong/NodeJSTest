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
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserRequest } from '../dtos/create-user-request.dto';
import { UserResponse } from '../dtos/user-response.dto';
import { UpdateUserRequest } from '../dtos/update-user-request.dto';
import { JwtAuthUserGuard } from '../../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfigFile } from '../../helpers/config-file';
import { plainToInstance } from 'class-transformer';
import { extname } from 'path';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/dtos/role.decorator';
import { ROLE } from 'src/shares/role.constant';

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
  async findOne(@Param('id') id: number): Promise<UserResponse> {
    return await this.userService.getUserById(id);
  }

  /**
   * Create a new User
   * @param userReq CreateUserRequest
   * @returns void
   */
  @Post()
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
  async create(
    @Body() userReq: CreateUserRequest,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const avatar = file?.destination + '/' + file?.filename;
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    return await this.userService.createUser(
      plainToInstance(CreateUserRequest, {
        ...userReq,
        avatar,
      }),
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
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserReq: UpdateUserRequest,
  ): Promise<UserResponse> {
    return await this.userService.updateUser(id, updateUserReq);
  }

  /**
   * delete user by id
   * @param id number
   * @returns void
   */
  @UseGuards(JwtAuthUserGuard)
  @Roles(ROLE.DELETE)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.userService.deleteUser(id);
  }

  /**
   * update-picture
   * @param req Req
   * @param file Express.Multer.File
   */
  @UseGuards(JwtAuthUserGuard)
  @Post('upload-avatar')
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
  ) {
    const avatar = file.destination + '/' + file.filename;
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    return await this.userService.updateUser(
      req.user.id,
      plainToInstance(UpdateUserRequest, {
        avatar,
      }),
    );
  }
}
