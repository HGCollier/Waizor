using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Abstractions;
using Waizor.Primitives.Exceptions;

namespace Waizor.Primitives.Components;

public partial class PopoverTrigger : SlotBase
{
    [CascadingParameter]
    public required Popover Popover { get; set; }

    [Parameter]
    public Func<ElementReference>? For { get; set; }

    [Parameter]
    public string? Id { get; set; }

    private ElementReference elementReference;

    protected override Dictionary<string, object> Attributes =>
        new()
        {
            { "onclick", () => OnClick() },
            { "aria-haspopup", "dialog" },
            { "aria-expanded", Popover.Open.ToString().ToLowerInvariant() },
            { "aria-controls", Popover.ContentId },
            { "data-state", Popover.State.ToString().ToLowerInvariant() }
        };

    private void OnClick() => Popover.Toggle();

    protected override void OnParametersSet() =>
        Popover.TriggerId = Id ?? Guid.NewGuid().ToString();

    protected override void OnAfterRender(bool firstRender)
    {
        if (!AsChild)
        {
            Popover.SetTriggerElementReference(elementReference);
            return;
        }

        elementReference = (
            For ?? throw new ElementReferenceNotProvidedException(GetType().Name)
        )();
        Popover.SetTriggerElementReference(elementReference);
    }
}
