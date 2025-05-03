using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Exceptions;

namespace Waizor.Primitives.Components;

public partial class Portal : ComponentBase, IDisposable
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [CascadingParameter]
    public required PortalProvider PortalProvider { get; set; }

    public void Dispose() => PortalProvider.Remove(Id);

    protected override void OnInitialized()
    {
        if (PortalProvider == null)
        {
            throw new ProviderNotFoundException(nameof(PortalProvider));
        }

        PortalProvider.Add(Id);
    }
}
