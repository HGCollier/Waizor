using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class RovingFocusItem : ComponentBase, IAsyncDisposable
{
    [CascadingParameter]
    public required RovingFocus RovingFocus { get; set; }

    [Parameter, EditorRequired]
    public required Func<ElementReference> For { get; set; }

    private bool added;

    public async ValueTask DisposeAsync()
    {
        await DisposeAsync(true);
        GC.SuppressFinalize(this);
    }

    protected virtual async Task DisposeAsync(bool disposing)
    {
        added = false;
        await RovingFocus.RemoveItemAsync(For());
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (added)
        {
            return;
        }

        added = await RovingFocus.TryAddItemAsync(For());
    }
}
