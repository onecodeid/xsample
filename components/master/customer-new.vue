<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card class="rounded-3">
        <v-card-title class="py-2">
          {{ !edit ? 'INPUT' : 'UBAH' }} DATA CUSTOMER
          <v-spacer></v-spacer>
          <v-btn icon :dark="dark" @click="dialog = false" class="mr-3">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-btn :dark="dark" class="primary rounded-3" @click="save">
            Simpan
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-text-field label="Nama Customer" v-model="customerName" placeholder="Nama"></v-text-field>
            </v-col>

            <v-col cols="12" md="6" sm="6">
              <v-row>
                <v-col cols="4">
                  <v-select :items="customerTypes" v-model="selectedCustomerType" label="Tipe Customer" return-object
                    item-text="text" item-id="id"></v-select>
                </v-col>
                <v-col cols="8">
                  <v-text-field label="Nomor NPWP" v-model="customerNpwp"></v-text-field>
                </v-col>
              </v-row>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field label="Alamat Customer" v-model="customerAddress" prepend-inner-icon="place"
                :error="customerAddress.length < 10" :error-count="customerAddress.length < 10 ? 1 : 0"
                :error-messages="customerAddress.length < 10 ? ['Wajib diisi, Minimal 10 karakter'] : []"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-row>
                <v-col cols="12" md="6" sm="6">

                  <v-autocomplete label="Propinsi" v-model="selectedProvince" :items="provinces" return-object clearable
                    item-text="province_name" item-value="province_id" placeholder="Pilih Propinsi"
                    :error="!selectedProvince" :error-count="!selectedProvince ? 1 : 0"
                    :error-messages="!selectedProvince ? ['Pilih salah satu'] : []" :readonly="!!selectedProvince">
                    <template slot="item" slot-scope="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.province_name"></v-list-item-title>
                        <!-- <v-list-tile-sub-title v-text="getAddress(item)"></v-list-tile-sub-title> -->
                      </v-list-item-content>
                    </template>

                  </v-autocomplete>



                </v-col>
                <v-col cols="12" md="6" sm="6">
                  <v-autocomplete label="Kota" v-model="selectedCity" :items="cities" return-object clearable
                    item-text="city_name" item-value="city_id" placeholder="Pilih Kota"
                    :disabled="selectedProvince == null" :readonly="!!selectedCity">
                    <template slot="item" slot-scope="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.city_name"></v-list-item-title>
                      </v-list-item-content>
                    </template>

                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6" sm="6">
                  <v-autocomplete label="Kecamatan" v-model="selectedDistrict" :items="districts" return-object clearable
                    item-text="district_name" item-value="district_id" placeholder="Pilih Kecamatan"
                    :disabled="selectedProvince == null || selectedCity == null" :readonly="!!selectedDistrict">
                    <template slot="item" slot-scope="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.district_name"></v-list-item-title>
                      </v-list-item-content>
                    </template>

                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6" sm="6">
                  <v-autocomplete label="Kelurahan" v-model="selectedVillage" :items="villages" return-object clearable
                    item-text="village_name" item-value="village_id" placeholder="Pilih Kelurahan"
                    :disabled="selectedProvince == null || selectedCity == null || selectedDistrict == null"
                    :readonly="!!selectedVillage">
                    <template slot="item" slot-scope="{ item }">
                      <v-list-item-content>
                        <v-list-item-title v-text="item.village_name"></v-list-item-title>
                      </v-list-item-content>
                    </template>

                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="4" sm="4">
                  <v-text-field label="Kode Pos" v-model="customerPostcode" placeholder=""></v-text-field>
                </v-col>

                <v-col cols="12" sm="8" md="8">
                  <v-text-field label="Email" v-model="customerEmail" prepend-inner-icon="email"
                    placeholder="ex : someone@gmail.com" :error="!emailValidate" :error-count="emailValidate ? 0 : 1"
                    :error-messages="['Email harus diisi, Format email harus benar']"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-row>
                <v-col cols="8">
                  <v-text-field v-show="selectedCustomerTypeID == 'Y'" label="Nama PIC" v-model="customerPicName"
                    :error="customerPicName == ''" :error-count="customerPicName == '' ? 1 : 0"
                    :error-messages="customerPicName == '' ? ['Wajib diisi'] : []"></v-text-field>
                  <v-text-field v-show="selectedCustomerTypeID == 'N'" label="Nama PIC (hanya untuk bisnis)"
                    v-model="customerName" disabled></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field :disabled="selectedCustomerTypeID == 'N'" label="No HP PIC" v-model="customerPicPhone"
                    prefix="+62"></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea label="Catatan" placeholder=" " rows="2" v-model="customerNote"></v-textarea>
                </v-col>
              </v-row>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
