const resolveSuccess = (data: {}, status = 200) => {
  return Promise.resolve({status, data: {
      error: false,
      ...data
    }
  })
}

export {resolveSuccess};