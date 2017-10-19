<template>
  <Page hasHeader>
    <!-- 页头 -->
    <header slot="header" class="page-header head">
      <a class="ico retu" @click="back();"></a>
      <span>联系人列表</span>
      <div class="ed">
        <a href="javascript:void(0)" class="ico ico27"></a>
      </div>
    </header>

    <!-- 页面主体，可滚动区域 -->
    <main class="page-main">
      <div class="search search2">
        <i class="ico ico13 search-icon"></i>
        <input name="" placeholder="请输入联系人姓名" class="text" type="search">
        <input type="hidden" value="" id="customerType" name="customerType"/>
      </div>

      <div>
        <ul>
          <li>000001</li>
          <li>000002</li>
          <li>000003</li>
          <li>000004</li>
          <li>000005</li>
          <li>000006</li>
          <li>000007</li>
          <li>000008</li>
          <li>000009</li>
          <li>000010</li>
        </ul>
      </div>
    </main>
  </Page>
</template>
