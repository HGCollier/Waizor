using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class Arrow : ComponentBase
{
    [Parameter]
    public int Width { get; set; } = 10;

    [Parameter]
    public int Height { get; set; } = 5;

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }
}
