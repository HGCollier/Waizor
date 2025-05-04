using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Primitives.Components.Internal;

internal record FocusTrapJSObject(
    ElementReference Element,
    DotNetObjectReference<FocusTrap> DotNetObject,
    bool ClickOutsideDeactivates,
    bool AllowOutsideClick,
    bool KeyboardNavigation = true,
    ElementReference? Trigger = null
);
