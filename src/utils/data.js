const handleTaskArr = (items) => {
  for (let item of items) {
    let arriveTime = ''
    if (item.arriveTimeReal !== undefined && item.arriveTimeReal !== '') {
      arriveTime = item.arriveTimeReal
    } else if (item.arriveTimePre !== undefined && item.arriveTimePre !== '') {
      arriveTime = item.arriveTimePre
    } else if (item.arriveTimePlan !== undefined && item.arriveTimePlan !== '') {
      arriveTime = item.arriveTimePlan
    }
    let leaveTime = ''
    if (item.leaveTimeReal !== undefined && item.leaveTimeReal !== '') {
      leaveTime = item.leaveTimeReal
    } else if (item.leaveTimePre !== undefined && item.leaveTimePre !== '') {
      leaveTime = item.leaveTimePre
    } else if (item.leaveTimePlan !== undefined && item.leaveTimePlan !== '') {
      leaveTime = item.leaveTimePlan
    }
    // 如果进出港机位都不为空，并且不一样时用"/"隔开
    if (item.acPlace !== undefined && item.acPlacePf !== undefined && item.acPlace !== item.acPlacePf) {
      item.acPlace = item.acPlace + '/' + item.acPlacePf
    }
    if (item.acPlace === undefined && item.acPlacePf !== undefined) {
      item.acPlace = item.acPlacePf
    }
    /*
    if (item.arriveFlightNo === undefined || item.arriveFlightNo === '') {
      item.arriveFlightNo = item.leaveFlghtNo
    }
    if (item.leaveFlightNo !== undefined && !item.leaveFlightNo.startsWith('CA')) {
      item.leaveFlightNo = 'CA' + item.leaveFlightNo
    } */
    if (item.acReg !== undefined && !item.acReg.includes('B-')) {
      item.acReg = item.acReg.replace(/B/, 'B-')
    }
    let obj = { 'arriveTime': arriveTime, 'leaveTime': leaveTime }
    Object.assign(item, obj)
  }
  return items
}

const parseWorkState = (val) => {
  switch (val) {
    case 'accept':
      return 'Accept'
    case 'onSpot':
      return 'On-Spot'
    case 'onWork':
      return 'On-Work'
    case 'finished':
      return 'Finished'
    case 'claim':
      return 'Claim'
    default:
      break
  }
}

export { handleTaskArr, parseWorkState }
