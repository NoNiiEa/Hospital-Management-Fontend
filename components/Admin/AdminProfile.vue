<!-- @format -->

<template lang="html">
  <div class="head">
    <!-- Profile -->
    <div class="profile-container justify-center">
      <img
        src="@/assets/Images/DC.png"
        alt="Admin Profile Image"
        class="profile-image"
      />
      <div class="profile-details text-black flex justify-center">
        <!-- name -->
        <h3>นาย น็อต เทพน็อต</h3>
        <!-- role -->
        <p>Admin ประจำโรงบาล</p>
      </div>
    </div>
    <div class="Features-container">
      <!-- Features text -->
      <p class="Features">Features</p>
      <!-- DashBoard button-->
      <button
        class="button-class bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Dashboard
      </button>
    </div>
    <!-- log-out zone -->
    <div class="down">
      <div class="Card_Logout">
        <button
          class="button-class bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="css">
.profile-container {
  /* background-color: #121c3e; */
  display: flex;
  margin-top: 5%;
  height: auto;
}

.profile-image {
  width: 100px;
  height: auto;
  margin-right: 20px;
}

.profile-details {
  display: flex;
  flex-direction: column;
}

.head {
  margin-top: 20%;
}

.Features-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 5%;
}

.Features {
  margin: 2% 0%;
}

.button-class {
  width: 250px;
}
.Card_Logout {
  position: relative;
  bottom: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20%;
}
</style>
