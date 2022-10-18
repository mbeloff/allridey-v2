<template>
  <div class="flex gap-2 flex-col text-left max-w-screen-lg mx-auto px-2 pb-20">
    <img src="https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1625712411/allridey/jvqwe.jpg" alt="" class="max-h-[200px] object-cover rounded-lg md:rounded-none">
    <div class="my-10">
      <p class="text-4xl">Price Beat Guarantee</p>
      <p class="font-light">terms and conditions</p>
    </div>
    <div class="flex flex-col gap-2">
      <p>
        When hiring with Allridey, you can be sure you're getting the best deal
        available.
      </p>
      <p>
        If you happen to find a cheaper price from a competitor we'll beat it,
        even after you've already made your booking.
      </p>
      <p>
        To request a price match on your recent booking or quotation, just email
        <a
          class="text-blue-500 hover:underline"
          :href="`mailto:` + $store.state.email"
          >{{ $store.state.email }}</a
        >. Once you provide your quote or booking number along with the quote
        from the competitor, we'll confirm your reservation at the cheaper rate,
        and reduce it by a further 10%!
      </p>
    </div>
    <hr />
    <div class="mt-2 grid grid-cols-1 gap-x-5 gap-y-1 md:grid-cols-2">
      <ul class="list-disc text-xs grid gap-1 pl-4 text-justify">
        <li>This offer is subject to availability.</li>
        <li>
          Offer is not valid for travel between the 14th of December and the
          14th of January, or during major festivals and peak/holiday seasons.
        </li>
        <li>
          This offer will be valid on the initial quote only and is
          non-negotiable beyond our initial offer.
        </li>
        <li>
          Competitor's pricing must be accurate and in the appropriate currency
          (e.g., AUD for Australia, NZD for New Zealand).
        </li>
        <li>
          Price match requests must be supplied within 48 hours of making a
          booking or receiving a quotation from us.
        </li>
        <li>
          Competitor's price must be current and verifiable at the time of
          submission.
        </li>

        <li>
          To qualify for a price match, we must be satisfied that (a) the
          vehicle is the same in specifications, condition, and age, (b) the
          pickup and return dates and locations of travel are the same, and (c)
          the vehicle must be currently available for booking.
        </li>
      </ul>
      <ul class="list-disc text-xs grid gap-1 pl-4 text-justify">
        <li>
          Allridey may refuse to honour any price match offer if we are unable
          to verify the competitor's price.
        </li>
        <li>
          Price comparisons will consider the competitor's total price,
          including the cost of the vehicle plus any booking charges and any
          additional fees.
        </li>
        <li>
          Price beat requests will not be considered when you use
          coupons/vouchers or other promotional offers from competitors.
        </li>
        <li>
          Allridey reserves the right to refuse price beat requests if we do not
          deem the vehicles or hire conditions to be comparable.
        </li>
        <li>
          This offer is subject to change and can be withdrawn at any time and
          without prior notice.
        </li>
        <li>
          Offer will not apply to quotes from 3rd party Agents or travel
          providers. Wicked Campers will only honour its Price Beat Guarantee if
          a comparable quote is directly sourced from a campervan/4wd/car hire
          Operator - not a comparison website or travel provider.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
