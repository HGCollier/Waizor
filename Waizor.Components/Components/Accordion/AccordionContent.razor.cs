using Microsoft.AspNetCore.Components;

namespace Waizor.UI.Components;

public partial class AccordionContent : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }

    [CascadingParameter]
    public required Accordion Accordion { get; set; }
}
