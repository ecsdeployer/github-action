export function isPresent<T>(value: T | undefined | null): value is T {
  if (value !== undefined && value !== null) {
    if (typeof (value) === "string") {
      return value !== ""
    } else {
      return true
    }
  } else {
    return false
  }
}