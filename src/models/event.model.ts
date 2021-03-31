import {
  getModelForClass,
  modelOptions,
  prop,
  Severity
} from '@typegoose/typegoose';
import { LatLon } from '../interfaces/latLon.interface';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Event {
  @prop({ required: true })
  public title!: string;

  @prop()
  public description?: string;

  @prop({ required: true })
  public fromDate!: Date;

  @prop()
  public toDate?: Date;

  @prop()
  public location?: string;

  @prop()
  public latLon?: LatLon;

  @prop()
  public color?: string;

  @prop({ required: true })
  public author!: string;

  @prop({ required: true, default: [] })
  public participants!: string[];
}

export const EventModel = getModelForClass(Event);
