import { avatar } from "./components/avatar";
import { DotNetFocusTrapObject, FocusTrap } from "./components/focus-trap";
import { DotNetPopperObject, Popper } from "./components/popper";
import {
    DotNetRovingFocusObject,
    RovingFocus,
} from "./components/roving-focus";

window.avatar = avatar;
window.rovingFocus = (dotNetRovingFocusObject: DotNetRovingFocusObject) =>
    new RovingFocus(dotNetRovingFocusObject);
window.focusTrap = (dotNetFocusTrapObject: DotNetFocusTrapObject) =>
    new FocusTrap(dotNetFocusTrapObject);
window.popper = (dotNetPopperObject: DotNetPopperObject) =>
    new Popper(dotNetPopperObject);
