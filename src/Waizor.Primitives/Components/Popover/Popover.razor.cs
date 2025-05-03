using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class Popover : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public bool Open { get; set; }

    [Parameter]
    public EventCallback<bool> OpenChanged { get; set; }

    public string ContentId { get; set; } = Guid.NewGuid().ToString();
    public string TriggerId { get; set; } = Guid.NewGuid().ToString();

    public ElementReference TriggerElementReference { get; private set; }

    public bool HasCustomAnchor { get; private set; }

    public PopoverState State => Open ? PopoverState.Open : PopoverState.Closed;

    public void SetTriggerElementReference(ElementReference triggerElementReference) =>
        TriggerElementReference = triggerElementReference;

    public void CustomAnchorAdd()
    {
        HasCustomAnchor = true;

        StateHasChanged();
    }

    public void Toggle()
    {
        Open = !Open;

        StateHasChanged();
    }

    public void Show()
    {
        Open = true;

        StateHasChanged();
    }

    public void Hide()
    {
        Open = false;

        StateHasChanged();
    }
}
