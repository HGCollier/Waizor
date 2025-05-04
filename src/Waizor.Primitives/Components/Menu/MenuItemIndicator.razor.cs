using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuItemIndicator : ComponentBase
{
    [Parameter, EditorRequired]
    public required RenderFragment ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [CascadingParameter]
    public required MenuItemIndicatorProvider MenuItemIndicatorProvider { get; set; }
}
