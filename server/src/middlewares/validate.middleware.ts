import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

// Middleware dùng chung để validate params, query, body
export const validate = (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next(); // Dữ liệu chuẩn, cho phép đi vào Controller
    } catch (error) {
      if (error instanceof ZodError) {
        // Gom các lỗi của Zod thành mảng dễ đọc cho Frontend
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({ success: false, errors: errorMessages });
        return;
      }
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };