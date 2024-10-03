import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    StudentsModule,
    MongooseModule.forRoot('mongodb://mongo:WxfjNbEYetcLoBFmdNpwUJiccKeTrAbN@junction.proxy.rlwy.net:44487'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
