export default {
    namespaced: true,
    state: {
        employees: [],
        totalPos: 0,
        totalPosPage: 1,
        curPage: 1,
        selectedEmployee: null,
        search: "",

        employeePositionId: '',
        employeeCode: '',
        employeeName: '',
        employeeDOB: '',
        employeeAddress: '',
        employeeCity:'',
        employeeProvinceId: 0,
        employeeCityId: 0,
        employeeContact: '',
        employeeContactId: '',
        employeeJoinDate: '',
        employeeNote: '',
        posId: 0,

        cities: [],
        contacts: [],

        edit: false,
        dialog: false,
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
        }
    },
    actions: {
        async search(context) {
            let prm = {
                search: context.state.search,
                page: context.state.curPage
            }

            return context.dispatch("postme", {
                url: "master/employee/search",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECTS", [
                        ["employees", "totalPos", "totalPosPage"],
                        [d.records, d.total, d.total_page]
                    ])
                    return d
                }
            }, { root: true })
        },

        async searchDd(context) {
            let prm = {
                search: context.state.search
            }

            return context.dispatch("postme", {
                url: "master/employee/search_dd",
                prm: prm,
                callback: function(d) {
                    return d
                }
            }, { root: true })
        },

        async city(context) {
            let prm = {
                search: context.state.search,
                page: context.state.curPage,
                limit: 0,
            }

            return context.dispatch("postme", {
                url: "master/city/search",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECTS", [
                        ["cities", "totalPos", "totalPosPage"],
                        [d.records, d.total, d.total_page]
                    ])
                    return d
                }
            }, { root: true })
        },

        async contact(context) {
            let prm = {
                search: context.state.search,
                page: context.state.curPage
            }

            return context.dispatch("postme", {
                url: "master/contact/search",
                prm: prm,
                callback: function(d) {
                    context.commit("SET_OBJECTS", [
                        ["contacts", "totalPos", "totalPosPage"],
                        [d.records, d.total, d.total_page]
                    ])
                    return d
                }
            }, { root: true })
        },
        async save(context) {
            let prm = {
                employee_positionid: context.state.employeePositionId,
                employee_code: context.state.employeeCode,
                employee_name: context.state.employeeName,
                employee_dob: context.rootState.xdate.date01,
                employee_address: context.state.employeeAddress,
                employee_cityid: context.state.employeeCityId,
                employee_contactid: context.state.employeeContactId,
                employee_joindate: context.rootState.xdate.date02,
                employee_note: context.state.employeeNote,
                employee_id: context.state.posId
            }

            return context.dispatch("postme", {
                url: "master/employee/save",
                prm: prm,
                callback: function (d) {
                    return d
                }
            }, {root: true})
        },

        async delete(context) {
            let id = context.state.selectedEmployee.employee_id
            return context.dispatch("postme",{
                url: "master/employee/del",
                prm: {id:id},
                callback: function(d) {
                    return d
                }
            }, { root: true })
        }
    }
}