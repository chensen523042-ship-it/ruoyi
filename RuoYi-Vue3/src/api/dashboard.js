import request from '@/utils/request'

// 获取看板统计数据
export function getDashboardStats() {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

// 获取销售趋势数据
export function getSalesTrend(query) {
  return request({
    url: '/dashboard/sales/trend',
    method: 'get',
    params: query
  })
}

// 获取平台分布数据
export function getPlatformDistribution() {
  return request({
    url: '/dashboard/platform/distribution',
    method: 'get'
  })
}

// 获取订单状态统计
export function getOrderStatusStats() {
  return request({
    url: '/dashboard/order/status',
    method: 'get'
  })
}

// 获取待处理事项
export function getPendingTasks() {
  return request({
    url: '/dashboard/pending/tasks',
    method: 'get'
  })
}

// 获取最新订单列表
export function getLatestOrders(query) {
  return request({
    url: '/dashboard/orders/latest',
    method: 'get',
    params: query
  })
}

// 获取库存预警列表
export function getInventoryAlerts(query) {
  return request({
    url: '/dashboard/inventory/alerts',
    method: 'get',
    params: query
  })
}

