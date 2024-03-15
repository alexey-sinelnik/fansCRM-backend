import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  passwordForComparison: string,
): Promise<boolean> => {
  return bcrypt.compare(password, passwordForComparison);
};
