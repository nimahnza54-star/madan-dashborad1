import { ref, computed } from 'vue'
import materialsPools from '@/mock/materials-pools.json'
import statisticsPools from '@/mock/statistics-pools.json'
import progressBarsPools from '@/mock/progress-bars-pools.json'
import capacityBarsPools from '@/mock/capacity-bars-pools.json'
import lineChartPools from '@/mock/line-chart-pools.json'
import stackedBarPools from '@/mock/stacked-bar-pools.json'

interface MaterialPoolItem {
  name: string
  color: string
  colorClass: string
  unit: string
  quantityPool: number[]
}

interface SelectedMaterial {
  name: string
  quantity: number
  color: string
  colorClass: string
  unit: string
  percentage: number
}

export function useDashboardData() {
  const selectedMaterials = ref<SelectedMaterial[]>([])
  const selectedStatistics = ref<any>(null)
  const selectedProgressBars = ref<any[]>([])
  const selectedCapacityBars = ref<any[]>([])
  const selectedLineChart = ref<any>(null)
  const selectedStackedBar = ref<any>(null)

  function getRandomItem<T>(pool: T[]): T {
    const randomIndex = Math.floor(Math.random() * pool.length)
    return pool[randomIndex] as T
  }

  function getRandomQuantity(pool: number[]): number {
    const randomIndex = Math.floor(Math.random() * pool.length)
    return pool[randomIndex] as number
  }

  function initializeDashboardData(): void {
    const materialsPool = materialsPools.materials as MaterialPoolItem[]

    const selectedQuantities = materialsPool.map((material) => ({
      ...material,
      quantity: getRandomQuantity(material.quantityPool)
    }))

    const totalQuantity = selectedQuantities.reduce((sum, m) => sum + m.quantity, 0)

    selectedMaterials.value = selectedQuantities.map((material) => ({
      name: material.name,
      quantity: material.quantity,
      color: material.color,
      colorClass: material.colorClass,
      unit: material.unit,
      percentage: totalQuantity > 0 ? Math.round((material.quantity / totalQuantity) * 10000) / 100 : 0
    }))

    selectedStatistics.value = getRandomItem(statisticsPools.statisticsPool)
    selectedProgressBars.value = getRandomItem(progressBarsPools.progressBarsPool)
    selectedCapacityBars.value = getRandomItem(capacityBarsPools.capacityBarsPool)
    selectedLineChart.value = getRandomItem(lineChartPools.lineChartPool)
    selectedStackedBar.value = getRandomItem(stackedBarPools.stackedBarPool)
  }

  const totalQuantity = computed(() =>
    selectedMaterials.value.reduce((sum, m) => sum + m.quantity, 0)
  )

  const materialsWithPercentages = computed(() => {
    const total = totalQuantity.value
    return selectedMaterials.value.map((material) => ({
      ...material,
      percentage: total > 0 ? Math.round((material.quantity / total) * 10000) / 100 : 0
    }))
  })

  const chartData = computed(() => ({
    labels: materialsWithPercentages.value.map((m) => m.name),
    datasets: [
      {
        data: materialsWithPercentages.value.map((m) => m.percentage),
        backgroundColor: materialsWithPercentages.value.map((m) => m.color),
        borderColor: materialsWithPercentages.value.map((m) => m.color),
        borderWidth: 0,
        hoverOffset: 0
      }
    ]
  }))

  return {
    selectedMaterials,
    materialsWithPercentages,
    selectedStatistics,
    selectedProgressBars,
    selectedCapacityBars,
    selectedLineChart,
    selectedStackedBar,
    totalQuantity,
    chartData,
    initializeDashboardData
  }
}