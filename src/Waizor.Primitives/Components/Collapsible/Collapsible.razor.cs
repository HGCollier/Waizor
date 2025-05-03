using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class Collapsible : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public bool Open { get; set; }

    [Parameter]
    public EventCallback<bool> OpenChanged { get; set; }

    [Parameter]
    public bool DefaultOpen { get; set; }

    public string ContentId { get; set; } = Guid.NewGuid().ToString();

    public CollapsibleState State => Open ? CollapsibleState.Open : CollapsibleState.Closed;

    public void Toggle()
    {
        Open = !Open;

        StateHasChanged();
    }
}
