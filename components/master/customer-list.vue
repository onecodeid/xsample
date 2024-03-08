<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-title primary-title class="py-2">
                    <v-row>
                        <v-col cols="9"><h5 class="font-weight-bold text-h5 text-typo mb-0">DATA CUSTOMER</h5>
                            <p class="text-sm text-body font-weight-light mb-0"> Features include sorting, searching, pagination, content-editing, and row selection. </p></v-col>
                        <v-col cols="3"><searchbar @add="add" @search="search" @change="query"></searchbar></v-col>
                    </v-row>
                </v-card-title>
                <v-card-text class="py-2 px-3">
                    <v-data-table
                        :headers="headers"
                        :items="customers"
                        :items-per-page="10"
                        class="elevation-1"
                        hide-default-footer
                    >
                    <template v-slot:item="{ item }">
                        <tr @dblclick="edit(item)">
                            <td>{{ item.customer_code }}</td>
                            <td><b>{{ item.customer_name }}</b></td>
                            <td>{{ item.customer_address }}</td>
                            <td>{{ item.city_name }}</td>
                            <td>{{ item.customer_type == 'Y' ? 'BISNIS' : 'PERSONAL' }}</td>
                            <td class="text-center">
                                
                                <!-- <v-btn color="primary" class="" icon depressed @click="edit(item)" small>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn color="red red-lighten-5--text" icon depressed @click="del(item)" small>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn> -->

                                <v-menu
                                    bottom
                                    left
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-btn  color="primary"
                                        dark
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-icon>mdi-dots-horizontal</v-icon>
                                    </v-btn>
                                    </template>

                                    <v-list>
                                        <!-- <v-list-item class="px-1">
                                                <v-btn color="primary" class="" depressed block @click="edit(item)" small>
                                                    <v-icon small class="mr-2">mdi-pencil</v-icon> Ubah
                                                </v-btn>
                                                
                                            
                                        </v-list-item>
                                        <v-list-item class="px-1">
                                            <v-btn color="primary" class="" depressed block @click="del(item)" small>
                                                <v-icon small class="mr-2">mdi-delete</v-icon> Hapus
                                            </v-btn>
                                        </v-list-item> -->
                                        <v-list-item>
                                            <v-list-item-title><a href="javascript:;" @click="edit(item)"><v-icon small class="mr-2">mdi-pencil</v-icon> Ubah</a></v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title><a href="javascript:;" @click="del(item)"><v-icon small class="mr-2">mdi-delete</v-icon> Hapus</a></v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>
                    </template>
                    </v-data-table>        
                </v-card-text>
                <v-card-actions>
                    <v-pagination v-model="curPage" :length="totalPage" :total-visible="7"
                    ></v-pagination>
                </v-card-actions>
            </v-card>
        </v-col>

        <ddelete @todo="doDel"></ddelete>
    </v-row>
    
    <!-- <v-card>
        <v-card-title primary-title class="pt-2 pb-0">
            <v-layout row wrap>
                <v-flex xs6>
                    <h3 class="display-1 font-weight-light zalfa-text-title">DATA VENDOR</h3>
                </v-flex>
                <v-flex xs2 pr-2>
                    <v-autocomplete
                            label="Propinsi"
                            v-model="selectedProvince"
                            :items="provinces"
                            auto-select-first
                            return-object
                            clearable
                            item-text="province_name"
                            item-value="province_id"
                            placeholder="Semua Propinsi"
                            hide-details
                            solo
                            >
                            <template
                                slot="item"
                                slot-scope="{ item }"
                                >
                                <v-list-tile-content>
                                <v-list-tile-title v-text="item.province_name"></v-list-tile-title>
                                </v-list-tile-content>
                            </template>
                        </v-autocomplete>
                </v-flex>

                <v-flex xs2 pr-2>
                    <v-autocomplete
                            label="Kota"
                            v-model="selectedCity"
                            :items="cities"
                            auto-select-first
                            return-object
                            clearable
                            item-text="M_CityName"
                            item-value="M_CityID"
                            placeholder="Semua Kota"
                            :disabled="selectedProvince == null"
                            solo
                            hide-details
                            >
                            <template
                                slot="item"
                                slot-scope="{ item }"
                                >
                                <v-list-tile-content>
                                <v-list-tile-title v-text="item.M_CityName"></v-list-tile-title>
                                </v-list-tile-content>
                            </template>

                        </v-autocomplete>
                </v-flex>

                <v-flex xs2 class="text-xs-right" pl-3>
                    
                    <v-text-field
                        solo
                        hide-details
                        placeholder="Pencarian" 
                        v-model="query"
                        @keyup="do_search($event)"
                    >
                        <template v-slot:append-outer>
                            <v-btn color="primary" class="ma-0 btn-icon" @click="do_search">
                                <v-icon>search</v-icon>
                            </v-btn>      

                            <v-btn color="success" class="ma-0 ml-2 btn-icon" @click="add">
                                <v-icon>add</v-icon>
                            </v-btn>  
                        </template>
                    </v-text-field>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-card-text class="pt-2">
            <v-data-table 
                :headers="headers"
                :items="customers"
                :loading="false"
                hide-actions
                class="elevation-1">
                <template slot="items" slot-scope="props">
                    <td class="text-xs-left pa-2" v-bind:class="level_color(props.item.customer_type)" @click="select(props.item)"><b>{{ props.item.customer_code }}</b></td>
                    <td class="text-xs-left pa-2" v-bind:class="level_color(props.item.customer_type)" @click="select(props.item)"><b>{{ props.item.customer_name }}</b><br>
                    <div v-show="props.item.customer_prospect=='Y'" class="blue--text"><i>( Prospek )</i></div>
                    </td>
                    <td class="text-xs-left pa-2" v-bind:class="level_color(props.item.customer_type)" @click="select(props.item)">{{ props.item.customer_address }}, {{ props.item.address_kelurahan }}</td>
                    <td class="text-xs-left pa-2" v-bind:class="level_color(props.item.customer_type)" @click="select(props.item)">{{ props.item.city_name }}</td>
                    <td class="text-xs-left pa-2" v-bind:class="level_color(props.item.customer_type)" @click="select(props.item)">{{ props.item.province_name }}</td>
                    <td class="text-xs-center pa-0" v-bind:class="level_color(props.item.customer_type)" @click="select(props.item)">
                        <v-btn color="primary" class="btn-icon ma-0" small @click="edit(props.item)"><v-icon>create</v-icon></v-btn>
                        <v-btn color="red" dark class="btn-icon ma-0" small @click="del(props.item)"><v-icon>delete</v-icon></v-btn>
                    </td>
                </template>
            </v-data-table>
            <v-divider></v-divider>
            <v-pagination
                style="margin-top:10px;margin-bottom:10px"
                v-model="curr_page"
                :length="xtotal_page"
                @input="change_page"
            ></v-pagination>
        </v-card-text>
        <v-snackbar
            v-model="snackbar"
            multi-line
            :timeout="3000"
            top
            vertical
            >
            {{ snackbar_text }}
            <v-btn
                color="pink"
                flat
                @click="snackbar = false"
            >
                Tutup
            </v-btn>
        </v-snackbar>
        <common-dialog-delete :data="customer_id" @confirm_del="confirm_del" v-if="dialog_delete"></common-dialog-delete>
    </v-card> -->
