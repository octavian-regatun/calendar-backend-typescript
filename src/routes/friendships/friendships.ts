import express from 'express';
import FriendshipStatus from '../../enums/friendshipStatus.enum';
import { FriendshipModel } from '../../models/friendship.model';
import { UserModel } from '../../models/user.model';

const router = express.Router();

async function isPendingOrAccepted(requesterId: string, recipientId: string) {
  const friendship = await FriendshipModel.findOne({
    $and: [
      {
        $or: [{ recipient: requesterId }, { recipient: recipientId }],
      },
      {
        $or: [{ requester: requesterId }, { requester: recipientId }],
      },
    ],
  });

  if (friendship) return true;

  return false;
}

router.get('friend-request', async (req, res) => {
  const users = await UserModel.find();

  for (const [index, user] of users.entries()) {
    if (user._id === req.id) {
      users.splice(index, 1);
    }
  }

  return res.send(users);
});

router.post('/friend-request', async (req, res) => {
  interface Body {
    email?: string;
  }

  const { email }: Body = req.body;

  try {
    const recipientUser = await UserModel.findByEmail(email as string);

    if (
      await isPendingOrAccepted(req.id as string, recipientUser?._id as string)
    ) {
      return res.sendStatus(500);
    }

    const foundUser = await UserModel.findOne({ email: email });

    if (!foundUser || foundUser._id === req.id) {
      return res.sendStatus(500);
    }

    const newFriendship = new FriendshipModel();

    newFriendship.requester = req.id as string;
    newFriendship.recipient = foundUser?._id;
    newFriendship.status = FriendshipStatus.PENDING;

    await newFriendship.save();

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);

    return res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
    const friendships = await FriendshipModel.find({
      $and: [
        { status: FriendshipStatus.ACCEPTED },
        {
          $or: [
            { recipient: req.id as string },
            { requester: req.id as string },
          ],
        },
      ],
    });

    return res.send(friendships);
  } catch (e) {
    console.log(e);

    return res.sendStatus(500);
  }
});

export { router as friendships };
