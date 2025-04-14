using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Components;

public partial class FocusTrap(IJSRuntime jsRuntime) : ComponentBase, IAsyncDisposable
{
    [Parameter, EditorRequired]
    public required Func<ElementReference> For { get; set; }

    [Parameter]
    public EventCallback OnDeactivate { get; set; }

    [Parameter]
    public bool ClickOutsideDeactivates { get; set; }

    private IJSObjectReference? jsObjectReference;
    private DotNetObjectReference<FocusTrap>? dotNetObjectReference;

    private FocusTrapJSObject? JSObject =>
        dotNetObjectReference != null
            ? new(For(), dotNetObjectReference, ClickOutsideDeactivates)
            : null;

    public async ValueTask DisposeAsync()
    {
        if (jsRuntime == null)
        {
            return;
        }

        await jsRuntime.InvokeVoidAsync("focusTrap.dispose", jsObjectReference);

        dotNetObjectReference?.Dispose();

        if (jsObjectReference == null)
        {
            return;
        }

        await jsObjectReference.DisposeAsync();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender || jsRuntime == null)
        {
            return;
        }

        dotNetObjectReference = DotNetObjectReference.Create(this);
        jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
            "focusTrap.create",
            JSObject
        );
    }

    [JSInvokable]
    public async Task Deactivate() => await OnDeactivate.InvokeAsync();
}
