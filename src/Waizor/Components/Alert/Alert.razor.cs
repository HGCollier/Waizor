using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class Alert : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();
}
