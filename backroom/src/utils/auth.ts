import bcrypt from 'bcrypt';
import { query } from 'data';
import { User } from '../../../data/src/types/data';

export type DbUser = User & {
  password: string;
};

export const authenticate = async (
  email: string,
  password: string,
): Promise<User | undefined> => {
  const [user] = await query<DbUser>('select * from users where email=$1', [
    email,
  ]);
  if (!user) {
    return undefined;
  }

  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return undefined;
  }

  return {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
  };
};
