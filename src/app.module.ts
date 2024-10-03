import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    StudentsModule,
    MongooseModule.forRoot('mongodb://mongo:WxfjNbEYetcLoBFmdNpwUJiccKeTrAbN@mongodb.railway.internal:27017/tierraprometida'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
