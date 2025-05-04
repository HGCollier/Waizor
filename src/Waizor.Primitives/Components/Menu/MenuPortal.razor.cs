using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuPortal : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required Menu Menu { get; set; }
}
