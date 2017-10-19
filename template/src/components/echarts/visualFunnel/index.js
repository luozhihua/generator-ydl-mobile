import zrUtil from 'zrender/lib/core/util'
import echarts from 'echarts/lib/echarts'
import dataColor from 'echarts/lib/visual/dataColor'
import dataFilter from 'echarts/lib/processor/dataFilter'
import funnelLayout from './funnelLayout'
import extendFunnelSeries from './FunnelSeries'
import './FunnelView';

extendFunnelSeries(echarts)
echarts.registerVisual(zrUtil.curry(dataColor, 'visualFunnel'));
echarts.registerLayout(funnelLayout);
echarts.registerProcessor(zrUtil.curry(dataFilter, 'visualFunnelx'));
