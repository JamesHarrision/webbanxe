import { Request, Response } from 'express';
import * as postService from '../services/post.service';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = (req as any).admin ? true : false;
    const posts = await postService.getPosts(isAdmin);

    res.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idOrSlug } = req.params;
    const identifier = isNaN(Number(idOrSlug)) ? idOrSlug : Number(idOrSlug);

    const post = await postService.getPostByIdOrSlug(identifier as string | number);

    if (!post) {
      res.status(404).json({ success: false, message: 'Không tìm thấy bài viết!' });
      return;
    }

    // Nếu người dùng thường (không phải admin) truy cập bài chưa publish thì chặn
    const isAdmin = (req as any).admin ? true : false;
    if (!isAdmin && !post.isPublished) {
      res.status(403).json({ success: false, message: 'Bài viết chưa được xuất bản!' });
      return;
    }

    res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json({ success: true, message: 'Thêm bài viết thành công', data: post });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const post = await postService.updatePost(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật bài viết thành công', data: post });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await postService.deletePost(id);
    res.status(200).json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};