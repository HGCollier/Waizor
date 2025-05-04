import { DotNetFocusTrapObject, FocusTrap } from "../components/focus-trap";
import {
    DotNetRovingFocusObject,
    RovingFocus,
} from "../components/roving-focus";
import { DotNet } from "../lib/dotnet";
import { DotNetPopperObject, Popper } from "../components/popper";

declare global {
    interface Window {
        focusTrap: (dotNetFocusTrapObject: DotNetFocusTrapObject) => FocusTrap;
        popper: (dotNetPopperObject: DotNetPopperObject) => Popper;
        rovingFocus: (
            dotNetRovingFocusObject: DotNetRovingFocusObject
        ) => RovingFocus;
        avatar: (src: string, dotNetObject: DotNet.DotNetObject) => void;
    }
}

export {};
