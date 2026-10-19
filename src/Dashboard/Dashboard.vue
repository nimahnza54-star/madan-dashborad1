<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  Menu,
  Circle,
  Diamond,
  ArrowLeftRight,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-vue-next'
import { Doughnut, Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
  type ChartData,
  type ChartOptions
} from 'chart.js'
import { useTheme } from '@/composables/useTheme'

ChartJS.register(ArcElement, Tooltip, LineElement, PointElement, LinearScale, CategoryScale, BarElement)

const { theme, toggleTheme, isDark } = useTheme()

interface Material {
  name: string
  percent: number
  color: string
  colorClass: string
}

const materials: Material[] = [
  { name: 'سنگ آهن', percent: 42, color: '#22c55e', colorClass: 'bg-green-500' },
  { name: 'زغال سنگ', percent: 28, color: '#3b82f6', colorClass: 'bg-blue-500' },
  { name: 'گندله آهن', percent: 18, color: '#f59e0b', colorClass: 'bg-amber-500' },
  { name: 'سنگ آهک', percent: 12, color: '#a855f7', colorClass: 'bg-purple-500' }
]

// 42% of the total equals 12.8 thousand tons => total ≈ 30.476190 thousand tons
const TOTAL_THOUSAND_TONS = 12.8 / 0.42
const SELECTION_DURATION_MS = 8000
const SELECTED_SLICE_OFFSET = 34

const selectedIndex = ref<number | null>(null)
let selectionTimer: ReturnType<typeof setTimeout> | null = null

function formatTons(percent: number): string {
  return (TOTAL_THOUSAND_TONS * (percent / 100)).toFixed(2)
}

function selectMaterial(index: number): void {
  if (selectionTimer !== null) {
    clearTimeout(selectionTimer)
  }
  selectedIndex.value = index
  selectionTimer = setTimeout(() => {
    selectedIndex.value = null
    selectionTimer = null
  }, SELECTION_DURATION_MS)
}

function clearSelection(): void {
  if (selectionTimer !== null) {
    clearTimeout(selectionTimer)
    selectionTimer = null
  }
  selectedIndex.value = null
}

onBeforeUnmount(clearSelection)

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: materials.map((material) => material.name),
  datasets: [
    {
      data: materials.map((material) => material.percent),
      backgroundColor: materials.map((material) => material.color),
      borderColor: materials.map((material) => material.color),
      borderWidth: 0,
      hoverOffset: 0,
      offset: materials.map((_, index) =>
        selectedIndex.value === index ? SELECTED_SLICE_OFFSET : 0
      )
    }
  ]
}))

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  animation: {
    duration: 600,
    easing: 'easeOutQuart',
    animateRotate: true,
    animateScale: false
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  onHover: (event, elements) => {
    const target = event.native?.target as HTMLElement | null
    if (target) {
      target.style.cursor = elements.length > 0 ? 'pointer' : 'default'
    }
  },
  onClick: (_event, elements) => {
    const element = elements[0]
    if (element) {
      selectMaterial(element.index)
    }
  }
}))

const dates = ['1 مهر', '2 مهر', '3 مهر', '4 مهر', '5 مهر', '6 مهر', '7 مهر']
const weights = [1800, 2400, 1900, 1300, 2400, 1900, 2800, 2000, 3000, 2100, 3000, 3200, 2900, 3200]

const progressBars = [
  { value: 92, percent: 92, color: '#0f9f8f', vehicle: 'TR-08' },
  { value: 80, percent: 80, color: '#0f9f8f', vehicle: 'TR-12' },
  { value: 72, percent: 72, color: '#14b8a6', vehicle: 'TR-03' },
  { value: 60, percent: 60, color: '#3b82f6', vehicle: 'TR-15' },
  { value: 40, percent: 40, color: '#3b82f6', vehicle: 'TR-02' },
  { value: 36, percent: 36, color: '#3b82f6', vehicle: 'TR-11' }
]

const capacityBars = [
  { label: 'ناوگان', percent: 86, color: '#a855f7' },
  { label: 'TR-03', percent: 78, color: '#f59e0b' },
  { label: 'TR-12', percent: 86, color: '#3b82f6' },
  { label: 'TR-06', percent: 92, color: '#0f9f8f' }
]

