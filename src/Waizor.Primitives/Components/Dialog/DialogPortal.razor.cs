using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class DialogPortal : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required IDialog Dialog { get; set; }
}
