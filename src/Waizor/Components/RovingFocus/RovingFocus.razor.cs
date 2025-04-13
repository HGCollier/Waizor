using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Waizor.Enums;

namespace Waizor.Components;

public partial class RovingFocus(IJSRuntime jsRuntime) : ComponentBase, IAsyncDisposable
{
    [Parameter, EditorRequired]
    public required Func<ElementReference?> For { get; set; }

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    private IJSObjectReference? _jsObjectReference;

    public async ValueTask DisposeAsync()
    {
        if (_jsObjectReference == null || jsRuntime == null)
        {
            return;
        }

        await jsRuntime.InvokeVoidAsync("rovingFocus.dispose", _jsObjectReference);
        await _jsObjectReference.DisposeAsync();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (jsRuntime == null)
        {
            return;
        }

        if (_jsObjectReference != null)
        {
            _jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
                "rovingFocus.update",
                _jsObjectReference
            );
            return;
        }

        if (!firstRender)
        {
            return;
        }

        _jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
            "rovingFocus.create",
            For(),
            Orientation
        );
    }
}
