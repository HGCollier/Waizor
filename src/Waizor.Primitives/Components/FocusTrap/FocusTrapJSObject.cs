using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Primitives.Components;

internal record FocusTrapJSObject(
    ElementReference Element,
    DotNetObjectReference<FocusTrap> DotNetObject,
    bool ClickOutsideDeactivates,
    bool AllowOutsideClick,
    ElementReference? Trigger = null
);
