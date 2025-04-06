using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AccordionPanel : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }

    [CascadingParameter]
    public required Accordion Accordion { get; set; }

    [Parameter]
    public string? Class { get; set; }
}
