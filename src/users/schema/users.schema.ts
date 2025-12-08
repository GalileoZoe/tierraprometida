import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum UserStatus {
    Baja = 'Baja',
    Activo = 'Activo',
    Egresado = 'Egresado',
}

export enum UserRol {
    Usuario = 'Usuario',
    SuperUsuario = 'SuperUsuario',
    Administrador = 'Administrador',
    Psicólogo = 'Psicólogo',
}

@Schema()
export class Report {
    @Prop()
    report: string;

    @Prop()
    autor: string;

    @Prop()
    date: string;
}

@Schema()
export class File {
    @Prop()
    file: string;

    @Prop()
    title: string;

    @Prop()
    date: string;
}

const ReportSchema = SchemaFactory.createForClass(Report);
const FileSchema = SchemaFactory.createForClass(File);

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  photo: string;

  @Prop()
  avatar: string;

  
  @Prop()
  address: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  bio: string;

  @Prop()
  rol: string;

  @Prop()
  status: string;

  @Prop()
  online: string;

  @Prop()
  lastOnline: string;

  @Prop()
  lastseen: string;

  @Prop()
  sync: string;

  @Prop()
  touchId:string;

  @Prop()
  Backup: string;

  @Prop()
  lastBackup: string;

  @Prop()
  notifications: string;

  @Prop()
  settings: string;

  @Prop()
  expoPushToken: string;

    @Prop()
    number?: string;



    @Prop()
    lastname?: string;



    @Prop()
    blood?: string;
    

    @Prop()
    curp?: string;


    @Prop()
    disease?: string;

    @Prop()
    allergy?: string;

    @Prop()
    drug?: string;

    @Prop()
    stigma?: string;

    @Prop()
    treatment?: string;

    @Prop()
    tutor?: string;

    @Prop()
    stay?: string;

    @Prop()
    file?: string;

    @Prop({ type: [FileSchema], default: [] })
    files?: File[];;

    @Prop()
    description?: string;

    @Prop()
    startdate?: string;

    @Prop()
    enddate?: string;


    @Prop({ type: [ReportSchema], default: [] })
    reports?: Report[];
}

export const UsersSchema = SchemaFactory.createForClass(User);
