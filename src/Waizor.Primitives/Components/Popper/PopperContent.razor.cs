using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Waizor.Primitives.Enums;

namespace Waizor.Primitives.Components.Internal;

public partial class PopperContent(IJSRuntime jsRuntime)
    : ComponentBase,
        IAsyncDisposable,
        IPopperContent
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

    [Parameter]
    public EventCallback<ElementReference> OnElementReferenceChanged { get; set; }

    public ElementReference Ref
    {
        get => elementReference;
        set
        {
            elementReference = value;
            _ = OnElementReferenceChanged.InvokeAsync(elementReference);
        }
    }

    private ElementReference elementReference;
    private IJSObjectReference? jsObjectReference;

    private PopperJSObject? JSObject =>
        Popper.Anchor.HasValue
            ? new(
                AlignOffset,
                SideOffset,
                Ref,
                Popper.Anchor.Value,
                Popper.Arrow,
                ArrowPadding,
                Align.ToString().ToLowerInvariant(),
                Side.ToString().ToLowerInvariant()
            )
            : null;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            jsObjectReference = await jsRuntime.InvokeAsync<IJSObjectReference>("popper", JSObject);
            return;
        }

        if (JSObject is null || jsObjectReference is null)
        {
            return;
        }

        await jsObjectReference.InvokeVoidAsync("update", JSObject);
    }

    public async ValueTask DisposeAsync()
    {
        if (jsObjectReference is null)
        {
            return;
        }

        await jsObjectReference.InvokeVoidAsync("cleanup");
        await jsObjectReference.DisposeAsync();
    }
}
