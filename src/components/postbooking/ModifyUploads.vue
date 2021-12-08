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
        <div v-for="doc in doclist" class="border rounded p-1 text-left bg-gray-200 mb-1 text-sm">
          <div class="flex">
            <div class="p-2 flex-grow flex flex-col justify-between">
              <div>
                <p class="font-bold">{{doc.customerlastname + ', ' + doc.customerfirstname}}</p>
                <p>{{doc.title}}</p>
              </div>

              <span v-if="doc.isuploaded" class="text-green-600 font-normal text-sm"><i class="far fa-check "></i> uploaded</span>
            </div>

            <div class="grid items-center text-center p-2 rounded bg-gray-100 flex-shrink">
              <span class="fa-stack fa-2x mx-auto">
                <i :class="iconClass(doc)" class="fa-thin fa-stack-2x text-gray-500"></i>
                <i :class="{ 'opacity-0' : doc.isuploaded == 0 }" class="fas fa-check fa-stack-1x text-green-500"></i>
              </span>
              <button v-show="doc.isuploaded != 1" class="btn-green mt-2" @click="openCloudinaryWidget(doc)">upload</button>
              <button v-show="doc.isuploaded" class="btn-red mt-2" @click="editupload(doc.documentlinkid)">delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import SectionSummary from '@/components/postbooking/BookingSummary.vue'
  import Mixins from '@/Mixins'
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
            // button_class: 'btn-primary',
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
            this.doclist = res.results.sort((a, b) => a.customerlastname.localeCompare(b.customerlastname))
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
      },
      iconClass(doc) {
        return {
          'opacity-20' : doc.isuploaded == 1,
          'fa-id-card' : doc.title == "Take a photo of the front of your driving license",
          'fa-image-user' :doc.title == "Take a Selfie",
          'fa-credit-card-blank fa-flip-vertical': doc.title == "Take a photo of the back of your driving license"
        }
      }
    },
  }
</script>
<style lang='postcss'>

</style>