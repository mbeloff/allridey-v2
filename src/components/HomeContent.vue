<template>
  <div class="p-10 text-center">
    <div class="w-full h-full grid place-items-center">
      <h1 class="text-6xl mt-8 mb-3">Allridey</h1>
      <span class="">
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
      </span>
      <!-- <p class="text-xl mt-4 mb-4">Find cars and campervans in <span v-if="locationcount > 0">{{locationcount}}</span> locations across Australia and New Zealand</p> -->
      <p class="text-xl mt-4 mb-4">Car Rental</p>
      <p>
        Allridey offers great value car and van rentals with
        {{ locationcount }} locations around Australia and New Zealand. We've
        got the best prices - get an instant quote and book online today.
      </p>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-10 md:gap-10">
    <div
      v-for="(article, index) in articles"
      :key="index"
      class="w-full text-left rounded"
      :class="article.cols"
    >
      <div class="bg-white rounded shadow-lg group">
        <div
          class="h-48 rounded-t bg-cover bg-center relative"
          :style="{ 'background-image': 'url(' + article.img + ')' }"
        >
          <div
            class="absolute opacity-50 group-hover:opacity-100 transition ease-out bg-gradient-to-r h-full w-full rounded-t transtiion-colors"
            :class="'from-' + article.color + '-400'"
          ></div>
          <div class="absolute h-full w-full">
            <p
              v-if="article.overlaytext"
              class="pl-2 pt-2 text-4xl md:text-6xl font-bold italic text-white"
              v-html="article.overlaytext"
            ></p>
            <img
              v-if="article.overlayimg"
              class="h-full w-full object-scale-down"
              :src="article.overlayimg"
              alt=""
            />
          </div>
        </div>
        <div class="rounded-b p-2 flex flex-col gap-2">
          <p class="font-bold">{{ article.title }}</p>
          <p class="text-sm" v-html="article.content"></p>
          <router-link
            v-if="article.linksto"
            :to="{ name: article.linksto }"
            class="text-sm text-blue-800 cursor-pointer group"
            @click="scroll(article.scroll)"
            >{{ article.linktext }}
            <i
              class="fal fa-chevron-right transition ease-out duration-500 transform group-hover:translate-x-1"
            ></i
          ></router-link>
        </div>
      </div>
    </div>
  </div>
  <div class="py-20 text-left grid gap-2">
    <p>
      Welcome to Allridey - Your Affordable Car Rental Solution in Australia! At
      Allridey, we understand the importance of hassle-free and budget-friendly
      travel. That's why we offer affordable car rental options in locations all
      over the country to suit all your travel needs. Whether you're on a
      business trip or exploring the Australia's gorgeous landscapes, we have
      the perfect vehicle for you at great everyday prices.
    </p>
    <p>
      Ensure your journey is comfortable and convenient, with our budget small
      and mid-sized cars. At Allridey, we pride ourselves on great customer
      service and flexible options to suit your budget. Our team of experts is
      always available to help you with any questions or concerns you may have.
      We also offer flexible rental options, including long-term rentals and
      one-way hires to suit your travel needs.
    </p>
    <p>
      We keep our prices clear, with no hidden fees or charges - we make it
      quick and easy to get an instant quote or book online. We believe that
      everyone should have access to affordable car rental, so we work hard to
      keep our prices competitive. If you're looking for budget car rental in
      Australia, look no further than Allridey. Book your rental today and
      experience the beauty of Australia at your own pace. Contact us to find
      out more about our rental options or book online today!
    </p>
  </div>
</template>

<script>
export default {
  name: 'HomeContent',
  data() {
    return {
      gallery: [],
      articles: [
        {
          title: 'Sale',
          content:
            'Regular Allridey Specials Online! Keep an eye on our specials page for current deals.',
          img: 'https://res.cloudinary.com/allridey/image/upload/q_auto,f_auto/c_scale,w_700/v1641269764/assets/allridey_sale',
          cols: 'md:col-span-1',
          linktext: 'Grab a Quote',
          linksto: 'Search',
          scroll: 'search-form',
        },
        {
          title: 'Car rental. Simple',
          content:
            'Get an instant quote and quickly book online. Cheap car and van hire in locations around Australia and New Zealand',
          img: 'https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1628040145/allridey/ajddSjc',
          cols: 'md:col-span-2',
          linktext: 'Book Now',
          linksto: 'Search',
          scroll: 'search-form',
          overlaytext: 'bookings <br> in a flash <i class="fal fa-bolt"></i>',
          // color: 'blue'
        },
        {
          title: 'Our fleet',
          content:
            "We have a range of economical cars and 8 seat vans at great daily rates. If you find a cheaper price, we'll beat it by 10%.",
          img: 'https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1627347849/allridey/jbkad',
          cols: 'md:col-span-2',
          // linksto: "Search",
          color: 'yellow',
          overlayimg:
            'https://res.cloudinary.com/allridey/image/upload/c_scale,w_500/q_auto,f_auto/v1640042972/assets/allridey-micra',
        },
        {
          title: 'Roadside Assist',
          content:
            "We're only a phone call away with 24 hour support and roadside assist included with your hire.",
          img: 'https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1627348031/allridey/Kdbad2',
          cols: 'md:col-span-1',
          overlaytext: '<i class="fal fa-user-headset transform rotate-3"></i>',
          // linksto: "Search",
          color: 'green',
        },
        {
          title: "We'll Beat Any Price",
          content:
            "We're all about giving you the best deal. If you find a cheaper price somewhere else after making a quote or a booking. Terms and Conditions apply",
          img: 'https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1625712411/allridey/jvqwe.jpg',
          cols: 'md:col-span-full',
          linksto: 'PriceBeat',
          linktext: 'See offer',
          color: 'green',
        },
      ],
    }
  },
  computed: {
    locationcount() {
      return this.$store.state.locations.length
    },
  },
  mounted() {},
  methods: {
    scroll(id) {
      setTimeout(() => {
        document.getElementById(id).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        })
      }, 100)
    },
  },
}
</script>

<style lang="postcss">
.banner1 {
  background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/v1628040145/allridey/ajddSjc.jpg);
}
</style>
