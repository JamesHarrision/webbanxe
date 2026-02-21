'use client';

import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { UserOutlined, CarOutlined, FileTextOutlined, AlertOutlined } from '@ant-design/icons';
import { adminService, DashboardStats } from '@/services/admin.service';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-12"><Spin size="large" /></div>;

  const cards = [
    {
      title: 'Tổng số Xe',
      value: stats?.totalCars || 0,
      icon: <CarOutlined />,
      color: '#1677ff',
      bgColor: '#e6f4ff',
    },
    {
      title: 'Tổng Bài viết',
      value: stats?.totalPosts || 0,
      icon: <FileTextOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff',
    },
    {
      title: 'Tổng Khách hàng',
      value: stats?.totalLeads || 0,
      icon: <UserOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
    },
    {
      title: 'Leads mới (Chưa xử lý)',
      value: stats?.newLeads || 0,
      icon: <AlertOutlined />,
      color: '#fa8c16',
      bgColor: '#fff7e6',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card variant="borderless" className="shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  {card.icon}
                </div>
                <Statistic
                  title={<span className="text-gray-500">{card.title}</span>}
                  value={card.value}
                  valueStyle={{ color: card.color, fontWeight: 700 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
