using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Waizor.Components;

public partial class FocusTrap(IJSRuntime jsRuntime) : ComponentBase, IAsyncDisposable
{
    [Parameter, EditorRequired]
    public required Func<ElementReference> For { get; set; }

    [Parameter]
    public EventCallback OnDeactivate { get; set; }

    private IJSObjectReference? _jsObjectReference;
    private DotNetObjectReference<FocusTrap>? _dotNetObjectReference;

    public async ValueTask DisposeAsync()
    {
        if (jsRuntime == null)
        {
            return;
        }

        await jsRuntime.InvokeVoidAsync("focusTrap.dispose", _jsObjectReference);

        _dotNetObjectReference?.Dispose();

        if (_jsObjectReference == null)
        {
            return;
        }

        await _jsObjectReference.DisposeAsync();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender || jsRuntime == null)
        {
            return;
        }

        _dotNetObjectReference = DotNetObjectReference.Create(this);
        _jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
            "focusTrap.create",
            For(),
            _dotNetObjectReference
        );
    }

    [JSInvokable]
    public async Task Deactivate() => await OnDeactivate.InvokeAsync();
}
