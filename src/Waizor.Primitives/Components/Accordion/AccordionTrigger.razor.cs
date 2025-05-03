using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Abstractions;
using Waizor.Primitives.Exceptions;

namespace Waizor.Primitives.Components;

public partial class AccordionTrigger : SlotBase
{
    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public Func<ElementReference>? For { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }

    protected override Dictionary<string, object> Attributes
    {
        get
        {
            Dictionary<string, object> attributes =
                new()
                {
                    { "id", AccordionItem.TriggerId },
                    { "aria-expanded", AccordionItem.Open.ToString().ToLowerInvariant() },
                    { "aria-controls", AccordionItem.ContentId },
                    { "data-state", AccordionItem.State.ToString().ToLowerInvariant() },
                    { "data-disabled", AccordionItem.Disabled },
                    {
                        "data-orientation",
                        AccordionItem.Accordion.Orientation.ToString().ToLowerInvariant()
                    },
                    { "disabled", AccordionItem.Disabled },
                    { "onclick", () => OnClickAsync() }
                };

            if (Class != null)
            {
                attributes.Add("class", Class);
            }

            return attributes;
        }
    }

    private ElementReference elementReference;

    private async Task OnClickAsync() =>
        await AccordionItem.Accordion.ToggleAsync(AccordionItem.Value);

    protected override void OnParametersSet() => AccordionItem.TriggerId = Id;

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
