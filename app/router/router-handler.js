var Navigo = require("navigo");
import { Dashboard } from "../pages/dashboard.comp";
import { AddItem } from "../pages/addItem.comp";
import { EditItem } from "../pages/editItem.comp";

export class RouterHandler {
    constructor() {
        if (!RouterHandler.instance) {
            RouterHandler.instance = this;
        } else {
            throw new Error("use getInstance");
        }

        var root = null;
        var useHash = true;
        var hash = "#";
        this.router = new Navigo(root, useHash, hash);
        return RouterHandler.instance;
    }

    static get getInstance() {
        return RouterHandler.instance;
    }

    static inject(component) {
        const outlet = document.querySelector("router-outlet");
        while (outlet.firstChild) {
            outlet.removeChild(outlet.firstChild);
        }
        outlet.appendChild(component);
    }

    init() {
        const routes = [
            { path: "/", resolve: Dashboard },
            { path: "/addItem", resolve: AddItem },
            { path: "/editItem", resolve: EditItem },
        ];

        this.router
            .on(() => {
                RouterHandler.inject(new Dashboard());
            })
            .resolve();

        routes.forEach((route) => {
            this.router
                .on(
                    route.path,
                    (params) => {
                        RouterHandler.inject(new route.resolve(params));
                    },
                    {
                        before: (done, params) => {
                            if (!route.canActivate || route.canActivate()) {
                                done();
                            } else {
                                this.router.navigate("/");
                                done(false);
                            }
                        },
                    }
                )
                .resolve();
        });
    }
}
RouterHandler.instance = null;
