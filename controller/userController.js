import prisma from '../config/db.js';

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (findUser) {
    return res.status(400).json({
      error: 'User already exists!',
    });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  return res.status(201).json(user);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      email,
      password,
    },
  });

  return res.status(200).json(user);
};
