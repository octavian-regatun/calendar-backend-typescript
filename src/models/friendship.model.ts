import { getModelForClass, prop } from '@typegoose/typegoose';
import FriendshipStatus from '../enums/friendshipStatus.enum';

export class Friendship {
  @prop({ required: true })
  requester: string;

  @prop({ required: true })
  recipient: string;

  @prop({ required: true })
  status: FriendshipStatus;
}

export const FriendshipModel = getModelForClass(Friendship);
