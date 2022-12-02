export default function reducer(state, action) {
  switch (action.type) {
    case "FETCH_PROJECT_REQUEST":
      return { ...state, loading: true };
    case "FETCH_TASK_REQUEST":
      return { ...state, loading: true };
    case "FETCH_USER_REQUEST":
      return { ...state, loading: true };
    case "FETCH_PROJECT_SUCCESS":
      return {
        ...state,
        projects: action.payload,
        loading: false,
      };
    case "FETCH_TASK_SUCCESS":
      return { ...state, tasks: action.payload, loading: false };
    case "FETCH_USER_SUCCESS":
      return { ...state, users: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}
