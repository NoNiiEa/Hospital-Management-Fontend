<!-- @format -->

<template lang="html">
	<div>
		<!-- name -->
		<div class="box">
	  <div class="text">
			<div class="name">
				{{ name }}
			</div> 
	  </div>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			name: {
				type: String,
				required: true,
			},
		},
	};
</script>
<style lang="css">
	.name {
		font-weight: bold;
	}
	.box {
		/* padding: 5%; */
		background-color: #e3edf9;
		border-radius: 15px;
    margin: 2% 0%;
	}
  .text {
    padding: 2%;
  }
</style>
