using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Waizor.Primitives.Constants;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuItem : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public EventCallback OnSelect { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object> AdditionalAttributes { get; set; } = [];

    [CascadingParameter]
    public required Menu Menu { get; set; }

    [CascadingParameter]
    public MenuSub? MenuSub { get; set; }

    private ElementReference elementReference;

    private async Task OnKeyDownAsync(KeyboardEventArgs args)
    {
        if (MenuSub is not null && args.Code is KeyCodes.ArrowLeft)
        {
            await MenuSub.HideAsync();
            return;
        }

        if (args.Code is not KeyCodes.Enter and not KeyCodes.Space)
        {
            return;
        }

        await OnSelectAsync();
    }

    private async Task OnClickAsync() => await OnSelectAsync();

    private async Task OnSelectAsync()
    {
        if (Disabled)
        {
            return;
        }

        await OnSelect.InvokeAsync();
        await Menu.HideAsync();
    }
}
