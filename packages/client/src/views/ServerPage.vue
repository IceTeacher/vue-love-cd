<script setup lang="ts"></script>

<template>
  <div class="section">
    <div class="flex flex-wrap items-center justify-between xl:justify-center">
      <div class="flex flex-col items-start gap-[8vw] lg:flex-row">
        <div class="animate__animated animate__fadeInLeft min-w-[100px] justify-self-center md:w-[500px]">
          <img class="btn_pin" src="../assets/RayGroup-Server-Logo.jpg" alt="Hello,Welcome" />
        </div>
        <div class="animate__animated animate__zoomIn md:max-w-[400px]">
          <div class="mb-8 text-[1.8rem] font-bold sm:text-[3.5rem]">
            雨后晓晴 <br />
            欢迎
          </div>
          <div class="mb-8 text-xl">
            我想，生活如雨。雨中，听雨声轻灵。雨后，赏水木清华。晓晴，愿晴空万里。心逐南云，聆听这广阔天地，感受那动人瞬间。
          </div>
          <RouterLink to="/form" class="btn w-[100px]"> 预约服务 </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
