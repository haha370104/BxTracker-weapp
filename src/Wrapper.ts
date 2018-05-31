export const objectMethodWrapper = (object, methodName: string, implement) => {
  if (object[methodName]) {
    let originMethod = object[methodName]
    object[methodName] = function (e) {
      implement.call(this, e, methodName)
      originMethod.call(this, e)
    }
  } else
    object[methodName] = function (e) {
      implement.call(this, e, methodName)
    }
}
