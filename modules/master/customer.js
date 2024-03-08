import { app } from "../../app.js?t=ewr"

export default {
    namespaced: true,
    state : {
        customers: [],
        total: 0,
        totalPage: 1,
        curPage: 1,
        selectedCustomer: null,

        provinces: [],
        selectedProvince: null,

        cities: [],
        selectedCity: null,

        // new
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        customerNote: "",
        customerEmail: "",
        customerPostcode: "",
        customerPicName: "",
        customerPicPhone: "",
        customerNpwp: "",
        customerAuto: "N",
        customerMps: [],
        customerJoinDate: app.state.currentDate,
        customerProspect: 'N',
        currentDate: app.state.currentDate,

        customerTypes: [{id:'N',text:'Personal'},{id:'Y',text:'Bisnis'}],
        selectedCustomerType: null,

        staffs: [],
        selectedStaff: null,

        phones: [],
        selectedPhone: null,
        templatePhone: {no:"",wa:"N"},

        banks: [],
        selectedBank: null,

        cbanks: [],
        selecedCbank: null,
        templateCbank: {bank:null,no:"",name:""},

        snackbar: false,
        snackbar_text: '',

        search: '',
        edit: false,
        dialog: false,
        dialogDelete: false,
    },
    mutations: {
        SET_OBJECT(state, v) {
            let name = v[0]
            let val = v[1]
            state[name] = val
        },
        SET_OBJECTS(state, v) {
            let name = v[0]
            let val = v[1]
            for (let i = 0; i < name.length; i++)
                state[name[i]] = val[i]
        },
    },
    actions: {
        async search(context) {
            let prm = {
                search: context.state.search,
                page: context.state.curPage
            }

            return context.dispatch("postme", {
                url: "master/customer/search",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECTS", [
                        ["customers", "total", "totalPage"],
                        [d.records, d.total, d.total_page]
                    ])
                    return d
                }
            }, { root: true })
        },

        async provinces(context) {            
            return context.dispatch("postme", {
                url: "master/province/search",
                prm: "",
                calback: function(d) {
                    context.commit("SET_OBJECTS", [['provinces'],[d.records]])
                }
            },{root:true})
        },

        async searchDd(context) {
            let prm = {
                search: context.state.search
            }

            return context.dispatch("postme", {
                url: "master/vendor/search_dd",
                prm: prm,
                callback: function(d) {
                    return d
                }
            }, { root: true })
        },

        async save(context) {
            let __s = context.state, __r = context.rootState
            let phones = []
            let banks = []
            let addresses = []
            
            // for (let p of context.state.phones)
            //     if (p.no != "") phones.push(p)

            // for (let b of context.state.cbanks)
            //     if (!!b.bank) banks.push({bank:b.bank.bank_id,number:b.no,name:b.name})

            // for (let ad of context.rootState.address.addresses)
            //     addresses.push({id:ad.address_id,name:ad.address_name,desc:ad.address_desc,
            //         city:ad.address_city.id,
            //         district:ad.address_district?ad.address_district.id:0,
            //         village:ad.address_village?ad.address_village.id:0,
            //         postcode:ad.address_postcode,pic_name:ad.address_pic_name,phones:ad.address_phones})
                
            console.log(__s.selectedCustomerType)
            let prm = {
                customer_name: __s.customerName,
                customer_address: __s.customerAddress,
                customer_phone: __s.customerPhone,
                customer_phones: JSON.stringify(phones),
                customer_note: __s.customerNote,
                customer_email: __s.customerEmail,
                customer_postcode: __s.customerPostcode,
                customer_pic_name: __s.customerPicName,
                customer_pic_phone: __s.customerPicPhone,
                customer_npwp: __s.customerNpwp,
                customer_type: __s.selectedCustomerType.id,
                customer_prospect: __s.customerProspect,
                customer_city_id: __r.misc.selectedCity.city_id,
                customer_district_id: __r.misc.selectedDistrict?__r.misc.selectedDistrict.district_id:0,
                customer_kelurahan_id: __r.misc.selectedVillage?__r.misc.selectedVillage.village_id:0,
                // customer_staff: context.state.selected_staff?context.state.selected_staff.staff_id:0,

                bdata: JSON.stringify(banks),
                addresses: JSON.stringify(addresses)
                // customer_join_date: context.state.customer_join_date,
            }

            if (__s.edit)
                prm.customer_id = __s.selectedCustomer.customer_id

            return context.dispatch("postme", {
                url: "master/customer/save",
                prm: prm,
                callback: function(d) {
                    return d
                }
            }, { root: true })
        },
        
        async del(context) {
            let id = context.state.selectedCustomer.customer_id
            return context.dispatch("postme",{
                url: "master/customer/del",
                prm: {customer_id:id},
                callback: function(d) {
                    
                    return d
                }
            }, { root: true })
        }
    }
}