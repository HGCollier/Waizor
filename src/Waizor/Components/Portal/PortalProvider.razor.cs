using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

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
}
