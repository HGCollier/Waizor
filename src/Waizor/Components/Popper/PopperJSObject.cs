using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

internal record PopperJSObject(
    int AlignOffset,
    int SideOffset,
    ElementReference Content,
    ElementReference Anchor,
    ElementReference? Arrow = null,
    string Align = "center",
    string Side = "bottom"
);
