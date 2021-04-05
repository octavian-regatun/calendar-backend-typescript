import express from 'express';
import FriendshipStatus from '../../enums/friendshipStatus.enum';
import { FriendshipModel } from '../../models/friendship.model';
import { UserModel } from '../../models/user.model';

const router = express.Router();

async function isPendingOrAccepted(
  requesterId: string,
  recipientEmail: string,
) {
  const recipientUser = await UserModel.findByEmail(recipientEmail);

  const friendship = await FriendshipModel.findOne({
    $and: [
      {
        $or: [{ recipient: requesterId }, { recipient: recipientUser?._id }],
      },
      {
        $or: [{ requester: requesterId }, { requester: recipientUser?._id }],
      },
    ],
  });

  if (friendship) return true;

  return false;
}

router.post('/add-friend', async (req, res) => {
  interface Body {
    email?: string;
  }

  const { email }: Body = req.body;

  try {
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

router.get('/friends', async (req, res) => {
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
  } catch (e) {
    console.log(e);

    return res.sendStatus(500);
  }
});

export { router as friendships };
