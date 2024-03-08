export const URL = window.location.host.indexOf("onecode") > -1 ? "https://sibambo.onecode.id/" : window.location.protocol+"//"+window.location.host+"/xsample/"
export const APP_NAME = "SIBAMBO"
export const APP_REL_ICON = "https://assets-global.website-files.com/63d0f93b8842ec945ab130c6/651a89a898eca9a6ff71af1f_sm-ico-sbm.png"

export async function ajaxPost(u, p, h) {
    try {
        if (h)
            var r = await axios.post(u, p, h)
        else
            var r = await axios.post(u, p)
        if (r.status != 200) {
            return {
                status: "ERR",
                message: r.statusText
            };
        }
        let d = r.data;
        return d;
    } catch (e) {
        return {
            status: "ERR",
            message: e.message
        };
    }
}

export function moneyFormat(amount, currencySymbol = 'Rp', decimalSeparator = '.', thousandsSeparator = ',') {
    // Ensure the input is a number
    if (typeof amount !== 'number') {
      return 'Invalid input';
    }
  
    // Convert the number to a string with 2 decimal places
    const formattedAmount = amount.toFixed(2);
  
    // Split the string into parts before and after the decimal point
    const [integerPart, decimalPart] = formattedAmount.split('.');
  
    // Add thousands separators to the integer part
    const integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
    // Combine the integer and decimal parts with the appropriate symbols
    const formattedString = `${currencySymbol}${integerWithSeparators}${decimalSeparator}${decimalPart}`;
  
    return formattedString;
}

const current_date = function() {
    try {
        let x = moment().format('YYYY-MM-DD')
        return x
    } catch (error) {
        return null
    }
}

export const app = {
    namespaced: true,
    state : {
        search_status: 0,
        search_error_message: "",

        search_query: "",
        menus: [],

        MODULE_TITLE: '',
        APP_TITLE: 'SIBAMBO',
        NO_APP_BAR: false,
        USER_TOKEN: localStorage.getItem('token'),
        USER_DATA: localStorage.getItem('user'),
        URL: URL,

        THEME: 'dark',

        drawer: true,
        currentDate: current_date()
    },
    mutations : {
        set_object(state, v) {
            let name = v[0]
            let val = v[1]
            state[name] = val
        },
        SET_BAR_IMAGE (state, payload) {
            state.barImage = payload
        },
        SET_DRAWER (state, payload) {
        state.drawer = payload
        },
    },
    actions : {
        async postme(context, d) {
            let aurl = URL + 'api/' + d.url
            let prm = d.prm
            let hdr = d.hdr
            let callback = d.callback
            let failback = d.failback

            context.commit("set_object", ['search_status', 1])
            try {
                if (!prm.token) {
                    try {
                        prm.token = localStorage.getItem('token')
                    } catch (error) {
                    }
                }
                    
                let resp = await ajaxPost(aurl, prm, hdr)

                if (resp.status != "OK") {
                    context.dispatch('postme_fail', resp)
                    if (failback)
                        failback(resp.message)

                    return resp
                } else {
                    context.dispatch('postme_success')
                    if (callback)
                        callback(resp.data)

                    return resp.data
                }
            } catch (e) {
                context.dispatch('postme_fail', e)
                console.log(e)
                if (failback)
                    failback(e.message)
            }
        },

        postme_success(context) {
            context.commit("set_object", ['search_status', 2])
            context.commit("set_object", ['search_error_message', ""])
        },

        postme_fail(context, e) {
            context.commit("set_object", ['search_status', 3])
            context.commit("set_object", ['search_error_message', e.message])
        },
        
        async searchMenuGroup(context) {
            let prm = {
                token: localStorage.getItem('token')
            }

            return context.dispatch("postme", {
                url: "systm/menu/search_group",
                prm: prm,
                callback: function(d) {
                    return d
                }
            })
        },

        async logout(context) {
          return context.dispatch("postme", {
              url: "systm/user/logout",
              prm: {},
              callback: function(d) {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
  
                return true
              },
  
              failback: function(e) {
                context.commit("SET_OBJECT", ["message", e])
                context.commit("SET_OBJECT", ["err", true])
              }
          }, { root: true })
        },
    }
  };

export function ONE_TOKEN() {
    let x = ''
    try {
        x = localStorage.getItem('token')
    } catch (error) {
        x = ''
    }

    return x
}

export function ONE_MONEY(inp, format) {
    if (!inp)
        return 0
    return numeral(inp).format(format ? format : '0,000')
}