const heatmapColors = computed<Record<'W' | 'X' | 'Y' | 'Z', string>>(() => {
  const isDarkMode = theme.value === 'dark'
  if (isDarkMode) {
    return {
      W: '#14532d',
      X: '#166534',
      Y: '#15803d',
      Z: '#166534'
    }
  }
  return {
    W: '#dcfce7',
    X: '#86efac',
    Y: '#14b8a6',
    Z: '#166534'
  }
})

const heatmapTimeHeaders = ['00-03', '03-06', '06-09', '09-12', '12-15', '15-18', '18-21', '21-24']

const heatmapDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

const heatmapData = [
  ['W', 'W', 'X', 'Y', 'Z', 'Y', 'X', 'W'],     // شنبه
  ['W', 'X', 'Y', 'Z', 'Z', 'Y', 'X', 'W'],     // یکشنبه
  ['W', 'X', 'Y', 'Z', 'Y', 'Y', 'X', 'W'],     // دوشنبه
  ['W', 'W', 'X', 'Y', 'Z', 'Z', 'Y', 'X'],     // سه شنبه
  ['W', 'W', 'X', 'Y', 'Z', 'Y', 'X', 'W'],     // چهارشنبه
  ['W', 'W', 'X', 'X', 'Y', 'Y', 'X', 'W'],     // پنجشنبه
  ['W', 'W', 'X', 'Y', 'Z', 'Y', 'X', 'W']      // جمعه
]

const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

const stackedBarData = computed<ChartData<'bar'>>(() => ({
  labels: days,
  datasets: [
    {
      label: 'زغال سنگ',
      data: [100, 100, 70, 80, 60, 90, 80],
      backgroundColor: '#0f9f8f',
      borderRadius: { topLeft: 4, topRight: 4 },
      borderSkipped: false
    },
    {
      label: 'سنگ آهن',
      data: [60, 25, 40, 45, 60, 50, 60],
      backgroundColor: '#3b82f6',
      borderRadius: 0,
      borderSkipped: false
    },
    {
      label: 'سنگ آهک',
      data: [40, 25, 40, 45, 30, 40, 30],
      backgroundColor: '#f59e0b',
      borderRadius: { topLeft: 4, topRight: 4 },
      borderSkipped: false
    }
  ]
}))

