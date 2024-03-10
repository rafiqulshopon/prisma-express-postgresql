import prisma from '../config/db.js';

export const getPosts = async (req, res) => {
  const { q } = req.query;

  try {
    let queryOptions = {
      include: {
        comment: {
          select: {
            id: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    };

    if (q) {
      queryOptions.where = {
        OR: [
          {
            title: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const posts = await prisma.post.findMany(queryOptions);
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        comment: true,
      },
    });
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPost = async (req, res) => {
  const { userId, title, description } = req.body;

  const newPost = await prisma.post.create({
    data: {
      userId: Number(userId),
      title,
      description,
    },
  });

  return res.json({ status: 200, data: newPost, msg: 'Post created.' });
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, description },
    });
    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });

  return res.json({ status: 200, msg: 'Post deleted successfully' });
};
