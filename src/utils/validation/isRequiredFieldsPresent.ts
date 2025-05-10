const checkRequiredFieldsPresent = (targetFields: Record<string, any>, targetObject: Record<string, any>) => {
  return Object.values(targetFields).filter(valueAsKey => !targetObject[valueAsKey]);
}

export {checkRequiredFieldsPresent};