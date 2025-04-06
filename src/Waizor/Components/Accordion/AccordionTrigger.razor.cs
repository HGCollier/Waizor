using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AccordionTrigger : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }

    [CascadingParameter]
    public required Accordion Accordion { get; set; }

    private void OnClick() => AccordionItem.Toggle();
}
