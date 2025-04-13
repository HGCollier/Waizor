using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Components;

public partial class Popover(IJSRuntime jsRuntime) : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public bool DefaultOpen { get; set; }

    [Parameter]
    public bool Open { get; set; }

    [Parameter]
    public EventCallback<bool> OpenChanged { get; set; }

    [Parameter]
    public bool Modal { get; set; }

    public PopoverState State => Open ? PopoverState.Open : PopoverState.Closed;

    private ElementReference? contentElementReference;
    private ElementReference? triggerElementReference;

    private IJSObjectReference? jsObjectReference;

    public async Task SetContentElementReferenceAsync(ElementReference elementReference)
    {
        contentElementReference = elementReference;

        if (triggerElementReference != null && contentElementReference != null)
        {
            jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
                "popover.create",
                triggerElementReference,
                contentElementReference
            );
        }

        StateHasChanged();
    }

    public void SetTriggerElementReference(ElementReference elementReference)
    {
        triggerElementReference = elementReference;

        StateHasChanged();
    }

    public async Task HideAsync()
    {
        Open = false;

        await jsRuntime.InvokeVoidAsync("popover.dispose", jsObjectReference);

        StateHasChanged();
    }

    public void Show()
    {
        Open = true;

        StateHasChanged();
    }
}
