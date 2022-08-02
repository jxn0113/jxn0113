import util from "./util";
import _ from "lodash";
import { Message } from "element-ui";

const constants = {
  rowHeight: 140,
  itemHeight: 40,
  itemWidth: 100,
  lineSpace: 10,
};

class Metadata {
  meta = {
    nodes: [],
    lines: [],
  };

  dragging = false;

  draggingNode = null;

  dragStartPos = { x: 0, y: 0 };

  canDelete = false;

  processInfo = {
    businessCode: "",
    companyCode: "",
    voucherCode: "",
    voucherName: "",
    id: "",
  };
  originInfo = {};
  isUpdated = false; //是否已经修改 (添加删除节点 设置连接参数)

  constructor() {}

  init(processDetail) {
    let json = JSON.parse(processDetail.metaData);
    this.meta.lines = json.lines;
    let nodesConfig = {};
    //  nodesConfig={
    //    '0_12':{
    //      nodeId:3223,
    //      params: {}
    //    },
    //   }
    processDetail.nodeList.forEach((nodeItem) => {
      nodesConfig[`${nodeItem.preOrderTypeId}_${nodeItem.orderTypeId}`] = {
        params: util.buildNode({
          nodeObj: nodeItem.nodeConfig,
          sort: nodeItem.sort,
          preOrderTypeId: nodeItem.preOrderTypeId,
        }),
        nodeId: nodeItem.id,
        preId: nodeItem.preId,
      };
    });
    //覆盖以前的配置
    json.nodes.forEach((nodeItem) => {
      let item =
        nodesConfig[`${nodeItem.preOrderTypeId}_${nodeItem.orderTypeId}`];
      if (!item) {
        Message({
          showClose: true,
          message: "接口返回节点配置异常",
          type: "error",
        });
        return;
      }
      nodeItem.params = item.params;
      nodeItem.id =
        nodesConfig[
          `${nodeItem.preOrderTypeId}_${nodeItem.orderTypeId}`
        ].nodeId;
      nodeItem.preId =
        nodesConfig[`${nodeItem.preOrderTypeId}_${nodeItem.orderTypeId}`].preId;
    });
    this.meta.nodes = json.nodes; //todo 节点配置
    this.processInfo.id = processDetail.id;
    this.processInfo.voucherCode = processDetail.voucherCode;
    this.processInfo.voucherName = processDetail.voucherName;
    this.originInfo = _.cloneDeep(this.meta);
  }

  findNode(node) {
    let orderTypeId = node.orderTypeId || node;
    return this.meta.nodes.find((n) => n.orderTypeId == orderTypeId);
  }

  async getNodeConfig({
    companyCode,
    preOrderTypeId,
    preOrderCategory,
    orderTypeId,
    orderCategory,
    sort,
  }) {
    // try {
    let nodeConfigObj = await util.queryNodeConfig({
      companyCode,
      preOrderTypeId,
      preOrderCategory,
      orderTypeId,
      orderCategory,
    });
    return util.buildNode({ nodeObj: nodeConfigObj, sort, preOrderTypeId });
    // }catch (e) {
    //   return null;
    // }
  }

  /**获取节点坐标
   * nodeX 节点X轴坐标
   * nodeY 节点y轴坐标
   */
  getNodeXY(level, height) {
    let nodeX = this.meta.nodes.reduce((acc, nodeItem) => {
      if (level == nodeItem.level) {
        let nodeX = nodeItem.x + nodeItem.w + 40;
        return acc > nodeX ? acc : nodeX;
      }
      return acc;
    }, 20);
    let nodeY = (level + 0.5) * constants.rowHeight - height / 2;
    return { nodeX, nodeY };
  }
  // 连线时设置节点配置
  async setSonNodeInfo(parentNodeItem, currentNodeItem) {
    let params = {
      companyCode: this.processInfo.companyCode,
      preOrderTypeId: parentNodeItem.orderTypeId,
      preOrderCategory: parentNodeItem.orderCategory,
      orderTypeId: currentNodeItem.orderTypeId,
      orderCategory: currentNodeItem.orderCategory,
      sort: currentNodeItem.sort,
    };
    let nodesConfigs = await this.getNodeConfig(params);
    currentNodeItem.preOrderTypeId = parentNodeItem.orderTypeId;
    currentNodeItem.preId = parentNodeItem.id; //节点配置id
    currentNodeItem.isHaveParentNode = true;
    currentNodeItem.params = nodesConfigs;
  }
  getSonNodeDefaultInfo() {
    return {
      isHaveParentNode: false,
      preId: 0,
      preOrderTypeId: 0,
      params: [],
    };
  }

