<template>
  <div class="flex flex-col md:flex-row gap-3 items-start">
    <!-- LEFT SIDE -->
    <div class="w-full md:w-2/6 order-2 md:order-1 px-1">
      <section-summary :resref="resref" :totals="totals" :bookingdata="bookingdata"></section-summary>
    </div>
    <!-- RIGHT SIDE -->
    <div class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2 p-2 md:p-5 bg-white rounded">
      <div class="flex flex-col relative">
        <!-- FILE UPLOADS -->
        <p class="text-xl font-bold text-left">Document Uploads</p>
        <div v-for="doc in doclist" class="border rounded p-1 text-left bg-gray-200 mb-1">
          <div class="flex">
            <div class="p-2 flex-grow flex flex-col justify-between">
              <div>
                <p class="font-bold">{{doc.customerfirstname + ' ' + doc.customerlastname}}</p>
                <p>{{doc.text}}</p>
              </div>

              <span v-if="doc.isuploaded" class="text-green-600 font-normal text-sm"><i class="far fa-check "></i> uploaded</span>

            </div>
            <div class="grid items-center text-center p-2 rounded bg-gray-100 flex-shrink">
              <span class="fa-stack fa-2x mx-auto">
                <i :class="{ 'opacity-10' : doc.isuploaded == 1}" class="fal fa-id-card fa-stack-2x"></i>
                <i :class="{ 'opacity-0' : doc.isuploaded == 0 }" class="fas fa-check fa-stack-1x text-green-500"></i>
              </span>
              <button v-show="doc.isuploaded != 1" class="btn-green" @click="openCloudinaryWidget(doc)">upload</button>
              <button v-show="doc.isuploaded" class="btn-red" @click="editupload(doc.documentlinkid)">delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import SectionSummary from './SectionSummary.vue'
  import Mixins from '../Mixins'
  export default {
    components: {
      SectionSummary
    },
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      totals: Array,
      resref: String
    },
    data() {
      return {
        doclist: {},
      }
    },
    created() {
      this.documentlist()
    },
    methods: {
      openCloudinaryWidget(doc) {
        let res
        window.cloudinary.openUploadWidget({
            cloud_name: 'allridey',
            api_key: '136961181187692',
            upload_preset: 'kdmxe571',
            sources: ['camera', 'local'],
            default_source: 'local',
            multiple: doc.allowmultiple,
            max_image_width: doc.maximagewidth,
            button_class: 'btn-primary',
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log('Done uploading..: ', result.info);
              res = result.info
              this.processUploadResult(doc, res);
            }
          })
      },
      processUploadResult(doc, res) {
        let method = JSON.stringify({
          "method": "storeupload",
          "documentlinksetupid": doc.documentlinksetupid,
          "url": res.url,
          "doctype": res.resource_type,
          "source": "post-booking",
          "reservationref": this.resref,
          "vehicleid": doc.vehicleid,
          "customerid": doc.customerid,
          "storageprovider": "cloudinary",
          "sequencenumber": doc.seqno
        })
        Mixins.methods.postapiCall(method).then(res => {
          console.log(res)
          this.documentlist()
        })
      },
      documentlist() {
        let method = JSON.stringify({
          "method": "documentlist",
          "workflowcode": "checkin",
          "reservationref": this.resref
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            this.doclist = res.results
          })
      },
      editupload(id) {
        let method = JSON.stringify({
          "method": "editupload",
          "reservationref": this.resref,
          "documentlinkid": -id
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            console.log(res)
            this.documentlist()
          })
      }
    }
  }
</script>
<style lang='postcss'>

</style>