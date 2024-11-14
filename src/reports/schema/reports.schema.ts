import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { StudentStatus, FileSchema } from "src/students/schema/students.schema";



@Schema()
export class Reports extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Students' })
    idstudent: Types.ObjectId;  // Referencia al producto para identificar el producto vendido

    @Prop()
    author?: string;

    @Prop()
    title?: string;

    @Prop()
    reports?: string;

    @Prop()
    date?: string;

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

    @Prop({ default: StudentStatus })
    status?: StudentStatus;

}

export const ReportsSchema = SchemaFactory.createForClass(Reports);
