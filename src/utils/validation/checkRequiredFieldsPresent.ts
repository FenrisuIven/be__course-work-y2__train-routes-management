const checkRequiredFieldsPresent = (targetFields: Record<string, any>, targetObject: Record<string, any>) => {
  return Object.values(targetFields)
    .filter(fieldName => !(fieldName in targetObject));
}

export {checkRequiredFieldsPresent};