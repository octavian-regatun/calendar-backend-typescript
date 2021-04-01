import { getModelForClass, prop } from '@typegoose/typegoose';
import Gender from '../enums/gender.enum';
import Provider from '../enums/provider.enum';
import Role from '../enums/role.enum';

export class User {
  @prop({ required: true })
  public _id!: string;

  @prop({ required: true })
  public provider!: Provider;

  @prop({ required: true })
  public firstName!: string;

  @prop({ required: true })
  public lastName!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true, default: Gender.UNKNOWN })
  public gender!: Gender;

  @prop()
  public birthday?: Date;

  @prop({ required: true, default: Date.now() })
  public createdAt!: Date;

  @prop({ required: true, default: Date.now() })
  public loggedAt!: Date;

  @prop({ required: true, default: Role.BASIC })
  public role!: Role;

  @prop({ default: undefined })
  public isLogged?: boolean;
}

export const UserModel = getModelForClass(User);

export interface UserPublic {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
}
