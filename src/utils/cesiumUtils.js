import store from '@/store'
const speedStyle = {
  speed_popup: `
      position: absolute;
      background-color: rgba(43,43,43,0.7);
      width: 280px;
      height: 40px;
      padding: 5px
    `,
  speed_item: `
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
  speed_left: `
      font-size: 14px;
      font-family: Alibaba PuHuiTi-Regular, Alibaba PuHuiTi;
      font-weight: 400;
      color: #FFFFFF;
      width: 150px;
      text-align: left;
    `,
  speed_right: `
      font-size: 14px;
      font-family: Alibaba PuHuiTi-Regular, Alibaba PuHuiTi;
      font-weight: 400;
      color: #FFFFFF;
      width: 220px;
      text-align: left;
    `,
}

// 设置文本
export function setNameOverlay(viewer) {
  const nameOverlay = document.createElement("div");
  viewer.container.appendChild(nameOverlay);
  nameOverlay.className = "backdrop";
  nameOverlay.style.display = "none";
  nameOverlay.style.position = "absolute";
  nameOverlay.style.bottom = "0";
  nameOverlay.style.left = "0";
  nameOverlay.style["pointer-events"] = "none";
  nameOverlay.style.padding = "4px";
  nameOverlay.style.backgroundColor = "RGBA(10,20,36,0.7)";
  nameOverlay.style.color = "#ffffff";
  return nameOverlay;
}

// 点详情的飘窗
export function pointModal(pickedFeature, viewer, nameOverlay, movement) {
  const _item = pickedFeature.id.item;
  if (_item && _item.type === "point") {
    // 更改鼠标样式为手指
    viewer._container.style.cursor = "pointer";
    const pointEntity = pickedFeature.primitive.id.point
    pointEntity.outlineWidth = 2;
    pointEntity.outlineColor = pointEntity.color
    store.commit('setPointEntity',pointEntity)
    // 设置飘窗的内容
    nameOverlay.innerHTML = `
        <div style="${speedStyle.speed_popup}">
        <div style="${speedStyle.speed_item}">
            <span style="${speedStyle.speed_left}">名称:</span>
            <span style="${speedStyle.speed_right};width: 225px">${_item.name}</span>
        </div>
        <div style="${speedStyle.speed_item}">
            <span style="${speedStyle.speed_left}">经纬度:</span>
            <span style="${speedStyle.speed_right}">${_item.coordinateX};${_item.coordinateY}</span>
        </div>
        `
    nameOverlay.style.display = "block";
    nameOverlay.style.bottom = `${
      viewer.canvas.clientHeight - movement.endPosition.y + 50
    }px`;
    nameOverlay.style.left = `${movement.endPosition.x + 10}px`;
  } else {
    // 鼠标样式改为默认箭头型
    viewer._container.style.cursor = "default";
  }
}