  async addNode(item, currentRectObj, level, orderCategory) {
    let { width, height } = currentRectObj;
    let { nodeX, nodeY } = this.getNodeXY(level, height);
    let nodeInfo = {
      id: null,
      orderTypeId: item.id,
      code: item.orderType,
      label: item.orderTypeDesc,
      level: level,
      sort: item.sort,
      orderCategory,
      x: nodeX,
      y: nodeY,
      w: width,
      h: height,
    };
    Object.assign(nodeInfo, this.getSonNodeDefaultInfo());
    let isExistSomeLevel = this.meta.nodes.some((item) => item.level == level);
    if (isExistSomeLevel) {
      level += 1;
    }
    this.meta.nodes.splice(level, 0, nodeInfo);
    this.isUpdated = true;
  }

  async addLine(parentNodeItem, sonNodeItem) {
    this.isUpdated = true;
    //路径不能相同,或者互连
    if (
      this.meta.lines.some(
        (item) =>
          item.id ==
            `${parentNodeItem.orderTypeId}-${sonNodeItem.orderTypeId}` ||
          item.id == `${sonNodeItem.orderTypeId}-${parentNodeItem.orderTypeId}`
      )
    ) {
      return;
    }
    //连接规则,必须至上而下连接节点
    if (
      parentNodeItem == sonNodeItem ||
      parentNodeItem.level > sonNodeItem.level
    ) {
      return;
    }
    if (sonNodeItem.isHaveParentNode) {
      Message({
        showClose: true,
        message: "不允许有多个节点连向同一个节点",
        type: "error",
      });
      return;
    }

    let line = {
      source: parentNodeItem,
      target: sonNodeItem,
      id: `${parentNodeItem.orderTypeId}-${sonNodeItem.orderTypeId}`,
    };
    line.d = this.getLinePath(parentNodeItem, sonNodeItem, line);
    this.setLineImgPos(line, parentNodeItem, sonNodeItem);
    await this.setSonNodeInfo(parentNodeItem, sonNodeItem);
    this.meta.lines.push(line);
  }

  setLineImgPos(line, parentNodeItem, sonNodeItem) {
    if (parentNodeItem.level == sonNodeItem.level) {
      let middleNodes = metaData.meta.nodes.filter((lineItem) => {
        return (
          (parentNodeItem.level == lineItem.level &&
            parentNodeItem.x < lineItem.x &&
            sonNodeItem.x > lineItem.x) ||
          (parentNodeItem.x > lineItem.x && sonNodeItem.x < lineItem.x)
        );
      });
      if (middleNodes.length >= 1) {
        if (middleNodes.length % 2 == 0) {
          line.icony = line.dots[1][1];
        } else {
          line.icony = line.dots[1][1] - 22;
        }
      } else {
        line.icony = parentNodeItem.y - 15;
      }
      line.iconx =
        (parentNodeItem.x +
          parentNodeItem.w / 2 +
          sonNodeItem.x +
          sonNodeItem.w / 2 -
          22) /
        2;
    } else {
      let sameTargetLine = this.meta.lines.find((item) => {
        return (
          item.target.orderTypeId == line.target.orderTypeId && line != item
        );
      });
      let [endX, endY] = line.dots[line.dots.length - 1];
      if (sameTargetLine) {
        line.iconx = endX + 10;
      } else {
        line.iconx = endX - 30;
      }
      line.icony = endY - 50;
    }
  }

  calcLinkLinePath(startNode, event) {
    const { offsetX: endX, offsetY: endY } = event;
    const { x, y, w, h } = startNode;
    let ex = endX - 2;
    let ey = endY - 2;
    const startX = parseInt(x + w / 2);
    const startY = y + h;
    return `M ${startX},${startY} L ${ex},${ey}`;
  }

