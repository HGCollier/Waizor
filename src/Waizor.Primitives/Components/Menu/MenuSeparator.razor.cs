using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuSeparator : ComponentBase
{
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }
}
