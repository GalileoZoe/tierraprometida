import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:iSYjHUidqXllgiIdvhrCdxydVUyiMvcM@junction.proxy.rlwy.net:49497'),
    StudentsModule,
    UsersModule,
    LoginModule,
     ],
  providers: [],
})
export class AppModule {}
