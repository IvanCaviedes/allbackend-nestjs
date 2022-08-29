import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConstants } from './constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketGateway } from './sockets/socket.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest', {
      connectionFactory: (connection) => {
        console.log('DB connected');
        return connection;
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: MailConstants.email,
          pass: MailConstants.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [SocketGateway],
})
export class AppModule {}
