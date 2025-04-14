using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Components;

internal record FocusTrapJSObject(
    ElementReference Element,
    DotNetObjectReference<FocusTrap> DotNetObject,
    bool ClickOutsideDeactivates
);
