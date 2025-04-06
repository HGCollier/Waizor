import * as lib from "focus-trap";
import { FocusTrap } from "focus-trap";
import { DotNet } from "../lib/dotnet";

const create = (element: HTMLElement, dotNetObject: DotNet.DotNetObject) => {
    console.log("CREATE");
    const trap = lib.createFocusTrap(element, {
        onDeactivate: () => {
            dotNetObject.invokeMethodAsync("Deactivate");
        },
    });
    trap.activate();

    return trap;
};

const dispose = (trap: FocusTrap) => {
    trap.deactivate();
};

const focusTrap = {
    create,
    dispose,
};

export { focusTrap };
