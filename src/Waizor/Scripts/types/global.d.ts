import { FocusTrap } from "focus-trap";
import { DotNet } from "../lib/dotnet";

declare global {
    interface Window {
        focusTrap: {
            create: (
                element: HTMLElement,
                dotNetObject: DotNet.DotNetObject
            ) => FocusTrap;
            dispose: (trap: FocusTrap) => void;
        };
    }
}

export {};
