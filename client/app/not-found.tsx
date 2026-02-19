import Link from 'next/link';
import { Button, Result } from 'antd';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
        extra={
          <Link href="/">
            <Button type="primary" size="large">Về Trang Chủ</Button>
          </Link>
        }
      />
    </div>
  );
}
