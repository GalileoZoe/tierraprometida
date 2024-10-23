import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum StudentStatus {
    Baja = 'Baja',
    Residente = 'Residente',
    Egresado = 'Egresado',
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

const ReportSchema = SchemaFactory.createForClass(Report);

@Schema()
export class Students extends Document {

    @Prop()
    number?: string;

    @Prop()
    name?: string;

    @Prop()
    lastname?: string;

    @Prop()
    username?: string;

    @Prop()
    gender?: string;

    @Prop()
    blood?: string;
    
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

    @Prop({ type: [String], default: [] }) 
    files?: string[];

    @Prop()
    description?: string;

    @Prop()
    startdate?: string;

    @Prop()
    enddate?: string;

    @Prop({ default: StudentStatus.Residente })
    status?: StudentStatus;

    @Prop({ type: [ReportSchema], default: [] })
    reports?: Report[];
}

export const StudentsSchema = SchemaFactory.createForClass(Students);
