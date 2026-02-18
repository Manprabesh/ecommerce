import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SalesDashboard() {
  // Sample data - replace with your actual data
  const [dashboardData] = useState({
    totalEarnings: 245680,
    todayEarnings: 3420,
    weeklyEarnings: 18750,
    monthlyEarnings: 64200,
    quarterlyEarnings: 182500,
    yearlyEarnings: 698000,
    totalProductsSold: 1248,
    todayProductsSold: 23
  });

  // Monthly earnings data for line chart
  const monthlyData = [
    { month: 'Jan', earnings: 52000, products: 180 },
    { month: 'Feb', earnings: 48000, products: 165 },
    { month: 'Mar', earnings: 62000, products: 210 },
    { month: 'Apr', earnings: 58000, products: 195 },
    { month: 'May', earnings: 71000, products: 240 },
    { month: 'Jun', earnings: 64200, products: 218 },
  ];

  // Quarterly data for bar chart
  const quarterlyData = [
    { quarter: 'Q1 2024', earnings: 162000 },
    { quarter: 'Q2 2024', earnings: 193200 },
    { quarter: 'Q3 2024', earnings: 178500 },
    { quarter: 'Q4 2023', earnings: 164300 },
  ];

  // Top products data
  const topProducts = [
    { name: 'Product A', sales: 45200, quantity: 320, color: '#3b82f6' },
    { name: 'Product B', sales: 38900, quantity: 280, color: '#8b5cf6' },
    { name: 'Product C', sales: 32400, quantity: 245, color: '#ec4899' },
    { name: 'Product D', sales: 28700, quantity: 210, color: '#10b981' },
    { name: 'Product E', sales: 24100, quantity: 193, color: '#f59e0b' },
  ];

  // Weekly data
  const weeklyData = [
    { day: 'Mon', earnings: 2400 },
    { day: 'Tue', earnings: 2800 },
    { day: 'Wed', earnings: 3200 },
    { day: 'Thu', earnings: 2900 },
    { day: 'Fri', earnings: 3850 },
    { day: 'Sat', earnings: 2100 },
    { day: 'Sun', earnings: 1500 },
  ];

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          {subtitle && <p className="text-gray-400 text-xs mt-2">{subtitle}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sales Dashboard</h1>
          <p className="text-gray-600">Track your business performance and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={formatCurrency(dashboardData.totalEarnings)}
            subtitle="All time revenue"
            icon="💰"
            color="border-blue-500"
          />
          <StatCard
            title="Today's Earnings"
            value={formatCurrency(dashboardData.todayEarnings)}
            subtitle={`${dashboardData.todayProductsSold} products sold`}
            icon="📈"
            color="border-green-500"
          />
          <StatCard
            title="Weekly Earnings"
            value={formatCurrency(dashboardData.weeklyEarnings)}
            subtitle="Last 7 days"
            icon="📊"
            color="border-purple-500"
          />
          <StatCard
            title="Products Sold"
            value={dashboardData.totalProductsSold.toLocaleString()}
            subtitle="Total units"
            icon="📦"
            color="border-orange-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Monthly Earnings"
            value={formatCurrency(dashboardData.monthlyEarnings)}
            subtitle="Current month"
            icon="📅"
            color="border-indigo-500"
          />
          <StatCard
            title="Quarterly Earnings"
            value={formatCurrency(dashboardData.quarterlyEarnings)}
            subtitle="Last 3 months"
            icon="📑"
            color="border-pink-500"
          />
          <StatCard
            title="Yearly Earnings"
            value={formatCurrency(dashboardData.yearlyEarnings)}
            subtitle="Last 12 months"
            icon="🎯"
            color="border-teal-500"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Earnings Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Earnings Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Earnings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quarterly Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quarterly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="quarter" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="earnings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Product</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Sales</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Quantity</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">{product.name}</td>
                    <td className="py-4 px-4 text-gray-700">{formatCurrency(product.sales)}</td>
                    <td className="py-4 px-4 text-gray-700">{product.quantity} units</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(product.sales / topProducts[0].sales) * 100}%`,
                              backgroundColor: product.color 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {((product.sales / topProducts[0].sales) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}