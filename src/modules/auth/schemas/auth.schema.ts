import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {
  _id: Types.ObjectId;
  @ApiProperty()
  @Prop({ required: true, type: String })
  email: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  password: string;
  @ApiProperty()
  @Prop({ required: true, default: true, type: Boolean })
  state: boolean;
  @ApiProperty()
  @Prop({ required: true, default: false, type: Boolean })
  accountConfirmed: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
