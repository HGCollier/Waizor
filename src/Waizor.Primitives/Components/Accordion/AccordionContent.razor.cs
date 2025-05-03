using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class AccordionContent : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required AccordionItem AccordionItem { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    protected override void OnParametersSet() => AccordionItem.ContentId = Id;
}
