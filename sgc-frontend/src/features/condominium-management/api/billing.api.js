import { apiDelete, apiGet, apiPost } from '@shared/api/client'

const BILLING_ENDPOINTS = {
  condominiums: '/v1/billing/condominiums/',
  units: '/v1/billing/units/',
  residentAssignments: '/v1/billing/resident-assignments/',
  commonSpaces: '/v1/billing/common-spaces/',
  users: '/v1/users/',
}

const listCondominiumsRequest = (accessToken) => apiGet(BILLING_ENDPOINTS.condominiums, { accessToken })
const createCondominiumRequest = (payload, accessToken) => apiPost(BILLING_ENDPOINTS.condominiums, payload, { accessToken })

const listUnitsRequest = (accessToken) => apiGet(BILLING_ENDPOINTS.units, { accessToken })
const createUnitRequest = (payload, accessToken) => apiPost(BILLING_ENDPOINTS.units, payload, { accessToken })

const listResidentAssignmentsRequest = (accessToken) => apiGet(BILLING_ENDPOINTS.residentAssignments, { accessToken })
const createResidentAssignmentRequest = (payload, accessToken) => apiPost(BILLING_ENDPOINTS.residentAssignments, payload, { accessToken })
const deleteResidentAssignmentRequest = (assignmentId, accessToken) =>
  apiDelete(`${BILLING_ENDPOINTS.residentAssignments}${assignmentId}/`, { accessToken })

const listCommonSpacesRequest = (accessToken) => apiGet(BILLING_ENDPOINTS.commonSpaces, { accessToken })
const createCommonSpaceRequest = (payload, accessToken) => apiPost(BILLING_ENDPOINTS.commonSpaces, payload, { accessToken })

const listUsersRequest = (accessToken) => apiGet(BILLING_ENDPOINTS.users, { accessToken })

export {
  BILLING_ENDPOINTS,
  createCommonSpaceRequest,
  createCondominiumRequest,
  createResidentAssignmentRequest,
  createUnitRequest,
  deleteResidentAssignmentRequest,
  listCommonSpacesRequest,
  listCondominiumsRequest,
  listResidentAssignmentsRequest,
  listUnitsRequest,
  listUsersRequest,
}
