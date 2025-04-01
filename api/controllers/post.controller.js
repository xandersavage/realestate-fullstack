import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get posts",
    });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get post",
    });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update post",
    });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};
