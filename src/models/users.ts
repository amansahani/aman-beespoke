import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type registerProps = {
  Username : string,
  Customer_name : string,
  Gender : string,
  Preffered_category? : string,
  Password : string
}
//REGISTER
export const createUser = async ({Username, Customer_name, Gender, Preffered_category, Password }: registerProps) => {
  const user = await prisma.user_creds.create({
    data: {
      Username,
      Customer_name,
      Gender,
      Preffered_category,
      Password,
    },
  });

  return user;
};
//FIND USER BY ID OR UUID
export const findUserById = async(userId: string) =>{
    return await prisma.user_creds.findUnique({ where : {Id: userId}})
}
//FIND USER BY USERNAME
export const findUserByUsername = async (username: string) => {
  return await prisma.user_creds.findUnique({ where: { Username:username } });
};
//FIND USER BY ID AND UPDATES  TOKEN
export const updateUserToken = async (userId: string, token: string) => {
  return await prisma.user_creds.update({
    where: { Id: userId },
    data: { Token: token },
  });
};
