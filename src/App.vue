<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    // 低版本的浏览器可能不支持cesium
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);
    if (typeof WebGLRenderingContext !== 'undefined') {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!context) {
        alert("浏览器不支持WebGL，请升级浏览器版本")
      }
    } else {
      // 浏览器不支持WebGL
      alert("浏览器不支持WebGL，请升级浏览器版本")
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