const stackedBarOptions = computed<ChartOptions<'bar'>>(() => {
  const isDarkMode = theme.value === 'dark'
  const gridColor = isDarkMode ? '#1e293b' : '#f3f4f6'
  const borderColor = isDarkMode ? '#334155' : '#e5e7eb'
  const tickColor = isDarkMode ? '#94a3b8' : '#6b7280'
  const tooltipBg = isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: tooltipBg,
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} سرویس`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: tickColor, font: { size: 11 }, padding: 8 },
        border: { display: true, color: borderColor }
      },
      y: {
        stacked: true,
        min: 0,
        max: 300,
        grid: { color: gridColor },
        ticks: {
          stepSize: 100,
          callback: (value) => value.toString(),
          color: tickColor,
          font: { size: 11 },
          padding: 8
        },
        border: { display: true, color: borderColor }
      }
    }
  }
})

const lineChartData = computed<ChartData<'line'>>(() => {
  const seriesOffset = 0.15
  const data = weights.map((weight, i) => ({
    x: i / 2 - seriesOffset,
    y: weight
  }))
  return {
    datasets: [
      {
        data,
        borderColor: '#0f9f8f',
        backgroundColor: '#0f9f8f',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0f9f8f',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        fill: false,
        tension: 0,
        spanGaps: true
      }
    ]
  }
})

const lineChartOptions = computed<ChartOptions<'line'>>(() => {
  const isDarkMode = theme.value === 'dark'
  const gridColor = isDarkMode ? '#1e293b' : '#f3f4f6'
  const borderColor = isDarkMode ? '#334155' : '#e5e7eb'
  const tickColor = isDarkMode ? '#94a3b8' : '#6b7280'
  const tooltipBg = isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 20
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: tooltipBg,
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: (context) => {
            if (!context || !context[0]) return ''
            const tooltipItem = context[0]
            const dataIndex = tooltipItem.dataIndex
            if (dataIndex === undefined || dataIndex === null) return ''
            const dateIndex = Math.floor(dataIndex / 2)
            const pointInDate = dataIndex % 2 === 0 ? 'نقطه اول' : 'نقطه دوم'
            return `${dates[dateIndex] ?? ''} - ${pointInDate}`
          },
          label: (context) => `${context?.parsed?.y ?? ''} تن`
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: -0.25,
        max: 6.75,
        offset: true,
        grid: {
          display: false
        },
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const numValue = typeof value === 'number' ? value : Number(value)
            const dateIndex = Math.round(numValue)
            if (Number.isInteger(dateIndex) && dateIndex >= 0 && dateIndex < dates.length) {
              return dates[dateIndex]
            }
            return ''
          },
          color: tickColor,
          font: { size: 11, weight: 'bold' },
          padding: 12,
          z: 1
        },
        border: {
          display: true,
          color: borderColor
        }
      },
      y: {
        type: 'linear',
        min: 0,
        max: 4000,
        grid: {
          color: gridColor
        },
        ticks: {
          stepSize: 1000,
          callback: (value) => value.toLocaleString(),
          color: tickColor,
          font: { size: 11 },
          padding: 8
        },
        border: {
          display: true,
          color: borderColor
        }
      }
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-primary">
    <header class=" relative bg-secondary border-b border-primary shadow-sm transition-colors duration-300">
      <nav class=" mx-auto h-17 flex max-w-7xl items-center justify-between gap-4 py-3 sm:px-6 lg:px-8 w-full">
        <!-- Theme Toggle - Upper Left -->
        <button
          @click="toggleTheme"
          class="absolute left-8 top-5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:bg-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          :aria-label="theme === 'light' ? 'تغییر به حالت تاریک' : 'تغییر به حالت روشن'"
          :title="theme === 'light' ? 'حالت تاریک' : 'حالت روشن'"
        >
          <Sun v-if="theme === 'light'" class="h-5 w-5 text-primary" aria-hidden="true" />
          <Moon v-else class="h-5 w-5 text-primary" aria-hidden="true" />
        </button>

        <!-- Menu Icon - Upper Right -->
        <Menu class="absolute right-8 top-5 w-8 h-8 text-muted" />
      </nav>
    </header>

    <main class="flex-1 bg-primary" dir="rtl">
      <div class="w-full px-4 py-6 sm:px-6 lg:px-10">
        <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" dir="rtl">
          <!-- Card 1 -->
          <div class="flex h-full min-w-0 w-full flex-col justify-between gap-3 rounded-xl border border-primary bg-card p-5 shadow-sm-custom transition-colors duration-300">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500">
                <Circle class="h-4 w-4 text-white" />
              </div>
              <div class="min-w-0 w-full sm:w-[70%] mr-30  sm:mr-[60px] lg:mr-[120px]">
                <p class="text-sm text-muted">بهره برداری از ظرفیت</p>
                <div class="mt-1 flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-primary">86%</span>
                  <span class="text-sm text-muted">میانگین</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-muted">
              <span class="font-medium text-amber-500 dark:text-amber-400">1/34</span> نسبت به دوره قبل
            </p>
          </div>

          <!-- Card 2 -->
          <div class="flex h-full min-w-0 w-full flex-col justify-between gap-3 rounded-xl border border-primary bg-card p-5 shadow-sm-custom transition-colors duration-300">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-600">
                <Diamond class="h-4 w-4 text-white" />
              </div>
              <div class="min-w-0 w-full sm:w-[70%] mr-30  sm:mr-[60px] lg:mr-[120px]">
                <p class="text-sm text-muted">میانگین وزن هر سرویس</p>
                <div class="mt-1 flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-primary">9/98</span>
                  <span class="text-sm text-muted">تن</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-muted">
              <span class="font-medium text-green-600 dark:text-green-400">افزایش 2/11</span> نسبت به دوره قبل
            </p>
          </div>

          <!-- Card 3 -->
          <div class="flex h-full min-w-0 w-full flex-col justify-between gap-3 rounded-xl border border-primary bg-card p-5 shadow-sm-custom transition-colors duration-300">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                <ArrowLeftRight class="h-4 w-4 text-white" />
              </div>
              <div class="min-w-0 w-full sm:w-[70%] mr-30  sm:mr-[60px] lg:mr-[120px]">
                <p class="text-sm text-muted">تعداد سرویس حمل</p>
                <div class="mt-1 flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-primary">1286</span>
                  <span class="text-sm text-muted">سرویس</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-muted">
              <span class="font-medium text-green-600 dark:text-green-400">افزایش 5/24</span> نسبت به دوره قبل
            </p>
          </div>

          <!-- Card 4 -->
          <div class="flex h-full min-w-0 w-full flex-col justify-between gap-3 rounded-xl border border-primary bg-card p-5 shadow-sm-custom transition-colors duration-300">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-600">
                <ArrowUpRight class="h-4 w-4 text-white" />
              </div>
              <div class="min-w-0 w-full sm:w-[70%] mr-30  sm:mr-[60px] lg:mr-[120px]">
                <p class="text-sm text-muted">مجموع بار حمل شده</p>
                <div class="mt-1 flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-primary">12840</span>
                  <span class="text-sm text-muted">تن</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-muted">
              <span class="font-medium text-green-600 dark:text-green-400">افزایش 8/24</span> نسبت به دوره قبل
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-5 px-4 sm:px-6 lg:px-10 w-full overflow-x-hidden">
        <div class="border border-primary bg-card w-full lg:max-w-[680px] h-80 max-md:h-auto mt-4 rounded-xl transition-colors duration-300">
          <h3 class="mt-3 mr-3 text-base font-bold text-primary">ترکیب نوع بار</h3>
          <p class="mt-1 mr-3 text-xs text-muted">سهم هر ماده از کل بار حمل شده</p>

          <div class="mt-6 flex flex-col gap-4 px-4 pb-4 md:flex-row md:items-center md:gap-5">
            <!-- Material breakdown list (right side in RTL) -->
            <div class="flex min-w-0 flex-1 flex-col gap-1.5">
              <button
                v-for="(material, index) in materials"
                :key="material.name"
                type="button"
                class="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-right transition-colors duration-200 hover:bg-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                :class="{ 'bg-tertiary': selectedIndex === index }"
                :aria-pressed="selectedIndex === index"
                @click="selectMaterial(index)"
              >
                <span class="flex min-w-0 flex-1 items-center gap-2">
                  <span class="flex-shrink-0 text-sm font-semibold text-primary tabular-nums" dir="ltr">{{ material.percent }}%</span>
                  <span class="truncate text-sm text-secondary">{{ material.name }}</span>
                </span>
                <span class="flex flex-shrink-0 items-center gap-2">
                  <span
                    class="overflow-hidden whitespace-nowrap text-[11px] text-muted transition-all duration-300"
                    :class="selectedIndex === index ? 'max-w-[100px] opacity-100' : 'max-w-0 opacity-0'"
                  >{{ formatTons(material.percent) }} هزار تن</span>
                  <span class="h-5 w-5 rounded-sm" :class="material.colorClass"></span>
                </span>
              </button>
            </div>

            <!-- Donut chart (left side in RTL) -->
            <div class="relative h-44 w-44 flex-shrink-0 self-center md:self-auto lg:h-48 lg:w-48">
              <Doughnut :data="chartData" :options="chartOptions" :key="theme" />
            </div>
          </div>
        </div>


        <div class="border border-primary bg-card w-full lg:max-w-[1128px] h-80 mt-4 rounded-xl transition-colors duration-300">
          <h3 class="mt-3 mr-3 font-bold text-primary">روند مجموع بار حمل شده</h3>
          <p class="mt-1 mr-3 text-xs text-muted">وزن بار بر حسب تن در طول زمان</p>
          <div class="mt-2 h-[calc(100%-70px)] w-full">
            <Line :data="lineChartData" :options="lineChartOptions" :key="theme" />
          </div>
        </div>

      </div>

<div class="flex flex-col lg:flex-row gap-5 mt-1 px-4 sm:px-6 lg:px-10 w-full overflow-x-hidden">
        
          <div class="border border-primary bg-card w-full lg:max-w-[980px] h-80 mt-4 rounded-xl transition-colors duration-300">
            <h3 class="mt-3 mr-3 font-bold text-primary">سرویس به تفکیک ماشین</h3>
            <p class="mt-1 mr-3 text-xs text-muted">مقایسه تعداد سرویس در بازه انتخاب شده</p>
<div class="mt-10 mr-3 ml-3 flex flex-col justify-between gap-3">
              <div class="flex items-center gap-3" v-for="(bar, index) in progressBars" :key="index">
                <span class="text-sm font-semibold text-primary w-12 text-right">{{ bar.value }}</span>
                <div class="flex-1 h-2.5 bg-tertiary rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: bar.percent + '%', backgroundColor: bar.color }"></div>
                </div>
                <span class="text-sm text-muted whitespace-nowrap shrink-0">{{ bar.vehicle }}</span>
              </div>
            </div>
          </div>


        <div class="border border-primary bg-card w-full lg:max-w-[830px] h-80 mt-4 rounded-xl transition-colors duration-300">
          <h3 class="mt-4 mr-4 font-bold text-primary">تعداد سرویس حمل</h3>
          <p class="mt-1 mr-4 text-xs text-muted">تفکیک روزانه بر اساس نوع بار</p>
          <div class="mt-3 mr-4 ml-4 flex flex-wrap gap-4 justify-end text-sm">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-sm bg-amber-500"></span>
              <span class="text-secondary">سنگ آهک</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-sm bg-blue-500"></span>
              <span class="text-secondary">سنگ آهن</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-sm" style="background-color: #0f9f8f;"></span>
              <span class="text-secondary">زغال سنگ</span>
            </div>
          </div>
          <div class="mt-2 h-[calc(100%-120px)] w-full overflow-x-auto">
            <Bar :data="stackedBarData" :options="stackedBarOptions" :key="theme" />
          </div>
        </div>

   
 

      </div>

     
<div class="w-full px-4 sm:px-6 lg:px-10 overflow-x-hidden">
        <div class="border border-primary bg-card w-full lg:max-w-[1830px] h-70 mt-5 rounded-xl transition-colors duration-300">
          <h3 class="mt-3 mr-3 font-bold text-primary">نسبت وزن بار به ظرفیت تراک</h3>
          <p class="mt-1 mr-3 text-xs text-muted">میانگین نسبت وزن بارگیری به ظرفیت مجاز هر سرویس</p>
          <div class="mt-12 mr-3 ml-3 flex flex-col gap-4">
            <div class="flex items-center gap-3" v-for="(bar, index) in capacityBars" :key="index">
              <span class="text-sm text-secondary shrink-0">{{ bar.label }}</span>
              <div class="flex-1 h-2.5 bg-tertiary rounded-full overflow-hidden">
                <div class="h-full rounded-full" :style="{ width: bar.percent + '%', backgroundColor: bar.color }"></div>
              </div>
              <span class="text-sm font-semibold text-primary w-16 text-left">{{ bar.percent }}%</span>
            </div>
          </div>
        </div>
      </div>


      
<div class="w-full px-4 sm:px-6 lg:px-10 overflow-x-hidden">
        <div class="border border-primary bg-card w-full lg:max-w-[1830px] h-105 mt-5 rounded-xl transition-colors duration-300">
          <h3 class="mt-3 mr-3 font-bold text-primary">شدت بارگیری بر حسب ساعت و روز هفته</h3>
          <p class="mt-1 mr-3 text-xs text-muted">تراکم تعداد بارگیری ها برای شناسایی ساعات اوج</p>
          <p class="mt-1 mr-3 text-xs text-muted">30 روز گذشته</p>
          <div class="mt-3 mr-3 ml-3 overflow-x-auto">
            <table class="w-full min-w-max text-sm">
              <thead>
                <tr class="text-right">
                  <th class="p-2 font-medium text-muted">بازه زمانی</th>
                  <th class="p-2 font-medium text-muted" v-for="(header, i) in heatmapTimeHeaders" :key="i">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-right" v-for="(day, rowIndex) in heatmapDays" :key="rowIndex">
                  <td class="p-2 font-medium text-secondary whitespace-nowrap">{{ day }}</td>
                  <td class="p-1.5 mr-3 rounded-sm border border-primary/50" v-for="(cell, colIndex) in heatmapData[rowIndex]" :key="colIndex" :style="{ backgroundColor: heatmapColors[cell as keyof typeof heatmapColors] }"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>


   
 

     







    </main>
  </div>
</template>
