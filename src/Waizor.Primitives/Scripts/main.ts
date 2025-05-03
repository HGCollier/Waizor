import { avatar } from "./components/avatar";
import { DotNetFocusTrapObject, FocusTrap } from "./components/focus-trap";
import { DotNetPopperObject, Popper } from "./components/popper";
import { RovingFocus } from "./components/roving-focus";
import { Orientation } from "./enums/orientation";

window.avatar = avatar;
window.rovingFocus = (orientation: Orientation) => new RovingFocus(orientation);
window.focusTrap = (dotNetFocusTrapObject: DotNetFocusTrapObject) =>
    new FocusTrap(dotNetFocusTrapObject);
window.popper = (dotNetPopperObject: DotNetPopperObject) =>
    new Popper(dotNetPopperObject);
