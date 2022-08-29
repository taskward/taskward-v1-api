function isNumber(params: unknown): params is number {
  return typeof params === "number";
}

function isString(params: unknown): params is string {
  return typeof params === "string";
}

export { isNumber, isString };
