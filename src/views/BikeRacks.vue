<template>
  <div class="bg-gray-100 h-full py-20">
    <div class="max-w-screen-lg mx-auto text-left px-2">
      <h1 class="text-4xl mb-5">Bike Racks</h1>
      <p>
        Allridey offers range of bicycle and e-bike racks as an optional extra
        with our 5- and 7-seater vans. We understand the importance of staying
        active while traveling and exploring new destinations, and cycling is
        one of the best ways to do so. Whether you are a cycling enthusiast or
        simply looking for a fun way to explore your destination, our
        high-quality racks will help you transport your bicycles and e-bikes
        with ease. All our bike racks are tow ball mounted, and easy to use, so
        you can be on your way to your next adventure in no time. Browse our
        selection of racks and get the perfect one to enhance your travel
        experience.
      </p>
      <div
        class="mt-10 grid grid-cols-1 gap-y-10 gap-x-5 sm:grid-cols-2 md:grid-cols-3"
      >
        <div
          v-for="bike in bikes"
          class="bg-white p-2 shadow-lg rounded-lg flex flex-col justify-between"
        >
          <keen-slider
            :slides="bike.img"
            class="rounded-t md:rounded-tr-none md:rounded-l"
          ></keen-slider>
          <div>
            <p class="text-xl font-bold my-2">{{ bike.name }}</p>
            <!-- <p class="my-5">{{ bike.description }}</p> -->
          </div>

          <ul class="text-sm">
            <li v-for="item in bike.specs" class="grid grid-cols-2 border-b">
              <span>{{ item.label }}</span>
              <span v-html="item.value"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import KeenSlider from '@/components/PhotoGallery.vue'
const bikes = [
  {
    name: 'Bike Rack 2',
    specs: [
      {
        label: 'Capacity',
        value: '2',
      },
      {
        label: 'Max. Weight',
        value: '58kg',
      },
      {
        label: 'E-bike suitable',
        value: '<i class="fas fa-check text-green-500"></i>',
      },
    ],
    description: 'Securely carries up to 2 regular bicycles or e-bikes.',
    img: [
      'https://res.cloudinary.com/allridey/image/upload/assets/bike-racks/2/1.jpg',
      'https://res.cloudinary.com/allridey/image/upload/assets/bike-racks/2/2.jpg',
    ],
  },
  {
    name: 'Bike Rack 4',
    specs: [
      {
        label: 'Capacity',
        value: '4',
      },
      {
        label: 'Max. Weight',
        value: '60kg',
      },
      {
        label: 'E-bike suitable',
        value: '<i class="fas fa-check text-green-500"></i>',
      },
    ],
    description:
      'Folding bike rack. includes straps to securely carry up to 4 bikes.',
    img: [
      'https://res.cloudinary.com/allridey/image/upload/assets/bike-racks/4/1.jpg',
      'https://res.cloudinary.com/allridey/image/upload/assets/bike-racks/4/2.jpg',
    ],
  },
  {
    name: 'Bike Rack 6',
    specs: [
      {
        label: 'Capacity',
        value: '6',
      },
      {
        label: 'Max. Weight',
        value: '102kg (17kg per bike)',
      },
      {
        label: 'E-bike suitable',
        value: '<i class="fas fa-check text-green-500"></i> (check weight)',
      },
    ],
    description: 'Vertical hanging bike rack to carry up to 6 bikes.',
    img: [
      'https://res.cloudinary.com/allridey/image/upload/assets/bike-racks/6/1.jpg',
      'https://res.cloudinary.com/allridey/image/upload/assets/bike-racks/6/2.jpg',
    ],
  },
]
</script>

<style lang="scss" scoped></style>
