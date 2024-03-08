export default {
    namespaced: true,
    state: {
        citySearch: "",
        cities: [],
        selectedCity: null,

        provinces: [],
        selectedProvince: null,
        provinceSearch: '',

        districtSearch: "",
        districts: [],
        selectedDistrict: null,

        villageSearch: "",
        villages: [],
        selectedVillage: null,

        // dialogs
        dialogDelete: false,
        dialogDelete02: false,
        dialogPrint: false,

        // contacts
        contacts: [],
        contacts_cnt: 2,
        contact_default: {id:0,type:"P",desc:""},
        contact_id: 0,

        // status
        statusPrefix: '',
        statusSearch: ''
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

        setContactsForm(state) {
            let c = state.contact_default, n = state.contacts_cnt, contacts = JSON.parse(JSON.stringify(state.contacts))
            for (let i = contacts.length; i<n; i++) contacts.push(JSON.parse(JSON.stringify(c)))

            state.contacts = contacts
        }
    },
    actions: {
        async searchProvince (context) {
            let prm = {
                search: context.state.provinceSearch
            }

            return context.dispatch("postme", {
                url: "master/province/search",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECT", ["provinces", d.records])
                    return d
                }
            }, { root: true })
        },

        async searchCity (context) {
            let prm = {
                province_id: context.state.selectedProvince.province_id,
                search: context.state.citySearch
            }

            return context.dispatch("postme", {
                url: "master/city/search_dd",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECT", ["cities", d.records])
                    return d
                }
            }, { root: true })
        },

        async searchDistrict (context) {
            let prm = {
                city_id: context.state.selectedCity.city_id,
                search: context.state.districtSearch
            }

            return context.dispatch("postme", {
                url: "master/district/search",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECT", ["districts", d.records])
                    return d
                }
            }, { root: true })
        },

        async searchVillage (context) {
            let prm = {
                district_id: context.state.selectedDistrict.district_id,
                search: context.state.villageSearch
            }

            return context.dispatch("postme", {
                url: "master/kelurahan/search",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECT", ["villages", d.records])
                    return d
                }
            }, { root: true })
        },

        async searchStatus (context) {
            let prm = {
                prefix: context.state.statusPrefix,
                search: context.state.statusSearch
            }

            return context.dispatch("postme", {
                url: "master/status/search_dd",
                prm: prm,
                callback: function(d) {
                    return d
                }
            }, { root: true })
        }
    }
}