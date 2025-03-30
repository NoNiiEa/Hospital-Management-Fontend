<template>
    <div class="min-h-screen bg-blue-50 p-6">
        <div class="container mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold mb-6 text-blue-900">ระบบจัดการการชำระเงิน</h1>

            <!-- Search Bar -->
            <div class="mb-6">
                <div class="flex gap-2">
                    <input v-model="searchQuery" type="text" placeholder="ค้นหาผู้ป่วยตามชื่อ..."
                        class="border p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="searchPatients" />
                    <button @click="searchPatients"
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        ค้นหา
                    </button>
                </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="isLoading" class="text-center py-8">
                <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent">
                </div>
                <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>

            <!-- Search Results -->
            <div v-else>
                <!-- Patient List -->
                <div v-if="searchPerformed">
                    <h2 class="text-xl font-semibold mb-4 text-blue-800">ผลการค้นหา</h2>
                    <div v-if="patients.length" class="border rounded-lg overflow-hidden mb-6">
                        <div class="max-h-60 overflow-y-auto">
                            <div v-for="patient in patients" :key="patient.id" @click="selectPatient(patient)"
                                class="p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors flex justify-between items-center">
                                <div>
                                    <span class="font-medium">{{ patient.name }}</span>
                                    <span class="text-sm text-gray-500 ml-2">(อายุ: {{ patient.age }} ปี, โทร: {{
                                        patient.contact?.phone || 'ไม่มีข้อมูล' }})</span>
                                </div>
                                <button class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                                    เลือก
                                </button>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-center py-4 text-gray-500">ไม่พบผู้ป่วยที่ตรงกับการค้นหา</p>
                </div>

                <!-- Patient Billings List -->
                <div v-if="selectedPatient" class="mt-8">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-blue-800">รายการชำระเงินของ {{ selectedPatient.name }}
                        </h2>
                        <button @click="deselectPatient" class="text-blue-600 hover:text-blue-800">
                            เลือกผู้ป่วยคนอื่น
                        </button>
                    </div>

                    <!-- Loading billings -->
                    <div v-if="isBillingsLoading" class="text-center py-4">
                        <div
                            class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent">
                        </div>
                        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูลการชำระเงิน...</p>
                    </div>

                    <!-- Billings table -->
                    <div v-else-if="patientBillings.length > 0" class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        เลขที่บิล</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        นัดหมาย</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        จำนวนเงิน</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        วิธีชำระเงิน</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        สถานะ</th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="billing in patientBillings" :key="billing.id" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        {{ billing.id.slice(-6) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        {{ billing.appointment_id || 'ไม่มีข้อมูล' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        {{ billing.total_amount.toFixed(2) }} บาท
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        {{ billing.payment_method || 'ไม่ระบุ' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span :class="getBillingStatusClass(billing.status as BillingStatus)"
                                            class="px-2 py-1 rounded-full text-xs">
                                            {{ billing.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <button v-if="billing.status !== BillingStatus.PAID"
                                            @click="updateBillingStatus(billing.id, BillingStatus.PAID)"
                                            class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2">
                                            ชำระแล้ว
                                        </button>
                                        <button v-if="billing.status === BillingStatus.PAID"
                                            @click="updateBillingStatus(billing.id, BillingStatus.PENDING)"
                                            class="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                                            ยังไม่ชำระ
                                        </button>
                                        <button v-if="billing.status !== BillingStatus.OVERDUE"
                                            @click="updateBillingStatus(billing.id, BillingStatus.OVERDUE)"
                                            class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2">
                                            เกินกำหนด
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="text-center py-6 bg-gray-50 rounded-lg">
                        <p class="text-gray-500">ไม่พบรายการชำระเงินสำหรับผู้ป่วยนี้</p>
                    </div>
                </div>

                <!-- Detailed Billing View (when a billing is selected) -->
                <div v-if="selectedBilling" class="mt-8 bg-blue-50 p-6 rounded-lg">
                    <div class="flex justify-between mb-4">
                        <h2 class="text-xl font-semibold text-blue-900">รายละเอียดการชำระเงิน</h2>
                        <button @click="selectedBilling = null" class="text-blue-600 hover:text-blue-800">
                            ปิด
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="font-medium">เลขที่บิล:</p>
                            <p class="text-gray-700">{{ selectedBilling.id.slice(-8) }}</p>
                        </div>
                        <div>
                            <p class="font-medium">ผู้ป่วย:</p>
                            <p class="text-gray-700">{{ selectedPatient.name }}</p>
                        </div>
                        <div>
                            <p class="font-medium">จำนวนเงิน:</p>
                            <p class="text-gray-700">{{ selectedBilling.total_amount.toFixed(2) }} บาท</p>
                        </div>
                        <div>
                            <p class="font-medium">วิธีการชำระเงิน:</p>
                            <div class="flex items-center space-x-2 mt-1">
                                <select v-model="selectedBilling.payment_method" class="p-2 border rounded flex-1">
                                    <option v-for="option in paymentMethodOptions" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                                <button
                                    @click="updateBillingPaymentMethod(selectedBilling.id, selectedBilling.payment_method)"
                                    class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    อัปเดต
                                </button>
                            </div>
                        </div>
                        <div>
                            <p class="font-medium">สถานะ:</p>
                            <p :class="getBillingTextClass(selectedBilling.status)" class="font-bold">
                                {{ selectedBilling.status }}
                            </p>
                        </div>
                        <div>
                            <p class="font-medium">นัดหมาย:</p>
                            <p class="text-gray-700">{{ selectedBilling.appointment_id || 'ไม่มีข้อมูล' }}</p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <p class="font-medium mb-2">อัปเดตสถานะ:</p>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="option in billingStatusOptions" :key="option.value"
                                @click="updateBillingStatus(selectedBilling.id, option.value)"
                                :class="[option.bgColor, 'px-4 py-2 text-white rounded-md hover:' + option.hoverColor, 'flex items-center']">
                                <div class="w-3 h-3 bg-white rounded-full mr-2"></div>
                                {{ option.label }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

// TypeScript Enums
enum BillingStatus {
    PAID = 'Paid',
    PENDING = 'Pending',
    OVERDUE = 'Overdue',
    CANCELLED = 'Cancelled',
    REFUNDED = 'Refunded'
}

enum PaymentMethod {
    CREDIT_CARD = 'Credit Card',
    CASH = 'Cash',
    INSURANCE = 'Insurance',
    BANK_TRANSFER = 'Bank Transfer',
    QR_PAYMENT = 'QR Payment',
    OTHER = 'Other'
}

// TypeScript Interfaces
interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    contact?: {
        phone?: string;
        email?: string;
        address?: string;
    };
}

interface Billing {
    id: string;
    patient_id: string;
    appointment_id: string;
    total_amount: number;
    status: BillingStatus;
    payment_method: PaymentMethod;
}

interface StatusOption {
    value: BillingStatus;
    label: string;
    bgColor: string;
    hoverColor: string;
}

interface PaymentMethodOption {
    value: PaymentMethod;
    label: string;
}

// State
const searchQuery = ref('');
const patients = ref<Patient[]>([]);
const selectedPatient = ref<Patient | null>(null);
const patientBillings = ref<Billing[]>([]);
const selectedBilling = ref<Billing | null>(null);
const isLoading = ref(false);
const isBillingsLoading = ref(false);
const searchPerformed = ref(false);

// Billing status options
const billingStatusOptions: StatusOption[] = [
    { value: BillingStatus.PAID, label: 'ชำระแล้ว', bgColor: 'bg-green-500', hoverColor: 'bg-green-600' },
    { value: BillingStatus.PENDING, label: 'ยังไม่ชำระ', bgColor: 'bg-yellow-500', hoverColor: 'bg-yellow-600' },
    { value: BillingStatus.OVERDUE, label: 'เกินกำหนด', bgColor: 'bg-red-500', hoverColor: 'bg-red-600' },
    { value: BillingStatus.CANCELLED, label: 'ยกเลิก', bgColor: 'bg-gray-500', hoverColor: 'bg-gray-600' },
    { value: BillingStatus.REFUNDED, label: 'คืนเงิน', bgColor: 'bg-blue-500', hoverColor: 'bg-blue-600' }
];

// Payment method options
const paymentMethodOptions: PaymentMethodOption[] = [
    { value: PaymentMethod.CASH, label: 'เงินสด' },
    { value: PaymentMethod.CREDIT_CARD, label: 'บัตรเครดิต' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'โอนเงิน' },
    { value: PaymentMethod.INSURANCE, label: 'ประกัน' },
    { value: PaymentMethod.QR_PAYMENT, label: 'QR Payment' },
    { value: PaymentMethod.OTHER, label: 'อื่นๆ' }
];

// Search for patients by name
const searchPatients = async (): Promise<void> => {
    if (!searchQuery.value.trim()) return;

    try {
        isLoading.value = true;
        searchPerformed.value = true;

        const response = await axios.get("http://127.0.0.1:8000/patients/");

        if (response.status === 200) {
            const query = searchQuery.value.toLowerCase();
            patients.value = response.data.filter((patient: Patient) =>
                patient.name.toLowerCase().includes(query)
            );
        }
    } catch (error) {
        console.error("Error searching patients:", error);
        alert("เกิดข้อผิดพลาดในการค้นหาผู้ป่วย");
    } finally {
        isLoading.value = false;
    }
};

// Select a patient and fetch their billing information
const selectPatient = async (patient: Patient): Promise<void> => {
    selectedPatient.value = patient;
    await fetchPatientBillings(patient.id);
};

// Deselect the current patient
const deselectPatient = (): void => {
    selectedPatient.value = null;
    patientBillings.value = [];
    selectedBilling.value = null;
};

// Fetch billing records for a specific patient with proper error handling
const fetchPatientBillings = async (patientId: string): Promise<void> => {
    try {
        isBillingsLoading.value = true;

        const response = await axios.get<Billing[]>("http://127.0.0.1:8000/billings/");

        if (response.status === 200) {
            patientBillings.value = response.data.filter((billing: Billing) =>
                billing.patient_id === patientId
            );
        }
    } catch (error: any) {
        console.error("Error fetching patient billings:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลการชำระเงิน: " + (error.message || "Unknown error"));
    } finally {
        isBillingsLoading.value = false;
    }
};

// Update the status of a billing record with better error handling
const updateBillingStatus = async (billingId: string, newStatus: BillingStatus): Promise<void> => {
    try {
        const response = await axios.patch(
            `http://127.0.0.1:8000/billings/${billingId}/status`,
            { status: newStatus }
        );

        if (response.status === 200) {
            // Update the billing in our local state
            const updatedBilling = patientBillings.value.find(b => b.id === billingId);
            if (updatedBilling) {
                updatedBilling.status = newStatus;
            }

            // Also update the selected billing if it's the one we just changed
            if (selectedBilling.value && selectedBilling.value.id === billingId) {
                selectedBilling.value.status = newStatus;
            }

            alert(`อัปเดตสถานะการชำระเงินเป็น "${newStatus}" เรียบร้อยแล้ว`);
        }
    } catch (error: any) {
        console.error("Error updating billing status:", error);
        let errorMessage = "เกิดข้อผิดพลาดในการอัปเดตสถานะการชำระเงิน";
        if (error.response?.data?.detail) {
            errorMessage += ": " + error.response.data.detail;
        }
        alert(errorMessage);
    }
};

// Update the payment method of a billing record with better error handling
const updateBillingPaymentMethod = async (billingId: string, newPaymentMethod: PaymentMethod): Promise<void> => {
    try {
        const response = await axios.patch(
            `http://127.0.0.1:8000/billings/${billingId}/payment-method`,
            { payment_method: newPaymentMethod }
        );

        if (response.status === 200) {
            // Update the billing in our local state
            const updatedBilling = patientBillings.value.find(b => b.id === billingId);
            if (updatedBilling) {
                updatedBilling.payment_method = newPaymentMethod;
            }

            // Also update the selected billing if it's the one we just changed
            if (selectedBilling.value && selectedBilling.value.id === billingId) {
                selectedBilling.value.payment_method = newPaymentMethod;
            }

            alert(`อัปเดตวิธีการชำระเงินเป็น "${newPaymentMethod}" เรียบร้อยแล้ว`);
        }
    } catch (error: any) {
        console.error("Error updating billing payment method:", error);
        let errorMessage = "เกิดข้อผิดพลาดในการอัปเดตวิธีการชำระเงิน";
        if (error.response?.data?.detail) {
            errorMessage += ": " + error.response.data.detail;
        }
        alert(errorMessage);
    }
};

// Get CSS class for billing status badge
const getBillingStatusClass = (status: BillingStatus): string => {
    switch (status) {
        case BillingStatus.PAID: return 'bg-green-100 text-green-800';
        case BillingStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case BillingStatus.OVERDUE: return 'bg-red-100 text-red-800';
        case BillingStatus.CANCELLED: return 'bg-gray-100 text-gray-800';
        case BillingStatus.REFUNDED: return 'bg-purple-100 text-purple-800';
        default: return 'bg-blue-100 text-blue-800';
    }
};

// Get CSS class for billing status text
const getBillingTextClass = (status: BillingStatus): string => {
    switch (status) {
        case BillingStatus.PAID: return 'text-green-600';
        case BillingStatus.PENDING: return 'text-yellow-600';
        case BillingStatus.OVERDUE: return 'text-red-600';
        case BillingStatus.CANCELLED: return 'text-gray-600';
        case BillingStatus.REFUNDED: return 'text-purple-600';
        default: return 'text-blue-600';
    }
};

// View detailed billing information
const viewBillingDetails = (billing: Billing): void => {
    selectedBilling.value = billing;
};
</script>

<style scoped>
/* Any component-specific styles can be added here */
</style>
