import { RouterOutlet } from "../router/router-outlet";
import { ComponentRegistry } from "./component-registry";
import { Dashboard } from "../pages/dashboard.comp";
import { AddItem } from "../pages/addItem.comp";
import { EditItem } from "../pages/editItem.comp";

export class Core {
    constructor() {
        if (!Core.inst) {
            Core.inst = this;
        } else {
            throw new Error("use instance");
        }

        ComponentRegistry.register(components);

        return Core.inst;
    }

    static get instance() {
        return Core.inst;
    }
}
Core.inst = null;

const components = [
    {
        tagName: "router-outlet",
        component: RouterOutlet,
    },
    {
        tagName: "c-dashboard",
        component: Dashboard,
    },
    {
        tagName: "add-item",
        component: AddItem,
    },
    {
        tagName: "edit-item",
        component: EditItem,
    },
];
