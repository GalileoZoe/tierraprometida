import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://WxfjNbEYetcLoBFmdNpwUJiccKeTrAbN:WxfjNbEYetcLoBFmdNpwUJiccKeTrAbN@mongodb.railway.internal:27017'),
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
