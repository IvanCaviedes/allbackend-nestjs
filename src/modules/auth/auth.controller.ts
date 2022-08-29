import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { Auth } from './schemas/auth.schema';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { resJWT } from './jwt.strategy';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 409, description: 'User already exist' })
  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto): Promise<Auth> {
    return this.authService.signup(createAuthDto);
  }

  @ApiExtraModels(resJWT)
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(resJWT),
    },
  })
  @ApiResponse({ status: 404, description: 'User not exist' })
  @ApiResponse({ status: 403, description: 'Incorrect Password' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() createAuthDto: CreateAuthDto): Promise<resJWT> {
    return this.authService.login(createAuthDto);
  }

  @Get('confirmAccount')
  @UseGuards(JwtAuthGuard)
  confirmAccount(@Request() req): Promise<Auth> {
    const { userId } = req.user;
    return this.authService.confirmAccount(userId);
  }

  @Patch('changePassword')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Body() createAuthDto: UpdateAuthDto,
    @Request() req,
  ): Promise<Auth> {
    const { userId } = req.user;
    return this.authService.changePassword(createAuthDto, userId);
  }

  @Get('sendResetEmail')
  @UseGuards(JwtAuthGuard)
  sendResetEmail() {
    return this.authService.sendMailConfirmAccount();
  }

  @Patch('updateAcount')
  @UseGuards(JwtAuthGuard)
  updateAccount(
    @Body() createAuthDto: UpdateAuthDto,
    @Request() req,
  ): Promise<Auth> {
    const { userId } = req.user;
    return this.authService.updateAccount(createAuthDto, userId);
  }
}
