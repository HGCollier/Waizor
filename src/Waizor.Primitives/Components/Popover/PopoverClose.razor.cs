using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Abstractions;

namespace Waizor.Primitives.Components;

public partial class PopoverClose : SlotBase
{
    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required Popover Popover { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public Dictionary<string, object>? AdditionalAttributes { get; set; }

    protected override Dictionary<string, object> Attributes
    {
        get
        {
            Dictionary<string, object> attributes = AdditionalAttributes ?? [];

            attributes["id"] = Id;
            attributes["onclick"] = () => OnClick();

            if (Class != null)
            {
                attributes["class"] = Class;
            }

            return attributes;
        }
    }

    private void OnClick() => Popover.Hide();
}
