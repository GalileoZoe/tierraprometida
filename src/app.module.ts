import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:iSYjHUidqXllgiIdvhrCdxydVUyiMvcM@junction.proxy.rlwy.net:49497'),
    // MongooseModule.forRoot('mongodb://localhost:27017/tierraprometida'),
    StudentsModule,
    UsersModule,
    LoginModule,
    ReportsModule,
     ],
  providers: [],
})
export class AppModule {}
