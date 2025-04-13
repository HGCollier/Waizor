using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class PopoverContent : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required Popover Popover { get; set; }

    private ElementReference _elementReference;

    private async Task OnDeactivateAsync() => await Popover.HideAsync();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        await Popover.SetContentElementReferenceAsync(_elementReference);
    }
}
