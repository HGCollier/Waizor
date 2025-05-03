using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components;

public partial class AlertDialog : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string TitleId { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string DescriptionId { get; set; } = Guid.NewGuid().ToString();
    public bool Open { get; private set; }

    public void Show()
    {
        Open = true;

        StateHasChanged();
    }

    public void Hide()
    {
        Open = false;

        StateHasChanged();
    }
}
