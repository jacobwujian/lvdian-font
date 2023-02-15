import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'

areas.forEach((area) => {
  const matchCity = cities.filter(city => city.code === area.cityCode)[0]
  if (matchCity) {
    matchCity.children = matchCity.children || []
    matchCity.children.push({
      label: area.name,
      value: area.code
    })
  }
})

cities.forEach((city) => {
  const matchProvince = provinces.filter(province => province.code === city.provinceCode)[0]
  if (matchProvince) {
    matchProvince.children = matchProvince.children || []
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children
    })
  }
})

export const options = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children
}))

// 浙江范围
export const ZJoptions = provinces
  .filter(item => item.code === '33')
  .map(province => ({
    label: province.name,
    value: province.code,
    children: province.children
  }))

export const codeToText = (str) => {
  if (!str) return ''

  const code = str.split(',')
  const province = provinces.find(province => province.code === code[0])
  const city = cities.find(city => city.code === code[1])
  const area = areas.find(area => area.code === code[2])

  if (province && city && area) {
    return `${province.name} - ${city.name} - ${area.name}`
  }
}
