import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Login extends Document {

    @Prop()
    photo?: string;

    @Prop({unique:true})
    username?: string;
    
    @Prop({unique:true})
    email?: string;

    @Prop()
    password?: string;

    @Prop()
    rol?: string;

    @Prop({ type: Date, default: Date.now })
    update?: Date;

}

export const LoginSchema = SchemaFactory.createForClass(Login);
