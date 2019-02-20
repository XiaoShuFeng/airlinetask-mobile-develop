<template>
    <div>
        <x-header class="header-bar" :left-options="{showBack: true}">故障录入</x-header>
        <div class="content">
            <group title="故障内容" label-width="5.5em" label-margin-right="2em" label-align="justify">
                <cell title="开发中，敬请期待..." value=""></cell>
                <x-input title="上报人" v-model="value1"></x-input>
                <x-number title="数量" align="right" v-model="numberValue" button-style="round" :min="0" :max="5"></x-number>
                <datetime title="时间" v-model="time1" value-text-align="left"></datetime>
                <selector title="隐患类别" :options="['工艺技术', '其他']" v-model="value2"></selector>
                <popup-picker title="请选择" :data="list" v-model="value5" value-text-align="left"></popup-picker>
                <x-address title="地址选择" v-model="addressValue" raw-value :list="addressData" value-text-align="left" label-align="justify"></x-address>
                <x-switch title="选择"></x-switch>
                <x-textarea title="详细信息" placeholder="请填写详细信息" :show-counter="false" :rows="3"></x-textarea>
            </group>
        </div>
    </div>
</template>

<script>
import { Group, XHeader, Cell, XInput, XNumber, Datetime, Selector, ChinaAddressData, XAddress, XTextarea, XSwitch, PopupPicker } from 'vux'
export default {
  components: {
    XHeader,
    Cell,
    XInput,
    Datetime,
    Selector,
    ChinaAddressData,
    XAddress,
    XTextarea,
    XSwitch,
    PopupPicker,
    XNumber,
    Group
  },
  data () {
    return {
      addressData: ChinaAddressData
    }
  }
}
</script>

<style scoped>
</style>
