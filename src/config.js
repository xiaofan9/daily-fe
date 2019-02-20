const isProd = process.env.NODE_ENV === "production";

export default {
  url: isProd ? "api/" : "http://127.0.0.1:3000/api/"
};
