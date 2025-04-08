using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AccordionItem : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public string Value { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required Accordion Accordion { get; set; }

    public string PanelId { get; set; } = Guid.NewGuid().ToString();
    public string TriggerId { get; set; } = Guid.NewGuid().ToString();

    public bool Open => Accordion.Value.Contains(Value);

    public AccordionItemState State => Open ? AccordionItemState.Open : AccordionItemState.Closed;

    protected override void OnParametersSet()
    {
        if (!Accordion.Disabled)
        {
            return;
        }
        Disabled = Accordion.Disabled;
    }
}
