import layout from 'echarts/lib/util/layout'
import {parsePercent} from 'echarts/lib/util/number'

function getViewRect(seriesModel, api) {
  return layout.getLayoutRect(
    seriesModel.getBoxLayoutParams(), {
      width: api.getWidth(),
      height: api.getHeight()
    }
  );
}

function getSortedIndices(data, sort) {
  let valueArr = data.mapArray('value', function (val) {
    return val;
  });
  let indices = [];
  let isAscending = sort === 'ascending';

  for (let i = 0, len = data.count(); i < len; i++) {
    indices[i] = i;
  }

  // Add custom sortable function & none sortable opetion by "options.sort"
  if (typeof sort === 'function') {
    indices.sort(sort);
  } else if (sort !== 'none') {
    indices.sort(function (a, b) {
      return isAscending ? valueArr[a] - valueArr[b] : valueArr[b] - valueArr[a];
    });
  }
  return indices;
}

function labelLayout(data) {
  data.each(function (idx) {
    let itemModel = data.getItemModel(idx);
    let labelModel = itemModel.getModel('label.normal');
    let labelPosition = labelModel.get('position');

    let labelLineModel = itemModel.getModel('labelLine.normal');

    let layout = data.getItemLayout(idx);
    let points = layout.points;

    let isLabelInside = labelPosition === 'inner' || labelPosition === 'inside' || labelPosition === 'center';

    let textAlign;
    let textX;
    let textY;
    let linePoints;

    if (isLabelInside) {
      textX = (points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4;
      textY = (points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4;
      textAlign = 'center';
      linePoints = [
        [textX, textY], [textX, textY]
      ];
    } else {
      let x1;
      let y1;
      let x2;
      let labelLineLen = labelLineModel.get('length');

      if (labelPosition === 'left') {
        // Left side
        x1 = (points[3][0] + points[0][0]) / 2;
        y1 = (points[3][1] + points[0][1]) / 2;
        x2 = x1 - labelLineLen;
        textX = x2 - 5;
        textAlign = 'right';
      } else {
        // Right side
        x1 = (points[1][0] + points[2][0]) / 2;
        y1 = (points[1][1] + points[2][1]) / 2;
        x2 = x1 + labelLineLen;
        textX = x2 + 5;
        textAlign = 'left';
      }
      let y2 = y1;

      linePoints = [[x1, y1], [x2, y2]];
      textY = y2;
    }

    layout.label = {
      linePoints: linePoints,
      x: textX,
      y: textY,
      verticalAlign: 'middle',
      textAlign: textAlign,
      inside: isLabelInside
    };
  });
}

export default function (ecModel, api) {
  ecModel.eachSeriesByType('visualFunnel', function (seriesModel) {
    let data = seriesModel.getData();
    let sort = seriesModel.get('sort');
    let viewRect = getViewRect(seriesModel, api);
    let indices = getSortedIndices(data, sort);
    let dataExtent = data.getDataExtent('value');
    let min = seriesModel.get('min');
    let max = seriesModel.get('max');
    let neck = {
      width: seriesModel.get('neckWidth'),
      start: seriesModel.get('neckStart')
    }
    let neckStart = parsePercent(neck.start, viewRect.height) || viewRect.height * 0.55;
    let neckWidth = parsePercent(neck.width, viewRect.height) || parseFloat(neck.width) || viewRect.width / 3;

    if (min == null) {
      min = Math.min(dataExtent[0], 0);
    }
    if (max == null) {
      max = dataExtent[1];
    }

    let gap = 0; // seriesModel.get('gap');
    let itemHeight = (viewRect.height - gap * (data.count() - 1)) / data.count();
    let y = viewRect.y;

    function getPoints(idx, offY) {
      let height = itemHeight;
      let indent = (viewRect.width - neckWidth) / (neckStart / height);
      let points = [];
      let itemWidth;
      let nextItemWidth;
      let p1, p2, p3, p4, p5, p6;
      let indexWithNeck = neckStart / height;

      // 漏斗颈以上的图形顶部
      if (idx < indexWithNeck) {
        itemWidth = viewRect.width - (idx * indent);
      } else {
        itemWidth = neckWidth;
      }
      p1 = [viewRect.x + (viewRect.width - itemWidth) / 2, offY];
      p2 = [viewRect.x + itemWidth + (viewRect.width - itemWidth) / 2, offY];

      // 漏斗颈以下的图形底部
      if (idx < indexWithNeck && indexWithNeck < idx + 1) {
        nextItemWidth = neckWidth;

        let y1 = offY + height;
        let y2 = offY + (height - ((idx + 1) * height - neckStart));
        let x0 = (viewRect.width - nextItemWidth) / 2;

        p3 = [viewRect.x + nextItemWidth + x0, y2];
        p4 = [viewRect.x + nextItemWidth + x0, y1];
        p5 = [viewRect.x + x0, y1];
        p6 = [viewRect.x + x0, y2];
      } else {
        if ((idx + 1) < indexWithNeck) {
          nextItemWidth = viewRect.width - ((idx + 1) * indent);
        } else {
          nextItemWidth = neckWidth;
        }

        p3 = [viewRect.x + nextItemWidth + (viewRect.width - nextItemWidth) / 2, offY + height];
        p4 = [viewRect.x + (viewRect.width - nextItemWidth) / 2, offY + height];
      }

      if (idx === indices.length - 1) {
        p3[1] -= height / 2;
      }

      points.push(p1, p2, p3, p4);
      if (p5) {points.push(p5); }
      if (p6) {points.push(p6); }

      return points;
    }

    for (let i = 0; i < indices.length; i++) {
      let idx = indices[i];
      let points = getPoints(i, y);

      y += itemHeight + gap;
      data.setItemLayout(idx, {
        points: points
      });
    }

    labelLayout(data);
  });
}
