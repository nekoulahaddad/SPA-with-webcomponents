import "@webcomponents/webcomponentsjs/webcomponents-loader";
import { RouterHandler } from "./router/router-handler";
import { Core } from "./core/core";

class App {
    constructor() {
        const router = new RouterHandler();
        new Core();
        router.init();
    }
}

if (
    "registerElement" in document &&
    "import" in document.createElement("link") &&
    "content" in document.createElement("template")
) {
    // platform is good!
    new App();
} else {
    setTimeout(() => {
        new App();
    });
}
