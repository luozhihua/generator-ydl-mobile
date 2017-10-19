<template>
  <Page title="Number Demos">
    <Panel>
      <h1 slot="header-left">Number Demos</h1>

      <div class="numbers">
        <Panel>
          <pre>&lt;Number
            :animate="false"
            :value="number"
            symbol="￥"
            unit="天"
            type="number"
          &gt;&lt;/Number&gt;</pre>
          <br/>
          <h2>属性：</h2>
          <br/>
          <ul>
            <li>- <em>animate</em> 数值改变时是否显示动画</li>
            <li>- <em>value</em> 需要显示的数字</li>
            <li>- <em>symbol</em> 显示在数字前面的字符或者符号</li>
            <li>- <em>unit</em> 单位，显示在数字后面</li>
            <li>- <em>type</em> 数字类型：number(默认), date, currency</li>
          </ul>
        </Panel>

        <Panel>
          <h2>type 修饰符：</h2>
          <br/>
          <ul>
            <li>- type="date:<em>format</em>": format为日期时间的格式</li>
            <li>- type="number:<em>2</em>": 2 为小数位数</li>
          </ul>
        </Panel>

        <Panel>
          <pre>&lt;Number :value="number" unit="天" type="number"&gt;&lt;/Number&gt;</pre>
          静态数字：
          <Number :value="number" unit="天" type="number"/>
        </Panel>

        <Panel>
          <pre>&lt;Number animate :value="number" unit="天" type="number"&gt;&lt;/Number&gt;</pre>
          动态数字：
          <Number animate :value="number" unit="天" type="number"/>
        </Panel>

        <Panel>
          <pre>&lt;Number animate :value="date" type="date:YYYY-MM-DD"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="date" type="date:YYYY-MM-DD"/>
        </Panel>

        <Panel>
          <pre>&lt;Number animate :value="date" type="date:YYYY-MM-DD hh:mm:ss"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="date" type="date:YYYY-MM-DD hh:mm:ss"/>
        </Panel>

        <Panel>
          <pre>&lt;Number animate :value="date" type="date:YYYY年MM月DD日 hh时mm分ss秒"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="date" type="date:YYYY年MM月DD日 hh时mm分ss秒"/>
        </Panel>

        <Panel>
          <pre>&lt;Number animate :value="currency" unit="元" type="currency:4"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="currency" unit="元" type="currency:4"/>
        </Panel>

        <Panel>
          <pre>&lt;Number animate :value="currency" unit="万元" type="￥:currency:2"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="currency" unit="万元" type="￥:currency:2"/>
        </Panel>
        <Panel>
          <pre>&lt;Number animate :value="currency" unit="万元" type="currency" symbol="XXXX"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="currency" unit="万元" type="currency:2" symbol="XXXX"/>
        </Panel>
        <Panel>
          <pre>&lt;Number animate :value="number" unit="台" type="number:2"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="number" unit="台" type="number:2"/>
        </Panel>
        <Panel>
          <pre>&lt;Number animate :value="number" type="number:2"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="number" type="number:2"/>
        </Panel>
        <Panel>
          <pre>&lt;Number animate :value="number" symbol="+" type="number"&gt;&lt;/Number&gt;</pre>
          <Number animate :value="number" symbol="+" type="number"/>
        </Panel>
      </div>
    </Panel>

  </Page>
</template>

<script>
  export default {
    /**
     * 默认数据
     */
    data() {
      return {
        date: 1499928070445,
        number: 9233.21,
        currency: 1232
      }
    },

    /**
     * Number Examples
     */
    async created() {

      setInterval(() => {
        let now = new Date()

        now.setDate(Math.floor(Math.random() * 365))

        this.currency = Math.floor(Math.random() * 1000000)
        this.number = Math.floor(Math.random() * 100)
        this.date = now.getTime()
      }, 1200)
    }
  }
</script>

<style lang="less" scoped>

  .numbers {
    font-size: 1.2rem;

    pre {
      background-color: #000;
      color: #aaa;
      padding: 1rem;
      border-radius: 1rem;
      font-size: 1.2rem;
    }

    .animate-number {
      border-bottom: 1px solid #ccc;
      padding: 2rem 1rem;
      font-size: 1.8rem;
      display: block;
      color: #00aaff;
    }
  }

</style>
