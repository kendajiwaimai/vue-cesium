import axios from 'axios'

// 获取省会点数据
export function capitalPoint(){
  return axios.get('capitalPoint.json')
}