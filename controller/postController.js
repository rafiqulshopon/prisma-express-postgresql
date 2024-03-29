import prisma from '../config/db.js';

export const getPosts = async (req, res) => {
  let { q, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  if (page <= 0) page = 1;
  if (limit <= 0 || limit > 100) limit = 10;

  const skip = (page - 1) * limit;

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
      skip,
      take: limit,
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

    const totalPosts = await prisma.post.count({
      where: queryOptions.where,
    });

    const totalPages = Math.ceil(totalPosts / limit);

    return res.status(200).json({
      data: posts,
      meta: {
        totalPages,
        currentPage: page,
        limit: limit,
        totalPosts,
      },
    });
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
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    const newPost = await prisma.post.create({
      data: {
        userId: Number(userId),
        title,
        description,
      },
    });

    return res.json({ status: 200, data: newPost, msg: 'Post created.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
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
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return res.json({ status: 200, msg: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
