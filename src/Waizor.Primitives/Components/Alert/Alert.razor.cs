using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class Alert : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }
}
