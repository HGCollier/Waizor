import { Placement } from "@floating-ui/dom";
import { FocusTrap } from "../components/focus-trap";
import { RovingFocus } from "../components/roving-focus";
import { Orientation } from "../enums/orientation";
import { DotNet } from "../lib/dotnet";
import { Popper } from "../components/popper";

declare global {
    interface Window {
        focusTrap: {
            create: (
                element: HTMLElement,
                dotNetObject: DotNet.DotNetObject,
                orientation: Orientation
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
            create: (
                trigger: HTMLElement,
                content: HTMLElement,
                placement: Placement
            ) => Popper;
            dispose: (popper: Popper) => void;
        };
        avatar: (src: string, dotNetObject: DotNet.DotNetObject) => void;
    }
}

export {};
