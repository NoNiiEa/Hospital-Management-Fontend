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
                class="delete-button"
            >
                Delete
            </button>
		</div>

        <!-- Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <p>{{ modalMessage }}</p>
                <div class="modal-buttons">
                    <button @click="cancelDelete" class="modal-button cancel">Cancel</button>
                    <button v-if="deleteWarningCount === 1" @click="confirmDelete" class="modal-button ok">OK</button>
                    <button v-if="deleteWarningCount === 2" @click="handleDelete" class="modal-button delete">Delete</button>
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
			deleteWarningCount: 0,
            showModal: false,
            modalMessage: ''
		}
	},
	methods: {
		confirmDelete() {
			this.deleteWarningCount++
			
			if (this.deleteWarningCount === 1) {
				this.modalMessage = `Warning: Are you sure you want to delete ${this.type} "${this.name}"? Click OK to confirm.`
			} else if (this.deleteWarningCount === 2) {
				this.modalMessage = `Final warning: This will permanently delete ${this.type} "${this.name}". Are you sure?`
			}
			this.showModal = true

			// Reset warning count after 3 seconds of inactivity
			setTimeout(() => {
				this.deleteWarningCount = 0
				this.showModal = false
			}, 3000)
		},

        cancelDelete() {
            this.deleteWarningCount = 0
            this.showModal = false
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
			} finally {
                this.deleteWarningCount = 0
                this.showModal = false
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

.delete-button {
 background-color: #f44336;
 color: white;
 border: none;
 padding: 5px 10px;
 text-align: center;
 text-decoration: none;
 display: inline-block;
 font-size: 12px;
 border-radius: 5px;
 cursor: pointer;
}

.delete-button:hover {
 background-color: #da190b;
}

.modal {
 position: fixed;
 left: 0;
 top: 0;
 width: 100%;
 height: 100%;
 background: rgba(0, 0, 0, 0.5);
 display: flex;
 justify-content: center;
 align-items: center;
}

.modal-content {
 background: white;
 padding: 20px;
 border-radius: 5px;
 text-align: center;
 width: 300px;
}

.modal-buttons {
 margin-top: 10px;
 display: flex;
 justify-content: space-around;
}

.modal-button {
 border: none;
 color: white;
 padding: 8px 16px;
 text-align: center;
 text-decoration: none;
 display: inline-block;
 font-size: 12px;
 border-radius: 5px;
 cursor: pointer;
}

.modal-button.cancel {
 background-color: #a9a9a9;
}

.modal-button.cancel:hover {
 background-color: #808080;
}

.modal-button.ok {
 background-color: #4CAF50;
}

.modal-button.ok:hover {
 background-color: #367c39;
}

.modal-button.delete {
 background-color: #f44336;
}

.modal-button.delete:hover {
 background-color: #da190b;
}
</style>
