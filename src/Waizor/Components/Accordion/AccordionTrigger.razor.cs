using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AccordionTrigger : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }

    private ElementReference elementReference;

    protected override void OnParametersSet() => AccordionItem.PanelId = Id;

    private async Task OnClickAsync() =>
        await AccordionItem.Accordion.ToggleAsync(AccordionItem.Value);
}
