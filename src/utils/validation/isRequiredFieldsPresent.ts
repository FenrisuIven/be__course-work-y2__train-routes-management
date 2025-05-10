const checkRequiredFieldsPresent = (targetFields: Record<string, any>, targetObject: Record<string, any>) => {
  return Object.values(targetFields).filter(valueAsKey => !(valueAsKey in targetObject));
}

export {checkRequiredFieldsPresent};