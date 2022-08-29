import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  listUsers() {
    return 'listando usuarios';
  }
}
