<template>
  <div class="doctor-card">
    <div class="profile-header">
      <img src="../../assets/Images/doctor-avatar.svg" alt="Doctor Avatar" class="doctor-avatar">
      <div class="doctor-info">
        <h2 class="doctor-name">{{ name }}</h2>
        <p class="doctor-specialization">{{ specialization }}</p>
      </div>
    </div>
    <div class="contact-info">
      <div class="contact-item">
        <img src="../../assets/Images/phone.svg" alt="Phone Icon" class="contact-icon">
        <span>{{ contact.phone }}</span>
      </div>
      <div class="contact-item">
        <img src="../../assets/Images/email.svg" alt="Email Icon" class="contact-icon">
        <span>{{ contact.email }}</span>
      </div>
      <div class="contact-item">
        <img src="../../assets/Images/location.svg" alt="Location Icon" class="contact-icon">
        <span>{{ contact.address }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Dr. John Doe',
    },
    specialization: {
      type: String,
      default: 'General Practitioner',
    },
    contact: {
      type: Object,
      default: () => ({
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        address: '123 Main Street, Anytown',
      }),
    },
  },
};
</script>

<style scoped>
.doctor-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.doctor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
}

.doctor-info {
  flex-grow: 1;
}

.doctor-name {
  font-size: 20px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 4px;
}

.doctor-specialization {
  font-size: 14px;
  color: #5f6368;
}

.contact-info {
  margin-top: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #3c4043;
}

.contact-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  object-fit: contain;
}

.contact-item span {
  font-size: 14px;
}
</style>