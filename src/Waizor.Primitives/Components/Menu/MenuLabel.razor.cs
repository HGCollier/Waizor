using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuLabel : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }
}