</template>

<script>
module.exports = {
    components : {
        searchbar: httpVueLoader("../_common/search_bar.vue"),
        ddelete: httpVueLoader("../_common/delete_dialog.vue"),
    },

    data () {
        return {
            items: [
                { title: 'Ubah' },
                { title: 'Hapus' },
                { title: 'Click Me' },
                { title: 'Click Me 2' },
            ],
        }
    },

    computed : {
        __s () { return this.$store.state.masterCustomer },
        
        headers () {
            let h = [
                ['NOMOR', 'customer_code', '10%'],
                ['NAMA', 'customer_name', '20%'],
                ['ALAMAT', 'customer_address'],
                ['KOTA', 'customer_city', '15%'],
                ['TIPE', 'customer_type', '10%'],
                ['TODO', null, '7%','center']
            ]
            let hdrs = []
            for (let x of h) {
                hdrs.push({text: x[0], align: x[3]?x[3]:'start', sortable: false, value: x[1]?x[1]:'', 
                class: 'subtitle-1', width: x[2]?x[2]:0})
            }
            return hdrs
        },

        provinces () {
            return this.__s.provinces
        },

        customers () {
            return this.__s.customers
        },

        total () {
            return this.__s.totalVendor
        },

        totalPage () {
            return this.__s.totalVendorPage
        },

        curPage : {
            get () { return this.__s.curPage },
            set (v) { this.__c("curPage", v) }
        },

        query : {
            get () { return this.__s.search },
            set (v) { this.__c('search', v) }
        }
    },

    methods : {
        __c (a,b) { return this.$store.commit("masterCustomer/SET_OBJECT", [a, b]) },
        __d (a) { return this.$store.dispatch("masterCustomer/" + a) },

        add () {
            this.__c('edit', false)
            this.__c('customerName','')
            this.__c('customerAddress','')
            this.__c('customerPhone','')
            this.__c('customerNote','')
            this.__c('customerEmail','')
            this.__c('customerPostcode','')
            this.__c('customerPicName','')
            this.__c('customerPicPhone','')
            this.__c('customerNpwp','')
            this.__c('customerProspect', 'N')
            this.__c('phones', [])
            this.__c('cbanks', [])
            this.__c("selectedCustomerType", null)
            // this.$store.commit('address/set_addresses', [])
            // this.$store.commit('address/set_selected_address', null)
            
            this.__c('selectedProvince', null)
            this.__c('selectedCity', null)
            this.__c('selectedDistrict', null)
            this.__c('selectedVillage', null)
            this.__c('dialog', true)
        },

        edit (x) {
            this.select(x)
            let sc = x, 
                __cmisc = function(x,a,b){return x.$store.commit("misc/SET_OBJECT",[a,b])},
                __dmisc = function(x,a){return x.$store.dispatch("misc/"+a)}

            this.__c('edit', true)
            this.__c('customerName',sc.customer_name)
            this.__c('customerAddress', sc.customer_address)
            this.__c('customerPhone', sc.customer_phone)
            this.__c('customerNote', sc.customer_note)
            this.__c('customerEmail', sc.customer_email)
            this.__c('customerPostcode', sc.customer_postcode?sc.customer_postcode:'')
            this.__c('customerPicName', sc.customer_pic_name?sc.customer_pic_name:'')
            this.__c('customerPicPhone', sc.customer_pic_phone?sc.customer_pic_phone:'')
            this.__c('customerNpwp', sc.customer_npwp?sc.customer_npwp:'')
            this.__c('customerProspect', sc.customer_prospect?sc.customer_prospect:'N')
            this.__c('phones', sc.customer_phones)
            this.__c('cbanks', sc.banks)
            this.__c("selectedCustomerType", null)

            __cmisc(this, 'selectedProvince', null)
            __cmisc(this, 'selectedCity', null)
            __cmisc(this, 'selectedDistrict', null)
            __cmisc(this, 'selectedVillage', null)
            
            for (let ct of this.__s.customerTypes)
            if (ct.id == x.customer_type)
                this.__c("selectedCustomerType", ct)
            // let teritories=["province","city","district","village"], tn = 0
            // while (tn < 4) {
            //     let ter=teritories[tn].charAt(0).toUpperCase() + teritories[tn].slice(1)
            //     __dmisc(this, "search"+ter).then(p => {
                    
            //     })
            //     tn++
            // }
            __dmisc(this, "searchProvince").then(p => {
                for (let pp of p.records)
                if (pp.province_id==x.province_id) {
                    __cmisc(this, "selectedProvince", pp)
                    __dmisc(this, "searchCity").then(c => {
                        for (let cc of c.records)
                        if (cc.city_id==x.city_id) {
                            __cmisc(this, "selectedCity", cc)
                            __dmisc(this, "searchDistrict").then(d => {
                                for (dd of d.records)
                                if (dd.district_id==x.district_id) {
                                    __cmisc(this, "selectedDistrict", dd)
                                    __dmisc(this, "searchVillage").then(v => {
                                        for (vv of v.records)
                                        if (vv.village_id==x.village_id) __cmisc(this, "selectedVillage", vv)
                                    })
                                }
                                    
                            })
                        }
                    })
                }
            })

            this.__c('dialog', true)
        },

        del (x) {
            this.select(x)
            this.$store.commit("misc/SET_OBJECT", ["dialogDelete", true])
            // this.__c('dialogDelete', true)
        },

        doDel (x) {
            this.__d('del').then(x => {
                if (x.status && x.status == 'ERR')
                    alert(x.message)
                else {
                    this.$store.commit("misc/SET_OBJECT", ["dialogDelete", false])
                    this.search()
                }
            })
        },

        select (x) {
            this.__c('selectedCustomer', x)
        },

        // change_page(x) {
        //     this.curr_page = x
        //     this.$store.dispatch('vendor/search', {})
        // },

        do_search(e) {
            if (e.which == 13)
                this.search()
        },

        search() {
            this.__d("search")
        },

        // level_color (x) {
        //     if (x == 'Y')
        //         return 'cyan lighten-4'
        //     return 'white'
        // },
        
        // report () {
        //     let params = ['province_id='+(this.selected_province?this.selected_province.M_ProvinceID:0), 
        //             'city_id='+(this.selected_city?this.selected_city.M_CityID:0),
        //             'level_id='+(this.selected_level?this.selected_level.M_VendorLevelID:0),
        //             'token='+this.$store.state.vendor.token].join('&')
        //     let urls = this.$store.state.vendor.URL+'report/one_master_001'+
        //                 '?'+params
        //     this.$store.commit('vendor/set_common', ['report_url', urls])
        //     this.$store.commit('set_dialog_print', true)
        // },

        // duration(x) {
        //     let d1 = window.moment(x)
        //     let d2 = window.moment(window.moment().format("YYYY-MM-DD"))

        //     let y = d2.diff(d1, "years")
        //     let m = d2.diff(d1, "months")
        //     let md = d2.diff(d1, "months", true)
        //     let d = d2.diff(d1, "days")
        //     if (y < 1) {
        //         if (m > 0 && d > 14)
        //             return m + ",5 bulan"
        //         else if (m > 0)
        //             return m + " bulan"
        //         else
        //             return d + " hari"
        //     } else if (y < 5 && m > 5) {
        //         return y + ",5 tahun"
        //     } else {
        //         return y + " tahun"
        //     }
        // }
    },

    mounted () {
        this.$store.dispatch('masterCustomer/provinces', {})

        console.log(this.__s.currentDate)
    },

    watch : {
        selectedCity (v, o) {
            if (v != o)
                this.$store.dispatch('masterCustomer/search', {})
        },

        selectedProvince (v, o) {
            if (v != o)
                if (this.$store.state.masterCustomer.selectedCity != null)
                    this.$store.commit('masterCustomer/setSelectedCity', null)
                else
                    this.$store.dispatch('masterCustomer/search', {})
        }
    }
}
</script>