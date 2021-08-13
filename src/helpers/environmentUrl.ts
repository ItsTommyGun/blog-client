import PORT from "./port"

const ENVIRONMENT_URL = process.env.PRODUCTION ? 'https://dashboard.heroku.com' : `http://localhost:${PORT}`;

export default ENVIRONMENT_URL;