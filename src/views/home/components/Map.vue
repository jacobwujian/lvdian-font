<template>
  <div
    :id="id"
    :class="className"
    :style="{ width, height }"
  />
</template>

<script>
import echarts from '@/plugins/echarts'
import resize from '@/mixins/resize'
import geoJson from '@/static/geojson/ZJ.json'

const AreaColors = new Map([
  ['杭州市', '#FFC862'],
  ['湖州市', '#FD8E80'],
  ['嘉兴市', '#FFAA64'],
  ['绍兴市', '#65B0FC'],
  ['宁波市', '#5890FF'],
  ['衢州市', '#5D9CFE'],
  ['金华市', '#78DDF6'],
  ['台州市', '#66E6C3'],
  ['丽水市', '#01C8D8'],
  ['温州市', '#95FFF5'],
  ['舟山市', '#41DCCF']
])

export default {
  name: 'IndexMap',
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'Map'
    },
    className: {
      type: String,
      default: 'map'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '410px'
    },
    chartData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return{
      chart: null,
      geoJson
    }
  },
  computed: {
    values() {
      let arr = []
      for (const [index, item] of this.chartData.entries()) {
        arr.push({
          ...item,
          label: {
            color: index < 5 ? '#fff' : 'rgba(0, 117, 94, .72)'
          },
          itemStyle: {
            areaColor: index < 5 ? AreaColors.get(item.name) : '#F1FFFD'
          },
          emphasis: {
            itemStyle: {
              areaColor: AreaColors.get(item.name)
            }
          }
        })
      }

      return arr
    },
    regions() {
      let arr = []

      for (const [key, value] of AreaColors) {
        arr.push({
          name: key,
          itemStyle: {
            areaColor: value
          }
        })
      }

      return arr
    }
  },
  watch: {
    chartData() {
      this.$nextTick(() => {
        this.chart.dispose()
        this.chart = null
        this.initChart()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      let that = this
      echarts.registerMap('ZJ', geoJson)
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        geo: {
          map: 'ZJ',
          top: 54,
          aspectScale: .85,
          zoom: 1.23,
          silent: true,
          regions: that.regions,
          itemStyle: {
            borderWidth: 0
          }
        }
      })

      const geo = this.chart.getModel().getComponent('geo').coordinateSystem

      const points = []
      for (const [index, item] of this.chartData.entries()) {
        const region = geo.getRegion(item.name)
        if (!region) return

        const len = this.chartData.length

        const minimumIdx = len > 4 ? 4 : len - 1
        const minimumVal = this.chartData[minimumIdx].value
        let symbolSize = 0
        if (index < 5) {
          symbolSize = ((item.value / minimumVal)>5?5:(item.value / minimumVal)).toFixed(1) * 10
        }

        points.push({
          name: item.name,
          value: region.center,
          symbolSize,
          symbolOffset: [5, -30],
          count: item.value
        })
      }

      this.chart.setOption({
        series: [
          {
            name: '绿色电力积分发行总量',
            type: 'map',
            map: 'ZJ',
            data: this.values,
            top: 54,
            aspectScale: .85,
            zoom: 1.23,
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 400,
              color: 'rgba(0, 117, 94, .72)'
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: '#73D0BE',
              areaColor: '#F1FFFD'
            },
            emphasis: {
              itemStyle: {
                areaColor: 'transparent'
              },
              label: {
                color: '#fff'
              }
            }
          }, {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            silent: true,
            rippleEffect: {
              brushType: 'fill',
              color: '#fff',
              scale: 4
            },
            itemStyle: {
              color: '#fff'
            },
            symbolSize: function(value, params) {
              const count = params.data && params.data.count
              if (!count || params.dataIndex > 4) return 0

              return 5
            },
            data: points
          }
        ]
      })
    }
  }
}
</script>
