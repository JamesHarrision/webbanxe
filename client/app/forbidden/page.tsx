import Link from 'next/link';
import { Button, Result } from 'antd';

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Link href="/">
            <Button type="primary" size="large">Về Trang Chủ</Button>
          </Link>
        }
      />
    </div>
  );
}
