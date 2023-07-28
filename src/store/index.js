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
    pointEntity: null, // 鼠标移动到点上之后的动画效果
  },
  mutations: {
    setGisGraph(state, graph) {
      state.graph = graph
    },
    setPointEntity(state, pointEntity) {
      state.pointEntity = pointEntity
    },
  },
  actions: {
    async initPoints({dispatch}) {
      // 获取省会点的数据
      const {data} = await capitalPoint()
      // 绘制点
      data.forEach(point => {
        if (point.name === '北京市') {
          // 添加声浪
          dispatch('addRedPoint', point)
        } 
        dispatch('addPoint', point)
      })
    },
    /**
     * 添加像素点
     * @param state
     * @param point 点对象
     */
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
    },
    /**
     *  添加红色声浪
     * @param state
     * @param point 点对象
     */
    addRedPoint({state}, point) {
      const {graph} = state
      //声浪动画的数据
      const data = {
        height: 0,
        minR: 10000,
        maxR: 100000.0,
        deviationR: 500.0,//每次圆增加的大小
      }
      let r1 = data.minR, r2 = data.minR;
      const changeR1 = function () {
        r1 = r1 + data.deviationR
        if (r1 >= data.maxR) {
          r1 = data.minR;
        }
        return r1;
      }
      const changeR2 = function () {
        r2 = r2 + data.deviationR;
        if (r2 >= data.maxR) {
          r2 = data.minR;
        }
        return r2;
      }
      graph.entities.add({
        item: {
          ...point,
          ...data,
        },
        name: point.name,
        position: Cesium.Cartesian3.fromDegrees(point.coordinateX, point.coordinateY, 0),
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
          semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
          height: data.height,
          material: new Cesium.ImageMaterialProperty({
            image: require("@/assets/red-image.png"),
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: true,
            color: new Cesium.CallbackProperty(function () {
              return Cesium.Color.WHITE.withAlpha(1)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
            }, false)
          })
        }
      })
    },
  },
})