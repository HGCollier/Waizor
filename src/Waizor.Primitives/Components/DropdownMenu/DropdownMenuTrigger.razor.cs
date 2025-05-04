using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Waizor.Primitives.Abstractions;
using Waizor.Primitives.Constants;
using Waizor.Primitives.Exceptions;

namespace Waizor.Primitives.Components;

public partial class DropdownMenuTrigger : SlotBase
{
    [CascadingParameter]
    public required DropdownMenu DropdownMenu { get; set; }

    [Parameter]
    public Func<ElementReference>? For { get; set; }

    [Parameter]
    public string? Id { get; set; }

    private ElementReference elementReference;

    protected override Dictionary<string, object> Attributes =>
        new()
        {
            { "onmousedown", () => OnClickAsync() },
            { "onkeydown", (KeyboardEventArgs args) => OnKeyDownAsync(args) },
            { "aria-haspopup", "menu" },
            { "aria-expanded", DropdownMenu.Open.ToString().ToLowerInvariant() },
            { "data-state", DropdownMenu.State.ToString().ToLowerInvariant() }
        };

    private async Task OnClickAsync() => await DropdownMenu.ToggleAsync();

    private async Task OnKeyDownAsync(KeyboardEventArgs args)
    {
        if (args.Code is not KeyCodes.ArrowDown and not KeyCodes.Enter and not KeyCodes.Space)
        {
            return;
        }

        await DropdownMenu.ToggleAsync();
    }

    protected override void OnAfterRender(bool firstRender)
    {
        if (!AsChild)
        {
            DropdownMenu.SetTriggerElementReference(elementReference);
            return;
        }

        elementReference = (
            For ?? throw new ElementReferenceNotProvidedException(GetType().Name)
        )();
        DropdownMenu.SetTriggerElementReference(elementReference);
    }
}
