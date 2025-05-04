using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuItemIndicatorProvider : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public MenuItemIndicatorState State { get; set; }
}
