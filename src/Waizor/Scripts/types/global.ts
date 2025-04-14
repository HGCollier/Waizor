import { FocusTrap } from "../components/focus-trap";
import { RovingFocus } from "../components/roving-focus";
import { Orientation } from "../enums/orientation";
import { DotNet } from "../lib/dotnet";
import { DotNetPopperObject, Popper } from "../components/popper";

declare global {
    interface Window {
        focusTrap: {
            create: (
                element: HTMLElement,
                dotNetObject: DotNet.DotNetObject,
                clickOutsideDeactivates: boolean
            ) => FocusTrap;
            dispose: (trap: FocusTrap) => void;
        };
        rovingFocus: {
            create: (
                element: HTMLElement,
                orientation: Orientation
            ) => RovingFocus;
            update: (rovingFocus: RovingFocus) => RovingFocus;
            dispose: (rovingFocus: RovingFocus) => void;
        };
        popper: {
            create: ({
                side,
                align,
                anchor,
                arrow,
                content,
                sideOffset,
                alignOffset,
                arrowPadding,
            }: DotNetPopperObject) => Popper;
            dispose: (popper: Popper) => void;
        };
        avatar: (src: string, dotNetObject: DotNet.DotNetObject) => void;
    }
}

export {};