  getLinePath(source, target, line) {
    let pathItem = PathMethods.find((method) => method.check(source, target));
    if (pathItem) {
      return pathItem.getPath(source, target, line);
    } else {
      console.warn("未找到适合的连线方式:", source, target);
    }
  }

  getPos(node, type) {
    let { x, y, w, h } = node,
      positionMap = {
        top: {
          x: parseInt(x + w / 2),
          y: y,
        },
        bottom: {
          x: parseInt(x + w / 2),
          y: y + h,
        },
        left: {
          x: x,
          y: parseInt(y + h / 2),
        },
        right: {
          x: x + w,
          y: parseInt(y + h / 2),
        },
      };
    return positionMap[type];
  }

  moveNode(e) {
    if (!this.draggingNode) return;
    let node = this.draggingNode;
    let x = this.dragStartPos.oldX;
    x += e.pageX - this.dragStartPos.x;
    let boxWidth = document.querySelector("#svgBox").clientWidth;
    let maxX = boxWidth - node.w;
    x = Math.max(Math.min(maxX, x), 0);
    x = x - (x % 20);
    node.x = x;
    let currLevelNodes = this.meta.nodes.filter(
      (n) => n.level == node.level && n.orderTypeId != node.orderTypeId
    );
    currLevelNodes.forEach((item) => {
      if (
        node.x > item.x - constants.itemWidth + 20 &&
        node.x < item.x - constants.itemWidth / 2
      ) {
        item.x = node.x - constants.itemWidth;
      } else if (
        node.x > item.x + constants.itemWidth / 2 &&
        node.x < item.x + constants.itemWidth - 20
      ) {
        item.x = node.x + constants.itemWidth;
      }
      item.x = Math.min(maxX, Math.max(0, item.x));
    });

    this.updateLines();
  }

  updateLines() {
    this.meta.lines.forEach((line) => {
      line.dots = null;
    });
    this.meta.lines.forEach((line) => {
      this.updateLine(line);
    });
  }

  updateLine(line) {
    let sourceNode = this.findNode({ orderTypeId: line.source.orderTypeId });
    let targetNode = this.findNode({ orderTypeId: line.target.orderTypeId });
    line.d = this.getLinePath(sourceNode, targetNode, line);
    this.setLineImgPos(line, sourceNode, targetNode);
  }

  startDrag(nodeItem, e) {
    let node = this.findNode(nodeItem);
    this.dragStartPos = {
      x: e.pageX,
      y: e.pageY,
      oldX: node.x,
    };
    node.dragging = true;
    this.dragging = true;
    this.draggingNode = node;
  }
  endDrag() {
    this.dragging = false;
    if (this.draggingNode) {
      this.draggingNode.dragging = false;
      this.draggingNode = null;
    }
  }

  removeSelected(node) {
    this.meta.lines = this.meta.lines.filter((line) => {
      return (
        line.source.orderTypeId != node.orderTypeId &&
        line.target.orderTypeId != node.orderTypeId
      );
    });
    this.meta.nodes = this.meta.nodes.reduce((acc, item) => {
      if (item.orderTypeId != node.orderTypeId) {
        if (item.preOrderTypeId == node.orderTypeId) {
          Object.assign(item, this.getSonNodeDefaultInfo());
        }
        acc.push(item);
      }
      return acc;
    }, []);
  }

  clear() {
    this.meta.lines = [];
    this.meta.nodes = [];
    this.processInfo.id = "";
    this.processInfo.voucherCode = "";
    this.processInfo.voucherName = "";
    this.isUpdated = false;
    this.originInfo = {};
  }
}

function getSameLines(source, target, line, startX) {
  let sames = metaData.meta.lines.filter((line2) => {
    return (
      line2.source.orderTypeId == source.orderTypeId &&
      line.id != line2.id &&
      line2.dots &&
      line2.dots[0][0] == startX
    );
  });
  let targetSames = metaData.meta.lines.filter((line2) => {
    return (
      line2.target.orderTypeId == target.orderTypeId &&
      line.id != line2.id &&
      line2.dots
    );
  });
  return {
    sameSource: sames,
    sameTarget: targetSames,
  };
}

