/* eslint no-underscore-dangle: "off" */

import graphic from 'echarts/lib/util/graphic';
import Chart from 'echarts/lib/view/Chart'
import zrUtil from 'zrender/lib/core/util';

/**
 * Piece of pie including Sector, Label, LabelLine
 * @constructor
 * @extends {module:zrender/graphic/Group}
 */
function FunnelPiece(data, idx) {
  let polygon, labelLine, text

  graphic.Group.call(this);

  polygon = new graphic.Polygon();
  labelLine = new graphic.Polyline();
  text = new graphic.Text();

  this.add(polygon);
  this.add(labelLine);
  this.add(text);

  this.updateData(data, idx, true);

  // Hover to change label and labelLine
  function onEmphasis() {
    labelLine.ignore = labelLine.hoverIgnore;
    text.ignore = text.hoverIgnore;
  }

  function onNormal() {
    labelLine.ignore = labelLine.normalIgnore;
    text.ignore = text.normalIgnore;
  }

  this.on('emphasis', onEmphasis)
    .on('normal', onNormal)
    .on('mouseover', onEmphasis)
    .on('mouseout', onNormal);
}

let funnelPieceProto = FunnelPiece.prototype;

function getLabelStyle(data, idx, state, labelModel) {
  let textStyleModel = labelModel.getModel('textStyle');
  let position = labelModel.get('position');
  let isLabelInside = position === 'inside' || position === 'inner' || position === 'center';

  return {
    fill: textStyleModel.getTextColor() || (isLabelInside ? '#fff' : data.getItemVisual(idx, 'color')),
    textFont: textStyleModel.getFont(),
    text: zrUtil.retrieve(
      data.hostModel.getFormattedLabel(idx, state),
      data.getName(idx)
    )
  };
}

let opacityAccessPath = ['itemStyle', 'normal', 'opacity'];

funnelPieceProto.updateData = function (data, idx, firstCreate) {
  let polygon = this.childAt(0);
  let seriesModel = data.hostModel;
  let itemModel = data.getItemModel(idx);
  let layout = data.getItemLayout(idx);
  let opacity = data.getItemModel(idx).get(opacityAccessPath);

  opacity = opacity == null ? 1 : opacity;

  // Reset style
  polygon.useStyle({});

  if (firstCreate) {
    polygon.setShape({
      points: layout.points
    });
    polygon.setStyle({opacity: 0});
    graphic.initProps(polygon, {
      style: {
        opacity: opacity
      }
    }, seriesModel, idx);
  } else {
    graphic.updateProps(polygon, {
      style: {
        opacity: opacity
      },
      shape: {
        points: layout.points
      }
    }, seriesModel, idx);
  }

  // Update common style
  let itemStyleModel = itemModel.getModel('itemStyle');
  let visualColor = data.getItemVisual(idx, 'color');

  polygon.setStyle(
    zrUtil.defaults(
      {
        lineJoin: 'round',
        fill: visualColor
      },
      itemStyleModel.getModel('normal').getItemStyle(['opacity'])
    )
  );
  polygon.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();

  this._updateLabel(data, idx);

  graphic.setHoverStyle(this);
};

funnelPieceProto._updateLabel = function (data, idx) {

  let labelLine = this.childAt(1);
  let labelText = this.childAt(2);

  let seriesModel = data.hostModel;
  let itemModel = data.getItemModel(idx);
  let layout = data.getItemLayout(idx);
  let labelLayout = layout.label;
  let visualColor = data.getItemVisual(idx, 'color');

  graphic.updateProps(labelLine, {
    shape: {
      points: labelLayout.linePoints || labelLayout.linePoints
    }
  }, seriesModel, idx);
  graphic.updateProps(labelText, {
    style: {
      x: labelLayout.x,
      y: labelLayout.y
    }
  }, seriesModel, idx);
  labelText.attr({
    style: {
      textAlign: labelLayout.textAlign,
      textVerticalAlign: labelLayout.verticalAlign,
      textFont: labelLayout.font
    },
    rotation: labelLayout.rotation,
    origin: [labelLayout.x, labelLayout.y],
    z2: 10
  });

  let labelModel = itemModel.getModel('label.normal');
  let labelHoverModel = itemModel.getModel('label.emphasis');
  let labelLineModel = itemModel.getModel('labelLine.normal');
  let labelLineHoverModel = itemModel.getModel('labelLine.emphasis');
  let isShowLabelByIndex = idx < data.indices.length - 2

  labelText.setStyle(getLabelStyle(data, idx, 'normal', labelModel));

  labelText.ignore = labelText.normalIgnore = !labelModel.get('show') || isShowLabelByIndex;
  labelText.hoverIgnore = !labelHoverModel.get('show');

  labelLine.ignore = labelLine.normalIgnore = !labelLineModel.get('show') || isShowLabelByIndex;
  labelLine.hoverIgnore = !labelLineHoverModel.get('show');

  // Default use item visual color
  labelLine.setStyle({
    stroke: visualColor
  });
  labelLine.setStyle(labelLineModel.getModel('lineStyle').getLineStyle());

  labelText.hoverStyle = getLabelStyle(data, idx, 'emphasis', labelHoverModel);
  labelLine.hoverStyle = labelLineHoverModel.getModel('lineStyle').getLineStyle();
};

zrUtil.inherits(FunnelPiece, graphic.Group);

const Funnel = Chart.extend({

  type: 'visualFunnel',

  render: function (seriesModel, ecModel, api) {
    let data = seriesModel.getData();
    let oldData = this._data;

    let group = this.group;

    data.diff(oldData)
      .add(function (idx) {
        let funnelPiece = new FunnelPiece(data, idx);

        data.setItemGraphicEl(idx, funnelPiece);

        group.add(funnelPiece);
      })
      .update(function (newIdx, oldIdx) {
        let piePiece = oldData.getItemGraphicEl(oldIdx);

        piePiece.updateData(data, newIdx);

        group.add(piePiece);
        data.setItemGraphicEl(newIdx, piePiece);
      })
      .remove(function (idx) {
        let piePiece = oldData.getItemGraphicEl(idx);

        group.remove(piePiece);
      })
      .execute();

    this._data = data;
  },

  remove: function () {
    this.group.removeAll();
    this._data = null;
  },

  dispose: function () {}
});

export default Funnel;
