import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum StudentStatus {
    Baja = 'Baja',
    EnTratamiento = 'En Tratamiento',
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

    @Prop({ type: [FileSchema], default: [] })
    files?: File[];;

    @Prop()
    description?: string;

    @Prop()
    startdate?: string;

    @Prop()
    enddate?: string;

    @Prop({ default: StudentStatus.EnTratamiento })
    status?: StudentStatus;

    @Prop({ type: [ReportSchema], default: [] })
    reports?: Report[];
}

export const StudentsSchema = SchemaFactory.createForClass(Students);
