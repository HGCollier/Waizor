using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Waizor.Enums;

namespace Waizor.Components;

public partial class PopperContent(IJSRuntime jsRuntime) : ComponentBase, IAsyncDisposable
{
    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public Side Side { get; set; } = Side.Bottom;

    [Parameter]
    public int SideOffset { get; set; }

    [Parameter]
    public Align Align { get; set; } = Align.Center;

    [Parameter]
    public int AlignOffset { get; set; }

    [Parameter]
    public int ArrowPadding { get; set; }

    [CascadingParameter]
    public required Popper Popper { get; set; }

    private IJSObjectReference? jsObjectReference;
    private ElementReference elementReference;

    private PopperJSObject? PopperJSObject =>
        Popper.Anchor.HasValue
            ? new(
                AlignOffset,
                SideOffset,
                elementReference,
                Popper.Anchor.Value,
                Popper.Arrow,
                Align.ToString().ToLowerInvariant(),
                Side.ToString().ToLowerInvariant()
            )
            : null;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!Popper.Anchor.HasValue || jsRuntime == null)
        {
            return;
        }

        if (jsObjectReference != null)
        {
            await jsRuntime.InvokeVoidAsync("popper.dispose", jsObjectReference);
            jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
                "popper.create",
                PopperJSObject
            );
            return;
        }

        if (!firstRender)
        {
            return;
        }

        jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>(
            "popper.create",
            PopperJSObject
        );
    }

    public async ValueTask DisposeAsync()
    {
        if (jsObjectReference == null || jsRuntime == null)
        {
            return;
        }

        await jsRuntime.InvokeVoidAsync("popper.dispose", jsObjectReference);
        await jsObjectReference.DisposeAsync();
    }
}
