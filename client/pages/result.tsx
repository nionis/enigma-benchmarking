import App from "../src/App";
import Result from "../src/Result";

export default req => {
  return App({
    path: req.url.pathname,
    View: () => Result(req.url.query)
  });
};
