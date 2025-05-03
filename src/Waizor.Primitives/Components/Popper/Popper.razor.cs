using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class Popper : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    public ElementReference? Anchor { get; private set; }
    public ElementReference? Arrow { get; private set; }

    public void SetAnchor(ElementReference elementReference)
    {
        Anchor = elementReference;

        StateHasChanged();
    }

    public void SetArrow(ElementReference elementReference)
    {
        Arrow = elementReference;

        StateHasChanged();
    }
}
