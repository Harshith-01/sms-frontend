import { createAPI } from "./api";

// ✅ Connect to Fees Service
const api = createAPI(import.meta.env.VITE_FEES_SERVICE);

// ==================== STUDENT FEE TERMS ====================
export const getStudentFeeTerms = (
  filters = {},
  page = 1,
  pageSize = 20
) => {
  const params = new URLSearchParams({
    page,
    page_size: pageSize,
  });

  if (filters.student_id)
    params.append("student_id", filters.student_id);
  if (filters.academic_year_id)
    params.append("academic_year_id", filters.academic_year_id);
  if (filters.status) params.append("status", filters.status);

  return api.get(`/fees/student-fee-terms?${params.toString()}`);
};

export const getStudentFeeTerm = (id) =>
  api.get(`/fees/student-fee-terms/${id}`);

export const createStudentFeeTerm = (data) =>
  api.post("/fees/student-fee-terms", data);

export const updateStudentFeeTerm = (id, data) =>
  api.put(`/fees/student-fee-terms/${id}`, data);

export const deleteStudentFeeTerm = (id) =>
  api.delete(`/fees/student-fee-terms/${id}`);

// ==================== FEE PAYMENTS ====================
export const getFeePayments = (
  filters = {},
  page = 1,
  pageSize = 20
) => {
  const params = new URLSearchParams({
    page,
    page_size: pageSize,
  });

  if (filters.term_id) params.append("term_id", filters.term_id);
  if (filters.student_id)
    params.append("student_id", filters.student_id);
  if (filters.payment_date_from)
    params.append("payment_date_from", filters.payment_date_from);
  if (filters.payment_date_to)
    params.append("payment_date_to", filters.payment_date_to);

  return api.get(`/fees/payments?${params.toString()}`);
};

export const getFeePayment = (id) =>
  api.get(`/fees/payments/${id}`);

export const createFeePayment = (data) =>
  api.post("/fees/payments", data);

export const deleteFeePayment = (id) =>
  api.delete(`/fees/payments/${id}`);