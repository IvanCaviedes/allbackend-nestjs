import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { CreateAuthDto } from './dto/create-auth.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { resJWT } from './jwt.strategy';
import { MailService } from '../../mail/mail.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(userAuthDto: CreateAuthDto): Promise<Auth> {
    const checkExistUser = await this.checkExistUser(userAuthDto.email);
    if (checkExistUser.length)
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    const newPassword = await this.encryptPassword(userAuthDto.password);
    userAuthDto = { ...userAuthDto, password: newPassword };
    const createdUser = new this.authModel(userAuthDto);
    await this.mailService.sendMailSingUp(userAuthDto.email);
    return createdUser.save();
  }

  async login(userAuthDto: CreateAuthDto): Promise<resJWT> {
    const checkExistUser = await this.checkExistUser(userAuthDto.email);
    if (!checkExistUser.length)
      throw new HttpException('User not exist', HttpStatus.NOT_FOUND);
    const { password } = checkExistUser[0];
    const validatePassword = await this.validatePassword(
      userAuthDto.password,
      password,
    );
    if (!validatePassword)
      throw new HttpException('Incorrect Password', HttpStatus.FORBIDDEN);
    const payload = { id: checkExistUser[0]._id };
    this.mailService.sendMailLogin(userAuthDto.email);
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
    };
  }

  async confirmAccount(userId): Promise<Auth> {
    const user = await this.authModel.findById(userId);
    user.accountConfirmed = true;
    user.save();
    return user;
  }

  async changePassword(updateAuthDTO: UpdateAuthDto, userId: number) {
    const user = await this.authModel.findById(userId);
    const newPassword = await this.encryptPassword(updateAuthDTO.password);
    user.password = newPassword;
    user.save();
    return user;
  }

  sendMailConfirmAccount() {
    return 'Email de enviado';
  }

  async updateAccount(updateAuthDTO: UpdateAuthDto, userId: number) {
    let user = await this.authModel.findById(userId);
    user = Object.assign(user, updateAuthDTO);
    user.save();
    return user;
  }

  async checkExistUser(email: string): Promise<Auth[]> {
    return await this.authModel.find({ email });
  }

  async encryptPassword(password) {
    return await hash(password, 10);
  }
  async validatePassword(password, OldPasword) {
    return await compare(password, OldPasword);
  }
}
