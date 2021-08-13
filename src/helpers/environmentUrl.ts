import PORT from "./port"

const ENVIRONMENT_URL = process.env.REACT_APP_ENVIRONMENT_URL || process.env.ENVIRONMENT_URL || `http://localhost:${PORT}`;

export default ENVIRONMENT_URL;