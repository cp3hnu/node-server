export const createSuccessResponse = (data) => {
  return {
    code: 200,
    data: data,
    msg: 'Success'
  }
}

export const createErrorResponse = (code, errorMsg) => {
  return {
    code: code,
    data: null,
    msg: errorMsg
  }
}