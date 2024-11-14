interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  timestamp: string
  statusCode: number
}

export const createResponse = <T>(data: T, status = 200): ApiResponse<T> => ({
  status: status >= 200 && status < 300 ? 'success' : 'error',
  data,
  timestamp: new Date().toISOString(),
  statusCode: status
})