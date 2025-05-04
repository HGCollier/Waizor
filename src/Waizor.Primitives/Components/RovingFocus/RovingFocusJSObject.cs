using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Enums;

namespace Waizor.Primitives.Components.Internal;

internal record RovingFocusJSObject(
    ElementReference? ContainerElementReference,
    Orientation Orientation,
    bool Loop
);
