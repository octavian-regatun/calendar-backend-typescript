import { DocumentType } from '@typegoose/typegoose';
import express from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import config from '../../config';
import Gender from '../../enums/gender.enum';
import Providers from '../../enums/provider.enum';
import { User, UserModel } from '../../models/user.model';
import jwt from 'jsonwebtoken';
import JWTPayload from '../../interfaces/jwtPayload.interface';

const router = express.Router();

async function saveUser(payload: TokenPayload): Promise<DocumentType<User>> {
  const newUser = new UserModel();

  newUser._id = payload.sub;
  newUser.provider = Providers.GOOGLE;
  newUser.firstName = payload.given_name as string;
  newUser.lastName = payload.family_name as string;
  newUser.email = payload.email as string;
  newUser.gender = Gender.UNKNOWN;

  await newUser.save();

  return newUser;
}

function createJWT(newUser: DocumentType<User>): string {
  return jwt.sign(
    {
      id: newUser._id,
    } as JWTPayload,
    config.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1 days' },
  );
}

async function isUserInDatabase(
  id: string | undefined,
): Promise<DocumentType<User> | undefined> {
  const foundUser = await UserModel.findById(id);

  if (foundUser) {
    return foundUser;
  }

  return undefined;
}

async function getPayload(tokenId: string): Promise<TokenPayload | undefined> {
  const client = new OAuth2Client(config.GOOGLE.CLIENT_ID);

  const token = await client.verifyIdToken({
    idToken: tokenId,
    audience: config.GOOGLE.CLIENT_ID,
  });

  return token.getPayload();
}

router.post('/', async (req, res) => {
  const { tokenID }: { tokenID: string } = req.body;

  const payload = await getPayload(tokenID);

  if (!payload) {
    return res.send('payload not found, tokenID is not valid').status(404);
  }

  if (await isUserInDatabase(payload.sub)) {
    const existingUser = (await UserModel.findById(
      payload.sub,
    )) as DocumentType<User>;

    res.send({ token: createJWT(existingUser) });
  } else {
    const newUser = await saveUser(payload);

    res.send({ token: createJWT(newUser) });
  }
});

export { router as google };