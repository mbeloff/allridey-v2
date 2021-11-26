<template>
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
          <i :class="{ 'opacity-0' : doc.isuploaded == 0 }" class="fas fa-check fa-stack-1x text-green-500" ></i>
        </span>
        <button v-show="doc.isuploaded != 1" class="btn-green" @click="openCloudinaryWidget(doc)">upload</button>
        <button v-show="doc.isuploaded" class="btn-red" @click="editupload(doc.documentlinkid)">delete</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  export default {
    mixins: [Mixins],
    props: {
      bookingdata: Object
    },
    data() {
      return {
        doclist: {}
      }
    },
    mounted() {
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
          "reservationref": this.bookingdata.bookinginfo[0].reservationref,
          "vehicleid": doc.vehicleid,
          "customerid": doc.customerid,
          "storageprovider": "cloudinary",
          "sequencenumber": doc.seqno
        })
        Mixins.methods.postapiCall(method).then(res=>{
          console.log(res)
          this.documentlist()
          })
      },      
      documentlist() {
        let method = JSON.stringify({
          "method": "documentlist",
          "workflowcode": "checkin",
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            this.doclist = res.results
          })
      },
      editupload(id) {
        let method = JSON.stringify({
          "method":"editupload",
          "reservationref":this.bookingdata.bookinginfo[0].reservationref,
          "documentlinkid": -id
        })
        Mixins.methods.postapiCall(method)
        .then(res=>{
          console.log(res)
          this.documentlist()
          })
      }
    }
  }
</script>
<style lang='postcss'>

</style>
