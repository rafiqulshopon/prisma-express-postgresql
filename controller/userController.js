import prisma from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { post: true },
        },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(user);
};

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

  return res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
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

  return res.status(200).json({ message: 'User updated successfully' });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });

  return res.status(200).json({ message: 'User deleted successfully' });
};
