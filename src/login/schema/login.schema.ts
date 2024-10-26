import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Login extends Document {

    @Prop()
    username?: string;
    
    @Prop()
    email?: string;

    @Prop()
    password?: string;

    @Prop()
    image?: string;

    // Campo de fecha con el timestamp actual
    @Prop({ type: Date, default: Date.now })
    update: Date;

}

export const LoginSchema = SchemaFactory.createForClass(Login);