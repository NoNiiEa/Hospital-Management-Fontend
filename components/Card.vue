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
			 <button 
                @click="confirmDelete" 
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-1 border border-red-700 rounded"
            >
                Delete
            </button>
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
		id: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			required: true,
			validator: (value) => ['patient', 'doctor'].includes(value)
		}
	},
	data() {
		return {
			deleteWarningCount: 0
		}
	},
	methods: {
		confirmDelete() {
			this.deleteWarningCount++
			
			if (this.deleteWarningCount === 1) {
				alert(`Warning: Are you sure you want to delete ${this.type} "${this.name}"? Click delete again to confirm.`)
			} else if (this.deleteWarningCount === 2) {
				const confirmMessage = `Final warning: This will permanently delete ${this.type} "${this.name}". Are you sure?`
				if (confirm(confirmMessage)) {
					this.handleDelete()
				}
				this.deleteWarningCount = 0
			}

			// Reset warning count after 3 seconds of inactivity
			setTimeout(() => {
				this.deleteWarningCount = 0
			}, 3000)
		},

		async handleDelete() {
			try {
				const baseUrl = 'http://127.0.0.1:8000'
				const endpoint = this.type === 'patient' ? 'patients' : 'doctors'
				const response = await fetch(`${baseUrl}/${endpoint}/delete/${this.id}`, {
					method: 'DELETE',
					headers: {
						'accept': 'application/json'
					}
				})

				if (response.ok) {
					this.$emit('deleted', { id: this.id, type: this.type })
				} else {
					console.error('Failed to delete')
				}
			} catch (error) {
				console.error('Error deleting:', error)
			}
		}
	}
};
</script>
<style lang="css">
.name {
	font-weight: bold;
}

.box {
	background-color: #e3edf9;
	border-radius: 15px;
	margin: 2% 0%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2%;
}

.text {
	padding: 2%;
}
</style>
