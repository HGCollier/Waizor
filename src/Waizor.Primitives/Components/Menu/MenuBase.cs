using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public abstract class MenuBase : ComponentBase, IMenu
{
    [Parameter, EditorRequired]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public bool Open { get; set; }

    [Parameter]
    public EventCallback<bool> OpenChanged { get; set; }

    public ElementReference TriggerElementReference { get; private set; }
    public bool HasCustomAnchor { get; private set; }
    public MenuState State => Open ? MenuState.Open : MenuState.Closed;

    public void SetTriggerElementReference(ElementReference triggerElementReference) =>
        TriggerElementReference = triggerElementReference;

    public void CustomAnchorAdd()
    {
        HasCustomAnchor = true;

        StateHasChanged();
    }

    public async Task ToggleAsync()
    {
        Open = !Open;
        await OpenChanged.InvokeAsync(Open);
        await InvokeAsync(StateHasChanged);
    }

    public async Task ShowAsync()
    {
        Open = true;
        await OpenChanged.InvokeAsync(Open);
        await InvokeAsync(StateHasChanged);
    }

    public async Task HideAsync()
    {
        Open = false;
        await OpenChanged.InvokeAsync(Open);
        await InvokeAsync(StateHasChanged);
    }
}
