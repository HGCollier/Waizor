import { FocusTrap } from "../components/focus-trap";
import { RovingFocus } from "../components/focus-trap";
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
            create: (element: HTMLElement) => RovingFocus;
            dispose: (element: HTMLElement, rovingFocus: RovingFocus) => void;
        };
        avatar: (src: string, dotNetObject: DotNet.DotNetObject) => void;
    }
}

export {};
