using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class CollapsibleContent : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required Collapsible Collapsible { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    protected override void OnParametersSet() => Collapsible.ContentId = Id;
}
