import App from "./App.svelte";
import { mount, unmount } from "svelte";

var app = mount(App, {
  target: document.body,
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    unmount(app);
  });
}
