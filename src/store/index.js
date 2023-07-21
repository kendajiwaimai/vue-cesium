/**
 *  状态管理文件
 */
import Vue from 'vue'
import Vuex from 'vuex'
import {capitalPoint} from "@/api";

Vue.use(Vuex)

const Cesium = window.Cesium
export default new Vuex.Store({
  state: {
    graph: null, // 态势图的实例
  },
  mutations: {
    setGisGraph(state, graph) {
      state.graph = graph
    }
  },
  actions: {
    async initPoints({dispatch}) {
      // 获取省会点的数据
      const {data} = await capitalPoint()
      // 绘制点
      data.forEach(point => {
        point.size = 12
        point.color = "#00FF4E"
        dispatch('addPoint', point)
      })
    },
    addPoint({state}, point) {
      const {graph} = state
      const entity = {
        position: Cesium.Cartesian3.fromDegrees(point.coordinateX, point.coordinateY, 0),
        item: {
          ...point,
        },
        point: {
          pixelSize: point.size,
          color: new Cesium.Color.fromCssColorString(point.color),
        }
      }
      if (point.showLabel) {
        entity.label = {
          text: point.name,
          font: "14px sans-serif",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, 15), // 偏移量，控制Label相对于点的位置
          disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保Label不会被遮挡
        }
      }
      graph.entities.add(entity)
    }
  },
})