const PathMethods = [
  {
    name: "right-left left-right bottom-bottom 右到左连接",
    check(source, target) {
      return source.level == target.level;
    },
    getPath(source, target, line) {
      let middleNodes = metaData.meta.nodes.filter((lineItem) => {
        return (
          (source.level == lineItem.level &&
            source.x < lineItem.x &&
            target.x > lineItem.x) ||
          (source.x > lineItem.x && target.x < lineItem.x)
        );
      });
      if (middleNodes.length >= 1) {
        let { x: startX, y: startY } = metaData.getPos(
          source,
          middleNodes.length % 2 == 0 ? "top" : "bottom"
        );
        let { x: endX, y: endY } = metaData.getPos(
          target,
          middleNodes.length % 2 == 0 ? "top" : "bottom"
        );
        let centerY;
        if (middleNodes.length % 2 == 0) {
          centerY = startY - 24 - 3 * middleNodes.length;
        } else {
          centerY = startY + 24 + 3 * middleNodes.length;
        }
        line.dots = [
          [startX, startY],
          [startX, centerY],
          [endX, centerY],
          [endX, endY],
        ];
        return `M ${(startX +=
          middleNodes.length *
          3)},${startY} L ${startX},${centerY} L ${endX},${centerY} L ${endX},${endY}`;
      } else {
        let { x: startX, y: startY } = metaData.getPos(
          source,
          source.x < target.x ? "right" : "left"
        );
        let { x: endX, y: endY } = metaData.getPos(
          target,
          source.x > target.x ? "right" : "left"
        );

        line.dots = [
          [startX, startY],
          [endX, endY],
        ];
        return `M ${startX},${startY} L ${endX},${endY}`;
      }
    },
  },
  {
    name: "bottom-top 简单连接",
    check(source, target) {
      return source.x == target.x;
    },
    getPath(source, target, line) {
      let { x: startX, y: startY } = metaData.getPos(source, "bottom");
      let { x: endX, y: endY } = metaData.getPos(target, "top");
      let { sameSource, sameTarget } = getSameLines(
        source,
        target,
        line,
        startX
      );
      startX += constants.lineSpace * sameSource.length;
      line.dots = [
        [startX, startY],
        [startX, endY],
      ];
      return `M ${startX},${startY} L ${startX},${endY}`;
    },
  },
  {
    name: "right-top left-top 曲线连接",
    check(source, target) {
      let cond1 = Math.abs(source.x - target.x) >= constants.itemWidth;
      let cond2 = !metaData.meta.nodes.filter((n) => {
        if (source.level == n.level && n.orderTypeId != source.orderTypeId) {
          if (source.x < target.x) {
            return !(
              n.x < source.x || n.x > target.x + constants.itemWidth / 2
            );
          } else {
            return !(
              n.x > source.x || n.x < target.x - constants.itemWidth / 2
            );
          }
        }
      }).length;
      return cond1 && cond2;
    },
    getPath(source, target, line) {
      let { x: startX, y: startY } = metaData.getPos(
        source,
        source.x < target.x ? "right" : "left"
      );
      let { x: endX, y: endY } = metaData.getPos(target, "top");

      let { sameSource, sameTarget } = getSameLines(
        source,
        target,
        line,
        startX
      );
      startY += constants.lineSpace * sameSource.length;
      endX += constants.lineSpace * sameTarget.length;
      line.dots = [
        [startX, startY],
        [endX, startY],
        [endX, endY],
      ];
      return `M ${startX},${startY} L ${endX},${startY} L ${endX},${endY}`;
    },
  },
  {
    name: "bottom-top 曲线连接",
    check(source, target) {
      return true;
    },
    getPath(source, target, line) {
      let { x: startX, y: startY } = metaData.getPos(source, "bottom");
      let { x: endX, y: endY } = metaData.getPos(target, "top");
      let { sameSource, sameTarget } = getSameLines(
        source,
        target,
        line,
        startX
      );
      startX += constants.lineSpace * sameSource.length;
      endX += constants.lineSpace * sameTarget.length;
      let centerY = startY + 30;
      line.dots = [
        [startX, startY],
        [startX, centerY],
        [endX, centerY],
        [endX, endY],
      ];
      return `M ${startX},${startY} L ${startX},${centerY} L ${endX},${centerY} L ${endX},${endY}`;
    },
  },
];
const metaData = new Metadata();
export default metaData;
