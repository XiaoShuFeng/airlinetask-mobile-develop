import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const matList = []
const count = 101

for (let i = 0; i < count; i++) {
  matList.push(Mock.mock({
    id: '@increment',
    vendor: '@string(8)',
    location: 'L-@integer(1000,9999)',
    batch_no: 'B-@integer(1000,9999)',
    plant: '@string(8)',
    material_no: 'PN-@integer(10000,99999)',
    serial_no: '@integer(10000,99999)',
    qty_stock: '@integer(1,99)',
    'unit|1': ['em', 'kg', 'g', 'ml'],
    material_desc: '@title(8,10)'
  }))
}

export default {
  getMatListByPN: config => {
    const { partno, page = 1, limit = 10 } = param2Obj(config.url)
    const mockList = matList.filter(item => {
      if (partno && item.material_no.indexOf(partno) < 0) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  }
}
