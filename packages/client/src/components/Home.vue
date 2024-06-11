<script setup lang="ts">
import { CiBurger } from 'vue3-icons/ci';
import { GiBowlOfRice, GiCakeSlice } from 'vue3-icons/gi';
import { FaIceCream, FaArrowRight } from 'vue3-icons/fa';
</script>

<template>
  <div class="section flex flex-wrap items-center justify-start xl:justify-center" id="home">
    <div class="wow animate__zoomIn flex flex-col items-start gap-10">
      <div class="text-[1.8rem] font-bold sm:text-[2.5rem]">
        雨中，
        <br />
        听雨声轻灵
        <br />
        雨后，赏水木清华
      </div>
      <RouterLink to="/contact" class="btn">
        <div>查看工作室</div>
        <FaArrowRight></FaArrowRight>
      </RouterLink>
      <div className="flex gap-2 md:gap-6">
        <div
          class="btn_pin_fast flex h-12 w-12 items-center justify-center rounded-md bg-black text-xl text-white md:text-3xl"
        >
          <CiBurger />
        </div>
        <div
          class="btn_pin_fast flex h-12 w-12 items-center justify-center rounded-md bg-black text-xl text-white md:text-3xl"
        >
          <FaIceCream />
        </div>
        <div
          class="btn_pin_fast flex h-12 w-12 items-center justify-center rounded-md bg-black text-xl text-white md:text-3xl"
        >
          <GiCakeSlice />
        </div>
        <div
          class="btn_pin_fast flex h-12 w-12 items-center justify-center rounded-md bg-black text-xl text-white md:text-3xl"
        >
          <GiBowlOfRice />
        </div>
      </div>
    </div>
    <div class="wow animate__fadeInRight min-w-[200px] justify-self-center md:w-[600px]">
      <img src="../assets/picture/1.2.png" alt="Hello,Welcome" />
    </div>
  </div>
</template>

<style scoped></style>
