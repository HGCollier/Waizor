using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Waizor.Primitives.Enums;

namespace Waizor.Primitives.Components.Internal;

public partial class RovingFocus(IJSRuntime jsRuntime) : ComponentBase, IAsyncDisposable
{
    [Parameter, EditorRequired]
    public required Func<ElementReference?> For { get; set; }

    [Parameter, EditorRequired]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    [Parameter]
    public bool Loop { get; set; } = true;

    private RovingFocusJSObject JSObject => new(For(), Orientation, Loop);

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
        ElementReference? elementReference = For();
        if (elementReference is null)
        {
            return;
        }

        if (firstRender || jsObjectReference is null)
        {
            jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
                "rovingFocus",
                JSObject
            );
            await InvokeAsync(StateHasChanged);
            return;
        }

        await jsObjectReference.InvokeVoidAsync("update", JSObject);
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
