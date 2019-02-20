// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function numberFormatter (num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandslsFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function parseWorkType (val) {
  switch (val) {
    case 'service':
      return '勤务'
    case 'technic':
      return '维修'
    case 'release':
      return '放行'
    case 'pickup':
      return '接机'
    case 'transfers':
      return '送机'
    default:
      break
  }
}

export function parseWorkState (val) {
  switch (val) {
    case 'apply':
      return '领取，待确认'
    case 'unaccept':
      return '待接收'
    case 'accept':
      return '已接收'
    case 'on-work':
      return '已开工'
    case 'on-spot':
      return '已到位'
    case 'finished':
      return '已完成'
    case 'unrelease':
      return '待放行'
    case 'released':
      return '已放行'
    case 'canceled':
      return '已取消'
    default:
      break
  }
}
