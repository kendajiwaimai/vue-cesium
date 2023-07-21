<template>
  <div class="main">
    <div id="cesiumContainer" class="myGisStyle"></div>
  </div>
</template>

<script>
import earth from "@/assets/earth.jpg";
import GisGraph from "@/utils/gisGraph.js";
import {mapActions} from 'vuex'

const Cesium = window.Cesium
export default {
  name: "resourceIndex",
  data() {
    return {
      gisGraph: null,
    }
  },
  mounted() {
    this.initMap();// 初始化地图
    this.initPoints(); // 初始化点资源
  },
  methods: {
    ...mapActions(['initPoints']),
    initMap() {
      const viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false, //是否创建动画小器件，左下角仪表
        baseLayerPicker: false, //是否显示图层选择器
        fullscreenButton: false, //是否显示全屏按钮
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        homeButton: false, //是否显示Home按钮
        infoBox: false, //是否显示信息框
        sceneModePicker: false, //是否显示3D/2D选择器
        selectionIndicator: false, //是否显示选取指示器组件
        timeline: false, //是否显示时间轴
        scene3DOnly: true, //如果为true，则每个几何体实例将仅以3D渲染以节省GPU内存。
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        fullscreenElement: document.body, //全屏时渲染的HTML元素,
        shadows: true,
        showRenderLoopErrors: false, // 发生渲染循环错误时，此小部件将自动向包含错误的用户显示HTML面板。
        useBrowserRecommendedResolution: true, // 以浏览器建议的分辨率进行渲染，并忽略 window.devicePixelRatio 。
        automaticallyTrackDataSourceClocks: true, //自动追踪最近添加的数据源的时钟设置
        contextOptions: undefined, //传递给Scene对象的上下文参数（scene.options）
        sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式  哥伦布视图-COLUMBUS_VIEW  3D视图-SCENE3D
        imageryProvider: new Cesium.SingleTileImageryProvider({
          url: earth,
        }),
      });
      this.gisGraph = new GisGraph(viewer)
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  position: absolute;
  top: 0;
  left: 0;
  .myGisStyle {
    height: calc(100%);
    width: calc(100%);
    position: fixed;
    overflow: hidden
  }
}
</style>
