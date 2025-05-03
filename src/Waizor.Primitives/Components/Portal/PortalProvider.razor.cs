using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class PortalProvider : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    private readonly List<string> _ids = [];

    public void Add(string id)
    {
        _ids.Add(id);

        StateHasChanged();
    }

    public void Remove(string id)
    {
        _ = _ids.Remove(id);

        StateHasChanged();
    }
}
