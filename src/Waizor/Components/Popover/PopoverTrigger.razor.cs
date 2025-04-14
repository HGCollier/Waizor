using Microsoft.AspNetCore.Components;
using Waizor.Abstractions;
using Waizor.Exceptions;

namespace Waizor.Components;

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

    private void OnClick() => Popover.Show();

    protected override void OnParametersSet() =>
        Popover.TriggerId = Id ?? Guid.NewGuid().ToString();

    protected override void OnAfterRender(bool firstRender)
    {
        if (!AsChild)
        {
            return;
        }

        elementReference = (
            For ?? throw new ElementReferenceNotProvidedException(GetType().Name)
        )();
    }
}
