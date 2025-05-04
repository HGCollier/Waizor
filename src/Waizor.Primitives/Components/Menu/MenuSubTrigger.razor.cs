using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Abstractions;
using Waizor.Primitives.Exceptions;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuSubTrigger : SlotBase
{
    [CascadingParameter]
    public required Menu Menu { get; set; }

    [CascadingParameter]
    public required MenuSub MenuSub { get; set; }

    [Parameter]
    public Func<ElementReference>? For { get; set; }

    [Parameter]
    public string? Id { get; set; }

    private ElementReference elementReference;

    protected override Dictionary<string, object> Attributes =>
        new()
        {
            { "onmousedown", () => OnClickAsync() },
            //{ "onkeydown", (KeyboardEventArgs args) => OnKeyDownAsync(args) },
            { "aria-haspopup", "menu" },
            { "aria-expanded", MenuSub.Open.ToString().ToLowerInvariant() },
            { "data-state", MenuSub.State.ToString().ToLowerInvariant() }
        };

    private async Task OnClickAsync() => await MenuSub.ToggleAsync();

    //private async Task OnKeyDownAsync(KeyboardEventArgs args)
    //{
    //    if (args.Code is not KeyCodes.ArrowDown and not KeyCodes.Enter and not KeyCodes.Space)
    //    {
    //        return;
    //    }

    //    await Menu.ToggleAsync();
    //}

    protected override void OnAfterRender(bool firstRender)
    {
        if (!AsChild)
        {
            MenuSub.SetTriggerElementReference(elementReference);
            return;
        }

        elementReference = (
            For ?? throw new ElementReferenceNotProvidedException(GetType().Name)
        )();
        MenuSub.SetTriggerElementReference(elementReference);
    }
}
