using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class DialogDescription : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required IDialog Dialog { get; set; }
}