/* div.row > [class^=col] {
  padding-bottom: 0px;
} */

/* div.row > [class^="col"]:not(:first-child) {
  padding-top: 0px;
} */
</style>
<script>
module.exports = {
  components: {
  },

  data: function () {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      dark: false,

      selectedCustomerTypeID: 'Y'
    }
  },

  computed: {
    __s() { return this.$store.state.masterCustomer },
    __smisc() { return this.$store.state.misc },

    ...Vuex.mapState({
      provinces: state => state.misc.provinces,
      cities: state => state.misc.cities,
      districts: state => state.misc.districts,
      villages: state => state.misc.villages,
      customerTypes: state => state.masterCustomer.customerTypes
    }),

    edit() {
      return this.__s.edit
    },

    dialog: {
      get() { return this.__s.dialog },
      set(v) { this.__c("dialog", v) }
    },

    customerName: {
      get() { return this.__s.customerName },
      set(v) { this.__c("customerName", v) }
    },

    customerNote: {
      get() { return this.__s.customerNote },
      set(v) { this.__c("customerNote", v) }
    },

    customerAddress: {
      get() { return this.__s.customerAddress },
      set(v) { this.__c("customerAddress", v) }
    },

    selectedProvince: {
      get() { return this.__smisc.selectedProvince },
      set(v) {
        this.__cmisc("selectedProvince", v)
        if (!!v) this.$store.dispatch("misc/searchCity")
        else this.__cmisc("cities", [])
      }
    },

    selectedCity: {
      get() { return this.__smisc.selectedCity },
      set(v) {
        this.__cmisc("selectedCity", v)
        if (!!v) this.$store.dispatch("misc/searchDistrict")
        else this.__cmisc("districts", [])
      }
    },

    selectedDistrict: {
      get() { return this.__smisc.selectedDistrict },
      set(v) {
        this.__cmisc("selectedDistrict", v)
        if (!!v) this.$store.dispatch("misc/searchVillage")
        else this.__cmisc("villages", [])
      }
    },

    selectedVillage: {
      get() { return this.__smisc.selectedVillage },
      set(v) {
        this.__cmisc("selectedVillage", v)
      }
    },

    customerPostcode: {
      get() { return this.__s.customerPostcode },
      set(v) { this.__c('customerPostcode', v) }
    },

    customerEmail: {
      get() { return this.__s.customerEmail },
      set(v) { this.__c('customerEmail', v) }
    },

    customerPicName: {
      get() { return this.__s.customerPicName },
      set(v) { this.__c('customerPicName', v) }
    },

    customerPicPhone: {
      get() { return this.__s.customerPicPhone },
      set(v) { this.__c('customerPicPhone', v) }
    },

    emailValidate() {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.customerEmail).toLowerCase())
    },

    selectedCustomerType: {
      get() { return this.__s.selectedCustomerType },
      set(v) {
        this.__c("selectedCustomerType", v)
      }
    },

    customerNpwp: {
      get() { return this.__s.customerNpwp },
      set(v) { this.__c('customerNpwp', v) }
    }
  },

  methods: {
    __c(a, b) { return this.$store.commit("masterCustomer/SET_OBJECT", [a, b]) },
    __d(a) { return this.$store.dispatch("masterCustomer/" + a) },

    __cmisc(a, b) { return this.$store.commit("misc/SET_OBJECT", [a, b]) },

    save() {
      this.__d("save").then((x) => {
        this.__c("dialog", false)
        this.__d("search")
      })
    }
  },

  mounted() {
  }
}
</script>