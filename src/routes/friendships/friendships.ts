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

router.get('/suggestions', async (req, res) => {
  let users = await UserModel.find();

  users = users.filter(user => user._id !== req.id);

  const friendships = await FriendshipModel.find({ requester: req.id });

  users = users.filter(
    user => !friendships.find(friendship => user._id === friendship.recipient),
  );

  return res.send(users.map(({ _id, username }) => ({ _id, username })));
});

router.post('/request', async (req, res) => {
  interface Body {
    username?: string;
  }

  const { username }: Body = req.body;

  try {
    const recipientUser = await UserModel.findOne({ username });

    if (
      await isPendingOrAccepted(req.id as string, recipientUser?._id as string)
    ) {
      return res.sendStatus(500);
    }

    const foundUser = await UserModel.findOne({ username: username });

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

function queryBasedOnStatus(status: string) {
  switch (status) {
    case 'accepted':
      return { status: FriendshipStatus.ACCEPTED };

    case 'pending':
      return { status: FriendshipStatus.PENDING };

    case 'all':
      return {
        $or: [
          { status: FriendshipStatus.ACCEPTED },
          { status: FriendshipStatus.PENDING },
        ],
      };

    default:
      return {
        $or: [
          { status: FriendshipStatus.ACCEPTED },
          { status: FriendshipStatus.PENDING },
        ],
      };
  }
}

router.get('/:status', async (req, res) => {
  const { status } = req.params;

  try {
    const friendships = await FriendshipModel.find({
      $and: [queryBasedOnStatus(status), { requester: req.id as string }],
    });

    const users = await Promise.all(
      friendships.map(async friendship => {
        const user = await UserModel.findById(friendship.recipient);

        return { user, status: friendship.status };
      }),
    );

    res.send(users);
  } catch (e) {
    console.log(e);

    return res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await FriendshipModel.findOneAndDelete({
    $or: [
      { recipient: id, requester: req.id },
      { recipient: req.id, requester: id },
    ],
  });

  return res.sendStatus(200);
});

export { router as friendships };
