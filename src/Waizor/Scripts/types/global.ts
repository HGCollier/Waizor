import { DotNetFocusTrapObject, FocusTrap } from "../components/focus-trap";
import { RovingFocus } from "../components/roving-focus";
import { Orientation } from "../enums/orientation";
import { DotNet } from "../lib/dotnet";
import { DotNetPopperObject, Popper } from "../components/popper";

declare global {
    interface Window {
        focusTrap: (dotNetFocusTrapObject: DotNetFocusTrapObject) => FocusTrap;
        popper: (dotNetPopperObject: DotNetPopperObject) => Popper;
        rovingFocus: (orientation: Orientation) => RovingFocus;
        avatar: (src: string, dotNetObject: DotNet.DotNetObject) => void;
    }
}

export {};
