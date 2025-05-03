using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Abstractions;

namespace Waizor.Primitives.Components;

public partial class CollapsibleTrigger : SlotBase
{
    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [CascadingParameter]
    public required Collapsible Collapsible { get; set; }

    protected override Dictionary<string, object> Attributes
    {
        get
        {
            Dictionary<string, object> attributes =
                new()
                {
                    { "aria-expanded", Collapsible.Open.ToString().ToLowerInvariant() },
                    { "aria-controls", Collapsible.ContentId },
                    { "data-state", Collapsible.State.ToString().ToLowerInvariant() },
                    { "data-disabled", Collapsible.Disabled },
                    { "disabled", Collapsible.Disabled },
                    { "onclick", () => OnClick() }
                };

            if (Class != null)
            {
                attributes.Add("class", Class);
            }

            return attributes;
        }
    }

    private void OnClick() => Collapsible.Toggle();
}
