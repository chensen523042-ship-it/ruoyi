<template>
  <div class="app-container dashboard">
    <!-- 核心指标卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="stat-card stat-card-primary" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">今日销售额</div>
              <div class="stat-value">¥{{ formatNumber(stats.todaySales) }}</div>
              <div class="stat-change" :class="stats.todaySalesChange >= 0 ? 'positive' : 'negative'">
                <el-icon v-if="stats.todaySalesChange >= 0"><ArrowUp /></el-icon>
                <el-icon v-else><ArrowDown /></el-icon>
                {{ Math.abs(stats.todaySalesChange) }}% 较昨日
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="stat-card stat-card-success" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">今日订单数</div>
              <div class="stat-value">{{ stats.todayOrders }}</div>
              <div class="stat-change" :class="stats.todayOrdersChange >= 0 ? 'positive' : 'negative'">
                <el-icon v-if="stats.todayOrdersChange >= 0"><ArrowUp /></el-icon>
                <el-icon v-else><ArrowDown /></el-icon>
                {{ Math.abs(stats.todayOrdersChange) }}% 较昨日
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="stat-card stat-card-warning" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待处理订单</div>
              <div class="stat-value">{{ stats.pendingOrders }}</div>
              <div class="stat-change">
                <el-tag type="warning" size="small">需及时处理</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card class="stat-card stat-card-danger" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><WarnTriangleFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">库存预警</div>
              <div class="stat-value">{{ stats.inventoryAlerts }}</div>
              <div class="stat-change">
                <el-tag type="danger" size="small">库存不足</el-tag>
              </div>
            </div>
          </div>
        </el-card>
          </el-col>
        </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 销售趋势图 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="salesPeriod" size="small" @change="loadSalesTrend">
                <el-radio-button label="7">近7天</el-radio-button>
                <el-radio-button label="30">近30天</el-radio-button>
                <el-radio-button label="90">近90天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesTrendChart" style="height: 350px;"></div>
        </el-card>
          </el-col>
      
      <!-- 平台分布 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card shadow="hover">
          <template #header>
            <span>平台分布</span>
          </template>
          <div ref="platformChart" style="height: 350px;"></div>
        </el-card>
          </el-col>
        </el-row>

    <!-- 订单状态和待处理事项 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 订单状态统计 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>订单状态分布</span>
          </template>
          <div ref="orderStatusChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      
      <!-- 待处理事项 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <span>待处理事项</span>
          </template>
          <el-table :data="pendingTasks" style="width: 100%" height="300">
            <el-table-column prop="type" label="类型" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.tagType" size="small">{{ scope.row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="count" label="数量" width="80" align="center">
              <template #default="scope">
                <el-tag type="danger" size="small">{{ scope.row.count }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="scope">
                <el-button type="primary" link size="small" @click="handleTask(scope.row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新订单和库存预警 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 最新订单 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新订单</span>
              <el-button type="primary" link size="small" @click="goToOrders">查看更多</el-button>
            </div>
          </template>
          <el-table :data="latestOrders" style="width: 100%" height="300">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="platform" label="平台" width="100">
              <template #default="scope">
                <el-tag size="small">{{ scope.row.platform }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="100" align="right">
              <template #default="scope">
                <span style="color: #409EFF;">¥{{ formatNumber(scope.row.amount) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getOrderStatusType(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" />
          </el-table>
        </el-card>
      </el-col>
      
      <!-- 库存预警 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>库存预警</span>
              <el-button type="primary" link size="small" @click="goToInventory">查看更多</el-button>
            </div>
          </template>
          <el-table :data="inventoryAlerts" style="width: 100%" height="300">
            <el-table-column prop="sku" label="SKU" width="150" />
            <el-table-column prop="productName" label="商品名称" show-overflow-tooltip />
            <el-table-column prop="currentStock" label="当前库存" width="100" align="center">
              <template #default="scope">
                <el-tag type="danger" size="small">{{ scope.row.currentStock }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="minStock" label="最低库存" width="100" align="center" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="scope">
                <el-button type="primary" link size="small" @click="handleInventory(scope.row)">补货</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Dashboard">
import { getDashboardStats, getSalesTrend, getPlatformDistribution, getOrderStatusStats, getPendingTasks, getLatestOrders, getInventoryAlerts } from '@/api/dashboard'
import * as echarts from 'echarts'
import { Wallet, ShoppingCart, Clock, WarnTriangleFilled, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// 统计数据
const stats = ref({
  todaySales: 0,
  todaySalesChange: 0,
  todayOrders: 0,
  todayOrdersChange: 0,
  pendingOrders: 0,
  inventoryAlerts: 0
})

// 图表实例
const salesTrendChart = ref(null)
const platformChart = ref(null)
const orderStatusChart = ref(null)

// 销售趋势周期
const salesPeriod = ref('7')

// 待处理事项
const pendingTasks = ref([])

// 最新订单
const latestOrders = ref([])

// 库存预警
const inventoryAlerts = ref([])

// 图表实例变量
let salesTrendInstance = null
let platformInstance = null
let orderStatusInstance = null

// 格式化数字
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toLocaleString()
}

// 获取订单状态类型
function getOrderStatusType(status) {
  const statusMap = {
    '待付款': 'warning',
    '待发货': 'info',
    '已发货': 'primary',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

// 加载统计数据
function loadStats() {
  getDashboardStats().then(response => {
    if (response.code === 200) {
      stats.value = response.data
    } else {
      // 使用模拟数据
      stats.value = {
        todaySales: 128650,
        todaySalesChange: 12.5,
        todayOrders: 856,
        todayOrdersChange: 8.3,
        pendingOrders: 156,
        inventoryAlerts: 23
      }
    }
  }).catch(() => {
    // 使用模拟数据
    stats.value = {
      todaySales: 128650,
      todaySalesChange: 12.5,
      todayOrders: 856,
      todayOrdersChange: 8.3,
      pendingOrders: 156,
      inventoryAlerts: 23
    }
  })
}

// 加载销售趋势
function loadSalesTrend() {
  getSalesTrend({ period: salesPeriod.value }).then(response => {
    if (response.code === 200) {
      initSalesTrendChart(response.data)
    } else {
      // 使用模拟数据
      initSalesTrendChart(getMockSalesTrendData())
    }
  }).catch(() => {
    initSalesTrendChart(getMockSalesTrendData())
  })
}

// 初始化销售趋势图
function initSalesTrendChart(data) {
  if (!salesTrendChart.value) return
  
  if (salesTrendInstance) {
    salesTrendInstance.dispose()
  }
  
  salesTrendInstance = echarts.init(salesTrendChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['销售额', '订单数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.dates || []
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额(元)',
        position: 'left'
      },
      {
        type: 'value',
        name: '订单数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: data.sales || [],
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ]
          }
        }
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: data.orders || [],
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  
  salesTrendInstance.setOption(option)
  
  window.addEventListener('resize', () => {
    salesTrendInstance?.resize()
  })
}

// 加载平台分布
function loadPlatformDistribution() {
  getPlatformDistribution().then(response => {
    if (response.code === 200) {
      initPlatformChart(response.data)
    } else {
      initPlatformChart(getMockPlatformData())
    }
  }).catch(() => {
    initPlatformChart(getMockPlatformData())
  })
}

// 初始化平台分布图
function initPlatformChart(data) {
  if (!platformChart.value) return
  
  if (platformInstance) {
    platformInstance.dispose()
  }
  
  platformInstance = echarts.init(platformChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '平台分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: data || []
      }
    ]
  }
  
  platformInstance.setOption(option)
  
  window.addEventListener('resize', () => {
    platformInstance?.resize()
  })
}

// 加载订单状态统计
function loadOrderStatusStats() {
  getOrderStatusStats().then(response => {
    if (response.code === 200) {
      initOrderStatusChart(response.data)
    } else {
      initOrderStatusChart(getMockOrderStatusData())
    }
  }).catch(() => {
    initOrderStatusChart(getMockOrderStatusData())
  })
}

// 初始化订单状态图
function initOrderStatusChart(data) {
  if (!orderStatusChart.value) return
  
  if (orderStatusInstance) {
    orderStatusInstance.dispose()
  }
  
  orderStatusInstance = echarts.init(orderStatusChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: '60%',
        center: ['50%', '45%'],
        data: data || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  orderStatusInstance.setOption(option)
  
  window.addEventListener('resize', () => {
    orderStatusInstance?.resize()
  })
}

// 加载待处理事项
function loadPendingTasks() {
  getPendingTasks().then(response => {
    if (response.code === 200) {
      pendingTasks.value = response.data
    } else {
      pendingTasks.value = getMockPendingTasks()
    }
  }).catch(() => {
    pendingTasks.value = getMockPendingTasks()
  })
}

// 加载最新订单
function loadLatestOrders() {
  getLatestOrders({ pageSize: 10 }).then(response => {
    if (response.code === 200) {
      latestOrders.value = response.data
    } else {
      latestOrders.value = getMockLatestOrders()
    }
  }).catch(() => {
    latestOrders.value = getMockLatestOrders()
  })
}

// 加载库存预警
function loadInventoryAlerts() {
  getInventoryAlerts({ pageSize: 10 }).then(response => {
    if (response.code === 200) {
      inventoryAlerts.value = response.data
    } else {
      inventoryAlerts.value = getMockInventoryAlerts()
    }
  }).catch(() => {
    inventoryAlerts.value = getMockInventoryAlerts()
  })
}

// 处理任务
function handleTask(task) {
  proxy.$modal.msgSuccess(`正在处理：${task.content}`)
}

// 处理库存
function handleInventory(item) {
  proxy.$modal.msgSuccess(`正在为 ${item.productName} 补货`)
}

// 跳转到订单页面
function goToOrders() {
  proxy.$router.push('/system/order')
}

// 跳转到库存页面
function goToInventory() {
  proxy.$router.push('/system/inventory')
}

// 模拟数据函数
function getMockSalesTrendData() {
  const dates = []
  const sales = []
  const orders = []
  const days = parseInt(salesPeriod.value)
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
    sales.push(Math.floor(Math.random() * 50000) + 80000)
    orders.push(Math.floor(Math.random() * 200) + 600)
  }
  
  return { dates, sales, orders }
}

function getMockPlatformData() {
  return [
    { value: 450000, name: '亚马逊' },
    { value: 320000, name: 'eBay' },
    { value: 280000, name: 'Shopify' },
    { value: 180000, name: 'Wish' },
    { value: 56000, name: '其他' }
  ]
}

function getMockOrderStatusData() {
  return [
    { value: 156, name: '待付款' },
    { value: 234, name: '待发货' },
    { value: 135, name: '已发货' },
    { value: 1286, name: '已完成' },
    { value: 45, name: '已取消' }
  ]
}

function getMockPendingTasks() {
  return [
    { type: '待付款', content: '待付款订单', count: 156, tagType: 'warning' },
    { type: '待发货', content: '待发货订单', count: 234, tagType: 'info' },
    { type: '退款', content: '退款申请', count: 23, tagType: 'danger' },
    { type: '库存', content: '库存预警商品', count: 45, tagType: 'warning' }
  ]
}

function getMockLatestOrders() {
  const orders = []
  const platforms = ['亚马逊', 'eBay', 'Shopify', 'Wish']
  const statuses = ['待付款', '待发货', '已发货', '已完成']
  
  for (let i = 0; i < 10; i++) {
    orders.push({
      orderNo: 'ORD' + Date.now() + i,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      amount: Math.floor(Math.random() * 5000) + 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString('zh-CN')
    })
  }
  
  return orders
}

function getMockInventoryAlerts() {
  const alerts = []
  const products = ['蓝牙耳机', '手机壳', '数据线', '充电器', '移动电源', '手机支架', '车载支架', '保护膜']
  
  for (let i = 0; i < 10; i++) {
    alerts.push({
      sku: 'SKU' + (1000 + i),
      productName: products[Math.floor(Math.random() * products.length)],
      currentStock: Math.floor(Math.random() * 20),
      minStock: 30
    })
  }
  
  return alerts
}

// 初始化
onMounted(() => {
  loadStats()
  loadSalesTrend()
  loadPlatformDistribution()
  loadOrderStatusStats()
  loadPendingTasks()
  loadLatestOrders()
  loadInventoryAlerts()
})

// 清理
onUnmounted(() => {
  if (salesTrendInstance) {
    salesTrendInstance.dispose()
  }
  if (platformInstance) {
    platformInstance.dispose()
  }
  if (orderStatusInstance) {
    orderStatusInstance.dispose()
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
  
  .stats-row {
    margin-bottom: 20px;
    
    .stat-card {
      border-radius: 8px;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      .stat-content {
        display: flex;
        align-items: center;
        
        .stat-icon {
          margin-right: 20px;
          
          .el-icon {
            color: #409EFF;
          }
        }
        
        .stat-info {
          flex: 1;
          
          .stat-label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 8px;
          }
          
          .stat-change {
            font-size: 12px;
            display: flex;
            align-items: center;
            
            .el-icon {
              margin-right: 4px;
            }
            
            &.positive {
              color: #67C23A;
            }
            
            &.negative {
              color: #F56C6C;
            }
          }
        }
      }
      
      &.stat-card-primary {
        .stat-icon .el-icon {
          color: #409EFF;
        }
      }
      
      &.stat-card-success {
        .stat-icon .el-icon {
          color: #67C23A;
        }
      }
      
      &.stat-card-warning {
        .stat-icon .el-icon {
          color: #E6A23C;
        }
      }
      
      &.stat-card-danger {
        .stat-icon .el-icon {
          color: #F56C6C;
        }
      }
    }
  }
  
  .charts-row {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
