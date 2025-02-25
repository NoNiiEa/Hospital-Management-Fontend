<!-- @format -->

<template lang="html">
  <div class="admin-profile h-full">
    <!-- Profile -->
    <div class="profile-card">
      <div class="profile-image-container">
        <img src="@/assets/Images/DC.png" alt="Admin Profile Image" class="profile-image" />
      </div>
      <div class="profile-details">
        <!-- name -->
        <h3 class="profile-name">นาย น็อต เทพน็อต</h3>
        <!-- role -->
        <p class="profile-role">Admin ประจำโรงบาล</p>
      </div>
    </div>

    <div class="features-section">
      <!-- Features text -->
      <p class="features-title">Features</p>
      <!-- DashBoard button-->
      <button class="feature-button dashboard-btn">
        Dashboard
      </button>
    </div>

    <!-- log-out zone -->
    <div class="logout-section">
      <button class="feature-button logout-btn">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="css">
.admin-profile
{
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card
{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}

.profile-image-container
{
  position: relative;
  width: 110px;
  height: 110px;
  margin-bottom: 1rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: rgba(17, 12, 46, 0.08) 0px 4px 16px 0px;
  transition: transform 0.3s ease;
}

.profile-image-container:hover
{
  transform: scale(1.05);
}

.profile-image
{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details
{
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-name
{
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.5rem 0 0.2rem;
  color: #2d3748;
}

.profile-role
{
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
}

.features-section
{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.features-title
{
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.feature-button
{
  width: 250px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dashboard-btn
{
  background-color: #4299e1;
  color: #ffffff;
}

.dashboard-btn:hover
{
  background-color: #3182ce;
}

.logout-btn
{
  background-color: #f56565;
  color: #ffffff;
}

.logout-btn:hover
{
  background-color: #e03;
}

.logout-section
{
  display: flex;
  justify-content: center;
}
</style>
