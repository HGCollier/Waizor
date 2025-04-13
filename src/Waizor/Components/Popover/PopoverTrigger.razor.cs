using Microsoft.AspNetCore.Components;
using Waizor.Abstractions;
using Waizor.Exceptions;

namespace Waizor.Components;

public partial class PopoverTrigger : SlotBase
{
    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public Func<ElementReference>? For { get; set; }

    [CascadingParameter]
    public required Popover Popover { get; set; }

    private ElementReference? elementReference;

    protected override Dictionary<string, object> Attributes
    {
        get
        {
            Dictionary<string, object> attributes =
                new() { { "id", Id }, { "onclick", () => OnClick() } };

            if (Class != null)
            {
                attributes.Add("class", Class);
            }

            return attributes;
        }
    }

    private void OnClick() => Popover.Show();

    protected override void OnAfterRender(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        if (!AsChild)
        {
            Popover.SetTriggerElementReference((ElementReference)elementReference!);
            return;
        }

        if (For == null)
        {
            throw new ElementReferenceNotProvidedException(nameof(PopoverTrigger));
        }

        Popover.SetTriggerElementReference(For());
    }
}
