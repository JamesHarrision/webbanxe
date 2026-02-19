'use client';

import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, CarOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Summary</h1>

      <Row gutter={16}>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Tổng Leads"
              value={128}
              prefix={<UserOutlined />}
              formatter={(value) => <span style={{ color: '#3f8600' }}>{value}</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Xe Tồn kho"
              value={45}
              prefix={<CarOutlined />}
              formatter={(value) => <span style={{ color: '#cf1322' }}>{value}</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Doanh thu tháng"
              value={2400000000}
              prefix={<DollarOutlined />}
              suffix="VND"
              precision={0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="Tăng trưởng"
              value={12.5}
              prefix={<RiseOutlined />}
              suffix="%"
              formatter={(value) => <span style={{ color: '#3f8600' }}>{value}</span>}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt-8">
        <Col span={12}>
          <Card title="Leads mới nhất" variant="borderless" className="shadow-sm">
            <p>Chưa có dữ liệu...</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tin tức mới" variant="borderless" className="shadow-sm">
            <p>Chưa có dữ liệu...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
