import PORT from "./port"

const ENVIRONMENT_URL = process.env.ENVIRONMENT === 'PRODUCTION' ? 'https://tommycodes-blog.herokuapp.com' : `http://localhost:${PORT}`;

export default ENVIRONMENT_URL;