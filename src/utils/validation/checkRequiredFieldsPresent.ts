const checkRequiredFieldsPresent = (targetFields: Record<string, any>, targetObject: Record<string, any>) => {
  return Object.entries(targetObject)
    .filter((keyValPair)=> !Boolean(keyValPair[1]) && targetFields.includes(keyValPair[0]))
    .map((keyValPair) => keyValPair[0]);
}

export {checkRequiredFieldsPresent};