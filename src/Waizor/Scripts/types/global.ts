import { Placement } from "@floating-ui/dom";
import { FocusTrap } from "../components/focus-trap";
import { RovingFocus } from "../components/roving-focus";
import { Orientation } from "../enums/orientation";
import { DotNet } from "../lib/dotnet";

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
        popover: {
            create: (
                trigger: HTMLElement,
                content: HTMLElement,
                placement: Placement
            ) => void;
            dispose: (cleanup: () => void) => void;
        };
        avatar: (src: string, dotNetObject: DotNet.DotNetObject) => void;
    }
}

export {};
