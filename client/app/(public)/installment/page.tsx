'use client';

import React from 'react';
import { Row, Col, Card, Typography, Space, Divider } from 'antd';
import {
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';
import LeadForm from '@/components/forms/LeadForm';

const { Title, Paragraph, Text } = Typography;

const InstallmentPage = () => {
  const benefits = [
    {
      title: 'Tài trợ tối đa',
      desc: 'Số tiền vay lên đến 95% giá trị xe.',
      icon: <SafetyCertificateOutlined className="text-3xl text-blue-600" />,
    },
    {
      title: 'Thời gian linh hoạt',
      desc: 'Thời gian vay lên đến 8 năm (96 tháng).',
      icon: <ClockCircleOutlined className="text-3xl text-blue-600" />,
    },
    {
      title: 'Thủ tục đơn giản',
      desc: 'Hồ sơ nhanh chóng, duyệt vay trong ngày.',
      icon: <UsergroupAddOutlined className="text-3xl text-blue-600" />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <Title level={1} className="!text-white !mb-4 !font-black uppercase tracking-tight">
            Tư vấn mua xe VinFast Trả Góp
          </Title>
          <Paragraph className="text-blue-100 text-lg max-w-2xl mx-auto opacity-90">
            Sở hữu ngay dòng xe điện thông minh VinFast với giải pháp tài chính tối ưu, lãi suất ưu đãi và thủ tục cực kỳ đơn giản.
          </Paragraph>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-20">
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card className="rounded-3xl shadow-xl border-none p-4 lg:p-8">
              <Title level={3} className="!text-blue-900 !mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-orange-500 rounded-full" />
                Ví dụ minh họa
              </Title>
              <Paragraph className="text-gray-600 text-base leading-relaxed mb-8">
                Khách hàng A mua trả góp xe <Text strong>VinFast VF5</Text> với giá bán <Text strong>529 triệu đồng</Text> theo phương thức trả trước <Text strong className="text-orange-600">20%</Text>, tương đương <Text strong>105,8 triệu đồng</Text>. Phần còn lại là <Text strong>423,2 triệu đồng</Text> sẽ được vay ngân hàng với lãi suất cố định <Text strong>6,5%/năm</Text> và thanh toán trong vòng <Text strong>8 năm (96 tháng)</Text>.
              </Paragraph>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Text className="text-gray-500 block mb-1">Số tiền thanh toán tháng đầu (Gốc + Lãi)</Text>
                    <Title level={2} className="!text-blue-700 !m-0">~ 6.700.000 Đ</Title>
                  </div>
                  <div>
                    <Text className="text-gray-500 block mb-1">Số tiền lãi giảm dần theo dư nợ</Text>
                    <Title level={4} className="!text-green-600 !m-0">Linh hoạt & Tiết kiệm</Title>
                  </div>
                </div>
              </div>

              <Paragraph className="text-gray-500 italic">
                * Lưu ý: Con số trên chỉ mang tính chất tham khảo. Lãi suất và mức vay có thể thay đổi tùy theo quy định của ngân hàng và chương trình ưu đãi từng thời điểm.
              </Paragraph>

              <Divider className="my-10" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <Title level={4} className="!text-blue-900 !mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">I</span>
                    Đối với cá nhân
                  </Title>
                  <ul className="space-y-4 list-none p-0">
                    {[
                      'Chứng minh nhân dân / CCCD và Hộ khẩu.',
                      'Giấy chứng nhận độc thân hoặc Đăng ký kết hôn.',
                      'Chứng minh thu nhập: Hợp đồng lao động, bảng lương, sổ tiết kiệm...',
                      'Tài sản đảm bảo: Chính chiếc xe mua hoặc bất động sản khác.'
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-600">
                        <CheckCircleFilled className="text-green-500 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Title level={4} className="!text-blue-900 !mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">II</span>
                    Đối với doanh nghiệp
                  </Title>
                  <ul className="space-y-4 list-none p-0">
                    {[
                      'Giấy phép kinh doanh, Mã số thuế.',
                      'Báo cáo thuế, báo cáo tài chính gần nhất.',
                      'Hợp đồng kinh tế đầu ra, đầu vào.',
                      'Quyết định bổ nhiệm Giám đốc, Kế toán trưởng.'
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-600">
                        <CheckCircleFilled className="text-green-500 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <div className="sticky top-24">
              <LeadForm
                initialValues={{ serviceType: 'TRA_GOP' }}
                formName="installment_page_form"
              />

              <div className="mt-8 grid grid-cols-1 gap-4">
                {benefits.map((b, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <Title level={5} className="!m-0 !text-gray-800">{b.title}</Title>
                      <Text className="text-gray-500 text-sm">{b.desc}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-20">
          <Title level={2} className="text-center !text-blue-900 !mb-12 uppercase">
            Tại sao nên chọn mua xe trả góp tại VinFast?
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center hover:shadow-lg transition-shadow border-none rounded-2xl h-full">
                <Title level={4} className="!text-blue-700 !mb-4">Lãi suất cạnh tranh</Title>
                <Paragraph className="text-gray-500">
                  Hợp tác với các ngân hàng lớn nhất Việt Nam để mang đến mức lãi suất ưu đãi nhất cho khách hàng.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center hover:shadow-lg transition-shadow border-none rounded-2xl h-full">
                <Title level={4} className="!text-blue-700 !mb-4">Hỗ trợ 24/7</Title>
                <Paragraph className="text-gray-500">
                  Đội ngũ chuyên viên tư vấn tài chính giàu kinh nghiệm luôn sẵn sàng giải đáp mọi thắc mắc của bạn.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="text-center hover:shadow-lg transition-shadow border-none rounded-2xl h-full">
                <Title level={4} className="!text-blue-700 !mb-4">Bảo mật thông tin</Title>
                <Paragraph className="text-gray-500">
                  Mọi thông tin cá nhân và hồ sơ vay của khách hàng đều được cam kết bảo mật tuyệt đối.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default InstallmentPage;
