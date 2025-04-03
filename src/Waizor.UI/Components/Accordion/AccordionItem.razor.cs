using Microsoft.AspNetCore.Components;

namespace Waizor.UI.Components;

public partial class AccordionItem : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    public bool Open { get; set; }

    public void Toggle()
    {
        Open = !Open;

        StateHasChanged();
    }
}
