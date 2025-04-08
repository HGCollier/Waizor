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
        GC.SuppressFinalize(this);

        ElementReference? elementReference = For();

        if (_jsObjectReference == null || elementReference == null)
        {
            return;
        }

        await jsRuntime.InvokeVoidAsync("rovingFocus.dispose", For(), _jsObjectReference);
        await _jsObjectReference.DisposeAsync();
    }

    protected override async Task OnParametersSetAsync()
    {
        ElementReference? elementReference = For();

        if (_jsObjectReference == null || elementReference == null)
        {
            return;
        }

        await jsRuntime.InvokeVoidAsync("rovingFocus.dispose", For(), _jsObjectReference);
        _jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
            "rovingFocus.create",
            For(),
            Orientation
        );
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
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
