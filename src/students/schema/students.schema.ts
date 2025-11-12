import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document } from "mongoose";

export enum StudentStatus {
    Baja = 'Baja',
    EnTratamiento = 'En Tratamiento',
    Egresado = 'Egresado',
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

export const FileSchema = SchemaFactory.createForClass(File);

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
    files?: File[];

    @Prop()
    description?: string;

    @Prop()
    startdate?: string ;

    @Prop()
    enddate?: string;

    @Prop()
    service?: string;

    @Prop()
    experience?: string;

    @Prop()
    psychology?: string;

    @Prop()
    sessions?: string;

    @Prop()
    check?: number;

    @Prop()
    medicine: string;

    @Prop({ default: StudentStatus.EnTratamiento })
    status?: StudentStatus;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Payment' }] })
    payments?: Types.ObjectId[];

    // ✅ Campo para Soft Delete
    @Prop({ default: false })
    softdelete?: boolean;

    // ✅ Timestamps automáticos (creado y actualizado)
    @Prop({ default: Date.now })
    createdAt?: Date;

    @Prop({ default: Date.now })
    updatedAt?: Date;
}

export const StudentsSchema = SchemaFactory.createForClass(Students);

// 🔹 Middleware para actualizar updatedAt en cada save
StudentsSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
