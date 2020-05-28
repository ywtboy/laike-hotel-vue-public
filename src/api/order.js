import axios from "axios"

const baseUrl = '/api/order';

export const checkIn = checkInData => {
    return axios.post(baseUrl + '/checkIn', checkInData)
}

export const reserve = json => {
    return axios.post(baseUrl + '/reserve', json)
}

export const allotRoom = json => {
    return axios.post(baseUrl + '/allotRoom', json)
}

export const checkOut = checkOut => {
    return axios.post(baseUrl + '/checkOut', checkOut)
}

export const getOrderInfo = oederNo => {
    return axios.get(baseUrl + "/" + oederNo)
  }
  export const getOrderRooms = json => {
    return axios.get(baseUrl + '/rooms',{params: json})
  }

export const getOrders = query => {
return axios.get(baseUrl,{params: query})
}
// {params: query}
export const getOrderConsume = oederNo => {
return axios.get(baseUrl+ '/' +oederNo + "/consume")
}

export const saveOrderConsume = orderConsume => {
    return axios.post(baseUrl+ '/' +orderConsume.oederNo + "/consume" ,orderConsume)
}

export const getOrderIncome = oederNo => {
    return axios.get(baseUrl+  '/' +oederNo + "/income")
}

export const saveOrderIncome = orderIncome => {
    return axios.post(baseUrl+ '/' +orderIncome.oederNo + "/income" ,orderIncome)
}

export const exeChangeRoom = json => {
    return axios.post(baseUrl+ "/room/change" ,json)
}