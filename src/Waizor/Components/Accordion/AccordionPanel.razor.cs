using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AccordionPanel : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string? Id { get; set; }

    protected override void OnParametersSet() =>
        AccordionItem.PanelId = Id ?? Guid.NewGuid().ToString();
}
