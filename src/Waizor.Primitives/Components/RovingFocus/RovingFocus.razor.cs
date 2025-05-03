using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Waizor.Primitives.Enums;

namespace Waizor.Primitives.Components.Internal;

public partial class RovingFocus(IJSRuntime jsRuntime) : ComponentBase, IAsyncDisposable
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    private IJSObjectReference? jsObjectReference;

    public async ValueTask DisposeAsync()
    {
        await DisposeAsync(true);
        GC.SuppressFinalize(this);
    }

    protected virtual async Task DisposeAsync(bool disposing)
    {
        if (jsObjectReference is null)
        {
            return;
        }

        await jsObjectReference.InvokeVoidAsync("dispose");
        await jsObjectReference.DisposeAsync();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender || jsObjectReference is null)
        {
            jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
                "rovingFocus",
                Orientation
            );
            await InvokeAsync(StateHasChanged);
            return;
        }

        await jsObjectReference.InvokeVoidAsync("update", Orientation);
    }

    public async Task<bool> TryAddItemAsync(ElementReference elementReference)
    {
        if (jsObjectReference is null || jsRuntime is null)
        {
            return false;
        }

        await jsObjectReference.InvokeVoidAsync("addItem", elementReference);
        return true;
    }

    public async Task RemoveItemAsync(ElementReference elementReference)
    {
        if (jsObjectReference is null || jsRuntime is null)
        {
            return;
        }

        await jsObjectReference.InvokeVoidAsync("removeItem", elementReference);
    }
}
