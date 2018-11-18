export default function errorHandler (error) {
  delete error.extensions.exception
  return error
}
