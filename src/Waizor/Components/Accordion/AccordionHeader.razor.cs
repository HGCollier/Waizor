using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AccordionHeader : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }
}
