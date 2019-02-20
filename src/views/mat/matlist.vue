<template>
    <div>
        <x-header class="header-bar" :left-options="{showBack: false}">航材查询</x-header>
        <search v-model="partNo" placeholder="搜索件号" position="absolute" auto-scroll-to-top top="46px" @on-cancel="onCancel" @on-submit="onSubmit" ref="matSearch"></search>
        <div class="matlist-view">
            <scroller ref="matlist" class="scroller-view" height="90%">
                <!--matitem v-for="(item, index) in items" :key="index" :item="item"></matitem-->
                <group v-if="items.length > 0" class="group-item" title="国航航材库" label-width="5.5em" label-margin-right="2em" label-align="justify">
                    <cell v-for="(item, index) in items" :key="index" :title="item.werks" :is-link='false' :inline-desc="item.maktx">
                         <div slot="after-title" style="color:#E59313">{{item.matnr}}</div>
                         <div slot="default" style="color:red">{{item.lgort}}</div>
                         <div slot="default" style="color:#000000; font-weight:bold">{{item.charg}}</div>
                    </cell>
                </group>

                <group class="group-item" v-if="amecoItems.length > 0" title="Ameco航材库" label-width="5.5em" label-margin-right="2em" label-align="justify">
                    <cell v-for="(item, index) in amecoItems" :key="index" :title="item.plant" :is-link='false' :inline-desc="item.maktx">
                         <div slot="after-title" style="color:#E59313">{{item.material_no}}</div>
                         <div slot="default" style="color:red">{{item.location}}</div>
                         <div slot="default" style="color:#000000; font-weight:bold">{{item.charg}}</div>
                    </cell>
                </group>
            </scroller>
        </div>
    </div>
</template>

<script>
import { XHeader, Search, Group, Cell } from 'vux'
import { fetchListByPN } from '@/api/mat'
import { showAlertAuto } from '@/utils/index'
export default {
  data () {
    return {
      items: [],
      total: 0,
      partNo: '',
      amecoItems: []
    }
  },
  components: {
    XHeader,
    Search,
    Group,
    Cell
  },
  methods: {
    getList (val) {
      this.$store.commit('UPDATE_LOADING_STATUS', true)
      fetchListByPN({matpn: this.partNo}).then(response => {
        this.$store.commit('UPDATE_LOADING_STATUS', false)
        if (response.data.result === 'fail') {
          showAlertAuto('提示！', response.data.info)
        } else {
          this.items = response.data.data
          this.amecoItems = response.data.amecodata
        }
      })
    },
    onSubmit () {
      this.$refs.matSearch.setBlur()
      this.getList()
    },
    onCancel () {
      this.partNo = ''
      this.items = []
      this.amecoItems = []
    }
  }
}
</script>

<style scoped>
.matlist-view {
    margin-top: 40px;
    margin-bottom: 50px;
}
.scroller-view {
  margin-top: 70px;
  margin-bottom: 40px;
}
.group-item {
  margin-top: 20px;
}
</style>

