using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Components.Internal;

namespace Waizor.Primitives.Components;

public partial class DropdownMenu : Menu
{
    [Parameter]
    public bool? DefaultOpen { get; set; }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        if (!DefaultOpen.HasValue)
        {
            return;
        }

        Open = DefaultOpen.Value;
        await OpenChanged.InvokeAsync(Open);
        await InvokeAsync(StateHasChanged);
    }
}
