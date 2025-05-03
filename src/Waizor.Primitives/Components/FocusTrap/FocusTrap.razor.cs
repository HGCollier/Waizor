using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Primitives.Components;

public partial class FocusTrap(IJSRuntime jsRuntime) : ComponentBase, IAsyncDisposable
{
    [Parameter, EditorRequired]
    public required Func<ElementReference> For { get; set; }

    [Parameter]
    public Func<ElementReference>? ForTrigger { get; set; }

    [Parameter]
    public EventCallback OnDeactivate { get; set; }

    [Parameter]
    public bool ClickOutsideDeactivates { get; set; }

    [Parameter]
    public bool AllowOutsideClick { get; set; }

    private IJSObjectReference? jsObjectReference;
    private DotNetObjectReference<FocusTrap>? dotNetObjectReference;

    private ElementReference? Trigger => ForTrigger is not null ? ForTrigger() : null;

    private FocusTrapJSObject? JSObject =>
        dotNetObjectReference is not null
            ? new(For(), dotNetObjectReference, ClickOutsideDeactivates, AllowOutsideClick, Trigger)
            : null;

    public async ValueTask DisposeAsync()
    {
        if (jsRuntime is null || jsObjectReference is null)
        {
            return;
        }

        dotNetObjectReference?.Dispose();
        await jsObjectReference.InvokeVoidAsync("deactivate");
        await jsObjectReference.DisposeAsync();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender || jsRuntime is null)
        {
            return;
        }

        dotNetObjectReference = DotNetObjectReference.Create(this);
        jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>("focusTrap", JSObject);
    }

    [JSInvokable]
    public async Task Deactivate() => await OnDeactivate.InvokeAsync();
}
