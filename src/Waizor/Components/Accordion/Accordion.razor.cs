using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class Accordion : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string ContentId { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string TriggerId { get; set; } = Guid.NewGuid().ToString();
}
