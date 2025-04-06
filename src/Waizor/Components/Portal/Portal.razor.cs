using Microsoft.AspNetCore.Components;
using Waizor.Exceptions;

namespace Waizor.Components;

public partial class Portal : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [CascadingParameter]
    public required PortalProvider PortalProvider { get; set; }

    protected override void OnInitialized()
    {
        if (PortalProvider == null)
        {
            throw new ProviderNotFoundException(nameof(PortalProvider));
        }

        PortalProvider.Add(Id);
    }
}
