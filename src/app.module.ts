import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:WxfjNbEYetcLoBFmdNpwUJiccKeTrAbN@junction.proxy.rlwy.net:44487/tierraprometida'),
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
