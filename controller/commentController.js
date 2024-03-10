import prisma from '../config/db.js';

export const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        post: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return res.json({ status: 200, data: comments });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createComment = async (req, res) => {
  const { userId, postId, comment } = req.body;

  await prisma.post.update({
    where: { id: Number(postId) },
    data: { comment_count: { increment: 1 } },
  });

  const newComment = await prisma.comment.create({
    data: {
      userId: Number(userId),
      postId: Number(postId),
      comment,
    },
  });

  return res.json({
    status: 200,
    data: newComment,
    msg: 'Comment created successfully.',
  });
};

export const getComment = async (req, res) => {
  const commentId = req.params.id;
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: true,
      post: true,
    },
  });

  if (comment) {
    return res.json({ status: 200, data: comment });
  } else {
    return res.status(404).json({ msg: 'Comment not found' });
  }
};

export const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { postId: true },
  });

  if (!comment) {
    return res.status(404).json({ msg: 'Comment not found' });
  }

  await prisma.post.update({
    where: { id: comment.postId },
    data: { comment_count: { decrement: 1 } },
  });

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return res.json({ status: 200, msg: 'Comment deleted successfully' });
};
