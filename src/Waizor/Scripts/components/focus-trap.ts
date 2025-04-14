import * as lib from "focus-trap";
import { FocusTrap } from "focus-trap";
import { DotNet } from "../lib/dotnet";

interface DotNetFocusTrapObject {
    element: HTMLElement;
    dotNetObject: DotNet.DotNetObject;
    clickOutsideDeactivates: boolean;
}

const create = ({
    element,
    dotNetObject,
    clickOutsideDeactivates,
}: DotNetFocusTrapObject) => {
    const trap = lib.createFocusTrap(element, {
        onDeactivate: () => {
            dotNetObject.invokeMethodAsync("Deactivate");
        },
        clickOutsideDeactivates,
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

export { focusTrap, type FocusTrap, type DotNetFocusTrapObject };
