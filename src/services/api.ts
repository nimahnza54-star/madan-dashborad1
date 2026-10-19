import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

export interface Material {
  name: string
  percent: number
  color: string
  colorClass: string
}

export interface Statistics {
  capacityUtilization: {
    value: string
    trend: string
    trendLabel: string
  }
  avgWeightPerService: {
    value: string
    unit: string
    trend: string
    trendLabel: string
  }
  totalServices: {
    value: string
    unit: string
    trend: string
    trendLabel: string
  }
  totalWeightTransported: {
    value: string
    unit: string
    trend: string
    trendLabel: string
  }
}

export interface LineChartData {
  dates: string[]
  weights: number[]
}

export interface ProgressBar {
  value: number
  percent: number
  color: string
  vehicle: string
}

export interface CapacityBar {
  label: string
  percent: number
  color: string
}

export interface HeatmapColors {
  light: Record<string, string>
  dark: Record<string, string>
}

export interface HeatmapData {
  timeHeaders: string[]
  days: string[]
  data: string[][]
  colors: HeatmapColors
}

export interface StackedBarDataset {
  label: string
  data: number[]
  backgroundColor: string
}

export interface StackedBarData {
  days: string[]
  datasets: StackedBarDataset[]
}

class ApiClient {
  private client: AxiosInstance
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => config,
      (error: AxiosError) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response) {
          const message = `API Error: ${error.response.status} ${error.response.statusText}`
          console.error(message, error.response.data)
          return Promise.reject(new Error(message))
        } else if (error.request) {
          console.error('Network Error: No response received', error.request)
          return Promise.reject(new Error('Network Error: Unable to reach the server'))
        } else {
          console.error('Request Error:', error.message)
          return Promise.reject(error)
        }
      }
    )
  }

  async getStatistics(): Promise<Statistics> {
    return this.client.get('/api/statistics')
  }

  async getMaterials(): Promise<Material[]> {
    return this.client.get('/api/materials')
  }

  async getLineChart(): Promise<LineChartData> {
    return this.client.get('/api/lineChart')
  }

  async getProgressBars(): Promise<ProgressBar[]> {
    return this.client.get('/api/progressBars')
  }

  async getCapacityBars(): Promise<CapacityBar[]> {
    return this.client.get('/api/capacityBars')
  }

  async getHeatmap(): Promise<HeatmapData> {
    return this.client.get('/api/heatmap')
  }

  async getStackedBar(): Promise<StackedBarData> {
    return this.client.get('/api/stackedBar')
  }
}

export const api = new ApiClient()
export default api