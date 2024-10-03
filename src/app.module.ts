import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/tierraprometida'),
    // TypeOrmModule.forRoot({
    //   type: 'mariadb',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'najimi',
    //   password: 'pass',
    //   database: 'pandoradb',
    //   entities: [ Usuarios ],
    //   synchronize: true, // no recomendable en producción
    //   autoLoadEntities: true, // cargar entidades en db
    // }),
    // TypeOrmModule.forRoot({
    //     type: 'postgres',
    //     host: 'localhost',
    //     port: 5432,
    //     username: 'najimi',
    //     password: 'pass',
    //     database: 'pandora',
    //     entities: [ Login ],
    //     synchronize: true,
    //     autoLoadEntities: true
    // }),
 StudentsModule,
    // UsuariosModule,
    // SensorModule,
    // LoginModule
   ],
  controllers: [AppController],
  providers: [AppService],
})
  
export class AppModule {}