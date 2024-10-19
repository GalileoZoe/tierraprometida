import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum StudentStatus {
    Baja = 'Baja',
    EnProceso = 'En Proceso',
    Alta = 'Rehabilitado',
}

@Schema()
export class Students extends Document {

    @Prop()
    name?: string;

    @Prop()
    lastname?: string;

    @Prop()
    username?: string;

    @Prop()
    gender?: string;
    
    @Prop()
    age?: string;

    @Prop()
    curp?: string;

    @Prop()
    email?: string;

    @Prop()
    password?: string;

    @Prop()
    phone?: string;

    @Prop()
    address?: string;

    @Prop()
    drug?: string;

    @Prop()
    tutor?: string;

    @Prop()
    file?: string;

    @Prop({ type: [String], default: [] }) 
    files?: string[];

    @Prop()
    description?: string;

    @Prop()
    startdate?: string;

    @Prop()
    enddate?: string;

    @Prop({ default: StudentStatus.EnProceso })
    status?: StudentStatus;
}

export const StudentsSchema = SchemaFactory.createForClass(Students);