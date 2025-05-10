const resolveError = (status: number, data: {}) => {
  return Promise.resolve({status, data: {
      error: true,
      ...data
    }
  })
}

export {resolveError};