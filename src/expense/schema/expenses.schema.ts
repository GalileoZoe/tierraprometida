import { Prop, Schema, SchemaFactory,  } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Expense extends Document {

    @Prop( { type: Types.ObjectId, ref: 'Users' })
    iduser: Types.ObjectId ;

    @Prop()
    title: string;

    @Prop()
    concept: string;

    @Prop()
    amount: number;

    @Prop()
    source: string;

    @Prop()
    category: string;

    @Prop()
    date: Date;

    @Prop()
    notes: string;

    @Prop()
    deletedAt: Date

    @Prop()
    profits: number;

};

export const ExpenseSchema = SchemaFactory.createForClass(Expense);