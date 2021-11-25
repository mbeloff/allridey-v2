<template>
  <div class="flex flex-col relative">
    <!-- FILE UPLOADS -->
    <p class="text-xl font-bold text-left">Document Uploads</p>
    <div v-for="doc in doclist" class="border rounded p-2 text-left">
      <p>{{doc.customerfirstname + ' ' + doc.customerlastname}}</p>
      <p>{{doc.text}}</p>
      <button v-show="doc.isuploaded != 1" class="bg-green-300 rounded px-2 h-8" @click="openCloudinaryWidget(doc)">upload</button>
      <button v-show="doc.isuploaded" class="bg-red-300 rounded px-2 h-8" @click="editupload(doc.documentlinkid)">delete</button>
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
        Mixins.methods.postapiCall(method).then(res=>console.log(res))
      },      
      documentlist() {
        let method = JSON.stringify({
          "method": "documentlist",
          "workflowcode": "checkin",
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            console.log('returning doclist')
            this.doclist = res.results
            })
      },
      editupload(id) {
        let method = JSON.stringify({
          "method":"editupload",
          "reservationref":this.bookingdata.bookinginfo[0].reservationref,
          "documentlinkid": -id
        })
        console.log(JSON.parse(method))
        Mixins.methods.postapiCall(method)
        .then(res=>console.log(res))
        // .then(this.documentlist())
      }
    }
  }
</script>
<style>

</style>
