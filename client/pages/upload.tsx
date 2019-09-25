import App from "../src/App";
import Upload from "../src/Upload";

export default req => {
  return App({
    path: req.url.pathname,
    View: Upload
  });
};
