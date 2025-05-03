using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

internal record PopperJSObject(
    int AlignOffset,
    int SideOffset,
    ElementReference Content,
    ElementReference Anchor,
    ElementReference? Arrow = null,
    int ArrowPadding = 0,
    string Align = "center",
    string Side = "bottom"
);
