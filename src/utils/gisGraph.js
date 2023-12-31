import store from '@/store'
import * as cesiumUtils from './cesiumUtils.js'
import chinaArea from './chinaArea.json'
import provinceArea from './provinceArea.json'

const Cesium = window.Cesium;
export default class GisGraph {
  constructor(viewer) {
    this.pointEntity = null;
    this.viewer = viewer;
    this.initMap();
  }
  // 初始化地图实例
  initMap(){
    const maptLayer = new Cesium.UrlTemplateImageryProvider({
      url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", //
    });
    const tdtLayer = new Cesium.UrlTemplateImageryProvider({
      url: "https://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    });
    this.viewer.imageryLayers.addImageryProvider(maptLayer);
    this.viewer.imageryLayers.addImageryProvider(tdtLayer);
    // 国界
    const chinaJson = Cesium.GeoJsonDataSource.load(chinaArea,{
      stroke: Cesium.Color.fromCssColorString('#d0c277').withAlpha(1),
      strokeWidth: 2,
      clampToGround: true,
      id:'unselect'
    })
    // 省界
    const provinceJson = Cesium.GeoJsonDataSource.load(provinceArea,{
      stroke: Cesium.Color.fromCssColorString('#d0c277').withAlpha(1),
      strokeWidth: 1,
      clampToGround: true,
      type:'unselect'
    })
    this.viewer.dataSources.add(chinaJson)
    this.viewer.dataSources.add(provinceJson)
    // 去掉cesium的版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    // 开启抗锯齿
    this.viewer.scene.fxaa = true;
    this.viewer.scene.postProcessStages.fxaa.enabled = true;
    // 阻止默认的双击事件行为的函数
    const preventDefaultDblClick = function (event) {
      event.preventDefault();
    }
    this.viewer.canvas.addEventListener('dblclick', preventDefaultDblClick, false)
    // 设置名字的备注样式
    const nameOverlay = cesiumUtils.setNameOverlay(this.viewer)
    /******注册场景事件***/
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    // 注册鼠标左键点击事件
    handler.setInputAction((e) => {
      const pick = this.viewer.scene.pick(e.position);
      if (pick && pick.id && pick.id.item){
        const item = pick.id.item
        this.flyToPoint(item)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // 注册鼠标移动事件
    handler.setInputAction((movement) => {
      const pickedFeature = this.viewer.scene.pick(movement.endPosition);
      const {pointEntity} = store.state
      if(pointEntity) {
        pointEntity.outlineWidth = 0
        pointEntity.outlineColor = null
      }
      if (pickedFeature && pickedFeature.id) {
        // 点资源
        cesiumUtils.pointModal(pickedFeature, this.viewer, nameOverlay, movement)
      } else {
        // 鼠标样式改为默认箭头型
        this.viewer._container.style.cursor = "default";
        nameOverlay.style.display = 'none'
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 设置镜头初始位置
    this.resetMapView();
    // 提交地图实例
    store.commit('setGisGraph',this.viewer)
  }

  // 重置地图视角
  resetMapView(){
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(106, 38, 7400000), // 设置位置
      orientation: {
        heading: Cesium.Math.toRadians(0), // 方向
        pitch: Cesium.Math.toRadians(-90), // 倾斜角度
        roll: 0,
      },
    });
  }

  // 相机移动到指定位置
  flyToPoint(point) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(point.coordinateX, point.coordinateY, 50000), // 设置位置
      orientation: {
        heading: Cesium.Math.toRadians(0), // 方向
        roll: 0,
      },
    });
  }
}