import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Login extends Document {

    @Prop()
    image?: string;

    @Prop()
    username?: string;
    
    @Prop()
    email?: string;

    @Prop()
    password?: string;

    @Prop()
    rol?: string;

    @Prop({ type: Date, default: Date.now })
    update?: Date;

}

export const LoginSchema = SchemaFactory.createForClass(Login);
