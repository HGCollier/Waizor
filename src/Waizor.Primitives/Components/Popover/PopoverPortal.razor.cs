using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class PopoverPortal : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required Popover Popover { get; set; }
}
