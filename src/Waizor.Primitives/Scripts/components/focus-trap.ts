import * as lib from "focus-trap";
import { DotNet } from "../lib/dotnet";
import { keyCodes } from "../utils/key-codes";

interface DotNetFocusTrapObject {
    element: HTMLElement;
    dotNetObject: DotNet.DotNetObject;
    clickOutsideDeactivates: boolean;
    allowOutsideClick: boolean;
    keyboardNavigation: boolean;
    trigger: HTMLElement;
}

class FocusTrap {
    element: HTMLElement;
    dotNetObject: DotNet.DotNetObject;
    clickOutsideDeactivates: boolean;
    allowOutsideClick: boolean;
    keyboardNavigation: boolean;
    trigger: HTMLElement;

    trap: lib.FocusTrap;

    constructor({
        element,
        dotNetObject,
        allowOutsideClick,
        clickOutsideDeactivates,
        keyboardNavigation,
        trigger,
    }: DotNetFocusTrapObject) {
        this.element = element;
        this.dotNetObject = dotNetObject;
        this.allowOutsideClick = allowOutsideClick;
        this.clickOutsideDeactivates = clickOutsideDeactivates;
        this.keyboardNavigation = keyboardNavigation;
        this.trigger = trigger;

        const trap = lib.createFocusTrap(element, {
            onDeactivate: () => {
                dotNetObject.invokeMethodAsync("Deactivate");
            },
            isKeyBackward: (event: KeyboardEvent) => {
                if (!keyboardNavigation) {
                    event.preventDefault();
                    return false;
                }

                return event.shiftKey && event.key === "Tab";
            },
            isKeyForward: (event: KeyboardEvent) => {
                if (!keyboardNavigation) {
                    event.preventDefault();
                    return false;
                }

                return event.key === "Tab";
            },
            allowOutsideClick: (event: MouseEvent | TouchEvent) => {
                if (clickOutsideDeactivates) {
                    return true;
                }

                if (!(event.target instanceof HTMLElement)) {
                    return allowOutsideClick;
                }

                if (allowOutsideClick) {
                    return true;
                }

                return event.target === trigger;
            },
            clickOutsideDeactivates: (event: MouseEvent | TouchEvent) => {
                if (!(event.target instanceof HTMLElement)) {
                    return clickOutsideDeactivates;
                }

                return event.target !== trigger && clickOutsideDeactivates;
            },
        });

        trap.activate();

        this.trap = trap;
    }

    deactivate = () => {
        this.trap.deactivate();
    };
}

export { FocusTrap, type DotNetFocusTrapObject };
