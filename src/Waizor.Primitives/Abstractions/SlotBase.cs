using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Abstractions;

public abstract class SlotBase : ComponentBase
{
    [Parameter]
    public required RenderFragment<Dictionary<string, object>?> ChildContent { get; set; }

    [Parameter]
    public bool AsChild { get; set; }

    protected abstract Dictionary<string, object>? Attributes { get; }
}
